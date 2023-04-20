import React, {useContext, useEffect, useReducer, useState} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle,
SearchButtonStyle, DateTextFieldStyle, DataGridBoxStyle, DataGridStyle,  } from '../../styles/OtherIncomeExpenseStyle'
import { alertReducer, loadingReducer, useToggle } from '../CustomHooks/RandHooks';
import { Alert, Backdrop, Button, CircularProgress, Dialog, DialogActions, DialogTitle, IconButton, Menu, MenuItem, Snackbar } from '@mui/material';
import { CancelOutlined, CheckCircleOutline, MoreHoriz, MoreTime, Search } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { DeleteIncome, FindIncomeWithQuery } from '../BackendConnect/IncomeStorage.jsx';
import { convert } from '../BackendConnect/IncomeStorage.jsx';
import { DeleteExpense, FindExpensesWithQuery } from '../BackendConnect/ExpenseStorage.jsx';
import {  OTHEREXPENSEKEY, OTHERINCOMEKEY } from '../DataSource/RandData';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import { SessionContext } from '../Context/SessionContext';
import { AddLog } from '../BackendConnect/LogsStorage';
import DetailModal from './DetailModal';
import {GetAccess} from '../Utils/Rand'
const OtherIncomeExpense =  () => {

const Limit=50
const [sales, setSales] = useState()
const [purchases, setPurchases] = useState()
const [curItem, setCurItem]= useState()
const [moreLoading, toggleMoreLoading]= useToggle()
const [anchorEl, setAnchorEl]= useState()
const [date, setDates] = useState(new Date())
const [openModal, toggleModal] = useState({open:false, expense:true})
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [deleteDialog, toggleDeleteDialog] =useToggle()
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'Record Saved', isOpen:false, msgColor:'success'})
const context = useContext(SessionContext)
const {session, theme} = context

const SetInStrogate = ()=>{
  localStorage.setItem(OTHERINCOMEKEY, JSON.stringify(sales))
  localStorage.setItem(OTHEREXPENSEKEY, JSON.stringify(purchases))
}

