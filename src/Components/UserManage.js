import {Snackbar, Alert, CircularProgress, MenuItem, Typography, FormControlLabel, Checkbox, Backdrop} from '@mui/material'
import React, { useEffect, memo, useContext, forwardRef, useImperativeHandle, useState } from 'react'
import { ValidatorForm } from 'react-material-ui-form-validator';
import { NavBarData, userData } from '../DataSource/RandData';
import {FindDBList, findUser, signupUser, UpdateUser, UpdateUserPassword } from '../BackendConnect/AuthenticateUser';
import { MainBoxStyle, SigninBtnStyle, SignInInputBoxStyle, SingupNamesBoxStyle, SingupBoxStyle, TextFieldStyle, SignupBtnBoxStyle, HeaderTypographyStyle,
SelectStyle,  RightsBox, RightHeader, RightBody, RightBodyItem } from '../../styles/UserManageStyle';
import { alertReducer, customerReducer, useToggle } from '../CustomHooks/RandHooks';
import { useReducer } from 'react';
import { SessionContext } from '../Context/SessionContext';
import { ManageSearch, RotateLeft, Save, Update } from '@mui/icons-material';
import UserSessions from './UserSessions';
import { userType } from '../DataSource/RandData';

const ManageUser=forwardRef((props, ref)=>{
    const status = ['ACTIVE', 'SUSPENDED', 'BLOCKED', 'DELETED']
    const skipColumns =['logs', 'usersessions']
    const {setIndex}= props
    const [textFieldState, dispatchTextField] = useReducer(customerReducer, {...userData})
    const [isLoading, toggleLoading] = useToggle(false)
    const [showSessions, toggleSession] = useToggle()
    const [updatingUser, setUpdatingUser]= useState()
    const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Sale Cancelled', isOpen:false, msgColor:'error'})
    const context = useContext(SessionContext)
    const {session, theme} = context
    const submitBtn = updatingUser ? 'UPDATE' : 'CREATE'
    const submitIcon = updatingUser ? <Update /> :<Save />
    const [loadingRights, toggleLoadingRights] = useToggle()

    useImperativeHandle(ref, ()=>({
      childFunction1(user){
      setUpdatingUser({...user, password:'', confirmPass:''})
    },

    childFunction2(user){
      setUpdatingUser({...user, password:'', confirmPass:''})
      toggleSession()
    }
    }))

    const GetTables =async()=>{
      try
      {
        toggleLoadingRights()
        const tables = await FindDBList({myToken:session[0].token, myId:session[0]._id})
        let pageRows = [], tableRows=[]
        NavBarData.map(data=>pageRows.push({options:data.title,access:false }))
        pageRows.push({options:'SaleReturn',access:false })
        pageRows.push({options:'UserManagement',access:false })
        if(tables)
          tables.map(column=>skipColumns.some(skipColumn=>skipColumn.toLocaleLowerCase()===column.toLocaleLowerCase()) === false && tableRows.push({options:[{name:'Search', access:false},{name:'Insert' , access:false}, 
          {name:'Modify', access:false}, {name:'Delete', access:false} ], name:column}))
          dispatchTextField({type:'TABLERIGHTS', val:[{header:'PAGES', rows:pageRows}, {header:'TABLES', rows:tableRows}] })
          toggleLoadingRights()
      }catch(er)
      {
        toggleLoadingRights()
        console.log(er)
      }  
    }

    const Reset =()=>{
    dispatchTextField({type:'RESET', payload:userData})
    GetTables()
    setUpdatingUser()
    }

    useEffect(()=>{
      if(!loadingRights && updatingUser !==undefined && updatingUser!==null && updatingUser.username && updatingUser._id && updatingUser.rights)
      {
        dispatchTextField({type:'UPDATEUSER', payload:updatingUser})
      }
    },[loadingRights])
    
    useEffect(()=>{
          GetTables()
    },[])

    const handleSubmitSignup = async()=> {
        try
        {
          toggleLoading()
          if(updatingUser && updatingUser._id)
          {
            const user={_id:textFieldState.id, username:textFieldState.username.toLowerCase(),email: textFieldState.email.toLowerCase(), fName: textFieldState.fName,
            lName: textFieldState.lName,address:textFieldState.address, status:textFieldState.status, userType:textFieldState.userType, rights:textFieldState.rights}
            const res = await UpdateUser({...user,myToken:session[0].token, myId:session[0]._id })
            if(textFieldState.password.length>2){
             await UpdateUserPassword({_id:textFieldState.id, password:textFieldState.password,myToken:session[0].token, myId:session[0]._id })
                }
                dispatchSnack({type:'OTHER', message:`Username: ${textFieldState.username} has been updated Successfully!!!`, msgColor:'success'})
            if(res){
            setTimeout(() => {
              setUpdatingUser()
              toggleLoading()
              dispatchTextField({type:'RESET', payload:userData})
              setIndex("1")
              }, 1000)
            }
          }
          else
          {
           const data = await signupUser({...textFieldState, username:textFieldState.username.toLowerCase(),
            email: textFieldState.email.toLowerCase(),myToken:session[0].token, myId:session[0]._id})  
           if(data)
              {
                dispatchSnack({type:'OTHER', message:'USER SUCCESSFULLY CREATED', msgColor:'success'})
                setTimeout(() => {
                  toggleLoading()
                  dispatchTextField({type:'RESET', payload:userData})
                  GetTables()
                }, 1000);
              }
              else
                {
                  toggleLoading()
                  dispatchSnack({type:'OTHER', message:'Some Error Occurred', msgColor:'error'})
                }
          }
        }
        catch(err)
        {
          dispatchSnack({type:'OTHER', message:err, msgColor:'error'})
          console.log(err)
        }    
      }

      const GetDisabled =(type)=>{
        try{
          if (session[0] && session[0].userType)
          {

          const myIndex =  userType.findIndex(val=>val===session[0].userType)
        
          if(!updatingUser && !textFieldState._id && type)
          {
            let curType = userType.findIndex(val=>val===type)    
            if(curType>-1 && myIndex>-1)
            {
              if(curType>myIndex)
                return true
              else
                return false
            }
            else
             return true
          }
          else if(textFieldState._id && updatingUser && type)
          {
           const userIndex = userType.findIndex(val=>val===textFieldState.userType)
            const curIndex = userType.findIndex(val=>val===type)
            if(userIndex>myIndex || curIndex > myIndex)
            return true
          else
            return false
          }
         }
          else
            return true
      

        }catch(err)
        {
          console.log(err)
          return true
        }

      }

      const GetStatus =(index)=>{
        try{
          if (session[0] && session[0].userType)
          {
            const curType = userType.findIndex(val=>val===textFieldState.userType)
            const myType =   userType.findIndex(val=>val===session[0].userType)
            if(!isNaN(curType) && !isNaN(myType))
            {
              if(curType>myType)
              {
                if(index===0)
                return false
                else
                  return true
              }
              else
                return false
            }
            else
             return true
        }
        else
          return true

        }catch(err)
        {
          console.log(err)
        }
      }
      
      const find= async (type, filter)=>{
          
        if ((type==='username'&& filter === updatingUser.username) || (type==='email' && filter === updatingUser.email) ){
            return true
          }
          else{
        const available = await findUser(type, filter.toLowerCase(), {myToken:session[0].token, myId:session[0]._id})
        return available}
    }

    useEffect(()=>{
        ValidatorForm.addValidationRule('isfNameLengthOk', (value) => {
            if(value<3)
              return false
            else
              return true
          });

          ValidatorForm.addValidationRule('islNameLengthOk', (value) => {
            if(value<3)
           return false
            else
              return true
          });

          ValidatorForm.addValidationRule('isPasswordLengthOk', (value) => {
            if(updatingUser)
            {
              if(textFieldState.password.length<3 && textFieldState.password.length!==0)
              return false
               else
                 return true
            }
            else
            {
              if(value<3)
              return false
               else
                 return true
            }
      
          });

          ValidatorForm.addValidationRule('isMatching', (value) => {

          if(value !== textFieldState.password)
             return false
          else 
            return true
          });

          ValidatorForm.addValidationRule('isUsernameUnique', (value) => {
            if(updatingUser)
            {
              const isAvailable = find('username', value.toLowerCase())
              return isAvailable
            }else{
              const isAvailable= findUser('username', value.toLowerCase() , {myToken:session[0].token, myId:session[0]._id})
              return isAvailable
            }
          });

          ValidatorForm.addValidationRule('isUsernameLengthOk', (value) => {
            if(value<3 || value.indexOf(' ') >=0)
           return false
            else
              return true
          });

          ValidatorForm.addValidationRule('isEmailUnique', (value) => {
            if(updatingUser)
            {
              const isAvailable = find('email', value.toLowerCase())
              return isAvailable
            }else{
              const isAvailable= findUser('email', value.toLowerCase(), {myToken:session[0].token, myId:session[0]._id})
              return isAvailable
            }
          
          });
    },[textFieldState])
if(showSessions)
{
  return <UserSessions user={updatingUser} toggleSession={toggleSession}/>
}
else
    return (
        <MainBoxStyle theme={theme.themes[theme.active]} >
         <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
          anchorOrigin={{ vertical:'top',horizontal:'center' }} >
        <Alert  severity={alertSnack.msgColor}  elevation={6} variant="standard">
        {alertSnack.message}
        </Alert>
        </Snackbar>
        <SingupBoxStyle theme={theme.themes[theme.active]} >
        <HeaderTypographyStyle theme={theme.themes[theme.active]} variant='h4'>{updatingUser ? `Updating ${updatingUser.username}`:'Create User'}</HeaderTypographyStyle>
       <ValidatorForm onSubmit={handleSubmitSignup} instantValidate={false}>
       <SignInInputBoxStyle theme={theme.themes[theme.active]}>
       <SingupNamesBoxStyle theme={theme.themes[theme.active]}>
       <TextFieldStyle
       theme={theme.themes[theme.active]}
           label = 'First Name'
           size='small'
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
           size='small'
           value={textFieldState.lName}
           name='lName'
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
            fullWidth
            validators={['required', 'islNameLengthOk']}
            errorMessages={['Enter Last Name','Enter valid Name']}
           />
       </SingupNamesBoxStyle>
          <TextFieldStyle
          disabled={GetDisabled('User')}
          theme={theme.themes[theme.active]}
           label = 'User Name'
           size='small'
           
           value={textFieldState.username}
           name='username'
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}  
            fullWidth
            validators={['required', 'isUsernameUnique', 'isUsernameLengthOk']}
            errorMessages={['Enter Username', 'Username is not availalbe','Username is not Valid']}
           />
            <TextFieldStyle
            theme={theme.themes[theme.active]}
            disabled={GetDisabled('User')}
           label = 'Email Address'
           type='email'
           value={textFieldState.email}
           name='email'
           size='small'
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
            fullWidth
            validators={['required', 'isEmailUnique']}
            errorMessages={['Enter email', 'Email is not availalbe']}
           />
            <TextFieldStyle
            theme={theme.themes[theme.active]}
           type='password'
           label = 'Password'
           size='small'
           autoComplete="on"
           value={textFieldState.password}
           name='password'
           disabled={GetDisabled('User')}
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})}  
            fullWidth
            validators={['isPasswordLengthOk']}
            errorMessages={['enter valid password']}
           />
            <TextFieldStyle
            theme={theme.themes[theme.active]}
           label = 'Confirm Password'
           type='password'
           size='small'
           autoComplete="on"
           disabled={GetDisabled('User')}
           value={textFieldState.confirmPass}
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
           name='confirmPass'
            fullWidth
            validators={['isMatching']}
            errorMessages={['password does not match']}
           />
            <TextFieldStyle
            theme={theme.themes[theme.active]}
           label = 'Address'
           name='address'
           size='small'
           value={textFieldState.address}
           onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
            fullWidth
           />
            <SelectStyle theme={theme.themes[theme.active]} size='small' select value={textFieldState.status} name='status' onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
              label='Status'>
              {status.map((name,i)=> <MenuItem disabled={GetStatus(i)} value={name} key={name}>{name}</MenuItem>)}
          </SelectStyle>
          <SelectStyle theme={theme.themes[theme.active]} size='small' select value={textFieldState.userType} name='userType' onChange={e=>dispatchTextField({type:'CHANGEVAL', payload:e})} 
              label='userType'>
              {userType.map(name=> <MenuItem disabled={GetDisabled(name)} value={name} key={name}>{name}</MenuItem>)}
          </SelectStyle>
       </SignInInputBoxStyle>

       <RightsBox theme={theme.themes[theme.active]}>

        <RightHeader theme={theme.themes[theme.active]}> <Typography variant='body1'>Rights / Access</Typography> </RightHeader>
          <RightBody theme={theme.themes[theme.active]}>
          {textFieldState.rights && textFieldState.rights.map((data,i)=>
            <React.Fragment key={data.header}>
            <Typography variant='body2'>{data.header}</Typography> 
            {data.rows.map((row,j)=>row.name ?
              <RightBodyItem key={row.name}>
              <Typography variant='body2'>{row.name}</Typography> 
              <div style={{margin:0, padding:0}}>
              {row.options.map((option,k)=>
                <FormControlLabel key={option.name} control={<Checkbox checked={option.access} />} label={option.name}  onChange={()=>dispatchTextField({type:'CHANGECHECK', rightIndex:i, rightRowIndex:j, rowOptionIndex:k})} />)}
              </div>
              </RightBodyItem>
                :
              <FormControlLabel key={row.options} control={<Checkbox checked={row.access} onChange={()=>dispatchTextField({type:'CHANGECHECK', rightIndex:i, rightRowIndex:j})}/>} label={row.options} />)}
            </React.Fragment>)}
          </RightBody>
       </RightsBox>
        <SignupBtnBoxStyle theme={theme.themes[theme.active]}>
        <SigninBtnStyle theme={theme.themes[theme.active]} variant='contained' color='primary' disabled={isLoading}  type='submit' endIcon={submitIcon}>
            {isLoading ? <CircularProgress size='1.4rem'/> : submitBtn}
        </SigninBtnStyle>
        <SigninBtnStyle theme={theme.themes[theme.active]} variant='contained' color='warning' endIcon={<RotateLeft />}  onClick={Reset}>
              Reset
        </SigninBtnStyle>
        <SigninBtnStyle  theme={theme.themes[theme.active]} variant='contained' color='secondary' endIcon={<ManageSearch />}  onClick={toggleSession}>
              Sessions
        </SigninBtnStyle>
        </SignupBtnBoxStyle>
       </ValidatorForm>
        </SingupBoxStyle>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loadingRights}
      >
      <CircularProgress color='info' />
      </Backdrop>
        </MainBoxStyle>

    )
})


export default memo(ManageUser)