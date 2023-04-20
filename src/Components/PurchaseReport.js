import React, {useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DateTextFieldStyle, DataGridBoxStyle, DataGridStyle, SearchFirstBoxStyle, SearchBoxField, FooterBoxStyle } from '../../styles/PurchaseReportStyle'
import { useTextboxVal, loadingReducer, useToggle, alertReducer } from '../CustomHooks/RandHooks';
import { findPurchases, findDeletedBills, toggleDeleteBill, DeletePermanent } from '../BackendConnect/PurchaseStorage';
import {  IconButton, Menu, MenuItem, CircularProgress, Typography, Button, Snackbar, Alert } from '@mui/material';
import { MoreHoriz, MoreTime, Search } from '@mui/icons-material';
import { useRouter} from 'next/router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import addDays from 'date-fns/addDays';
import {  PURCHASEREPORTKEY } from '../DataSource/RandData';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter, GridToolbarColumnsButton} from '@mui/x-data-grid';
import { AddExpense } from '../BackendConnect/ExpenseStorage';
import DetailModal from './DetailModal';
import { SessionContext } from '../Context/SessionContext';
import { UpdateItem } from '../BackendConnect/ItemStorage';
import { GetAccess } from '../Utils/Rand';

const PurchaseReport =  () => {
const navigate = useRouter()
const [purchases, setPurchases] = useState({data:[], showAll:false})
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
  localStorage.setItem(PURCHASEREPORTKEY, JSON.stringify(purchases))
}
const GetFromStorage = ()=>{
 const data = JSON.parse(localStorage.getItem(PURCHASEREPORTKEY))
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
 setPurchases({data:rowData, showAll:data.showAll})
}

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{display:'flex', gap:0.5,  marginBottom:'0.2rem'}} >
      <GridToolbarQuickFilter  sx={{color:'white', width:'42%'}}/>
      <GridToolbarColumnsButton variant='contained'/>
      <GridToolbarExport variant='contained' />
      <Button disabled={!purchases.data.length || searchField!=='' || !purchases.showAll}  variant='contained' startIcon={<MoreTime sx={{color:'white', }}/>}
       onClick={LoadMore}>
       More
      </Button>
    </GridToolbarContainer>
  );
}

const LoadMore =async()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    return
  }
  dispatchLoading({type:'SEARCHSTART'})


  let rowData =[]
  if(!isLoading.Search && !loadingReducer.Delete)
  {
    let skip = 0
    if(purchases.data.length)
      skip=purchases.data.length

     let filter ={[searchBy]:searchField, skip}
      if(dates[0] && dates[1])
      {
          filter = {...filter, dates}
      }
       const resp = await findPurchases({...filter, myToken:session[0].token, myId:session[0]._id})
      
       if(purchases.data.length)
        rowData=[...purchases.data]
     
      if (resp)
      {
          await resp.map(purchase=>rowData.push({...purchase, id:purchase._id, supplierInfo:purchase.supplierInfo.name,
            createdAt:new Date(purchase.createdAt), updatedAt:new Date(purchase.updatedAt)}))
      }
    
    setPurchases({data:rowData, showAll:true})
  }

  dispatchLoading({type:'SEARCHEND'})
  
}
const GetTotal =()=>{
  let   totalCount=0, receivedCount=0, remainingCount=0
if(purchases)
  for(let i=0;i<purchases.data.length;i++)
  {
    totalCount+=purchases.data[i].gTotal
    receivedCount += purchases.data[i].paid
  }

  remainingCount = totalCount-receivedCount
  return `Total: ${totalCount}
   Remaining: ${remainingCount}`
}

const getPurchases =async (e)=>{
  if(e)
        e.preventDefault()

        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Search' )
        if(!access)
        {
          dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
          return
        }

        dispatchLoading({type:'SEARCHSTART'})
        let filter ={[searchBy]:searchField}
        let rowData =[]
        if(!isLoading.Search && !loadingReducer.Delete)
        {
          if(searchBy ==='isDeleted')
          {
            const resp = await findDeletedBills({myToken:session[0].token, myId:session[0]._id})
           
            if (resp)
            {
              await resp.map(purchase=>rowData.push({...purchase, id:purchase._id, supplierInfo:purchase.supplierInfo.name, 
              createdAt:new Date(purchase.createdAt), updatedAt:new Date(purchase.updatedAt)}))
            }
          }
          else
          {
            if(dates[0] && dates[1])
            {
                filter = {...filter, dates}
               
            }
             const resp = await findPurchases({...filter, myToken:session[0].token, myId:session[0]._id})
    
           
            if (resp)
            {
                await resp.map(purchase=>rowData.push({...purchase, id:purchase._id, supplierInfo:purchase.supplierInfo.name,
                  createdAt:new Date(purchase.createdAt), updatedAt:new Date(purchase.updatedAt)}))
               
            }
          }
          setPurchases({data:rowData, showAll: (searchField === '' && dates[0]===null && dates[1] ===null && searchBy!=='isDeleted') ? true:false})
        }

        dispatchLoading({type:'SEARCHEND'})
}   

