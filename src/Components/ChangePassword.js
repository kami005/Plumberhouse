import React, { useEffect, useState, useReducer, useContext} from 'react'
import { Button, CircularProgress, Snackbar, LinearProgress, Alert, Backdrop} from '@mui/material'
import { ValidatorForm } from 'react-material-ui-form-validator';
import { FindUserData , FindUserPassword, UpdateUserPassword} from '../BackendConnect/AuthenticateUser'
import { alertReducer, itemReducer, useToggle } from '../CustomHooks/RandHooks';
import { useRouter } from 'next/router';
import { SessionContext } from '../Context/SessionContext';
import { ContainerBoxStyle, MainBoxStyle, MainPaper, TextFieldStyle, VerifiedButtonBoxStyle, HeaderTypographyStyle} from '../../styles/ChangePasswordStyle';
import { themeVar } from '../DataSource/themeVar';

const ChangePassword=()=> {
    const route = useRouter()
    const [isLoading, toggleLoading] = useToggle(false)
    const [userPass, setData]= useState(null)
    const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Account Has been Updated', isOpen:false, msgColor:'success'})
    const [userPassText, dispatchTextField] = useReducer(itemReducer, {oldPass:'', newPass:'', confirmPass:''})
    const context = useContext(SessionContext)
    const {session, theme} = context

    const submitButtonText= isLoading ? <CircularProgress /> : 'Submit'
   
    const loadUser =async ()=>{

     if(session && session[0] && session[0].token)
        {
        const data =  await FindUserData(session[0].token)
        if(data && !userPass){
          setData({username:data.username, _id:data._id})
        }
      }
    }  
   
  useEffect(()=>{
    loadUser()
  },[])

      const handleChangePassword = async ()=>{
        toggleLoading()
          const res = await FindUserPassword(userPass._id, userPassText.oldPass)
            if(res.message && res.message ==='VERIFIED'){
              dispatchSnack({type:'OTHER',message:'Password Verified Updating New Password', msgColor:'success' })
              setTimeout(async() => {    
              const user= {_id:userPass._id, password:userPassText.newPass}
              const res = await UpdateUserPassword({...user, myToken:session[0].token, myId:session[0]._id})
              if(res)
                {
                  dispatchSnack({type:'OTHER',message:'Password Updated', msgColor:'success' })
                  setTimeout(() => {
                    route.push('/')
                  }, 2000);
                }
                else
                {
                  dispatchSnack({type:'OTHER',message:'Error Occurred while updating Password, Retry', msgColor:'error' })
                  toggleLoading()
                }
                
              }, 2000);
                }

            else{
              toggleLoading()
              dispatchSnack({type:'OTHER',message:'Enter Correct Password', msgColor:'error' })
            }
        
        }

        useEffect(()=>{ 
          ValidatorForm.addValidationRule('isUsernameLengthOk', (value) => {
              if(value.length<3)
              {
             return false
              }
              else{
                return true
              }
            });
  
            ValidatorForm.addValidationRule('isPassLengthOk', (value) => {
              if(value.length<3)
              {
             return false
              }
              else{
                return true
              }
            });

            ValidatorForm.addValidationRule('isMatching', (value) => {
             if(value === userPassText.newPass)
              return true
              else
                return false
            });
  
      },[userPassText])
    return (
        <MainBoxStyle  theme={theme.themes[theme.active]}>
        {!userPass && 
          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => themeVar.zIndex.drawer + 1 }}
          open={!userPass}
        >
        <CircularProgress color='success' />
        </Backdrop>}

     <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={()=>dispatchSnack({type:'CLOSEMSG'})} 
         anchorOrigin={{ vertical:'top',horizontal:'center' }}>
        <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
        {alertSnack.message}
        </Alert>
        </Snackbar>
        <MainPaper elevation={10}>
        <HeaderTypographyStyle theme={theme.themes[theme.active]} variant='h4'>CHANGE PASSWORD</HeaderTypographyStyle>
        <ContainerBoxStyle theme={theme.themes[theme.active]}>
         
          <ValidatorForm onSubmit={handleChangePassword} instantValidate={false}>
    
    
    <TextFieldStyle
    theme={theme.themes[theme.active]}
   label = 'Old Password'
   type='password'
   value={userPassText.oldPass}
   name='oldPass'
   autoComplete="on"
   onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
    validators={['required']}
    errorMessages={['Enter Current Password']}
   />
         <TextFieldStyle
         theme={theme.themes[theme.active]}
   label = 'New Password'
   type='password'
   autoComplete="on"
   value={userPassText.newPass}
   name='newPass'
   onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}
    validators={['required', 'isPassLengthOk']}
    errorMessages={['Enter Password', 'Password is not valid']}
   />  
    <TextFieldStyle
    theme={theme.themes[theme.active]}
   label = 'Confirm Password'
   value={userPassText.confirmPass}
   onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}
   name='confirmPass'
   type='password'
   autoComplete="on"
    validators={['required', 'isMatching']}
    errorMessages={['Retype new Password', 'Password does not Match']}
   />

  <VerifiedButtonBoxStyle>
  <Button variant='contained' color='primary' type='submit'>
        {submitButtonText}
  </Button>
  <Button  variant='outlined' color='primary' disabled={isLoading}onClick={()=>route.push('/')}>
        Cancel
  </Button>
  </VerifiedButtonBoxStyle>
  
</ValidatorForm>
       

      </ContainerBoxStyle>   
      </MainPaper>
        </MainBoxStyle>
    )
      
}


export default ChangePassword