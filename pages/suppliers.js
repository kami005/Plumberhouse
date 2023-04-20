import React, {useContext, useEffect, useRef, useState} from 'react'
import { StyledBoxMain, TabBoxStyle } from '../styles/SupplierStyle'
import { Tab} from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import SupplierSearch from '../src/Components/SupplierSearch'
import SupplierLoan from '../src/Components/SupplierLoan'
import SupplierLedger from '../src/Components/SupplierLedger'
import SupplierRec from '../src/Components/SupplierRec'
import Header from '../src/Components/HeaderText'
import { SessionContext } from '../src/Context/SessionContext'
import { useRouter } from 'next/router'

const suppliers = () => {
  const context = useContext(SessionContext)
  const {session, theme} = context
  const editRef = useRef()
  const loanRef = useRef()
  const ledgerRef = useRef()
  const [tabIndex, setIndex]=useState('2')
  const route = useRouter()
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

  const EditSupplier= async(supplier)=>{
    await setIndex('1')

  editRef.current.childFunction1(supplier)
  }

  return (
    <StyledBoxMain flex={10}>
    <Header name='SUPPLIERS' />
    <TabContext value={tabIndex}>
    <TabBoxStyle theme={theme.themes[theme.active]}>
        <TabList onChange={handleChange} aria-label="basic tabs example" 
        variant="scrollable"
        scrollButtons="auto">
          <Tab label="Manage Suppliers" value="1" />
          <Tab label="Search Suppliers" value="2"  />
          <Tab label="Pay Supplier" value="3"  />
          <Tab label="Supplier Ledger" value="4"  />
        </TabList>
      </TabBoxStyle>

      <TabPanel value="1" >
      <SupplierRec  ref ={editRef}/>
      </TabPanel>
      <TabPanel value="2" >
      <SupplierSearch EditSupplier={EditSupplier} EditLoan={EditLoan} GotoLedger={GotoLedger}/>
      </TabPanel>
      <TabPanel value="3" >
      <SupplierLoan ref={loanRef} GotoLedger={GotoLedger} />
      </TabPanel>
      <TabPanel value="4" >
      <SupplierLedger ref={ledgerRef} EditLoan={EditLoan}/>
      </TabPanel>
    </TabContext>
    
    
    </StyledBoxMain>
  )
}

export default suppliers