const handlePrint =()=>{
  let url
  if(curItem.purchaseStatus ==='RETURN')
     url=`/prints/printpurchase?purchaseID=${curItem.purchaseID}`
  else
  url=`/prints/printpurchase?purchaseID=${curItem.purchaseID}`
  window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');

  handleCloseAnchor()
}

const handleToggleDelete= async (e)=>{
  dispatchLoading({type:'DELETESTART'})
  const res = await toggleDeleteBill(curItem.id, curItem.isDeleted ? false:true, {myToken:session[0].token, myId:session[0]._id})
  if(res && res.message && res.message ==='SUCCESS')
  {
  
    let rowData=[]
    if (searchBy ==='isDeleted')
    {
      
      const resp = await findDeletedBills({myToken:session[0].token, myId:session[0]._id})
         
      if (resp)
      {
        await resp.map(purchase=>rowData.push({...purchase, id:purchase._id, supplierInfo:purchase.supplierInfo.name,
          createdAt:new Date(purchase.createdAt), updatedAt:new Date(purchase.updatedAt)}))
      }
     
    }
    else{
      let filter ={[searchBy]:searchField}
      if(dates[0] && dates[1])
      {
          filter = {...filter, dates}
         
      }
       const resp = await findPurchases({...filter, myToken:session[0].token, myId:session[0]._id})
     
      if (resp)
      {
        await resp.map(purchase=>rowData.push({...purchase, id:purchase._id, supplierInfo:purchase.supplierInfo.name,
          createdAt:new Date(purchase.createdAt), updatedAt:new Date(purchase.updatedAt)}))
      }
    }
    setPurchases({data:rowData, showAll: (searchField === '' && dates[0]===null && dates[1] ===null && searchBy!=='isDeleted') ? true:false})
  }
  handleCloseAnchor()
  dispatchLoading({type:'DELETEEND'})
  }
const handleMoreClick=(e, item)=>{
  setCurItem(item)
  setAnchorEl(e.currentTarget);
}

