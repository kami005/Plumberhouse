import { Alert, Button, CircularProgress, Snackbar, TextField, Typography } from '@mui/material'
import React, { createRef } from 'react'
import { ButtonBox, InputBox, MainBox } from '../../styles/SendTicketStyle'
import ReCAPTCHA from "react-google-recaptcha";
import { Box } from '@mui/system';
import { useReducer } from 'react';
import { alertReducer, customerReducer, useToggle } from '../CustomHooks/RandHooks';
import { SendTicketMessage } from '../BackendConnect/MessageStorage';

const SendTicket = (props) => {
const {theme, setTicketState}= props
const recaptchaRef = createRef()
const [textState, dispatchTextField] = useReducer(customerReducer, {name:'', email:'', phone:'', message:''})
const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Signin Cancelled', isOpen:false, msgColor:'error'})
const [loadingSend, toggleLoadingSend] = useToggle()

const SendMessage = async(e)=>{
    if(e)
        e.preventDefault()
    try{
        
        let token = await recaptchaRef.current.getValue()
        if(token && !loadingSend)
        {
            toggleLoadingSend()
            const msg = await SendTicketMessage({name:textState.name, email:textState.email, phone:textState.phone, 
            message:textState.message})
           if(msg)
           {
            dispatchSnack({type:'OTHER', message:'Message Sent', msgColor:'info'})

           }
            setTimeout(() => {
                toggleLoadingSend() 
                setTicketState(false)
            }, 1000);  
        }
        else
        {
            dispatchSnack({type:'OTHER', message:'Please Verify with ReCapthca First', msgColor:'warning'})
        }
        
    }catch(er)
    {
        toggleLoadingSend()
        console.log(er)
    }

        
   
}

  return (
    <MainBox theme ={theme}>
    <Typography variant='h6'>Contact Us</Typography>
    <form onSubmit={e=>SendMessage(e)}>
    
    <InputBox>
    <TextField placeholder='Name' onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} variant='outlined' type='text' name='name' value={textState.name} autoFocus required/>
    <TextField placeholder='Email' onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} variant='outlined' type='email' name='email' value={textState.email} required/>
    <TextField placeholder='Phone Number' onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} variant='outlined' type='tel' name='phone' value={textState.phone} required />
    <TextField placeholder='Message' onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} variant='outlined' type='tel' name='message' value={textState.message}  multiline rows={4} required/>
    </InputBox>
    <Box sx={{display:'flex', justifyContent:'center', margin:'0.2rem'}}>
    <ReCAPTCHA style={{zIndex:10}} ref={recaptchaRef} sitekey={process.env.RECAPTCHA_KEY} />
    </Box>

    <ButtonBox>
        <Button color='success' variant='contained' type='submit'>{loadingSend ? <CircularProgress /> :'SEND'}</Button>
        <Button color='warning' variant='contained' onClick={()=>setTicketState(false)}>Cancel</Button> 
    </ButtonBox>
    
    </form>

    <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={e=>dispatchSnack({type:'CLOSEMSG'})} 
    anchorOrigin={{ vertical:'top',horizontal:'center' }}>
   <Alert  severity={alertSnack.msgColor}  elevation={6} variant='standard'>
     {alertSnack.message}
   </Alert>
   </Snackbar>

    </MainBox>
  )
}

export default SendTicket