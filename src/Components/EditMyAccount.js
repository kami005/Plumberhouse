import React, { useEffect, useState, useReducer, useContext} from 'react'
import {  Button, CircularProgress, Snackbar, LinearProgress, Alert, Backdrop } from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator';
import {  itemReducer, useToggle } from '../CustomHooks/RandHooks';
import { FindUserData, UpdateUser } from '../BackendConnect/AuthenticateUser'
import { alertReducer } from '../CustomHooks/RandHooks';
import { ButtonBoxStyle, HeaderTypographyStyle, MainBoxStyle, TextBoxStyle, TextFieldStyle, MainPaper } from '../../styles/EditMyAccountStyle';
import { FindExistingUser } from '../BackendConnect/AuthenticateUser';
import { userData } from '../DataSource/RandData';
import { useRouter } from 'next/router';
import { SessionContext } from '../Context/SessionContext';
import { themeVar } from '../DataSource/themeVar';


const  EditMyAccount=(props) =>{
    const route = useRouter()
    const [isLoading, toggleLoading] = useToggle(false)
    const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Account Has been Updated', isOpen:false, msgColor:'success'})
    const buttonText= isLoading ? <CircularProgress /> : 'Submit'
    const [user, setData]= useState(null)
    const [textFieldState, dispatchTextField] = useReducer(itemReducer, {...userData})
    const context = useContext(SessionContext)
    const {session, theme} = context
    
    const loadUser =async ()=>{
      try{
        if(session && session[0] && session[0].token)
        {
            const data =  await FindUserData(session[0].token, session[0]._id )
            if(data && !user){
            setData(data)
              const userData ={...data, password:''}
              dispatchTextField({type:'UPDATEDATA', payload:userData})
            }
        }

      }
      catch (er){
        toggleLoading()
        dispatchSnack({type:'OTHER', message:'Error Occurred', msgColor:'error'})   
        console.log(er)
      }

    }  

    const findUser = async (searchBy, filter)=>{
      if ((searchBy==='username'&& filter === user.username) || (searchBy==='email' && filter === user.email) ){
        return true
      }else{
        const available = await FindExistingUser(searchBy, filter, {myToken:session[0].token, myId:session[0]._id})
        return available
       }
    }
   
    const handleSubmit = async ()=>{
        toggleLoading()
        const user={_id:textFieldState._id, username:textFieldState.username,email: textFieldState.email, fName: textFieldState.fName,lName: textFieldState.lName,address:textFieldState.address}
        const res = await UpdateUser({...user, myToken:session[0].token, myId:session[0]._id})
          if(res && res.data)
          {
            dispatchSnack({type:'OTHER', message:'Account Updated', msgColor:'success'})
            toggleLoading()
            setTimeout(() => {
              route.push('/')
            }, 2000);
          }   
          else
          dispatchSnack({type:'OTHER', message:'Error Occurred', msgColor:'error'})      
      }
    useEffect(()=>{
        loadUser()
    }, [])

      useEffect( ()=>{

        ValidatorForm.addValidationRule('isUsernameLengthOk', () => {
          if(textFieldState.username.length<3 || textFieldState.username.indexOf(' ') >=0)
         return false
          else
            return true
        });
  
          ValidatorForm.addValidationRule('isUsernameUnique', (value) => {
              const isAvailable = findUser('username', value)
              return isAvailable
            });
  
       
  
            ValidatorForm.addValidationRule('isEmailUnique', (value) => {
              const isAvailable= findUser('email', value)
              return isAvailable
            });
  
            ValidatorForm.addValidationRule('isfNameLengthOk', () => {
              if(textFieldState.fName.length<3)
                return false
              else
                return true
            });
  
            ValidatorForm.addValidationRule('islNameLengthOk', () => {
              if(textFieldState.lName.length<3)
             return false
              else
                return true
            });
  
            ValidatorForm.addValidationRule('isPasswordLengthOk', () => {
              if(textFieldState.password.length<3)
             return false
              else
                return true
            });
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[textFieldState])
    return (
        <MainBoxStyle  theme={theme.themes[theme.active]}>
       
        <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={()=>dispatchSnack({type:'CLOSEMSG'})} 
         anchorOrigin={{ vertical:'top',horizontal:'center' }}>
        <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
        {alertSnack.message}
        </Alert>
        </Snackbar>
        <MainPaper elevation={10}>
        {!user && 
          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => themeVar.zIndex.drawer + 1 }}
          open={!user}
        >
        <CircularProgress color='success' />
        </Backdrop>}
        <HeaderTypographyStyle variant='h4'>EDIT ACCOUNT</HeaderTypographyStyle>
        <ValidatorForm instantValidate={true} onSubmit={handleSubmit}>
          <TextBoxStyle  theme={theme.themes[theme.active]}>
          <TextFieldStyle
           theme={theme.themes[theme.active]}
           label = 'User Name'
           value={textFieldState.username}
           name='username'
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}
            fullWidth
            validators={['required', 'isUsernameUnique', 'isUsernameLengthOk']}
            errorMessages={['Enter Username', 'Username is not availalbe','Username is not Valid']}
           />
            <TextFieldStyle
             theme={theme.themes[theme.active]}
           label = 'Email Address'
           type='email'
           value={textFieldState.email}
           name='email'
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}
            fullWidth
            validators={['required', 'isEmailUnique']}
            errorMessages={['Enter email', 'Email is not availalbe']}
           />  
            <TextFieldStyle
             theme={theme.themes[theme.active]}
           label = 'First Name'
           value={textFieldState.fName}
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
           name='fName'
            fullWidth
            validators={['required', 'isfNameLengthOk']}
            errorMessages={['Enter First Name', 'Enter valid Name']}
           />
         <TextFieldStyle
 theme={theme.themes[theme.active]}
           label = 'Last Name'
           value={textFieldState.lName}
           name='lName'
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
            fullWidth
            validators={['required', 'islNameLengthOk']}
            errorMessages={['Enter Last Name','Enter valid Name']}
           />
            <TextFieldStyle
 theme={theme.themes[theme.active]}
           label = 'Address'
           name='address'
           value={textFieldState.address}
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}
            fullWidth
           />

</TextBoxStyle>
  <ButtonBoxStyle  theme={theme.themes[theme.active]}>
  <Button variant='contained' color='primary' disabled={isLoading}  type='submit'>
                {buttonText}
          </Button>
          <Button variant='outlined' color='primary'  onClick={()=>route.push('/')}>
                Cancel
          </Button>
  </ButtonBoxStyle>
    </ValidatorForm>
        </MainPaper>

        </MainBoxStyle>
    )
      
}


export default EditMyAccount