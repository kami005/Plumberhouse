import {Typography, CircularProgress, Alert, Snackbar} from '@mui/material'
import React, { useContext, useEffect, useReducer, memo, createRef} from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator';
import { SHOPINFO, userData as usersData } from '../src/DataSource/RandData';
import {alertReducer} from '../src/CustomHooks/RandHooks';
import { SessionContext } from '../src/Context/SessionContext'
import { FindUserData, SigninUser } from '../src/BackendConnect/AuthenticateUser';
import { MainBoxStyle, SigninBoxStyle, SigninBtnStyle, SignInInputBoxStyle, TextFieldStyle, SignupBtnBoxStyle, LogoStyle } from '../styles/SigninStyle';
import { SESSIONKEY } from '../src/DataSource/RandData';
import { customerReducer } from '../src/CustomHooks/RandHooks';
import { useToggle } from '../src/CustomHooks/RandHooks';
import { useRouter} from 'next/router';
import { Login } from '@mui/icons-material';
import Header from '../src/Components/HeaderText'
import ReCAPTCHA from "react-google-recaptcha";

function SigninForm() {
  const navigate= useRouter()
    const [textFieldState, dispatchTextField] = useReducer(customerReducer, {...usersData})
    const [isLoading, toggleLoading] = useToggle(false)
    const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Signin Cancelled', isOpen:false, msgColor:'error'})
    const context = useContext(SessionContext)
    const {session, userData, theme, GetData} = context
    const [userState, getFromStorage, setInStorage, addUserType] = session
    const buttonText= isLoading ? <CircularProgress /> : 'Login'
    const recaptchaRef = createRef()

    const LogIn = async(res)=>{
      try{
        let mySession = res
        const user = await FindUserData(res.token, res._id)
        mySession= {...mySession, userType:user.userType ? user.userType :'User'}
        setInStorage(SESSIONKEY, mySession)
      }catch(err)
      {
        navigate.reload()
      }
    }
    const authenticate = async()=>{
      try{
        let token = await recaptchaRef.current.getValue()
        if(!token)
        {
          dispatchSnack({type:'OTHER', message:'Please Verify with ReCaptcha', msgColor:'warning'})
          return
        }

         if(!isLoading)
         {
          toggleLoading()
          const res =  await SigninUser(textFieldState.username.toLowerCase(), textFieldState.password)
          if(res && (res.message==='SUCCESS' || res.message==='WARN'))
          {
            if(res.message==='SUCCESS' )
            {
              dispatchSnack({type:'OTHER', message:'Signed in Sucessfully', msgColor:'success'})
            }
            else
            {
              dispatchSnack({type:'OTHER', message:'Welcome Back', msgColor:'warning'})
            }
           
             setTimeout(async() => {
              await LogIn(res.activeSession)
            }, 1000); 
          }
         else if(res && res.message)
         {
          toggleLoading()
          dispatchSnack({type:'OTHER', message:res.message, msgColor:'error'})  
          }
          else
        {
          toggleLoading()
            dispatchSnack({type:'OTHER', message:'Signed in Failed', msgColor:'error'})
        }

        if(recaptchaRef.current)
          recaptchaRef.current.reset()
         }
      }catch(err){
        toggleLoading()
      }
     
}

  const CompleteSignin =async()=>{
  await GetData ()
  navigate.push({
    pathname:'/saleclassic'
  })
  }

  useEffect(()=>{
    
    if(session[0] && session[0].token && !session[0].isDeleted && !userData.users.length)
    {
      CompleteSignin()
    }
    
  }, [session[0]])

    useEffect(()=>{ 
        ValidatorForm.addValidationRule('isUsernameLengthOk', (value) => {
            if(textFieldState.username.length<3 || textFieldState.username.indexOf(' ') >=0)
            {
           return false
            }
            else{
              return true
            }
          });

          ValidatorForm.addValidationRule('isPasswordLengthOk', (value) => {
            if(textFieldState.password.length<3)
            {
           return false
            }
            else{
              return true
            }
          });

    },[textFieldState])

    return (
        <MainBoxStyle> 
        <Header  name='Signin' />
        <LogoStyle src={SHOPINFO && SHOPINFO.ico.src} alt={SHOPINFO && SHOPINFO.ico.alt} />
        <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={e=>dispatchSnack({type:'CLOSEMSG'})} 
         anchorOrigin={{ vertical:'top',horizontal:'center' }}>
        <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
          {alertSnack.message}
        </Alert>
        </Snackbar>

        <SigninBoxStyle theme={theme.themes[theme.active]}>
       
        <Typography variant='h4'>SIGN IN</Typography>
       <ValidatorForm onSubmit={authenticate} instantValidate={false}>
       <SignInInputBoxStyle >
          <TextFieldStyle
          theme={theme.themes[theme.active]}
           label = 'User Name'
           value={textFieldState.username}
           name='username'
           onChange={(e)=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
     
            validators={['required',  'isUsernameLengthOk']}
            errorMessages={['Enter Username','Username is not Valid']}
           />

          <TextFieldStyle
          theme={theme.themes[theme.active]}
           label = 'Password'
           value={textFieldState.password}
           name='password'
           type='password'
           autoComplete="on"
           onChange={(e)=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
            validators={['required', 'isPasswordLengthOk']}
            errorMessages={['Enter password', 'enter valid password']}/>
       </SignInInputBoxStyle>
  
        <SignupBtnBoxStyle  >
        <ReCAPTCHA style={{zIndex:10}}
        ref={recaptchaRef}
        sitekey={process.env.RECAPTCHA_KEY}
        />
        <SigninBtnStyle  theme={theme.themes[theme.active]} variant='contained' color='primary' disabled={isLoading}  type='submit' endIcon={<Login />} >
           {buttonText}
        </SigninBtnStyle>
        </SignupBtnBoxStyle>
       </ValidatorForm>
        </SigninBoxStyle>
        </MainBoxStyle>
    )
}

export default memo(SigninForm)


