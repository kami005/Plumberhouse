import React, {useImperativeHandle, forwardRef, useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, DialogTitleStyle, DialogActionStyle,
 DataGridBoxStyle, 
 SearchButtonStyle} from '../../styles/CustomerLedgerStyle'
import { IconButton,  CircularProgress, Snackbar, Alert, Dialog, Button, Menu, MenuItem} from '@mui/material';
import {loadingReducer, supplierReducer, alertReducer, dialogReducer, useToggle} from '../CustomHooks/RandHooks'
import { DataGridStyle } from '../../styles/SupplierLoanStyle';
import { DeleteExpense, FindExpensesWithQuery } from '../BackendConnect/ExpenseStorage';
import {CheckCircleOutline, CancelOutlined, AccountBalanceOutlined, MoreTime, MoreHoriz} from '@mui/icons-material'
import Linearprogress from '../../pages/api/linearprogress'
import { SessionContext } from '../Context/SessionContext';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import {AddLog} from '../BackendConnect/LogsStorage'
import DetailModal from './DetailModal';
import { GetAccess } from '../Utils/Rand';
const SupplierLedger = forwardRef((props, ref) => {
const {EditLoan}  =props
const [purchases, setPurchases] = useState(null)
const [textFiedState, dispatchData]=useReducer(supplierReducer, {name:'', id:null})  
const [curExpense, setCurExpense]= useState()
const [anchorEl, setAnchorEl]= useState()
const [openModal, toggleModal] = useToggle()
const [moreLoading, toggleMoreLoading]= useToggle()
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Update', isOpen:false, msgColor:'warning'})
const context = useContext(SessionContext)
const {session, theme} = context
const Limit = 50

useImperativeHandle(ref, ()=>({
        childFunction1(supplier){
        dispatchData({type:'UPDATE', payload:{name:supplier.name, id:supplier.id}})
        }
}))


const handleEditLoan=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
  }
  else
    if(textFiedState && textFiedState.id)
    EditLoan({...textFiedState, id:parseInt(textFiedState.id)})
  }


  const handleMoreClick=(e, item)=>{
    setCurExpense(item)
    setAnchorEl(e.currentTarget);
  }
  
  const handleCloseAnchor=()=>{
    setAnchorEl(null)
  }

  const LoadMore=async()=>{
    try
    {
      if(!moreLoading)
      {
        toggleMoreLoading()
          let res = await FindExpensesWithQuery({'supplier.id':parseInt(textFiedState.id), limit:Limit,skip:purchases.length, myToken:session[0].token, myId:session[0]._id })
         
          if(res)
          {
            for (let i=0; i<res.length;i++)
            {
              res[i].id=res[i]._id
              res[i].createdAt = new Date(res[i].createdAt)
              res[i].updatedAt = new Date(res[i].updatedAt)
              if(res[i].customer)
                  res[i].customer = res[i].customer.name
            }
             let rowData= [...purchases, ...res]
            setPurchases(rowData)
          }
    
      }
      toggleMoreLoading()
    }catch(err)
    {
      toggleMoreLoading()
    }
  }

const FindBills =async ()=>{
    dispatchLoading({type:'SEARCHSTART'})

        let res = await FindExpensesWithQuery({'supplier.id':parseInt(textFiedState.id),  limit:Limit, myToken:session[0].token, myId:session[0]._id})
        if(res && res.length)
        {
            for (let i=0;i<res.length;i++)
            {
                res[i].id=res[i]._id
                res[i].createdAt = new Date(res[i].createdAt)
                res[i].updatedAt = new Date(res[i].updatedAt)
                res[i].supplier = res[i].supplier.name
            }
           setPurchases(res)
        }
        else
            setPurchases([])

    dispatchLoading({type:'SEARCHEND'})
}   

const ToggleDelete=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Delete' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
  }
  else
      dispatchDialog({type:'DELETE'})
}

const handleConfirmDelete =async()=>{
  if(session[0] && session[0].userType!=='Manager' &&  session[0].userType!=='Developer')
  {
    dispatchDialog({type:'CLOSEMSG'})
    dispatchSnack({type:'OTHER', message:'You Can not Delete this Record', msgColor:'info'})
    handleCloseAnchor()
    return
  }
    dispatchLoading({type:'DELETESTART'})
    let from={title:curExpense.title, amount:curExpense.amount, supplier:curExpense.supplier, cat:curExpense.cat, status:curExpense.status, addedBy:curExpense.addedBy, date:curExpense.date}, to ={title:curExpense.title, amount:curExpense.amount, supplier:curExpense.supplier, cat:curExpense.cat, status:curExpense.status, addedBy:curExpense.addedBy, date:curExpense.date}
    await AddLog({table:'Expense', type:'Delete', from, to, id:curExpense._id, by:session[0].username, name:curExpense.title, status:'Delete' })
    await DeleteExpense(curExpense.id, {myToken:session[0].token, myId:session[0]._id})
    await FindBills()
    dispatchLoading({type:'DELETEEND'})
    dispatchDialog({type:'CLOSEMSG'})
    handleCloseAnchor()
}

