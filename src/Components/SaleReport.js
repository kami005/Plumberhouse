import React, {useContext, useEffect, useReducer, useState} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DateTextFieldStyle, DataGridBoxStyle, DataGridStyle, SearchFirstBoxStyle, SearchBoxField, FooterBoxStyle } from '../../styles/SaleReportStyle.js'
import { alertReducer, loadingReducer, useTextboxVal, useToggle } from '../CustomHooks/RandHooks';
import { findSales, findDeletedSales , toggleDeleteSale, DeletePermanent} from '../BackendConnect/SaleStorage';
import { Alert, Button, CircularProgress, IconButton, Menu, MenuItem, Snackbar, Typography } from '@mui/material';
import { MoreHoriz, MoreTime, Search } from '@mui/icons-material';
import { useRouter} from 'next/router';
import addDays from 'date-fns/addDays';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { SALEREPORTKEY } from '../DataSource/RandData.jsx';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter , GridToolbarColumnsButton} from '@mui/x-data-grid';
import { AddIncome } from '../BackendConnect/IncomeStorage.jsx';
import { SessionContext } from '../Context/SessionContext.js';
import DetailModal from './DetailModal.js';
import { UpdateItem } from '../BackendConnect/ItemStorage.jsx';
import {GetAccess} from '../Utils/Rand'
const SaleReport =  () => {
const navigate = useRouter()
const [sales, setSales] = useState({data:[], showAll:false})
const [searchBy, setSearchBy] = useState('paymentStatus')
const [searchField, handleChange] = useTextboxVal('')
const [curItem, setCurItem]= useState()
const [anchorEl, setAnchorEl]= useState()
const [openModal, toggleModal] = useToggle()
const [dates, setDates] = useState([null, null])
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const context = useContext(SessionContext)
const {session, theme} = context
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const SetInStrogate = ()=>{
  localStorage.setItem(SALEREPORTKEY, JSON.stringify(sales))
}
const GetFromStorage = ()=>{
 const data = JSON.parse(localStorage.getItem(SALEREPORTKEY))
 let rowData =[]
 if(Array.isArray(data))
 {
  data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 else if(data && data.data.length)
 {
 
  data.data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 if(rowData.length)
 setSales({data:rowData, showAll:data.showAll})
}


function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{display:'flex', gap:0.5,  marginBottom:'0.2rem'}}  >
      <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
      <GridToolbarColumnsButton variant='contained'/>
      <GridToolbarExport variant='contained'/>
      <Button disabled={!sales.data.length || searchField!=='' || !sales.showAll}  variant='contained' startIcon={<MoreTime sx={{color:'white', }}/>} 
       onClick={LoadMore}>
       More
      </Button>
    </GridToolbarContainer>
  );
}

const LoadMore= async()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    return
  }

  if(!isLoading.Search)
  {
    let rowData =[]
    dispatchLoading({type:'SEARCHSTART'})

    let skip=0
      if(sales.data.length)
        skip=sales.data.length

      let filter ={[searchBy]:searchField, skip}
      if(dates[0] && dates[1])
      {
          filter = {...filter, dates}
      }

       const resp = await findSales({...filter, myToken:session[0].token, myId:session[0]._id})
      
       if(sales.data.length)
       rowData=[...sales.data]

      if (resp)
      { 
          await resp.map(sale=>rowData.push({...sale, id:sale._id, customerInfo:sale.customerInfo.name, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt)}))
      }
    
    setSales({data:rowData, showAll:true})
  }
 
    dispatchLoading({type:'SEARCHEND'})
}

const getSales =async (e)=>{
  if(e)
    e.preventDefault()
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    return
  }
    if(!isLoading.Search)
    {
      let rowData =[]
      dispatchLoading({type:'SEARCHSTART'})
      if(searchBy ==='isDeleted')
      {
        const resp = await findDeletedSales({myToken:session[0].token, myId:session[0]._id})
        if (resp)
        {
            await resp.map(sale=>rowData.push({...sale, id:sale._id, customerInfo:sale.customerInfo.name, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt)}))
        }
      }
      else
      {
       
        let filter ={[searchBy]:searchField}
        if(dates[0] && dates[1])
        {
            filter = {...filter, dates}
           
        }
         const resp = await findSales({...filter, myToken:session[0].token, myId:session[0]._id})
       
        if (resp)
        {
            await resp.map(sale=>rowData.push({...sale, id:sale._id, customerInfo:sale.customerInfo.name, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt)}))
        }
      
      }
      setSales({data:rowData, showAll: (searchField === '' && dates[0]===null && dates[1] ===null && searchBy!=='isDeleted') ? true:false})
    }
   
      dispatchLoading({type:'SEARCHEND'})
}   

const handleMoreClick=(e, item)=>{
  setCurItem(item)
  setAnchorEl(e.currentTarget);
}



