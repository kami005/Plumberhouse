import {Tab} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, {useContext, useState, useEffect} from 'react'
import { MainBoxStyle, TabBoxStyle } from '../../styles/ReportManageStyle'
import Header from '../../src/Components/HeaderText'
import { SessionContext } from '../../src/Context/SessionContext'
import { useRouter } from 'next/router'
import ChangePassword from '../../src/Components/ChangePassword'
import EditMyAccount from '../../src/Components/EditMyAccount'

const MyAccount = (props) => {

  const route = useRouter()
  const [tabIndex, setIndex]=useState('2')
  const context = useContext(SessionContext)
  const {session, theme} = context
  const handleChange =(e, newVal)=>{
    setIndex(newVal)
  }

  useEffect(()=>{
    if(!session || !session[0] || !session[0].username)
    {
      route.push({
        pathname:'/signin'
        })
    }
    else if(route.query!==session[0].username)
    {
      route.replace(`/${session[0].username}/myaccount`)
    }

  }, [session[0]])


  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
    <Header name={tabIndex ==='1' ? 'CHANGE PASSWORD' : 'MANAGE MY ACCOUNT'} />
    <TabContext value={tabIndex}>
    <TabBoxStyle theme={theme.themes[theme.active]}>
        <TabList onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Change Password" value="1"/>
          <Tab label="MY ACCOUNT" value="2" />
        </TabList>
      </TabBoxStyle>

      <TabPanel value="1" >
      <ChangePassword />
      </TabPanel>
      <TabPanel value="2" >
       <EditMyAccount />
      </TabPanel>
    </TabContext>

    </MainBoxStyle>
  )
}

export default MyAccount