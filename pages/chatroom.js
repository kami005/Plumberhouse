
import React, { useContext, useEffect, useRef, useState } from "react";
import { alpha, Avatar, Badge, CircularProgress, Divider, IconButton, Typography } from "@mui/material";
import { SessionContext } from "../src/Context/SessionContext";
import {  IconBtnStyle, MainBox, MessageBody, MessageFooter, MsgCard, SendIconBtn, TextFieldBox, 
TextFieldStyle,  UserBox, UserHeaderCard, UsersBox, UsersChatBox, UsersChatPaper, UsersPaper } from "../styles/ChatRoomStyle";
import Header from '../src/Components/HeaderText'
import { DeleteForever, DoneAll, RemoveDone, Send, Done } from "@mui/icons-material";
import {v4} from 'uuid'
import { AddMessage } from "../src/BackendConnect/MessageStorage";

const chatroom=(props)=>{
  const context = useContext(SessionContext)
  const {userData, dispatchMessage, session, socket, theme} = context
  const [fieldText, setFieldText] = useState('')
  const messagesEndRef = useRef (null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

const SendMessage =async (e)=>{
  try
  {
    if(e)
    e.preventDefault()
    if(fieldText !== '')
    {
      const uuid= v4()

      dispatchMessage({type:'SENDMESSAGE', message:fieldText, msgID:uuid})
      if(userData.activeIndex>=0 && userData.users[userData.activeIndex].socket && socket && userData.users[userData.activeIndex].active)
      {
        socket.emit('send_message', {sender:session[0].username, message:fieldText, msgID:uuid, socket: userData.users[userData.activeIndex].socket, mySocket:socket.id})
        dispatchMessage({type:'UPDATESTATUS' , msgID:uuid, _id:uuid, status:'SENT'})
      }
      else if(userData.activeIndex>=0)
      {
        const msg = await AddMessage({myToken:session[0].token, senderID:session[0].token,  myId:session[0]._id, message:fieldText, type:'SENT', status:'SENT', group:[], receiverID:userData.users[userData.activeIndex].id })
        dispatchMessage({type:'UPDATESTATUS' , msgID:uuid, _id:msg.data._id, status:'SENT'})
      }
       
      setFieldText('')
     }
  }catch(er)
  {
    console.log(er)
  }
}

const GetMsgStatus =()=>{
  let usersArray =userData.users
  for (let i=0;i<usersArray.length;i++)
  {
   if( userData.activeIndex>-1)
    for(let j=0;j<usersArray[i].messages.length;j++)
    {
      if(usersArray[userData.activeIndex].name === usersArray[i].name &&  usersArray[i].messages[j].status!=='READ' && usersArray[i].messages[j].type=='RECEIVE'  )
      {
        socket.emit('open_message', {mySocket:socket.id, msgID:usersArray[i].messages[j].msgID, sender:session[0].username, socket:usersArray[i].socket})
      }
    }
  }
}


const OpenUserMessage =async(id)=>{
  GetMsgStatus()
  await dispatchMessage({type:'CHANGEUSER', id:id})
  await dispatchMessage({type:'OPENMESSAGE'})
  await dispatchMessage({type:'GETUNREADMSG'})
  scrollToBottom()

}




useEffect(()=>{
  if(session[0] && session[0].username)
  {
    if(socket && props.pathname.includes('chatroom'))
    {
      socket.on('message_opened', async(data)=>{
        dispatchMessage({type:'SETMSGSTATUS', msgID:data.msgID, status:'READ'})
      })
    }
  }

}, [socket])
useEffect(()=>{
  scrollToBottom()
  GetMsgStatus()
},[userData])


useEffect(()=>{
if(session[0] && session[0].username)
{
  dispatchMessage({type:'OPENMESSAGE'})
  dispatchMessage({type:'GETUNREADMSG'})
  scrollToBottom()
  GetMsgStatus()
}

},[])

const GetMessages =()=>{

  if(userData.users.length && userData.activeIndex>=0)
  {
    return(
      <React.Fragment>
      <UserHeaderCard sx={{display:'none'}}>
      <Typography variant="h6">{userData.users[userData.activeIndex].name} </Typography>
      </UserHeaderCard>
      
      {userData.users[userData.activeIndex].messages.map((message, i)=>
        <MsgCard key={i} elevation={10} 
        sx={{ alignSelf:message.type==='SEND'? 'flex-end':'flex-start',
        background:message.type==='SEND'?  theme.themes[theme.active].tabBackground: message.status ==='SENT'? '#18332E' : alpha(theme.themes[theme.active].tabBackground, 0.6)}}>
        <Divider variant="middle" />
        <MessageBody theme={theme.themes[theme.active]}>
        <Typography variant='body1'>
        {message.message}
        </Typography>

      
        </MessageBody>
        <Divider variant="middle" />
      
        <MessageFooter theme={theme.themes[theme.active]}>
       
        {
          message.type==='SEND' ?
          (
            message.status === 'SENDING' ?
            <CircularProgress size='12px' sx={{color:'#F13D65'}}/> 
             : 
             message.status==='SENT'
             ?
            <Done sx={{color:theme.themes[theme.active].text, width:'18px', height:'18px',}} />
            :
            message.status==='RECEIVED'
            ?
            <DoneAll sx={{color:theme.themes[theme.active].text, width:'18px', height:'18px',}}/>
            :
            message.status ==='FAILED'
            ?
            <RemoveDone sx={{color:'#F13D65', width:'18px', height:'18px',}} />
            :
            message.status==='READ'
            &&
            <DoneAll sx={{color:theme.themes[theme.active].up, width:'18px', height:'18px',}} />
          ) : ''

          
        }
        <Typography variant='body2'>{message.dateTime}</Typography>
   
        <IconButton onClick={()=> dispatchMessage({type:'DELETEMSG', index:i })}>
          <DeleteForever sx={{color:theme.themes[theme.active].down,width:'18px', height:'18px',}}/>
        </IconButton>
       
        </MessageFooter>
        </MsgCard>
        )}
     
      </React.Fragment>
    )
  }
  else
  return null
}

  return (
    <MainBox>
    <Header name='CHAT ROOM'/>
    <UsersBox theme={theme.themes[theme.active]}>
    <UsersPaper elevation={8} theme={theme.themes[theme.active]}>
      { userData.users.map((user, i)=>
      <UserBox theme={theme.themes[theme.active]} key={i} className={i===userData.activeIndex && 'active'}>
        <IconBtnStyle theme={theme.themes[theme.active]} onClick={()=>OpenUserMessage(user.id)}>
        <Badge   
         sx={{
            "& .MuiBadge-badge": {
            color:user.active ? 'black':'white',
            backgroundColor: user.active ? '#09ff00':'#4663ac'
          }
        }} 
        badgeContent={user.unreadMsg>0 ? user.unreadMsg:''}
        variant={user.unreadMsg>0 ?'standard':'dot'}>
        <Avatar />
       </Badge>
       </IconBtnStyle>
       <Typography variant='body2'>{user && user.name}</Typography>
      </UserBox>
       )}
    </UsersPaper>
    </UsersBox>
        <UsersChatPaper elevation={8} theme={theme.themes[theme.active]}>
        <UsersChatBox theme={theme.themes[theme.active]}> 
        {GetMessages()}
        <div ref={messagesEndRef} />
        </UsersChatBox>
        {userData.activeIndex>=1 && <form onSubmit={e=>SendMessage(e)}>
        <TextFieldBox elevation={8} theme={theme.themes[theme.active]}>
        <TextFieldStyle fullWidth theme={theme.themes[theme.active]} size="small" variant='outlined' type='search' value={fieldText} onChange={e=>setFieldText(e.target.value)} placeholder="Type a message...." 
        InputProps={{
          endAdornment: (
            <SendIconBtn theme={theme.themes[theme.active]} type='submit'>
            <Send/>
          </SendIconBtn>
          )
         }}
        />

        </TextFieldBox>
        </form>}
        </UsersChatPaper>

  </MainBox>
  );
}


export default chatroom;