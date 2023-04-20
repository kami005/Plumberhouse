import { Tab} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, {useContext, useEffect, useRef, useState} from 'react'
import ItemRec from '../src/Components/ItemRec'
import ItemSearch from '../src/Components/ItemSearch'
import { MainBoxStyle, TabBoxStyle } from '../styles/ItemManageStyle'
import Header from '../src/Components/HeaderText'
import { SessionContext } from '../src/Context/SessionContext'
import { useRouter } from 'next/router'

const ItemManage = () => {
  const route = useRouter()
  const childref = useRef()
  const context = useContext(SessionContext)
  const {session, theme} = context
  const [tabIndex, setIndex]=useState('2')

  const handleChange =(e, newVal)=>{
    setIndex(newVal)
  }

  const EditItem= async(item)=>{
    await setIndex('1')

  childref.current.childFunction1(item)
  }

  return (
    <MainBoxStyle>
    <Header name='STOCK / ITEMS' />
    <TabContext value={tabIndex} >
    <TabBoxStyle theme={theme.themes[theme.active]}>
        <TabList onChange={handleChange} aria-label="basic tabs example"
         variant="scrollable"
        scrollButtons="auto">
          <Tab label="Manage Item" value="1" />
          <Tab label="Search Item" value="2"  />
        </TabList>
      </TabBoxStyle>

      <TabPanel value="1" >
      <ItemRec  ref ={childref} />
      </TabPanel>
      <TabPanel value="2" >
        <ItemSearch EditItem={EditItem}/>
      </TabPanel>
    </TabContext>

    </MainBoxStyle>
  )
}

export default ItemManage