import { Tab} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, {useContext, useState, useRef, useEffect} from 'react'
import { MainBoxStyle, TabBoxStyle } from '../styles/ReportManageStyle'
import Header from '../src/Components/HeaderText'
import { SessionContext } from '../src/Context/SessionContext'
import CreateUser from '../src/Components/UserManage'
import UserSearch from '../src/Components/UserSearch'

const UserManagement = () => {
  const [tabIndex, setIndex]=useState('1')
  const context = useContext(SessionContext)
  const {session, theme} = context
  const [editing, setEditing] = useState()
  const editRef = useRef()
  
  const handleChange =(e, newVal)=>{
    setEditing(null)
    setIndex(newVal)
  }
  const EditUser =async(user)=>{
    try
    {
      setIndex('2')
      setEditing({...user, type:'EDIT'})
    }catch(er)
    {
      console.log(er)
    }

  }


  const GotoSessions =async(user)=>{
    setIndex('2')
    setEditing({...user, type:'SESSION'})
  }

  useEffect(() => {
    if(editing && tabIndex==="2")
    {
      if(editing.type==='EDIT')
      editRef.current.childFunction1(editing)
      else
      editRef.current.childFunction2(editing)
    }
    return () => {
    };
  }, [tabIndex]);
  
  return (
    <MainBoxStyle>
    <Header name={tabIndex ==='1' ? 'SEARCH USERS' : 'MANGE USER'} />

    <TabContext value={tabIndex}>
    <TabBoxStyle theme={theme.themes[theme.active]}>
        <TabList onChange={handleChange} aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons="auto">
         <Tab label="Search User" value="1" />
          <Tab label="Manage User" value="2"/>
         
          
        </TabList>
      </TabBoxStyle>
      <TabPanel value='1'>
      <UserSearch EditUser={EditUser} GotoSessions={GotoSessions}/>
    </TabPanel>
      <TabPanel value="2" >
      <CreateUser setIndex={setIndex} ref ={editRef}/>
      </TabPanel>
    

    </TabContext>

    </MainBoxStyle>
  )
}

export default UserManagement