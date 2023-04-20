import { Avatar, Backdrop, Badge, Box, Button, CircularProgress, IconButton, Menu, MenuItem, SwipeableDrawer, Typography } from '@mui/material'
import React, {useContext, useEffect,  useState} from 'react'
import { StyledAppbar, StyledToolbar,StyledTypographyTitle, StyledUserBox,StyledTypographyUsername, DrawerBtnStyle, DrawerBoxStyle,
LogoStyle} from '../../styles/AppbarStyle'
import {AppsOutlined, Mail} from '@mui/icons-material'
import { useRouter} from 'next/router';
import { SessionContext } from '../Context/SessionContext';
import { LogoutUser } from '../BackendConnect/AuthenticateUser';
import { SHOPINFO, USERDATAKEY, UsersAPI } from '../DataSource/RandData';
import { useToggle } from '../CustomHooks/RandHooks';
import { GetAccess } from '../Utils/Rand';
import SendTicket from './SendTicket';
const Appbar = (props) => {
  const {toggleDrawer} = props
  const [anchorEl, setAnchorEl]= useState()
  const route = useRouter()
  const [logoutLoading, toggleLogout]= useToggle()
  const [userState, setState] = useState({username:'', type:'Login'})
  const context = useContext(SessionContext)
  const {session, userData, dispatchMessage,theme, DisconnectSocket} = context
  const Logout = context.funct
  const [linkName, setLinkName] = useState('')
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [ticketState, setTicketState] = useState(false)
  const GetUnreadMessages=()=>{
    let count=0
   if(userData && userData.users && userData.users.length)
   {
    for (let i=0;i<userData.users.length;i++)
    {
     for (let j=0; j<userData.users[i].messages.length;j++)
     {
       if(userData.users[i].messages[j].type==='RECEIVE' && userData.users[i].messages[j].status==='SENT')
         count+=1
     }
    }
    setUnreadMessages(count)
   }
  }

  const handleMoreClick=(e)=>{
    setAnchorEl(e.currentTarget);
  }
  
  const handleCloseAnchor=()=>{
    setAnchorEl(null)
  }

  const gotoSaleReturn=()=>{ 
    handleCloseAnchor() 
   
    route.push({
      pathname:'/salereturn'})
  }
const GotoUserManage =()=>{
  handleCloseAnchor()
    route.push({
      pathname:'/usermanagement'
    })
}
const GotoSignin =()=>{
  handleCloseAnchor()
}

const LogOut = async()=>{
  handleCloseAnchor()
  toggleLogout()
  if(session[0].token)
  {
    setState({username:'', type:'LOGIN'})
    const status=  await LogoutUser(session[0].token, session[0]._id )
    if(status)
    {
      Logout()
      DisconnectSocket()
      localStorage.removeItem(USERDATAKEY)
      dispatchMessage({type:'RESET', data:UsersAPI})
      toggleLogout()
    }
 
  }
    
}

const GetRight = (header, header2, option)=>{
  return  GetAccess(session[0].userType, session[0].rights, header, header2, option)
}

const GotoMyAccount= ()=>{
  handleCloseAnchor()
  route.push({
    pathname:`/${session[0].username}/myaccount`
  })
}

const GotoChatRoom =()=>{
  if(session[0] && session[0].token)
  {
    handleCloseAnchor()
    route.push({
      pathname:`/chatroom`
    })
  }

}

const LogoClicked =()=>{
if(session[0] && session[0].username && (session[0].userType ==='Manager' || session[0].userType==='Developer'))
route.push({
  pathname:'/dashboard'
})
}

const GetLogin =()=>{
if(session[0] && session[0].username)
{ 
  return    <Menu
          id='more-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseAnchor}>
        {GetRight('PAGES', null, 'salereturn')===true ? <MenuItem onClick={gotoSaleReturn}>
        Sale Return
        </MenuItem>: null}
       {GetRight('PAGES', null, 'usermanagement')===true ?  <MenuItem onClick={GotoUserManage}>
       User Management
       </MenuItem> : null}

        <MenuItem onClick={GotoMyAccount}>
        My Account
        </MenuItem>
        <MenuItem onClick={LogOut} sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>
        Log Out
        </MenuItem>
        </Menu>
}
else {
  return     <Menu
  id='more-menu'
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={handleCloseAnchor}>
<MenuItem onClick={GotoSignin}>Login</MenuItem></Menu>
}
}



useEffect(() => {
  if(session[0] && session[0].username)
     {
      setState({username:session[0].username, type:session[0].userType})
    }
    else
    {
      setState({username:'', type:'Login'})
    }
}, [session[0]])

useEffect(()=>{
  GetUnreadMessages()
}, [userData])

useEffect(()=>{
  if((session[0] && session[0].username) && (userState.type!==session[0].userType || userState.username !== session[0].username))
  {
    setState({username:session[0].username, type:session[0].userType})
  }
  else if((!session[0] || !session[0].username) && (userState.type !=='Login' || userState.username.length))
  {
    setState({username:'', type:'Login'})
  }
}, [userState])

useEffect(()=>{
  let pathname = route.pathname
  if (pathname==='/')
    pathname ='home'
  else
    {
      pathname = pathname.split("/").pop();
    }
    setLinkName(pathname.toUpperCase())

},[route.pathname])

const GetButtons=()=>{
  if(userState.type !=='Login')
  {
    return  <Box>
   <DrawerBtnStyle theme={theme.themes[theme.active]}  onClick={GotoChatRoom}>
   <Badge badgeContent={userData.unreadMsg} color="success" >
   <Mail color={userData.unreadMsg>0 ? 'success':'inherit'} />
   </Badge>
   </DrawerBtnStyle>
   <DrawerBtnStyle theme={theme.themes[theme.active]}  aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMoreClick(e)} >
   <Avatar src='' sx={{width:25, height:25, bgcolor:theme.themes[theme.active].text }} />
   </DrawerBtnStyle>
   <DrawerBtnStyle theme={theme.themes[theme.active]}   onClick={toggleDrawer}>
   <AppsOutlined sx={{width:25, height:25, color:theme.themes[theme.active].sidebar }}/>
   </DrawerBtnStyle>
   </Box>
  }


}
  return (
  <StyledAppbar position='sticky' theme={theme.themes[theme.active]} >
  <style jsx global>{`body {background: ${theme.themes[theme.active].mainBackground}}`}</style>
    <StyledToolbar theme={theme.themes[theme.active]}>
        <DrawerBoxStyle  theme={theme.themes[theme.active]}>
          <LogoStyle theme={theme.themes[theme.active]} src={SHOPINFO.logo.src} alt={SHOPINFO.logo.alt} onClick={LogoClicked} />
            <StyledTypographyTitle theme={theme.themes[theme.active]} variant='h6'>
            {linkName}
            </StyledTypographyTitle>
        </DrawerBoxStyle>
        {userState.username ? 
        <StyledUserBox theme={theme.themes[theme.active]}>
       <StyledTypographyUsername variant='body2' theme={theme.themes[theme.active]} onClick={GotoMyAccount}>
        Logged as:  {userState.username}
        </StyledTypographyUsername>
        { GetButtons() }
        </StyledUserBox>: null}
      {(!userState || userState.type==='Login') ?  
      <StyledUserBox theme={theme.themes[theme.active]}> 
      <IconButton  onClick={()=>setTicketState(true)}>
      <Mail sx={{color:theme.themes[theme.active].text}} />
      </IconButton>
      </StyledUserBox> : null }
        <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={logoutLoading}>
          <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <CircularProgress color='inherit' size='3rem'/>
            <span >Logging out....</span>
          </div>
        </Backdrop>
        {GetLogin()}
    </StyledToolbar>
    <SwipeableDrawer
      anchor='bottom'
      open={ticketState}
      onClose={()=>setTicketState(false)}
      onOpen={()=>setTicketState(true)}
    >
    <SendTicket setTicketState={setTicketState} theme={theme.themes[theme.active]}/>
    </SwipeableDrawer>
      </StyledAppbar>
  )
}


export default Appbar