const GetFromStorage = ()=>{
 let saleData = localStorage.getItem(OTHERINCOMEKEY)
  let purchaseData =localStorage.getItem(OTHEREXPENSEKEY)
  if(saleData!=='undefined')
  saleData= JSON.parse(saleData)
  else
    saleData=null
  if(purchaseData!=='undefined')
    purchaseData= JSON.parse(purchaseData)
   else
   purchaseData=null
  let saleRowData =[], purchaseRowData=[]
  if(saleData && saleData.length)
  {

    saleData.map(item=>saleRowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
  }
  if(purchaseData && purchaseData.length)
  {
  
    purchaseData.map(item=>purchaseRowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
  }

  if(saleRowData.length)
  setSales(saleRowData)
if(purchaseRowData.length)
 setPurchases(purchaseRowData)
}


const GetData =async (e)=>{
    e.preventDefault()

    const incomeAccess = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Search')
    const expenseAccess = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Search' )
    if(!incomeAccess && !expenseAccess)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      return
    }

    if(!isLoading.Search)
    {
      let saleRowData =[], purchaseRowData=[]
      dispatchLoading({type:'SEARCHSTART'})

      let startDate= new Date(date)
      var endDate = new Date(startDate)
      startDate =new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      
      endDate = new Date(endDate.getFullYear(), endDate.getMonth()+1, 1);
      const createdAt = {
        "createdAt":{
        $gte: convert(startDate, 0),
        $lte: convert(endDate, 0),
      }}
       if(incomeAccess)
       {
        const resp = await FindIncomeWithQuery({...createdAt, limit:Limit,$or:[{'cat':'SALES'}, {'cat':'SALERETURN'}], myToken:session[0].token, myId:session[0]._id })
        if(resp)
        {
          for (let i=0; i<resp.length;i++)
          {
            saleRowData.push({...resp[i], customer:resp[i].customer.name, createdAt:new Date(resp[i].createdAt), updatedAt:new Date(resp[i].updatedAt)})
          }
          setSales(saleRowData)
        }
       }
        if(expenseAccess)
        {
          const purReps  = await FindExpensesWithQuery({...createdAt, limit:Limit, $or:[{'cat':'PURCHASES'}, {'cat':'PURCHASERETURN'}], myToken:session[0].token, myId:session[0]._id  })
          for (let i=0; i<purReps.length;i++)
          {
            purchaseRowData.push({...purReps[i], supplier:purReps[i].supplier.name, createdAt:new Date(purReps[i].createdAt), updatedAt:new Date(purReps[i].updatedAt)})
          }
        }

        setPurchases(purchaseRowData)

    }
      dispatchLoading({type:'SEARCHEND'})
}   

const LoadMoreSales=async()=>{
  try
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Search' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      return
    }

    if(!moreLoading)
    {
      toggleMoreLoading()
      let saleRowData =[]
  
      let startDate= new Date(date)
      var endDate = new Date(startDate)
      startDate =new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      
      endDate = new Date(endDate.getFullYear(), endDate.getMonth()+1, 1);
      const createdAt = {
        "createdAt":{
        $gte: convert(startDate, 0),
        $lte: convert(endDate, 0),
      }}
      saleRowData= [...sales]
        const resp = await FindIncomeWithQuery({...createdAt, limit:Limit,skip:sales.length,$or:[{'cat':'SALES'}, {'cat':'SALERETURN'}], myToken:session[0].token, myId:session[0]._id })
        if(resp)
        {
          for (let i=0; i<resp.length;i++)
          {
            saleRowData.push({...resp[i], customer:resp[i].customer.name, createdAt:new Date(resp[i].createdAt), updatedAt:new Date(resp[i].updatedAt)})
          }
          setSales(saleRowData)
      
        }
  
    }
    toggleMoreLoading()
  }catch(err)
  {
    toggleMoreLoading()
  }

}
const LoadMorePurchases=async()=>{
  try
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Search' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      return
    }
    if(!moreLoading)
    {
      toggleMoreLoading()
      let purchaseRowData=[]
  
      let startDate= new Date(date)
      var endDate = new Date(startDate)
      startDate =new Date(startDate.getFullYear(), startDate.getMonth(), 1)
      
      endDate = new Date(endDate.getFullYear(), endDate.getMonth()+1, 1);
      const createdAt = {
        "createdAt":{
        $gte: convert(startDate, 0),
        $lte: convert(endDate, 0),
      }}
        purchaseRowData=[...purchases]
          const purReps  = await FindExpensesWithQuery({...createdAt, limit:Limit,skip:purchases.length,$or:[{'cat':'PURCHASES'}, {'cat':'PURCHASERETURN'}], myToken:session[0].token, myId:session[0]._id  })
          if(purReps)
          {
            for (let i=0; i<purReps.length;i++)
            {
              purchaseRowData.push({...purReps[i], supplier:purReps[i].supplier.name, createdAt:new Date(purReps[i].createdAt), updatedAt:new Date(purReps[i].updatedAt)})
            }
          setPurchases(purchaseRowData)
          }

    }
    toggleMoreLoading()
  }catch(err)
  {
    toggleMoreLoading()
  }

}