const handleToggleDelete= async (e)=>{

dispatchLoading({type:'DELETESTART'})
const res = await toggleDeleteSale(curItem.id, curItem.isDeleted ? false:true, {myToken:session[0].token, myId:session[0]._id})
if(res && res.message && res.message ==='SUCCESS')
{

  let rowData=[]
  if (searchBy ==='isDeleted')
  {
    
    const resp = await findDeletedSales({myToken:session[0].token, myId:session[0]._id})
       
    if (resp)
    {
        await resp.map(sale=>rowData.push({...sale, id:sale._id, customerInfo:sale.customerInfo.name, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt)}))
    }
   
  }
  else{
    let filter ={[searchBy]:searchField}
    if(dates[1] && dates[0])
    {
        filter = {...filter, dates}
       
    }
     const resp = await findSales({...filter, myToken:session[0].token, myId:session[0]._id})
   
    if (resp)
    {
        await resp.map(sale=>rowData.push({...sale, id:sale._id, customerInfo:sale.customerInfo.name, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt)}))
    }
  }
  setSales({data:rowData, showAll: (searchField === '' && dates[0]===null && dates[1] ===null && searchBy!=='isDeleted') ? true:false})
}
handleCloseAnchor()
dispatchLoading({type:'DELETEEND'})
}