const HandleOpenDetail=async()=>{
  handleCloseAnchor()
  toggleModal()
}

useEffect(() => {

if(textFiedState.name.length)
{
    FindBills()
}
   
}, [textFiedState.name])

const handlePrint =()=>{
  handleCloseAnchor()
 
   if (curExpense && curExpense.cat==='PURCHASES' && curExpense.title.includes('FromBillID:'))
  {
    const url=`/prints/printpurchase?purchaseID=${curExpense.purchases[0].purchaseID}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
  }
  else if (curExpense && curExpense.cat==='PURCHASES' && curExpense.title.includes('BULKPAYMENT'))
  {
    const url=`/prints/printpayments?type=purchase&id=${curExpense._id}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
  }
}

const columns=[
    { field: 'more', headerName:'More', width:65, headerClassName: 'super-app-theme--header',
    renderCell: (params)=>{
      const handleMore =(e)=>{
        const data =purchases.find(purchase=>purchase.id === params.row.id)
        handleMoreClick(e, data)
      }
  
      return(
           <React.Fragment>
      <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
      <MoreHoriz style={{color:'#81c784', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}} />
      </IconButton>

      <Menu id='more-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseAnchor}>
      <MenuItem onClick={HandleOpenDetail}>Detail</MenuItem>
      <MenuItem onClick={handlePrint}>Print</MenuItem>
      <MenuItem onClick={ToggleDelete}>
      {isLoading.Delete ? <CircularProgress  size='1.5rem'/> :'Delete'}
      </MenuItem>
      </Menu>
      </React.Fragment>
      )
    }},
     
      {field: 'cat',headerName: 'Category',width: 120, headerClassName: 'super-app-theme--header',},
      {field:'title', headerName:'Title', width:150, headerClassName: 'super-app-theme--header',},
      {field:'amount', headerName:'Amount', width:100, headerClassName: 'super-app-theme--header',},
      {field: 'createdAt', headerName: 'Payment Date', width: 200, headerClassName: 'super-app-theme--header',},
      {field: 'addedBy', headerName: 'Added By',width: 100, headerClassName: 'super-app-theme--header',},
      {field:'supplier', headerName:'Supplier', width:150, headerClassName: 'super-app-theme--header', hide:true},
      { field: 'id',headerName: 'Object ID',width: 200, headerClassName: 'super-app-theme--header', hide:true}, 
      ]

      function Toolbar() {
        return (
          <GridToolbarContainer sx={{display:'flex', gap:0.5}}>
            <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
            <GridToolbarExport variant='contained'/>
            <Button  variant='contained' startIcon={<MoreTime sx={{color:'white'}}/>}
            onClick={LoadMore}>
            {moreLoading ? <CircularProgress size='1.5rem'/> : 'More'}
            </Button>
          </GridToolbarContainer>
        );
      }

return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
        <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>

            <SearchBoxStyle theme={theme.themes[theme.active]}>
            <SearchTextStyle theme={theme.themes[theme.active]} size ='small' variant='outlined' label='Supplier Name' placeholder='Pay Amount' name='name' value={textFiedState.name} disabled/>
            <SearchButtonStyle theme={theme.themes[theme.active]}  variant='contained' disabled={!textFiedState.name} onClick={handleEditLoan} endIcon={<AccountBalanceOutlined />}>Bills</SearchButtonStyle>
            </SearchBoxStyle>

            <DataGridBoxStyle>
            {isLoading.Search ? <Linearprogress /> : !isLoading.Search && purchases &&
            <DataGridStyle
            rows={purchases}
            columns={columns}
            theme={theme.themes[theme.active]}
            density='compact'
            rowsPerPageOptions={[15,50,100]}
            checkboxSelection = {false}
            disableSelectionOnClick 
            components={{
                Toolbar: Toolbar,
              }}
            getRowClassName={(params) => `super-app-theme--${params.row.cat }`}
            /> }

            </DataGridBoxStyle>
        </MainPaperStyle>

        {/* Snackbar Alert are here */}
        <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
         onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
         anchorOrigin={{ vertical:'top',horizontal:'center' }}
         >
        <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
         {alertSnack.message}
        </Alert>
        </Snackbar>

        {/* Dialog Box is here */}
        <Dialog open={openDialog.isOpen} 
        onClose={()=>dispatchDialog({type:'CLOSEMSG'})}
        aria-labelledby="dialoge-title">
        <DialogTitleStyle id='dialoge-title' >{openDialog.message}</DialogTitleStyle>
        <DialogActionStyle > 
        <IconButton onClick={handleConfirmDelete}>
          {isLoading.Delete ? <CircularProgress  size='1.5rem' /> :  <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
        </IconButton>
        <IconButton onClick={()=>dispatchDialog({type:'CLOSEMSG'})}>
            <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
        </IconButton>
        </DialogActionStyle>
        </Dialog>

        {openModal &&  <DetailModal expense={curExpense} open={openModal} onclose={()=>toggleModal()} />}
    </MainBoxStyle>
  )
})

export default SupplierLedger