import React, {createContext,useEffect, useReducer, useState} from 'react'
import { useLocalStorageState } from '../CustomHooks/SessionHooks'
import { getData } from '../CustomHooks/SessionHooks'
import {Alert, Backdrop, CircularProgress, Snackbar} from '@mui/material'
import {messageReducer, useToggle} from '../CustomHooks/RandHooks'
import {SESSIONKEY, USERDATAKEY, THEMEDATA, UsersAPI} from '../DataSource/RandData'
import { findActiveSession, FindAllUsers, FindUserData} from '../BackendConnect/AuthenticateUser'
export const SessionContext = createContext()
import { ServerIP } from '../DataSource/BackendIP'
import io from "socket.io-client";
import { useRouter } from 'next/router'
import { mainTheme, lightTheme, darkTheme } from '../DataSource/RandData'
import { GetReceiveMessages, GetSentMessages, GetTicketMessage } from '../BackendConnect/MessageStorage'
export const REVALIDATETIME = 10000;

const SessionProvider =(props)=>{
    const route = useRouter()
    const {children} = props
    const [theme, setTheme] =useState({themes:[mainTheme, darkTheme, lightTheme], active:0})
    const [showSnack, toggleSnack] = useToggle(false)
    const [logoutLoading, toggleLogout] =useToggle(true)
    const [count, setCount] = useState(1)
    const [userData, dispatchMessage] = useReducer(messageReducer, UsersAPI)
    const session = useLocalStorageState(SESSIONKEY, getData(SESSIONKEY))
    const [userState, getFromStorage, setInStorage, addUserType] = session
    const [socket, setConnect] = useState(false)
    

    const ConnectSocket = async()=>{
      const socketIO =  io(ServerIP);
      setConnect(socketIO)
    }

    if(!socket && session[0] && session[0].token)
    { 
        ConnectSocket()
    }
    
    const DisconnectSocket =()=>{
      if(socket)
        socket.disconnect()
      setConnect()
    }

  const GetTheme = ()=>{
    let activeTheme = localStorage.getItem(THEMEDATA)
    if(activeTheme)
      {
        activeTheme = JSON.parse(activeTheme)
        if(!isNaN(activeTheme))
          setTheme({...theme, active:activeTheme})
      }
  }

  const LoadUsers = async ()=>{
    if(session[0] && session[0].username)
    {
      let activeSession = session[0]
      let data = localStorage.getItem(USERDATAKEY)
      data = JSON.parse(data)
      let res = []

      res = await FindAllUsers({myToken:activeSession.token, myId:activeSession._id})
      let usersRes = []
      
      usersRes.push({name:'Guests', active:false, id:'other', socket:null, messages:[], unreadMsg:0})

       if(!data || data===undefined || !data.users || !data.users.length)
           for(let i=0;i<res.length;i++)
           {
            if(res[i].username !== activeSession.username)
             usersRes.push({name:res[i].username, active:false, id:res[i]._id, socket:null, messages:[], unreadMsg:0})
           }
       else
        for(let i=0;i<res.length;i++)
         {
           loop2: for(let j=0;j<data.users.length;j++)
           { 
             let found=false
            
             if(res[i].username===data.users[j].name )
             {
                 found=true
                 if(res[i].username !== activeSession.username)
                 usersRes.push({name:res[i].username, active:false, id:res[i]._id, socket:null, messages:data.users[j].messages, unreadMsg:data.users[j].unreadMsg})
                 break loop2;
               }
             else if(!found && j===parseInt(data.users.length)-1)
             {
              if(res[i].username !== activeSession.username)
               usersRes.push({name:res[i].username, active:false, id:res[i]._id, socket:null, messages:[], unreadMsg:0})
             }
           }
         }
       dispatchMessage({type:'LOAD', users:usersRes})
    }

  }

  const FindSession =async (data) =>{
        try{
            if((session && session[0] && session[0].token && session[0]._id) || data){
              let activeSession = (session[0] && session[0].username) ? session[0] : data
              const sessionisActive = await findActiveSession(activeSession.token, activeSession._id)
              const user = await FindUserData(activeSession.token,  activeSession._id)
              let userType='User'
              if(user && user.userType)
                  userType= user.userType
              addUserType(userType, user.rights)

              if(!sessionisActive || !user || user.status !=='ACTIVE'){
                toggleSnack()
              if(socket)
              {
                socket.disconnect()
              } 
                setInStorage(SESSIONKEY, {})
                dispatchMessage({type:'RESET', data:UsersAPI})
                route.replace({
                  pathname: '/signin',
               })
               }
               else if (socket)
                socket.emit('send_beacon', {user:activeSession.username, mySocket:socket.id})
            }
        }
        catch(err){
            console.log('Internal Error occurred from Session'+err)
        }
    }

    const GetData =async(data)=>{
      try
      {
        GetTheme()
        await LoadUsers()
        await FindSession(data)
        toggleLogout(false)
         GetSent()
         GetReceive()
      }catch(er)
      {
        toggleLogout(false)
        console.log(er)
      }
      
    }

    const GetSent=async ()=>{
      try
      {
        const ticketMessages = await GetTicketMessage({myToken:session[0].token, myId:session[0]._id})
        if(ticketMessages && ticketMessages.length)
        {
        dispatchMessage({type:'GETTICKETMESSAGES', messages:ticketMessages})
        }
        const messages = await GetSentMessages({myToken:session[0].token, myId:session[0]._id})
        if(messages && messages.length)
        for (let i in messages)
        {
           dispatchMessage({type:'GETONLINEMESSAGE', messageData:messages[i]})
        }
        dispatchMessage({type:'GETUNREADMSG'})
      }catch(er)
      {
        console.log(er)
      }
     }

     const GetReceive=async ()=>{
      try
      {
        
        const messages = await GetReceiveMessages({myToken:session[0].token, myId:session[0]._id})
        if(messages && messages.length)
        {
          for (let i in messages)
          {
            dispatchMessage({type:'SETMSGSTATUS', msgID:messages[i]._id, status:'READ', message:messages[i]})
          }
        }
      }catch(er)
      {
        console.log(er)
      }
     }

    const GetPageAccess=()=>{
      try
      {
        const curPage = route.pathname
        curPage = curPage.substring(1);
        if(!curPage.length)
            curPage='Home'
        if(curPage.toLocaleLowerCase()!=='saleclassic' && session[0].userType!=='Developer' && session[0].rights && session[0].rights.length)
        {
          const userRight =  session[0].rights[0].rows.find(page=>page.options.toLowerCase()===curPage.toLowerCase())
          if(curPage!=='saleclassic' && userRight && !userRight.access)
              route.push('/saleclassic')
        }
      }catch(err)
      {
        console.log(err)
      }

    }
  
    useEffect(()=>{
      let counter=count
      const gameStartInternal = setInterval(() => {
        counter++
        if(counter>=8)
          foo()
          setCount(count=>counter)
      }, 1000);
      if(session[0] && session[0].token)
        GetData()
      else
        toggleLogout(false)
      var foo = function () {
        clearInterval(gameStartInternal);
      };
      return () => {
        clearInterval(gameStartInternal);
      };
    },[])

    const PushLoginPage = async()=>{
      await route.push({
        pathname:'/signin'
      })
    }

    useEffect(()=>{
      if(route)
      {
        if((!session[0] || !session[0].username) && route.pathname !=='/signin' )
        PushLoginPage()
      else if(session[0] && session[0].userType)
        {
          GetPageAccess()
        }
      }

    },[route, session[0]])


  useEffect(()=>{
    if(socket)
    { 
      socket.on("receive_beacon", (data) => {
        if(data.socket)
        {
          dispatchMessage({type:'SETACTIVE', user:data})
          if(session[0] && session[0].username)
              socket.emit('receive_beacon', {user:session[0].username, mySocket:socket.id})  
        }
      });
      socket.on("reply_beacon", (data) => {
        if(data.socket)
        {
          dispatchMessage({type:'SETACTIVE', user:data, mySocket:socket.id})
        }
       
      });
       socket.on("send_offline", (data) => {
        dispatchMessage({type:'SENDOFFLINE', socket:data.socketID, mySocket:socket.id})
    });

    socket.on("get_message", async(data) => {
     await dispatchMessage({type:'GETMESSAGE', data})
     
     if(window.location.pathname.includes('chatroom'))
     {
      dispatchMessage({type:'CHECKCHATOPEN', sender:data.sender, msgID:data.msgID, socket, receiverSocket: data.socket} )

     }
     else
     {
      socket.emit('receive_message', {sender:session[0].username, msgID:data.msgID, socket: data.socket, mySocket:socket.id})
     }
     dispatchMessage({type:'GETUNREADMSG'})
    });

    socket.on("message_received", async(data) => {
      dispatchMessage({type:'SETMSGSTATUS', msgID:data.msgID, status:'RECEIVED'})
     });
    }

  },[socket])


  useEffect(()=>{
    localStorage.setItem(USERDATAKEY, JSON.stringify(userData))
  },[userData])

        return(
            <SessionContext.Provider value={{session, funct:FindSession, userData, GetData, dispatchMessage, socket, DisconnectSocket, theme, setTheme}}>
            {children}
            <Snackbar open={showSnack} autoHideDuration={3000} onClose={toggleSnack} 
            anchorOrigin={{ vertical:'top',horizontal:'center' }}>
            <Alert  severity='warning'  elevation={6} variant='standard'>
            Logged out!
            </Alert>
            </Snackbar>

            <Backdrop sx={{ backdropFilter: 'blur(5px)', color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={logoutLoading}>
            <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
            <CircularProgress color='inherit' size='3rem'/>
            <span >Loading{Array(count).fill('.')}</span>
             </div>
            
            </Backdrop>
            </SessionContext.Provider>
        )
}
 

export default  SessionProvider