const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const handleEditItem=()=>{  
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    return
  }
  navigate.push({
    pathname:'/saleclassic', 
    query:{editing:true, saleID:curItem.saleID}})
  
}
const handlesearchByChange=(e)=>{
  setSearchBy(e.target.value)
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
const handlePrint =()=>{
  let url
  if(curItem.saleStatus ==='RETURN')
     url=`/prints/printsalereturn?saleID=${curItem.saleID}`
  else
    url=`/prints/printsale?saleID=${curItem.saleID}`

    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');

  handleCloseAnchor()
}
const GetTotal =()=>{
  let   totalCount=0, receivedCount=0, remainingCount=0
if(sales)
  for(let i=0;i<sales.data.length;i++)
  {
    totalCount+=sales.data[i].gTotal
    receivedCount += sales.data[i].amountReceived
  }

  remainingCount= totalCount-receivedCount

  return `Total: ${totalCount} Remaining: ${remainingCount}`
}

const OpenSaleDetail=()=>{
handleCloseAnchor()
toggleModal()
}

const DeleteForever =async()=>{
  try{
  dispatchLoading({type:'DELETESTART'})
 const res = await DeletePermanent(curItem._id, {myToken:session[0].token, myId:session[0]._id})
 let itemsRec= []
 if(res && res.data)
 {
  const orders= res.data.orders
  for (let i=0;i<orders.length;i++)
  {
    let qty=parseInt(orders[i].qty)
    if(curItem.saleStatus==='RETURN' || curItem.saleStatus==='SALERETURN')
    {
      qty= qty*-1
    }

   await UpdateItem(orders[i]._id, {qty:qty, type:'SALERETURN', price:orders[i].sPrice ? orders[i].sPrice:orders[i].price, myToken:session[0].token, myId:session[0]._id})
   itemsRec.push({id:orders[i]._id, name:orders[i].itemName, qty:-orders[i].qty, price:orders[i].sPrice ? orders[i].sPrice:orders[i].price})
  }
 }
  if(res.data.amountReceived!==0)
  await AddIncome({cat:'SALERETURN', title:`FromSALEID:${res.data.saleID}`, amount:-res.data.amountReceived, status:'COMPLETE', 
  customer:res.data.customerInfo, addedBy:session[0].username, isDeleted:false, sales:[{saleID:res.data.saleID}], items:itemsRec, myToken:session[0].token, myId:session[0]._id}) 
  handleCloseAnchor()
  getSales()
  dispatchLoading({type:'DELETEEND'})
  }
  catch(err)
  {
    dispatchLoading({type:'DELETEEND'})
  }

}

useEffect(()=>{
  GetFromStorage()
  },[])
  
  useEffect(()=>{
    SetInStrogate()
    },[sales]) 

const columns=[
  { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header', width:60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =sales.data.find(sale=>sale.id === params.row.id)
      handleMoreClick(e, data)
    }

    return(
      <React.Fragment>
      <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
      <MoreHoriz style={{color:'red', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}} />
      </IconButton>

      <Menu
        id='more-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseAnchor}
      >
     {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Modify' ) ? <MenuItem onClick={handleEditItem}>
      Edit
      </MenuItem> :null}
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Search' ) ? <MenuItem onClick={OpenSaleDetail}>
      Detail
      </MenuItem> : null}
      <MenuItem onClick={handlePrint}>
      Print
      </MenuItem>
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Delete' ) ?<MenuItem onClick={handleToggleDelete}>
      {isLoading.Delete ? <CircularProgress /> : (curItem &&  curItem.isDeleted) ? 'Restore' : 'Delete'}
      </MenuItem> :null}
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Delete' ) ?
      (curItem && curItem.isDeleted) && <MenuItem onClick={DeleteForever} sx={{backgroundColor:'#FFCCCB'}}>
        {isLoading.Delete ?  <CircularProgress /> : 'Delete Forever'}
      </MenuItem>  : null }
      </Menu>
      </React.Fragment>
    )
  }},
    { field: 'saleID', headerName: 'Sale ID', width: 70, height:20, headerClassName: 'super-app-theme--header', },
    {field:'gTotal', headerName:'Total', width:70, height:20, headerClassName: 'super-app-theme--header',},
    {field:'discount', headerName:'Disc', width:60, height:20, headerClassName: 'super-app-theme--header',},
    {field: 'amountReceived', headerName: 'Received',width: 100, height:20, headerClassName: 'super-app-theme--header',},
    {field:'subTotal', headerName:'Sub Total', width:80, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'customerInfo', headerName: 'Customer', width: 100, height:20, headerClassName: 'super-app-theme--header', },
    { field: 'soldBy', headerName: 'Sold By', width: 100, height:20, headerClassName: 'super-app-theme--header', },
    { field: 'saleStatus',headerName: 'Sale Status',width: 100, height:20, headerClassName: 'super-app-theme--header', hide:true}, 
    {field: 'paymentStatus',headerName: 'Pay Status',width: 100, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'createdAt', headerName: 'Sale Date', width: 200, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'updatedAt', headerName: 'Last Updated', width: 200, height:20, headerClassName: 'super-app-theme--header', },
    { field: 'isDeleted', headerName: 'Sale Deleted', width: 120, height:20, headerClassName: 'super-app-theme--header',hide:true },
    { field: 'id', headerName: 'Object ID', width: 150, height:20, headerClassName: 'super-app-theme--header', hide:true},
    
    ]

  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>
            <form onSubmit={e=>getSales(e)}>
            <SearchBoxStyle theme={theme.themes[theme.active]}>
            <SearchFirstBoxStyle theme={theme.themes[theme.active]}>
            <SearchBoxField theme={theme.themes[theme.active]}>
            <SearchTextStyle theme={theme.themes[theme.active]} size='small' variant='outlined' label='Search...' placeholder='Search....' value={searchField} onChange={e=>handleChange(e)}/>
              <SearchTextStyle theme={theme.themes[theme.active]} size='small' select
                label='Search By'
                name='selectSearchBy'
                value={searchBy}
                onChange={handlesearchByChange}>
                <MenuItem value='saleID'>Sale ID</MenuItem>
                <MenuItem value='paymentStatus'>Payment Status</MenuItem>
                <MenuItem value='saleStatus'>Sale Status</MenuItem>
                <MenuItem value='customerInfo.name'>Customer Name</MenuItem>
                <MenuItem value='soldBy'>Seller Name</MenuItem>
                <MenuItem value='orders.itemName'>Item Name</MenuItem>
                <MenuItem value='isDeleted'  sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>Deleted Sales</MenuItem>
               
                </SearchTextStyle>
            </SearchBoxField>

                <SearchBoxField theme={theme.themes[theme.active]}> 
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                <DatePicker

                  label="Date From"
                  inputFormat="dd/MM/yyyy"
                  value={dates[0]}
                  maxDate={addDays(new Date(), 1)}
                  onChange={date=>handleFirstDate(date)} 
                  renderInput={(params) => <DateTextFieldStyle theme={theme.themes[theme.active]} size='small' {...params} />}
                />
                <DatePicker
                  label="Date To"
                  inputFormat="dd/MM/yyyy"
                  value={dates[1]}
                  maxDate={addDays(new Date(), 1)}
                  onChange={date=>handleSecondDate(date)} 
                  renderInput={(params) => <DateTextFieldStyle theme={theme.themes[theme.active]} size='small' {...params}/>}
                />
                </LocalizationProvider>
                </SearchBoxField>

            </SearchFirstBoxStyle>
             <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<Search />}>{isLoading.Search ? <CircularProgress color='inherit' /> :'Search'}</SearchButtonStyle>
            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle>
            {sales.data &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={sales.data}
            columns={columns}
            density='compact'
            components={{
              Toolbar: CustomToolbar,
            }}
            
            rowsPerPageOptions={[15, 50, 100]}
            checkboxSelection = {false}
            disableSelectionOnClick
            getRowClassName={(params) => !params.row.isDeleted ? `super-app-theme--${params.row.paymentStatus}` : 'super-app-theme--DELETED'
                }
            /> }
         
            </DataGridBoxStyle>
            <FooterBoxStyle theme={theme.themes[theme.active]}>
              <Typography variant='body1'>{GetTotal()}</Typography>
            </FooterBoxStyle>
            </MainPaperStyle>

            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
            onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
            anchorOrigin={{ vertical:'top',horizontal:'center' }}
            >
           <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
            {alertSnack.message}
           </Alert>
           </Snackbar>

            {openModal && <DetailModal sale={curItem} open={openModal} onclose={toggleModal} />}
    </MainBoxStyle>
  )
}

export default SaleReport