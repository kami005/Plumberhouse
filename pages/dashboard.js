
import React, {useContext, useEffect, useReducer, useState} from 'react'
import {StyledBoxMain, CardGraphStyle, FormFilterStyle, ButtonStyle, CardContentStyle, DatesDivStyle } from '../styles/DashboardStyle'
import { Grid,  CardContent, CardHeader, Divider,Box, TextField, CircularProgress, Typography} from '@mui/material'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { dashboardReducer } from '../src/CustomHooks/RandHooks';
import { getGraphs, GetSales } from '../src/BackendConnect/SaleStorage';
import { getPurchasesGraph } from '../src/BackendConnect/PurchaseStorage';
import Graphs from '../src/Components/Graphs';
import addDays from 'date-fns/addDays';
import Header from '../src/Components/HeaderText'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { SessionContext } from '../src/Context/SessionContext';
import EqualizerIcon from '@mui/icons-material/Equalizer';

 const Dashboard = () => {
  const [dates, setDates] = useState([null, null])
  const [dashboard, dispatchDashboard] = useReducer(dashboardReducer, {Barchart:null, LineChart:null, PieChart:null, 
  PurchaseCart:null, DoughnutChart:null, todaySale:null, monthSale:null, monthProfit:null, todayTarget:null, monthTarget:null,  monthTargetProfit:null })
  const [isGenerating, setGenerate] = useState(true)
  const context = useContext(SessionContext)
  const {session, theme} = context
 
  const setLocalStorage =()=>{
    localStorage.setItem('GRAPHS', JSON.stringify(dashboard))
  }

  const getLocalStorage =()=>{
    const data = JSON.parse(localStorage.getItem('GRAPHS'))
    if(data)
      dispatchDashboard({type:'STORAGE', data})
  }


  const GetSalesData =async(dates)=>{
    try
    {
      const res = await GetSales({myToken:session[0].token, myId:session[0]._id, }, dates)

      if(res)
      dispatchDashboard({type:'SALES', data:res})

      setGenerate(false)
    }catch(er)
    {
      console.log(er)
    }

   }

  const generate =async(e)=>{
    try
    {
      e.preventDefault()
      if(!isGenerating)
      {
        setGenerate(true)
        if(dates[0] !== null)
        await GetSalesData(dates[0])
        else
          await GetSalesData(new Date())

        let filterDates =[null, null]
        if(dates[0] && dates[1])
          {
            filterDates[0]= new Date(dates[0])
            filterDates[1]= new Date(dates[1])
          }

        
          
        const res = await getGraphs({...filterDates, myToken:session[0].token, myId:session[0]._id})
          if(res && res.graphChart)
            dispatchDashboard({type:'SALEVPROFIT', data:res.graphChart})
          if(res && res.lineChart)
            dispatchDashboard({type:'MONTHLYSALES', data:res.lineChart})
          if(res && res.doughnutChart)
            dispatchDashboard({type:'ITEMMOSTSELL', data:res.doughnutChart})
          if(res && res.pieChart)
            dispatchDashboard({type:'ITEMRETURN', data:res.pieChart})

        const purchaseRes = await getPurchasesGraph({...filterDates, myToken:session[0].token, myId:session[0]._id})
          if(purchaseRes && purchaseRes.purchaseGraphchart)
            dispatchDashboard({type:'MONTHLYPURCHASE', data:purchaseRes.purchaseGraphchart})

           
        setGenerate(false)
      }
    }
    catch(err)
    {
      setGenerate(false)
    }
  }
 
const handleFirstDate =(date)=>{
  let state = [...dates]
  
  if((dates[1] && date <= dates[1]) || !dates[1])
  state[0] = date
  else
  state[0]=null
  setDates(state)
}
const handleSecondDate = (date)=>{
  let state = [...dates]

  if((dates[0] && date >= dates[0]) || !dates[0])
  state[1] = date
  else
    state[1]=null
    setDates(state)
}

const today = ()=>{
  let today = new Date(), month = new Date()
  today = `${today.toLocaleString('default', { day:'2-digit', month: 'short' })} ${today.getFullYear()} `  
  month = `${month.toLocaleString('default', { month: 'short' })} ${month.getFullYear()} `
  return [today, month]
}


const GetTarget =(type)=>{
  if(type==='TodaySale')
    {
      if(dashboard.todaySale && dashboard.todayTarget)
      {
        let difference = dashboard.todaySale.sale * 100/dashboard.todayTarget
        if(difference<10)
        difference = Math.round(difference)
        if(difference<10)
             difference=15
        else if(difference>100)
        difference=100
        let color = ["hsl(",difference-10,`,80%,${theme.themes[theme.active].dark})`].join("");
        return {difference, color}
      }
      else
      return {difference:0, color:'red'}
    }
    else if(type==='MonthProfit')
    {
      if(dashboard.monthProfit && dashboard.monthTargetProfit)
      {
        let difference = dashboard.monthProfit.profit * 100/dashboard.monthTargetProfit
        difference = Math.round(difference)
        if(difference<10)
        difference=15
        else if(difference>100)
        difference=100
        let color = ["hsl(",difference-10,`,80%,${theme.themes[theme.active].dark})`].join("");
        return {difference, color}
      }
      else
      return {difference:0, color:'red'}
    }
    else if(type==='MonthSale')
    {
      if(dashboard.monthSale && dashboard.monthTarget)
      {
        let difference = dashboard.monthSale.sale * 100/dashboard.monthTarget
        difference = Math.round(difference)
        if(difference<10)
        difference=15
        else if(difference>100)
        difference=100
        let color = ["hsl(",difference-10,`,80%,${theme.themes[theme.active].dark})`].join("");
        return {difference, color}
      }
      else
        return {difference:0, color:'red'}
    }
}

useEffect(()=>{
  if(session[0] && session[0].username)
  {
    setGenerate(true)
    getLocalStorage()
    GetSalesData(new Date())

  }
},[])

useEffect(()=>{
  setLocalStorage()
},[dashboard])
 

  return (
   <StyledBoxMain flex={10}>
   <Header name='DASHBOARD' />

    <Grid container  justifyContent="center" spacing={1}>
    <Grid item xl={5.9} lg={6} md={11.9} sm={11.9} xs={11.9}>
     <CardGraphStyle  theme={theme.themes[theme.active]} elevation={10} >
     <CardHeader title='Search Filters'/>
     <Divider />
     <CardContent >
 
       <FormFilterStyle  onSubmit={e=>generate(e)} theme={theme.themes[theme.active]}>
       <DatesDivStyle theme={theme.themes[theme.active]}>
       <LocalizationProvider dateAdapter={AdapterDateFns}>

       <DatePicker
         label="Date From"
         inputFormat="dd/MM/yyyy"
         value={dates[0]}
         maxDate={addDays(new Date(), 1)}
         onChange={date=>handleFirstDate(date)} 
         renderInput={(params) => <TextField size='small' {...params} />}
       />
       <DatePicker
         label="Date To"
         inputFormat="dd/MM/yyyy"
         value={dates[1]}
         maxDate={addDays(new Date(), 1)}
         onChange={date=>handleSecondDate(date)} 
         renderInput={(params) => <TextField size='small' {...params}/>}
       />
       </LocalizationProvider>
      </DatesDivStyle>
     <ButtonStyle theme={theme.themes[theme.active]} variant='contained' color='success' type='submit' endIcon={isGenerating? <CircularProgress size='2rem'/> : <EqualizerIcon />}>{isGenerating ? 'Generating..':'Generate'}</ButtonStyle>
     </FormFilterStyle>
  
     </CardContent>
     <Divider />
     <Box
         sx={{
         display: 'flex',
         justifyContent: 'flex-end',
         p: 2
         }}
     >
     </Box>
     </CardGraphStyle>
     </Grid>
 
      {/* Todays Sale */}
     <Grid item xl={2.95} lg={2.95} md={3.95} sm={5.95} xs={5.95}>
     <CardGraphStyle elevation={10} theme={theme.themes[theme.active]}>
     <CardHeader title="Day's Sales"/>
     <Divider />
 
     <CardContentStyle theme={theme.themes[theme.active]} >
      <Typography variant='h6'>Rs. {dashboard.todaySale && dashboard.todaySale.sale}
      <sub style={{display:'flex', alignItems:'flex-end'}}><Typography variant='caption'>{dashboard.todaySale && dashboard.todaySale.up && dashboard.todaySale.up}</Typography> 
      {dashboard.todaySale && dashboard.todaySale.up && parseFloat(dashboard.todaySale.up) >= 1 ? <ArrowDropUpIcon className='arrowUp'/> : <ArrowDropDownIcon className='arrowDown' /> }
      </sub>
      </Typography>
      <Typography variant='body2' >{today()[0]}</Typography>
     </CardContentStyle>
     </CardGraphStyle>
     </Grid>

   {/* Month's Sale */}
     <Grid item xl={2.95} lg={2.95} md={3.95} sm={5.95} xs={5.95}>
     <CardGraphStyle elevation={10} theme={theme.themes[theme.active]}>
     <CardHeader title="Month's Sales"/>
     <Divider />
     <CardContentStyle theme={theme.themes[theme.active]}>
     <Typography variant='h6'>Rs. {dashboard.monthSale && dashboard.monthSale.sale}
     <sub style={{display:'flex', alignItems:'flex-end'}}> 
     <Typography variant='caption'>{dashboard.monthSale && dashboard.monthSale.up && dashboard.monthSale.up}</Typography> 
     {dashboard.monthSale && dashboard.monthSale.up && parseFloat(dashboard.monthSale.up) >= 1 ? <ArrowDropUpIcon className='arrowUp'/> : <ArrowDropDownIcon className='arrowDown' /> }
     </sub>
     </Typography><Typography variant='body2' >{today()[1]}</Typography>
     </CardContentStyle>
     </CardGraphStyle>
     </Grid>

        {/* Month's Profit */}
      <Grid item xl={2.95} lg={2.95} md={3.95} sm={5.95} xs={5.95}>
     <CardGraphStyle elevation={10}  theme={theme.themes[theme.active]}>
     <CardHeader title="Month's Profit"/>
     <Divider />
     <CardContentStyle theme={theme.themes[theme.active]}>
     <Typography variant='h6'>Rs. {dashboard.monthProfit && dashboard.monthProfit.profit}
     <sub style={{display:'flex', alignItems:'flex-end'}}><Typography variant='caption'>{dashboard.monthProfit && dashboard.monthProfit.up && dashboard.monthProfit.up}</Typography> 
     {dashboard.monthProfit && dashboard.monthProfit.up && parseFloat(dashboard.monthProfit.up) >= 1 ? <ArrowDropUpIcon className='arrowUp'/> : <ArrowDropDownIcon className='arrowDown' />}
     </sub>
     </Typography><Typography variant='body2' >{today()[1]}</Typography>
     </CardContentStyle>
     </CardGraphStyle>
     </Grid>

       {/* Tody's Projected Sale */}
       <Grid item xl={2.95} lg={2.95} md={3.95} sm={5.95} xs={5.95}>
     <CardGraphStyle elevation={10} theme={theme.themes[theme.active]}>
     <CardHeader title="Today's Target"/>
     <Divider />
     <CardContentStyle sx={{display:'flex', justifyContent:'space-between'}} theme={theme.themes[theme.active]}>
      <Typography variant='h6'>Rs. {dashboard.todayTarget && dashboard.todayTarget}</Typography>
      <CircularProgress sx={{color:`${GetTarget('TodaySale').color} !important`}} variant="determinate" value={GetTarget('TodaySale').difference}/>
     </CardContentStyle>
     </CardGraphStyle>
     </Grid>

      {/* Month's Projected Sale */}
      <Grid item xl={2.95} lg={2.95} md={3.95} sm={5.95} xs={5.95}>
     <CardGraphStyle elevation={10}  theme={theme.themes[theme.active]}>
     <CardHeader title="Month's Target"/>
     <Divider />
     <CardContentStyle theme={theme.themes[theme.active]} sx={{display:'flex', justifyContent:'space-between'}} ><Typography variant='h6'>Rs. {dashboard.monthTarget && dashboard.monthTarget}</Typography>
     <CircularProgress sx={{color:`${GetTarget('MonthSale').color} !important`}} variant="determinate" value={GetTarget('MonthSale').difference}  color='success'/>
     </CardContentStyle>
     </CardGraphStyle>
     </Grid>

      {/* Months's Projected Profit */}
      <Grid item xl={2.95} lg={2.95} md={3.95} sm={5.95} xs={5.95}>
     <CardGraphStyle elevation={10} theme={theme.themes[theme.active]}>
     <CardHeader title="Target Profit"/>
     <Divider />
     <CardContentStyle theme={theme.themes[theme.active]} sx={{display:'flex', justifyContent:'space-between'}}><Typography variant='h6'>Rs. {dashboard.monthTargetProfit && dashboard.monthTargetProfit}</Typography>
     <CircularProgress sx={{color:`${GetTarget('MonthProfit').color} !important`}} variant="determinate" value={GetTarget('MonthProfit').difference}  color='success'/>
     </CardContentStyle>
     </CardGraphStyle>
     </Grid>


 
     <Grid item xl={11.8} lg={11.8} md={11.8} sm={11.8} xs={11.8} >
      <Graphs graph={dashboard.Barchart} graphType='Line' title='Sale vs Profit'/>
        </Grid>
       <Grid item xl={5.9} lg={5.9} md={5.9} sm={11.8} xs={11.8} >
         <Graphs graph={dashboard.LineChart} graphType='Bar' title='Past Sales'/>
         </Grid>
         <Grid item xl={5.9} lg={5.9} md={5.9} sm={11.8} xs={11.8} >
         <Graphs graph={dashboard.PurchaseCart} graphType='Bar' title='Past Purchases'/>
         </Grid>
       <Grid item xl={5.9} lg={5.9} md ={5.9} sm={5.9} xs={11.8}>
         <Graphs graph={dashboard.DoughnutChart} graphType='Doughnut' title ='Trending Items' />
       </Grid>
       <Grid item xl={5.9} lg={5.9} md ={5.9} sm={5.9} xs={11.8}>
         <Graphs graph={dashboard.PieChart} graphType='Doughnut' title ='Return Items'/>
       </Grid>
   </Grid>
  
   </StyledBoxMain>
  )

}


export default Dashboard