import { ChevronRight, Flare, LightMode, ModeNight } from '@mui/icons-material'
import React, { useState, useEffect, useContext} from 'react'
import { MainBoxStyle, DrawerStyle, DrawerBoxHeaderStyle, IconBtnStyle, DrawerBoxBodyStyle, ListStyle, ListItemBtnStyle, StyledTypographyUsername} from '../../styles/drawerStyle'
import { NavBarData, THEMEDATA} from '../DataSource/RandData';
import { Divider, ListItem, ListItemIcon,ListItemText, ToggleButton } from '@mui/material'
import Link from "next/link";
import { useRouter } from 'next/router'
import {SessionContext} from '../Context/SessionContext';
import { ToggleBtnGrp } from '../../styles/SidebarStyle';

const Drawer = (props) => {
const router = useRouter()
const {drawerOpen, toggleDrawer} = props
const context = useContext(SessionContext)
const {session, theme, setTheme} = context
const [navbarLinks, setnNavbarLinks] =useState([])

const UserData = ()=>{
  return ( <React.Fragment>
            <ListStyle>
            {navbarLinks.map(data=>
              <Link href={data.link} state={{from:'allUsers'}} key={data.link} >
              <ListItem onClick={toggleDrawer}>
                <ListItemBtnStyle className={router.pathname === data.link ? 'activeLink' : ''} theme={theme.themes[theme.active]}>
                  <ListItemIcon sx={{minWidth:'30px'}}>
                    <data.icon />
                  </ListItemIcon>
                  <ListItemText primary={data.title}/>
                </ListItemBtnStyle>
              </ListItem>
            </Link>
          )}
            </ListStyle>
            <Divider variant='middle' sx={{backgroundColor:theme.themes[theme.active].text}}/>
            <ToggleBtnGrp
              sx={{display:'flex', justifyContent:'center'}}
              showsidebar={'true'}
              theme={theme.themes[theme.active]}
              color="primary"
              value={theme.active}
              exclusive
              onChange={handleChange}
              aria-label="Platform">
            <ToggleButton value={0} className={theme.active===0 ? 'activeLink':''}><Flare /></ToggleButton>
              <ToggleButton value={1} className={theme.active===1 ? 'activeLink':''}><ModeNight /></ToggleButton>
              <ToggleButton value={2} className={theme.active===2 ? 'activeLink':''}><LightMode /></ToggleButton>
            
            </ToggleBtnGrp>
            <Divider variant='middle' sx={{backgroundColor:theme.themes[theme.active].text}}/>
          <StyledTypographyUsername theme={theme.themes[theme.active]} variant='h6'>Logged As: {session[0] && session[0].username}</StyledTypographyUsername>
          <Divider variant='middle' sx={{backgroundColor:theme.themes[theme.active].text}}/>
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

const AuthenticateBySession = () =>{
try
{
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
 } 
catch(err)
{
console.log(err)
}
}

 useEffect(()=>{
    AuthenticateBySession()
},[session[0]])
  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
      <DrawerStyle
        anchor='right'
        open={drawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        PaperProps={{
          sx:{
            backgroundColor:theme.themes[theme.active].sidebar,
            opacity:'0.85'
          }
        }}>
        <DrawerBoxHeaderStyle>
          <IconBtnStyle onClick={toggleDrawer} theme={theme.themes[theme.active]}>
            <ChevronRight />
          </IconBtnStyle>
        </DrawerBoxHeaderStyle>

        <DrawerBoxBodyStyle>
          {UserData()}
        </DrawerBoxBodyStyle>
        </DrawerStyle>

    </MainBoxStyle>
  )
}



export default Drawer
