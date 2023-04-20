import { Tab} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import React, {useContext, useState} from 'react'
import SaleReport from '../src/Components/SaleReport'
import { MainBoxStyle, TabBoxStyle } from '../styles/ReportManageStyle'
import PurchaseReport from '../src/Components/PurchaseReport'
import Header from '../src/Components/HeaderText'
import IncomeExpense  from '../src/Components/IncomeExpense'
import OtherReports from '../src/Components/OtherReports'
import { SessionContext } from '../src/Context/SessionContext'
import { useRouter } from 'next/router'
import OtherIncomeExpense from '../src/Components/OtherIncomeExpense'

const Reports = () => {
  const route = useRouter()
  const [tabIndex, setIndex]=useState('3')
  const context = useContext(SessionContext)
  const {session, theme} = context
  const handleChange =(e, newVal)=>{
    setIndex(newVal)
  }


  return (
    <MainBoxStyle>
    <Header name='REPORTS' />
    <TabContext value={tabIndex}>
    <TabBoxStyle theme={theme.themes[theme.active]}>
        <TabList onChange={handleChange} 
        aria-label="basic tabs example"
        variant="scrollable"
        scrollButtons="auto">
          <Tab label="Manage Sales" value="1"/>
          <Tab label="Manage Purchases" value="2" />
          <Tab label="Income Expense" value="3" />
          <Tab label="Load Payments" value="4" />
          <Tab label="Other Reports" value="5" />
        </TabList>
      </TabBoxStyle>

      <TabPanel value="1" >
      <SaleReport />
      </TabPanel>
      <TabPanel value="2" >
       <PurchaseReport />
      </TabPanel>
      <TabPanel value='3'>
        <IncomeExpense />
      </TabPanel>
      <TabPanel value='4'>
      <OtherIncomeExpense />
    </TabPanel>
    <TabPanel value='5'>
    <OtherReports />
     </TabPanel>
    </TabContext> 

    </MainBoxStyle>
  )
}

export default Reports