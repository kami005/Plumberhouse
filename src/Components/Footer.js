import { Link, SwipeableDrawer, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { BodyBox2, FindUsBox, MainBox, TopBox } from '../../styles/FooterStyle'
import { SessionContext } from '../Context/SessionContext'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SendTicket from './SendTicket';
import { useState } from 'react';

export const Footer = () => {
const context = useContext(SessionContext)
const {session, theme} = context
const [ticketState, setTicketState] = useState(false)
const GetCurYear =()=>{
  const date = new Date()
  return date.getFullYear()
}
const SessionActive = ()=>{
  
    if(session[0] && session[0].username)
        return 'true'
    else    
        return 'false'
}
  return (
    <MainBox theme={theme.themes[theme.active]} active={SessionActive()}>
    <TopBox>
    <FindUsBox>
    <Typography variant ='h6'>Find Us</Typography>
    <BodyBox2>
    <Link variant='body2' href="https://www.google.com/maps/dir//plumber+house+address/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x38dfc07573cbba11:0x444696d40a4e1e93?sa=X&ved=2ahUKEwidi-fM6JH7AhUF_rsIHeKDC4MQ9Rd6BAhfEAQ' ">
    <LocationOnIcon />Address
    </Link>
    <Link variant='body2' href="mailto:plumberhouse1@gmail.com">
    <EmailIcon />Email</Link>
    </BodyBox2>
    </FindUsBox>

    <FindUsBox>
    <Typography variant ='h6'>Contact Us</Typography>
    <BodyBox2>
    <Link variant='body2' href="tel:(009251) 2603214">
    <CallIcon /></Link>
    <Link variant='body2' href="https://wa.me/923125786189">
    <WhatsAppIcon /> </Link>
   
    <Link variant='body2' onClick={()=>setTicketState(true)}>
    <EmailIcon /></Link>
    </BodyBox2>

    </FindUsBox>

    <FindUsBox>
    <Typography variant ='h6'>About Us</Typography>
    <Typography variant='body1' >We Provide wide range of Sanitary and Hardware Items, 
    online order placement availalble on call, all services related to Plumbing are also available,
    we have highly qualified Plumbers with 100% Satisfaction Ratio.
    </Typography>
 
    </FindUsBox>

    </TopBox>
  
    <span>Plumber House © {GetCurYear()}</span>

  <SwipeableDrawer
    anchor='bottom'
    open={ticketState}
    onClose={()=>setTicketState(false)}
    onOpen={()=>setTicketState(true)}>
  <SendTicket setTicketState={setTicketState} theme={theme.themes[theme.active]}/>
  </SwipeableDrawer>
    </MainBox>
  )
}
