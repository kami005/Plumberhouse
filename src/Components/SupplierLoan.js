import React, {useImperativeHandle, forwardRef, useState, useReducer, useEffect} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DataGridBoxStyle, SearchTextBoxStyle, DataGridStyle, DialogTitleStyle, DialogActionStyle } from '../../styles/SupplierLoanStyle'
import { IconButton, Menu, MenuItem, CircularProgress, FormControlLabel, Checkbox, Snackbar, Alert, Button, Dialog} from '@mui/material';
import { CalculateOutlined, CancelOutlined, CheckCircleOutline, MoreHoriz, MoreTime, PaidOutlined } from '@mui/icons-material';
import {loadingReducer, supplierReducer, useToggle, alertReducer, dialogReducer} from '../CustomHooks/RandHooks'
import { findPurchases, UpdatePurchase } from '../BackendConnect/PurchaseStorage';
import { AddExpense } from '../BackendConnect/ExpenseStorage';
import Linearprogress from '../../pages/api/linearprogress'
import { useRouter} from 'next/router';
import { useContext } from 'react';
import { SessionContext } from '../Context/SessionContext';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import DetailModal from './DetailModal';
import { GetAccess } from '../Utils/Rand';

const SupplierLoan = forwardRef((props, ref) => {
const navigate = useRouter()
const {GotoLedger} = props
const [purchases, setPurchases] = useState(null)
const [textFiedState, dispatchData]=useReducer(supplierReducer, {name:'', amount:'', id:null})  
const [anchorEl, setAnchorEl]= useState()
const [curPurchase, setCurPurchase]= useState()
const [moreLoading, toggleMoreLoading]= useToggle()
const [disableMore, toggleDisable] =useToggle()
const [openModal, toggleModal] = useToggle()
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [onlyPayables, toggleOnlyPayables] = useToggle(true)
const [payableAmount, setPayableAmount] = useState('')
const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Pay to Supplier', isOpen:false, msgColor:'success', status:'cancel'})
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const context = useContext(SessionContext)
const {session, theme} = context
const Limit=50

useImperativeHandle(ref, ()=>({

        childFunction1(supplier){
        dispatchData({type:'UPDATE', payload:{amount:'', name:supplier.name, id:supplier.id}})
        }
}))

const handleCloseAnchor=()=>{
    setAnchorEl(null)
  }
  const handleGotoLedger=()=>{
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Search' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    }

    if(textFiedState && textFiedState.id)
    GotoLedger({...textFiedState})
  }
const handleMoreClick=(e, purchase)=>{
    setCurPurchase(purchase)
    setAnchorEl(e.currentTarget);
}
  
const CalculatePayable  = async()=>{

    if(onlyPayables)
    {   let payable =0
        for (let i=0; i<purchases.length;i++)
        {
            payable = payable + (purchases[i].gTotal-purchases[i].paid)
        }

        setPayableAmount(payable)
    }
    else
        setPayableAmount('')
}

const handleEditItem=()=>{  
    handleCloseAnchor()
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Modify' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    }
    else
    navigate.push({
        pathname:'/purchases', 
        query:{editing:true, purchaseID:curPurchase.purchaseID}})
  }

  const LoadMore =async()=>{
    try
    {
        if(!moreLoading)
        {
            toggleMoreLoading()
            const res = await findPurchases({'supplierInfo.id':parseInt(textFiedState.id), limit:Limit, skip:purchases.length,  myToken:session[0].token, myId:session[0]._id})
            if(!res.length)
            {
                toggleDisable()
            }
            else
            {
                let rowData =[]
                if(res)
                {
                    rowData = [...purchases]
                    await res.map(purchase=>rowData.push({id:purchase._id, ...purchase, createdAt:new Date(purchase.createdAt), updatedAt:new Date(purchase.updatedAt), supplierName:purchase.supplierInfo.name}))
                    setPurchases(rowData)
                }
            }
         
    
            toggleMoreLoading()
        }

    }catch(err)
    {
        toggleMoreLoading()
    }

}

const FindBills =async ()=>{
    dispatchLoading({type:'SEARCHSTART'})
    if(onlyPayables)
    {
        const res = await findPurchases({'supplierInfo.id':textFiedState.id, $or:[ {paymentStatus:'UNPAID'}, {paymentStatus:'PARTIALPAID'}], myToken:session[0].token, myId:session[0]._id})
        let rowData =[]
        if(res)
        {
            res.slice(0).reverse().map(purchases=>rowData.push({id:purchases._id, ...purchases, createdAt:new Date(purchases.createdAt), updatedAt:new Date(purchases.updatedAt), supplierName:purchases.supplierInfo.name}))
            setPurchases(rowData)
        }

    }
    else
    {
        const res = await findPurchases({'supplierInfo.id':textFiedState.id, limit:Limit, myToken:session[0].token, myId:session[0]._id,})
        let rowData =[]
        if(res)
        {
            await res.map(purchases=>rowData.push({id:purchases._id, ...purchases, supplierName:purchases.supplierInfo.name,createdAt:new Date(purchases.createdAt), updatedAt:new Date(purchases.updatedAt),  }))
           setPurchases(rowData)
        }
    }

    dispatchLoading({type:'SEARCHEND'})
}   
const PayDialog=(e)=>{
    if(e)
        e.preventDefault()

        if(!payableAmount || payableAmount<=0 || !textFiedState.amount || isNaN(textFiedState.amount) || parseInt(textFiedState.amount)<=0 )
        {
            dispatchSnack({type:'OTHER', message:'Action not Allowed', msgColor:'warning'})
        }
        else if(payableAmount<parseInt(textFiedState.amount))
        {
            dispatchSnack({type:'OTHER', message:'Paying More than Payable is not allowed!', msgColor:'error'})
        }   
        else
            dispatchDialog({type:'OTHER', message:`Confirm to Pay Rs. ${textFiedState.amount} to "${textFiedState.name}"`})
    
}
const PayAmount =async (e)=>{
    if(e)
     e.preventDefault()
  
    try
    {
        dispatchDialog({type:'CLOSEMSG'})
        dispatchLoading({type:'SEARCHSTART'})
        if(payableAmount && payableAmount>0 && textFiedState.amount && parseInt(textFiedState.amount)>0 )
        {
           
            if(payableAmount<parseInt(textFiedState.amount))
            {
                dispatchSnack({type:'OTHER', message:'Paying More than Payable is not allowed!', msgColor:'error'})
            }   
            else
            {
                let amountPaid = textFiedState.amount
                let newArray = purchases, updatedArray=[]
                for (let i=0;i<purchases.length;i++)
                {
                    const remaingAmount = newArray[i].gTotal-newArray[i].paid
                    if(newArray[i].paymentStatus!=='PAID')
                    {
                        if(amountPaid>=remaingAmount)
                        {
                            amountPaid-=remaingAmount
                            newArray[i].paid += remaingAmount
                            newArray[i].payment = remaingAmount
                            newArray[i].paymentStatus='PAID'    
                            updatedArray.push( newArray[i])
                        }
                    else if(amountPaid ===0)
                        break
                    else if(amountPaid<remaingAmount) {
                        newArray[i].paid += amountPaid
                        newArray[i].payment = amountPaid
                        amountPaid=0
                        newArray[i].paymentStatus='PARTIALPAID'   
                        updatedArray.push( newArray[i])
                        break;
                    }
                    }
                }
                let purchasesRec=[]
                for (let i=0; i<updatedArray.length;i++)
                {
                     await UpdatePurchase(updatedArray[i]._id, {paid:updatedArray[i].paid, paymentStatus:updatedArray[i].paymentStatus}, {myToken:session[0].token, myId:session[0]._id})
                    purchasesRec.push({purchaseID:updatedArray[i].purchaseID, amount:updatedArray[i].payment})
                }
            if(updatedArray.length  )
            {
                let payment = textFiedState.amount
                 const id =   await AddExpense({cat:'PURCHASES', title:`BULKPAYMENT`, purchases:purchasesRec, amount:payment, supplier:{name:textFiedState.name, id:textFiedState.id}, status:'COMPLETE',
                 addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})  
                if(id && id.expenseID)
                {
                    const url=`/prints/printpayments?type=purchase&id=${id.expenseID}`
                    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
                }

            }
              await FindBills({myToken:session[0].token, myId:session[0]._id})


              dispatchData({type:'RESETSINGLE', payload:'amount'})
              CalculatePayable()
              dispatchSnack({type:'OTHER', message:'PAYMENT SUCCESSFULLY ADDED', msgColor:'success'})
            }
        }
        else
            dispatchSnack({type:'OTHER', message:'Action not Allowed', msgColor:'warning'})
        dispatchLoading({type:'SEARCHEND'})
       
    }
    catch(err)
    {
        dispatchLoading({type:'SEARCHEND'})
        dispatchSnack({type:'OTHER', message:'SOMTHING WENT WRONG', msgColor:'error'})
    }

}

const handlePrint =()=>{
    handleCloseAnchor()
    const url=`/prints/printpurchase?purchaseID=${curPurchase.purchaseID}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
 
    }

const OpenPurchaseDetail=()=>{
    handleCloseAnchor()
    toggleModal()
    }

useEffect(() => {

if(textFiedState.name.length)
{
    FindBills()
}
   
}, [textFiedState.name, onlyPayables])

useEffect(() => {
    if(purchases && purchases.length)
       CalculatePayable()
    }, [purchases])

const columns=[
    { field: 'more', headerName:'More', width:60, headerClassName: 'super-app-theme--header',
    renderCell: (params)=>{
      const handleMore =(e)=>{
        const data =purchases.find(purchase=>purchase.id === params.row.id)
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
        <MenuItem onClick={handleEditItem}>
        Edit
        </MenuItem>
        <MenuItem onClick={OpenPurchaseDetail}>
        Detail
        </MenuItem>
        <MenuItem onClick={handlePrint}>
        Print
        </MenuItem>
        <MenuItem sx={{backgroundColor:(curPurchase && !curPurchase.isDeleted) && '#FFCCCB'}}>
        {isLoading.Delete ? <CircularProgress size='1.5rem'/> : (curPurchase && curPurchase.isDeleted) ? 'Revert' : 'Delete'}
        </MenuItem>

        </Menu>
        </React.Fragment>
      )
    }},
      { field: 'purchaseID',headerName: 'Bill ID',width: 80, headerClassName: 'super-app-theme--header', }, 
      {field:'supplierBill', headerName:'Supplier Bill', width:110,headerClassName: 'super-app-theme--header', },
      {field: 'gTotal', headerName: 'Total', width: 100, headerClassName: 'super-app-theme--header', },
      {field: 'paid', headerName: 'Paid',width: 100,headerClassName: 'super-app-theme--header', },
      {field:'procuredBy', headerName:'Procured By', width:110,headerClassName: 'super-app-theme--header', },
      {field: 'paymentStatus',headerName: 'Pay Status',width: 120, headerClassName: 'super-app-theme--header', },
      { field: 'createdAt', headerName: 'Bill Date', width: 220, headerClassName: 'super-app-theme--header',  },
      { field: 'updatedAt', headerName: 'Last Update', width: 200, headerClassName: 'super-app-theme--header', },
      {field:'supplierName', headerName:'Supplier Name', width:150,headerClassName: 'super-app-theme--header', hide:true},
      { field: 'id', headerName: 'Object ID', width: 200, hide:true, headerClassName: 'super-app-theme--header'   },
      ]

      function Toolbar() {
        return (
          <GridToolbarContainer sx={{display:'flex', gap:0.5}} >
            <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
            <GridToolbarExport variant='contained'/>
            <Button disabled={onlyPayables || !purchases.length || disableMore} variant='contained' startIcon={<MoreTime sx={{color:'white', }}/>}
            onClick={LoadMore}>
            {moreLoading ? <CircularProgress size='1.5rem'/> : 'More'}
            </Button>
          </GridToolbarContainer>
        );
      }


return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
        <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>
        <form onSubmit={e=>PayDialog(e)}>
            <SearchBoxStyle theme={theme.themes[theme.active]}>
            <SearchTextBoxStyle theme={theme.themes[theme.active]} >
            <SearchTextStyle theme={theme.themes[theme.active]} size ='small'  variant='outlined' label='Supplier Name' placeholder='Pay Amount' name='name' value={textFiedState.name} disabled/>
            <SearchTextStyle theme={theme.themes[theme.active]} size ='small'  variant='outlined' placeholder={`Pay ${payableAmount ? payableAmount : '0'}/-`} label={`Pay ${payableAmount ? payableAmount : '0'}/-`} name='amount' value={textFiedState.amount}
             disabled={!textFiedState.name.length || !onlyPayables} onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})} />
            </SearchTextBoxStyle>
           
           <SearchTextBoxStyle theme={theme.themes[theme.active]}>
           <FormControlLabel  label={isLoading.Search ? <CircularProgress size='2rem' color='success' />: 'Pendings'} control={
            <Checkbox  checked={onlyPayables}  onChange={toggleOnlyPayables} name='onlyPayables'/>}/>
           <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' color='primary' disabled={!textFiedState.name.length || !onlyPayables} endIcon={<CalculateOutlined />}>PAY</SearchButtonStyle>
             <SearchButtonStyle  theme={theme.themes[theme.active]} variant='contained' disabled={!textFiedState.name} onClick={handleGotoLedger} endIcon={<PaidOutlined />}> Ledger</SearchButtonStyle>
           </SearchTextBoxStyle>
           
            </SearchBoxStyle>
        </form>
       
            <DataGridBoxStyle>
            {isLoading.Search ? <Linearprogress /> : !isLoading.Search && purchases &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={purchases}
            columns={columns}
            density='compact'
            rowsPerPageOptions={[15, 50, 100]}
            checkboxSelection = {false}
            disableSelectionOnClick 
            components={{
                Toolbar: Toolbar,
              }}
            getRowClassName={(params) =>
                `super-app-theme--${params.row.paymentStatus}`
                }
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


                {/* Dialogs are here */}
                <Dialog open={openDialog.isOpen} 
                onClose={()=>dispatchDialog({Type:'CLOSEMSG'})}
                aria-labelledby="dialoge-title">
                <DialogTitleStyle id='dialoge-title' >{openDialog.message}</DialogTitleStyle>
                <DialogActionStyle > 
                <IconButton onClick={()=>PayAmount()}>
                <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />
                </IconButton>
                <IconButton onClick={()=>dispatchDialog({Type:'CLOSEMSG'})}>
                    <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
                </IconButton>
                </DialogActionStyle>
                 </Dialog>

        {openModal && <DetailModal purchase={curPurchase} open={openModal} onclose={toggleModal} />}
    </MainBoxStyle>
  )
})

export default SupplierLoan