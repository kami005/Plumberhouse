import {  Divider, List, ListItem, ListItemIcon, ListItemText, ToggleButton } from '@mui/material'
import React, {useContext, useEffect, useState}from 'react'
import { BoxMainStyle, ListItemBtnStyle, AntSwitch, ToggleBtnGrp } from '../../styles/SidebarStyle';
import { NavBarData, THEMEDATA } from '../DataSource/RandData';
import Link from "next/link";
import { useRouter } from "next/router";
import {SessionContext} from '../Context/SessionContext';
import ModeNightIcon from '@mui/icons-material/ModeNight';
import LightModeIcon from '@mui/icons-material/LightMode';
import FlareIcon from '@mui/icons-material/Flare';

const Sidebar = () => {
const router =useRouter()
const SidebarKey = 'SIDEBARTOGGLEKEY'
const [showSidebar, setShowSidebar] =useState(false)
const context = useContext(SessionContext)
const {session, theme, setTheme} = context
const [navbarLinks, setnNavbarLinks] =useState([])



useEffect(()=>{
  const sidebar  = JSON.parse(localStorage.getItem(SidebarKey))
  setShowSidebar(Boolean(sidebar))
}, [])

useEffect(()=>{
  localStorage.setItem(SidebarKey, JSON.stringify(showSidebar))
}, [showSidebar])

const UserData = ()=>{    
  return ( 
    <React.Fragment>
    <List>
    {navbarLinks.map(data=>
        <Link href={data.link} key={data.link}>
        <ListItem >
          <ListItemBtnStyle className={router.pathname === data.link ? 'activeLink' : ''} theme={theme.themes[theme.active]}>
            <ListItemIcon sx={{minWidth:'30px'}}>
              <data.icon />
            </ListItemIcon>
            <ListItemText primary={data.title} className={showSidebar ? '' : 'hideText'} />
          </ListItemBtnStyle>
          </ListItem>
        </Link>
    )}
    </List>
    <div style={{width:'100%'}}>
    <Divider variant='middle' sx={{backgroundColor:theme.themes[theme.active].text}}/>
    <AntSwitch onClick={()=>setShowSidebar(!showSidebar)} checked={showSidebar} />
    <Divider variant='middle' sx={{backgroundColor:theme.themes[theme.active].text}}/>
    <ToggleBtnGrp
      showsidebar={showSidebar.toString()}
      theme={theme.themes[theme.active]}
      color="primary"
      value={theme.active}
      exclusive
      onChange={handleChange}
      aria-label="Platform">
      <ToggleButton value={0} className={theme.active===0 ? 'activeLink':''}><FlareIcon /></ToggleButton>
      <ToggleButton value={1} className={theme.active===1 ? 'activeLink':''}><ModeNightIcon /></ToggleButton>
      <ToggleButton value={2} className={theme.active===2 ? 'activeLink':''}><LightModeIcon /></ToggleButton>
    </ToggleBtnGrp>
    <Divider variant='middle' sx={{backgroundColor:theme.themes[theme.active].text}}/>
    </div>
    </React.Fragment>

    )
}

const handleChange = (event, newAlignment) => {
  if(newAlignment || newAlignment===0)
  {
    setTheme({...theme, active:newAlignment});
    localStorage.setItem(THEMEDATA, JSON.stringify(newAlignment))
  }
};


 useEffect(()=>{
  if(session[0] && session[0] && session[0].username)
  {     
     let newNavBarData = [...NavBarData]
    if(session[0].rights && session[0].rights.length)
    {
      for (let i in newNavBarData)
      {
        const userRight =  session[0].rights[0].rows.find(page=>page.options.toLowerCase()===newNavBarData[i].title.toLowerCase())
        if(userRight && !userRight.access)
          delete newNavBarData[i]
      }
      setnNavbarLinks(newNavBarData)
    }
  }
},[session[0]])

  return (
   <BoxMainStyle className={showSidebar ? 'showText' : 'hideText'} theme={theme.themes[theme.active]} elevation={12}> 
    {UserData() }
    </BoxMainStyle>
  )
}

export default Sidebar