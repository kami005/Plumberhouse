import React, {useContext, useEffect, useRef, useState} from 'react'
import { StyledBoxMain, TabBoxStyle } from '../styles/CustomersStyle'
import { Tab} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import CustomerRec from '../src/Components/CustomerRec'
import CustomerSearch from '../src/Components/CustomerSearch'
import CustomerLoan from '../src/Components/CustomerLoan'
import CustomerLedger from '../src/Components/CustomerLedger'
import Header from '../src/Components/HeaderText'
import { SessionContext } from '../src/Context/SessionContext';
import { useRouter } from 'next/router'

const customers = () => {
    const route = useRouter()
    const childref = useRef()
    const loanRef = useRef()
    const ledgerRef = useRef()
    const context = useContext(SessionContext)
    const {session, theme} = context
  const [tabIndex, setIndex]=useState('2')

  const handleChange =(e, newVal)=>{
    setIndex(newVal)
  }
  const EditLoan =async(supplier)=>{
    await setIndex('3')
    loanRef.current.childFunction1(supplier)
  }
  const GotoLedger =async(supplier)=>{
    await setIndex('4')
    ledgerRef.current.childFunction1(supplier)
  }
  const EditCustomer= async(item)=>{
    await setIndex('1')

  childref.current.childFunction1(item)
  }


  return (
    <StyledBoxMain flex={10} >
    <Header name='CUSTOMERS' />
    <TabContext value={tabIndex}>
    <TabBoxStyle theme={theme.themes[theme.active]}>
        <TabList onChange={handleChange} aria-label="basic tabs example"variant="scrollable"
        scrollButtons="auto" >
          <Tab label="Manage Customer" value="1" />
          <Tab label="Search Customers" value="2"  />
          <Tab label="Customer Loan" value="3"  />
          <Tab label="Customer Ledger" value="4"  />
        </TabList>
      </TabBoxStyle>

      <TabPanel value="1" >
      <CustomerRec  ref ={childref}/>
      </TabPanel>
      <TabPanel value="2" >
      <CustomerSearch EditCustomer={EditCustomer} EditLoan={EditLoan} GotoLedger={GotoLedger} />
      </TabPanel>
      <TabPanel value="3" >
      <CustomerLoan ref = {loanRef} GotoLedger={GotoLedger}/>
      </TabPanel>
      <TabPanel value="4" >
      <CustomerLedger ref = {ledgerRef} EditLoan={EditLoan}/>
      </TabPanel>
    </TabContext>
    
    
    </StyledBoxMain>
  )
}

export default customers