const handlePrint =()=>{
  handleCloseAnchor()
  if(curItem && curItem.cat==='SALES' && curItem.title.includes('FromSALEID:'))
  {
    const url=`/prints/printsale?saleID=${curItem.sales[0].saleID}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
  }
  else if  (curItem && curItem.cat==='SALERETURN' && curItem.title.includes('FromSALEID:'))
      {
        const url=`/prints/printsalereturn?saleID=${curItem.sales[0].saleID}`
        window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
      }
  else if (curItem && curItem.cat==='PURCHASES' && curItem.title.includes('FromBillID:'))
  {
    const url=`/prints/printpurchase?purchaseID=${curItem.purchases[0].purchaseID}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
  }
  else if (curItem && curItem.cat==='PURCHASES' && curItem.title.includes('BULKPAYMENT'))
  {
    const url=`/prints/printpayments?type=purchase&id=${curItem._id}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
  }
}


const handleMoreClick=(e, item)=>{
  setCurItem(item)
  setAnchorEl(e.currentTarget);
}

const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const handleConfirmDelete =async(e)=>{
  handleCloseAnchor()

  dispatchLoading({type:'DELETESTART'})
  let res
  if(curItem && curItem.supplier)
  {

    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Delete' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      toggleDeleteDialog()
      dispatchLoading({type:'DELETEEND'})
      return
    }

    let from={title:curItem.title, amount:curItem.amount, supplier:curItem.supplier, cat:curItem.cat, status:curItem.status, addedBy:curItem.addedBy, date:curItem.date}, to ={title:curItem.title, amount:curItem.amount, supplier:curItem.supplier, cat:curItem.cat, status:curItem.status, addedBy:curItem.addedBy, date:curItem.date}
    await AddLog({table:'expense', type:'Delete', from, to, id:curItem._id, by:session[0].username, name:curItem.title, status:'Delete' })
    res = await DeleteExpense(curItem ._id, {myToken:session[0].token, myId:session[0]._id} )
  }
  else if(curItem && curItem.customer)
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Delete' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      toggleDeleteDialog()
      dispatchLoading({type:'DELETEEND'})
      return
    }

  let from={title:curItem.title, amount:curItem.amount, customer:curItem.customer, cat:curItem.cat, status:curItem.status, addedBy:curItem.addedBy, date:curItem.date}, to ={title:curItem.title, amount:curItem.amount, customer:curItem.Misc, cat:curItem.cat, status:curItem.status, addedBy:curItem.addedBy, date:curItem.date}
  await AddLog({table:'income', type:'Delete', from, to, id:curItem._id, by:session[0].username, name:curItem.title, status:'Delete' })
  res = await DeleteIncome(curItem._id , {myToken:session[0].token, myId:session[0]._id })
  }
 if(res)
 {
  dispatchSnack({type:'DELETESUCCESS'})
  GetData(e)
 }
else
 dispatchSnack({type:'FAILED'})

toggleDeleteDialog()
dispatchLoading({type:'DELETEEND'})
}

const HandleOpenDetail=async()=>{
  handleCloseAnchor()
  if(curItem && curItem.cat==='PURCHASES')
  {
    toggleModal({open:true, expense:true})
  }
  else if  (curItem && curItem.cat!=='PURCHASES')
  toggleModal({open:true, expense:false})
}


useEffect(()=>{
  GetFromStorage()
  },[])
  
  useEffect(()=>{
    SetInStrogate()
    },[sales, purchases])  

const purchaseColumns=[
  { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header',width: 60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =purchases.find(sale=>sale._id === params.row._id)
      handleMoreClick(e, data)
    }

    return(
      <React.Fragment>
      <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
      <MoreHoriz style={{color:'#81c784', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}} />
      </IconButton>

      <Menu id='more-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseAnchor}>
      <MenuItem onClick={HandleOpenDetail}>
      Detail
    </MenuItem>
      <MenuItem onClick={handlePrint}>
      Print
    </MenuItem>
    <MenuItem onClick={toggleDeleteDialog}  sx={{backgroundColor:'#FFCCCB'}}>
    {isLoading.Delete ? <CircularProgress /> : (curItem && curItem.isDeleted) ? 'Restore' : 'Delete'}
    </MenuItem>
      </Menu>
      </React.Fragment>

    )
  }},
   
    { field: 'cat',headerName: 'Category',width: 120, height:20, headerClassName: 'super-app-theme--header',}, 
    {field: 'title',headerName: 'Title',width: 150, height:20, headerClassName: 'super-app-theme--header',},
    {field: 'amount',headerName: 'Payment',width: 100, height:20, headerClassName: 'super-app-theme--header',},
    {field:'supplier', headerName:'Supplier Name', width:100, height:20, headerClassName: 'super-app-theme--header',},
    {field: 'addedBy', headerName: 'Paid By',width: 100, height:20, headerClassName: 'super-app-theme--header',},
    {field: 'status', headerName: 'Status',width: 100, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'createdAt', headerName: 'Sale Date', width: 200, height:20, headerClassName: 'super-app-theme--header',},
    { field: 'updatedAt', headerName: 'Last Updated', width: 200, height:20, headerClassName: 'super-app-theme--header', },
    { field: '_id', headerName: 'Expense ID', width: 150, height:20, headerClassName: 'super-app-theme--header', },
    ]
    const saleComumns=[
      { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header',width:60,
      renderCell: (params)=>{
        const handleMore =(e)=>{
          const data =sales.find(sale=>sale._id === params.row._id)
          handleMoreClick(e, data)
        }
    
        return(
          <React.Fragment>
          <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
          <MoreHoriz style={{color:'#81c784', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}} />
          </IconButton>
    
          <Menu id='more-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseAnchor}>
          <MenuItem onClick={HandleOpenDetail}>
            Detail
          </MenuItem>
          <MenuItem onClick={handlePrint}>
          Print
        </MenuItem>
          <MenuItem onClick={toggleDeleteDialog}  sx={{backgroundColor:'#FFCCCB'}}>
          {isLoading.Delete ? <CircularProgress /> : (curItem && curItem.isDeleted) ? 'Restore' : 'Delete'}
          </MenuItem>
          </Menu>
          </React.Fragment>
        )
      }},
       
        { field: 'cat',headerName: 'Category',width: 120, height:20, headerClassName: 'super-app-theme--header',}, 
        {field: 'title',headerName: 'Title',width: 150, height:20, headerClassName: 'super-app-theme--header',},
        {field: 'amount',headerName: 'Payment',width: 100, height:20, headerClassName: 'super-app-theme--header',},
        {field:'customer', headerName:'Customer Name', width:100, height:20, headerClassName: 'super-app-theme--header',},
        {field: 'addedBy', headerName: 'Received By',width: 120, height:20, headerClassName: 'super-app-theme--header',},
        {field: 'status', headerName: 'Status',width: 100, height:20, headerClassName: 'super-app-theme--header',},
        { field: 'createdAt', headerName: 'Sale Date', width: 200, height:20, headerClassName: 'super-app-theme--header',},
        { field: 'updatedAt', headerName: 'Last Updated', width: 200, height:20, headerClassName: 'super-app-theme--header', },
        { field: '_id', headerName: 'Income ID', width: 150, height:20, headerClassName: 'super-app-theme--header', },
        ]

        function SalesToolbar() {
          return (
            <GridToolbarContainer sx={{display:'flex', gap:0.5}}>
              <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
              <GridToolbarExport variant='contained'/>
              <Button  variant='contained' startIcon={<MoreTime sx={{color:'white'}}/>}
              onClick={LoadMoreSales}>
              More
              </Button>
            </GridToolbarContainer>
          );
        }
        function PurchaseToolBar() {
          return (
            <GridToolbarContainer sx={{display:'flex', gap:0.5}} >
              <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
              <GridToolbarExport variant='contained'/>
              <Button  variant='contained' startIcon={<MoreTime sx={{color:'white', }}/>}
              onClick={LoadMorePurchases}>
              More
              </Button>
            </GridToolbarContainer>
          );
        }

  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>
            <form onSubmit={e=>GetData(e)}>
            <SearchBoxStyle theme={theme.themes[theme.active]}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
            views={['year', 'month']}
            label="Year and Month"
            minDate={new Date('2019-01-01')}
            maxDate={new Date()}
            value={date}
            
            onChange={(newValue) => {
                setDates(newValue);
            }}
            renderInput={(params) => <DateTextFieldStyle theme={theme.themes[theme.active]} size='small' {...params} helperText={null} />}
            />
            </LocalizationProvider>

             <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<Search />}>{isLoading.Search ? <CircularProgress size='2rem' color='inherit' /> :'Search'}</SearchButtonStyle>
      
            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle >
            {sales &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={sales}
            columns={saleComumns}
            rowsPerPageOptions={[15, 50, 100, 200]}
            getRowId={(row) => row._id}
            checkboxSelection = {false}
            disableSelectionOnClick
            density='compact'
            components={{
              Toolbar: SalesToolbar,
            }}
            getRowClassName={(params) =>params.row.amount>0 ? `super-app-theme--SALES` :`super-app-theme--SALERETURN`}
            /> }
            {purchases &&
              <DataGridStyle
              theme={theme.themes[theme.active]}
              rows={purchases}
              columns={purchaseColumns}
              components={{
                Toolbar: PurchaseToolBar,
              }}
              density='compact'
              rowsPerPageOptions={[15, 50, 100, 200]}
              getRowId={(row) => row._id}
              checkboxSelection = {false}
              disableSelectionOnClick
              getRowClassName={(params) => params.row.amount>0 ?  `super-app-theme--PURCHASES` :`super-app-theme--PURCHASERETURN`}
              /> }
         
            </DataGridBoxStyle>
            </MainPaperStyle>


            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
              onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
              anchorOrigin={{ vertical:'top',horizontal:'center' }}>
                  <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
                {alertSnack.message}
            </Alert>
            </Snackbar>
         <Dialog open={deleteDialog} 
            onClose={toggleDeleteDialog}
            aria-labelledby="dialoge-title">
            <DialogTitle id='dialoge-title' >Confirm to Delete {(curItem && curItem.supplier) ? 'Record from Expense' :'Record from Income'}</DialogTitle>
            <DialogActions > 
            <IconButton onClick={e=>handleConfirmDelete(e)}>
              {isLoading.Delete ? <CircularProgress /> :  <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
            </IconButton>
            <IconButton onClick={toggleDeleteDialog}>
                <CancelOutlined  style={{color:'red', fontSize:'2rem'}} />
            </IconButton>
            </DialogActions>
      </Dialog>
      {openModal.open &&  <DetailModal expense={openModal.expense && curItem}  income={!openModal.expense && curItem} open={openModal.open} onclose={()=>toggleModal({open:false, expense:true})} />}
      <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={moreLoading}
        >
        <CircularProgress color='success' />
        </Backdrop>
    </MainBoxStyle>
  )
}

export default OtherIncomeExpense