const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const handleEditItem=()=>{  
  
  navigate.push({
    pathname:'/purchases', 
    query:{editing:true, purchaseID:curItem.purchaseID}})
  
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

const OpenPurchaseDetail=()=>{handleCloseAnchor()
  toggleModal()
  }
  
const DeleteForever =async()=>{
  try
  {
    
    dispatchLoading({type:'DELETESTART'})
   
    const res = await DeletePermanent(curItem._id, {myToken:session[0].token, myId:session[0]._id})
    let itemsRec= []
    if(res && res.data.orders)
    {
      const orders= res.data.orders
      for (let i=0;i<orders.length;i++)
      {
       await UpdateItem(orders[i]._id, {qty:-parseInt(orders[i].qty), price:orders[i].pPrice ? orders[i].pPrice:orders[i].price, myToken:session[0].token, myId:session[0]._id})
       itemsRec.push({id:orders[i]._id, name:orders[i].itemName, qty:-orders[i].qty, price:orders[i].pPrice ? orders[i].pPrice:orders[i].price})
      }
    }
    
    if(res.data.paid!==0)
    await AddExpense({cat:'PURCHASERETURN', title:`FromBillID:${res.data.purchaseID}`,amount:-res.data.paid, status:'COMPLETE', 
    supplier:res.data.supplierInfo, addedBy:session[0].username, isDeleted:false, items:itemsRec, 
    purchases:[{purchaseID:res.data.purchaseID}], myToken:session[0].token, myId:session[0]._id})  
    handleCloseAnchor()
     getPurchases()
     dispatchLoading({type:'DELETEEND'})
  }catch(err)
  {
    dispatchLoading({type:'DELETEEND'})
  }

 }

useEffect(()=>{
  GetFromStorage()
  },[])
  
  useEffect(()=>{
    SetInStrogate()
    },[purchases]) 
const columns=[
  { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header', width:60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =purchases.data.find(purchase=>purchase.id === params.row.id)
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
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Modify' ) ? <MenuItem onClick={handleEditItem}>
      Edit
      </MenuItem> :null}
      <MenuItem onClick={OpenPurchaseDetail}>
      Detail
      </MenuItem>

      <MenuItem onClick={handlePrint}>
      Print
      </MenuItem>
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Delete' ) ?<MenuItem onClick={handleToggleDelete}>
      {isLoading.Delete ? <CircularProgress /> : (curItem &&  curItem.isDeleted ) ? 'Restore' : 'Delete'}
      </MenuItem> : null}
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Search' ) ? (curItem && curItem.isDeleted) &&
      <MenuItem onClick={DeleteForever} sx={{backgroundColor:'#FFCCCB'}}>
      {isLoading.Delete ?  <CircularProgress /> : 'Delete Forever'}
      </MenuItem>: null}
      </Menu>
      </React.Fragment>
    )
  }},
    { field: 'purchaseID', headerName: 'Bill ID', width: 80, height:20, headerClassName: 'super-app-theme--header', },
    {field:'supplierBill', headerName:'Supplier Bill', width:80, height:20, headerClassName: 'super-app-theme--header',},
    {field:'gTotal', headerName:'Total', width:80, height:20, headerClassName: 'super-app-theme--header',},
    {field: 'paid', headerName: 'PAID',width: 100, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'supplierInfo', headerName: 'Supplier', width: 100, height:20, headerClassName: 'super-app-theme--header', },
    { field: 'procuredBy', headerName: 'Procured By', width: 100, height:20, headerClassName: 'super-app-theme--header', },
    { field: 'purchaseStatus',headerName: 'Bill Status',width: 100, height:20, headerClassName: 'super-app-theme--header',}, 
    {field: 'paymentStatus',headerName: 'Pay Status',width: 120, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'createdAt', headerName: 'Bill Date', width: 200, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'updatedAt', headerName: 'Last Updated', width: 200, height:20, headerClassName: 'super-app-theme--header', },
    { field: 'isDeleted', headerName: 'Bill Deleted', width: 100, height:20, headerClassName: 'super-app-theme--header', hide:true},
    { field: 'id', headerName: 'Object ID', width: 150, height:20, headerClassName: 'super-app-theme--header', hide:true},
    ]

  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>
            <form onSubmit={e=>getPurchases(e)}>
            <SearchBoxStyle theme={theme.themes[theme.active]}>
            <SearchFirstBoxStyle theme={theme.themes[theme.active]}>
            <SearchBoxField theme={theme.themes[theme.active]} >
            <SearchTextStyle theme={theme.themes[theme.active]} size='small' variant='outlined' label ='Search.. ' placeholder='Search....' value={searchField} onChange={e=>handleChange(e)}/>
              <SearchTextStyle theme={theme.themes[theme.active]} select
                label='Search By'
                name='searchBy' size='small'
                value={searchBy}
                onChange={handlesearchByChange}
                >
                <MenuItem value='purchaseID'>Purchase ID</MenuItem>
                <MenuItem value='paymentStatus'>Payment Status</MenuItem>
                <MenuItem value='purchaseStatus'>Purchase Status</MenuItem>
                <MenuItem value='supplierInfo.name'>Supplier Name</MenuItem>
                <MenuItem value='procuredBy'>Procurer Name</MenuItem>
                <MenuItem value='orders.itemName'>Item Name</MenuItem>
                <MenuItem value='supplierBill'>Supplier Bill</MenuItem>
                <MenuItem value='isDeleted'  sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>Deleted Bills</MenuItem>
                </SearchTextStyle>
            </SearchBoxField>
            <SearchBoxField >
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

            <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<Search />}>{isLoading.Search ? <CircularProgress color='inherit' size='2rem'/> :'Search'}</SearchButtonStyle>
            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle>
            {purchases.data &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={purchases.data}
            columns={columns}
            rowsPerPageOptions={[15, 50,100,200]}
            checkboxSelection = {false}
            disableSelectionOnClick
            density='compact'
            components={{
              Toolbar: CustomToolbar,
            }}
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
            anchorOrigin={{ vertical:'top',horizontal:'center' }}>
           <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
            {alertSnack.message}
           </Alert>
           </Snackbar>

            {openModal && <DetailModal purchase={curItem} open={openModal} onclose={toggleModal} />}
    </MainBoxStyle>
  )
}

export default PurchaseReport