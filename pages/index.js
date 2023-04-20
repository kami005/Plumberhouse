import { Divider, Grid, CardHeader, Typography, CircularProgress } from '@mui/material'
import React, {useEffect, useReducer, useContext} from 'react'
import {StyledBoxMain, CardGraphStyle, CardContentStyle, IconBtnStyle} from '../styles/IndexStyle'
import Header from '../src/Components/HeaderText'
import { FindSalesData } from '../src/BackendConnect/SaleStorage'
import { dashboardReducer, useToggle } from '../src/CustomHooks/RandHooks'
import { FindPurchaseData } from '../src/BackendConnect/PurchaseStorage'
import HomeSales from '../src/Components/HomeSales'
import HomePurchases from '../src/Components/HomePurchases'
import SuspendedSales from '../src/Components/SuspendedSales'
import { FindPendingIncomes } from '../src/BackendConnect/IncomeStorage'
import { FindPendingExpense } from '../src/BackendConnect/ExpenseStorage'
import {SessionContext} from '../src/Context/SessionContext'
import { useRouter } from 'next/router'
import { GetStockWorth } from '../src/BackendConnect/ItemStorage'
import { Refresh } from '@mui/icons-material'
 import { homeKey } from '../src/DataSource/RandData'

const Index = () => {

  const route = useRouter()
  const [homeData, dispatchHomeData] = useReducer(dashboardReducer, {recentSales:null, receiveableAmount:0, payableAmount:0, recentPurchases:null, stockPurchase:0, stockSale:0})
  const context = useContext(SessionContext)
  const {session, theme} = context
  const [stockLoading, toggleStockLoading] = useToggle(false)

  const GetFromStorage =()=>{
    const data = JSON.parse(localStorage.getItem(homeKey))
    if(data)
       dispatchHomeData({type:'STORAGE', data:data})
  }

  const SetInStorage =async()=>{
   localStorage.setItem(homeKey, JSON.stringify(homeData) )
  }

  const FindSales =async()=>{

      const saleRes = await FindSalesData({myToken:session[0].token, myId:session[0]._id})

      if(saleRes )
      {
        if(saleRes.recentSales)
        {
          let recentSales = saleRes.recentSales
          for (let i =0; i<recentSales.length;i++)
          {
              recentSales[i].id = recentSales[i]._id
              recentSales[i].customerInfo =  recentSales[i].customerInfo.name
              recentSales[i].discount = recentSales[i].subTotal-recentSales[i].gTotal
              recentSales[i].createdAt = new Date(recentSales[i].createdAt)
              recentSales[i].updatedAt = new Date(recentSales[i].updatedAt)
          }
  
          dispatchHomeData({type:'SALES', data:{recentSales:recentSales}})
        }
        if (saleRes.receiveableAmount !== undefined)
        {
          dispatchHomeData({type:'SALES', data:{receiveableAmount:saleRes.receiveableAmount}})
        }
      }
      const receivableRes = await FindPendingIncomes({myToken:session[0].token, myId:session[0]._id})

      if(receivableRes && receivableRes.receiveableAmount !== undefined) 
        {
            dispatchHomeData({type:'ADDPENDING', data:{receiveableAmount:receivableRes.receiveableAmount}})
        }
  }

  const FindPurchases =async()=>{

    const purchaseRes = await FindPurchaseData({myToken:session[0].token, myId:session[0]._id})
    if(purchaseRes)
    {
      if(purchaseRes.recentPurchases)
      {
        let recentPurchases = purchaseRes.recentPurchases
        for (let i =0; i<recentPurchases.length;i++)
        {
          recentPurchases[i].id = recentPurchases[i]._id
          recentPurchases[i].supplierInfo =  recentPurchases[i].supplierInfo.name
          recentPurchases[i].createdAt = new Date(recentPurchases[i].createdAt)
          recentPurchases[i].updatedAt = new Date(recentPurchases[i].updatedAt)
        }
  
        dispatchHomeData({type:'SALES', data:{recentPurchases:recentPurchases}})
      }
      if (purchaseRes.payableAmount!==undefined)
      {
        dispatchHomeData({type:'SALES', data:{payableAmount:purchaseRes.payableAmount}})
      }
    }

    const payableRes = await FindPendingExpense({myToken:session[0].token, myId:session[0]._id})

    if(payableRes && payableRes.payableAmount !==undefined) 
      {
          dispatchHomeData({type:'ADDPENDING', data:{payableAmount:payableRes.payableAmount}})
      }

  }

  const FindStockWorth =async()=>{
    toggleStockLoading()
    const stockRes = await GetStockWorth({myToken:session[0].token, myId:session[0]._id})
    if(stockRes && stockRes.length)
    {
      dispatchHomeData({type:'SALES', data:{stockPurchase:stockRes[0].stockPurchase, stockSale:stockRes[0].stockSale}})
    }
    toggleStockLoading()
  }

  const GetNetAmount = ()=>{
    let netPayment = homeData.receiveableAmount-homeData.payableAmount
    
    if(netPayment>=0)
    return {amount:netPayment, title:'Net Receiveable'}
    else
    return {amount:netPayment*-1 , title:'Net Payable'}

  }


  useEffect(()=>{
    GetFromStorage()
   // FindSales()
   // FindPurchases()
    //FindStockWorth()
  
  },[])
  
  useEffect(()=>{
    SetInStorage()
  },[homeData])

  return (
    <StyledBoxMain flex={10}>
    <Header name='HOME'/>
    <Grid container  justifyContent="flex-start" spacing={1}>

    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} >
    <HomeSales recentSales={homeData.recentSales} FindSales={FindSales} />
    </Grid>
    
    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} >
    <HomePurchases recentPurchases={homeData.recentPurchases} FindPurchases={FindPurchases} />
    </Grid>

    <Grid item xl={12} lg={12} md={12} sm={12} xs={12}>
    <SuspendedSales/>
    </Grid>


    <Grid item xl={4} lg={4} md={4} sm={12} xs={12} >
    <CardGraphStyle  elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title={GetNetAmount().title} /> 
    <Divider />
    <CardContentStyle  theme={theme.themes[theme.active]}>
    <Typography variant='h6'>Rs. {GetNetAmount().amount} </Typography>
    </CardContentStyle>
    </CardGraphStyle>
    </Grid>

    <Grid item  xl={4} lg={4} md={4} sm={12} xs={12} >
    <CardGraphStyle  elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title='Receiveables' 
       
    /> 
    <Divider />
    <CardContentStyle  theme={theme.themes[theme.active]}>
    <Typography variant='h6'>Rs. {homeData.receiveableAmount} </Typography>
    </CardContentStyle>
    </CardGraphStyle>
    </Grid>
    
    <Grid item   xl={4} lg={4} md={4} sm={12} xs={12} >
    <CardGraphStyle  elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title='Payables' />
    <Divider />
    <CardContentStyle  elevation={10} theme={theme.themes[theme.active]}>
    <Typography variant='h6'>Rs. {homeData.payableAmount} </Typography>
    </CardContentStyle>
    </CardGraphStyle>
    </Grid>
    
    <Grid item  xl={6} lg={6} md={6} sm={12} xs={12} >
    <CardGraphStyle  elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title='Stock Purchase Worth' 
       action={stockLoading ? <CircularProgress />:
          <IconBtnStyle aria-label="settings" onClick={FindStockWorth} theme={theme.themes[theme.active]}>
            <Refresh  color=''/>
          </IconBtnStyle>}
    />
    <Divider />
    <CardContentStyle theme={theme.themes[theme.active]}>
    <Typography variant='h6'>Rs. {homeData.stockPurchase} </Typography>
    </CardContentStyle>
    </CardGraphStyle>
    </Grid>
    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} >
    <CardGraphStyle  elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title='Stock Sale Worth'
       action={stockLoading ? <CircularProgress />:
          <IconBtnStyle aria-label="settings" onClick={FindStockWorth}  theme={theme.themes[theme.active]}>
            <Refresh  color=''/>
          </IconBtnStyle>}
    />
    <Divider />
    <CardContentStyle theme={theme.themes[theme.active]}>
    <Typography variant='h6'>Rs. {homeData.stockSale} </Typography>
    </CardContentStyle>
    </CardGraphStyle>
    </Grid>
    </Grid>

    </StyledBoxMain>
  )
}


export default Index