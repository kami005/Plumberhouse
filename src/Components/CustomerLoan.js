import React, {useImperativeHandle, forwardRef, useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DataGridBoxStyle, DataGridStyle, SearchTextBoxStyle, DialogActionStyle, DialogTitleStyle} from '../../styles/SupplierLoanStyle'
import { IconButton, Menu, MenuItem, CircularProgress, FormControlLabel, Checkbox, Snackbar, Alert, Button, Dialog} from '@mui/material';
import { CalculateOutlined, CancelOutlined, CheckCircleOutline, MoreHoriz, MoreTime, PaidOutlined } from '@mui/icons-material';
import {loadingReducer,  useToggle, alertReducer, customerReducer, dialogReducer} from '../CustomHooks/RandHooks'
import { AddIncome } from '../BackendConnect/IncomeStorage';
import Linearprogress from '../../pages/api/linearprogress'
import { findSales, UpdateSale } from '../BackendConnect/SaleStorage';
import { useRouter} from 'next/router';
import { SessionContext } from '../Context/SessionContext';
import { GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import DetailModal from './DetailModal';
import { GetAccess } from '../Utils/Rand';

const CustomerLoan = forwardRef((props, ref) => {
const navigate = useRouter()
const {GotoLedger} = props
const [sales, setSales] = useState(null)
const [textFiedState, dispatchData]=useReducer(customerReducer, {name:'', amount:'', id:null})  
const [anchorEl, setAnchorEl]= useState()
const [curSale, setCurSale]= useState()
const [moreLoading, toggleMoreLoading]= useToggle()
const [openModal, toggleModal] = useToggle()
const [disableMore, toggleDisable] =useToggle()
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [onlyReceiveables, toggleOnlyReceiveables] = useToggle(true)
const [receiveableAmount, setReceiveableAmount] = useState('')
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const context = useContext(SessionContext)
const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Pay to Supplier', isOpen:false, msgColor:'success', status:'cancel'})
const {session, theme} = context
const Limit = 50

useImperativeHandle(ref, ()=>({
        childFunction1(customer){
        dispatchData({type:'UPDATE', payload:{amount:'', name:customer.customerName, id:customer.customerID}})
        }
}))

const handleGotoLedger=()=>{
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Search' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    }
    else
    if(textFiedState && textFiedState.id)
    GotoLedger({...textFiedState, customerName:textFiedState.name, customerID:textFiedState.id})
  }
const handleCloseAnchor=()=>{
    setAnchorEl(null)
  }
const handleMoreClick=(e, sale)=>{
    setCurSale(sale)
    setAnchorEl(e.currentTarget);
}

const OpenSaleDetail=()=>{
    handleCloseAnchor()
    toggleModal()
    }
const CalculatePayable  = async()=>{

    if(onlyReceiveables)
    {   let receiveable =0
        for (let i=0; i<sales.length;i++)
        {
            receiveable = receiveable + (sales[i].gTotal-sales[i].amountReceived)
        }

        setReceiveableAmount(receiveable)
    }
    else
        setReceiveableAmount('')
}

const LoadMore =async()=>{
    try
    {
        if(!moreLoading)
        {
            toggleMoreLoading()
            const res = await findSales({'customerInfo.id':parseInt(textFiedState.id), limit:Limit, skip:sales.length,  myToken:session[0].token, myId:session[0]._id})
            if(!res.length)
            {
                toggleDisable()
            }
            else
            {
                let rowData =[]
                if(res)
                {
                    rowData = [...sales]
                    await res.map(sale=>rowData.push({id:sale._id, ...sale, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt), customerName:sale.customerInfo.name}))
                    setSales(rowData)
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
    if(onlyReceiveables)
    {
        const res = await findSales({'customerInfo.id':textFiedState.id, $or:[ {paymentStatus:'UNPAID'}, {paymentStatus:'PARTIALPAID'} ] , myToken:session[0].token, myId:session[0]._id})
        let rowData =[]
        if(res)
        {
           res.slice(0).reverse().map(sale=>rowData.push({id:sale._id, ...sale, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt),  customerName:sale.customerInfo.name}))
            // await res.map(sale=>rowData.push({id:sale._id, ...sale, createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt),  customerName:sale.customerInfo.name}))
             setSales(rowData)
        }

    }
    else
    {
        const res = await findSales({'customerInfo.id':parseInt(textFiedState.id),limit:Limit, myToken:session[0].token, myId:session[0]._id})
        let rowData =[]
        if(res)
        {
            await res.map(sale=>rowData.push({id:sale._id, ...sale,   createdAt:new Date(sale.createdAt), updatedAt:new Date(sale.updatedAt), customerName:sale.customerInfo.name}))
            setSales(rowData)
        }
    }

    dispatchLoading({type:'SEARCHEND'})
}   

const RecieveDialog=(e)=>{
    if(e)
        e.preventDefault()
        if(!receiveableAmount || receiveableAmount<=0 || !textFiedState.amount || isNaN(textFiedState.amount) || parseInt(textFiedState.amount)<=0 )
        {
            dispatchSnack({type:'OTHER', message:'Action not Allowed', msgColor:'warning'})
        }
        else if(receiveableAmount<textFiedState.amount)
        {
            dispatchSnack({type:'OTHER', message:'Paying More than Payable is not allowed!', msgColor:'error'})
        }   
        else
            dispatchDialog({type:'OTHER', message:`Confirm to Receive Rs. ${textFiedState.amount} from "${textFiedState.name}"`})
    
}

const handleEditItem=()=>{  
    handleCloseAnchor()
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Modify' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    }
    else
    navigate.push({
      pathname:'/saleclassic', 
      query:{editing:true, saleID:curSale.saleID}})
  }


const PayAmount =async (e)=>{
    if(e)
        e.preventDefault()
    try
    {
        dispatchDialog({type:'CLOSEMSG'})
        dispatchLoading({type:'SEARCHSTART'})
        if(receiveableAmount && receiveableAmount>0 && textFiedState.amount && parseInt(textFiedState.amount)>0 )
        {
           
            if(receiveableAmount<textFiedState.amount)
            {
                dispatchSnack({type:'OTHER', message:'Paying More than Payable is not allowed!', msgColor:'error'})
            }   
            else
            {
                let amountReceived = textFiedState.amount
                let newArray = sales,
                updatedArray=[]
                for (let i=0;i<sales.length;i++)
                {
                    const remaingAmount = newArray[i].gTotal-newArray[i].amountReceived
                    if(newArray[i].paymentStatus!=='PAID')
                    {
                        if(amountReceived>=remaingAmount)
                        {
                            amountReceived-=remaingAmount
                            newArray[i].amountReceived += remaingAmount
                            newArray[i].payment = remaingAmount
                            newArray[i].paymentStatus='PAID'    
                            updatedArray.push( newArray[i])
                        }
                    else if(amountReceived ===0)
                        break
                    else if(amountReceived<remaingAmount) {
                        newArray[i].amountReceived += amountReceived
                        newArray[i].payment = amountReceived
                        amountReceived=0
                        newArray[i].paymentStatus='PARTIALPAID'   
                        updatedArray.push(newArray[i])
                        break;
                    }
                    }
                }

            let salesData=[]
            for (let i=0; i<updatedArray.length;i++)
            {
                await UpdateSale(updatedArray[i]._id, {amountReceived:parseInt(updatedArray[i].amountReceived), paymentStatus:updatedArray[i].paymentStatus}, 
                {myToken:session[0].token, myId:session[0]._id})
                salesData.push({saleID:updatedArray[i].saleID, amount:updatedArray[i].payment})
            }
            if(updatedArray.length  )
            {
                let payment = textFiedState.amount
                await AddIncome({cat:'SALES', title:`BULKPAYMENT`, sales:salesData,amount:payment, customer:{name:textFiedState.name, id:textFiedState.id}, status:'COMPLETE', 
                addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})  
            }
              await FindBills()
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
        console.log(err)
        dispatchLoading({type:'SEARCHEND'})
        dispatchSnack({type:'OTHER', message:'SOMTHING WENT WRONG', msgColor:'error'})
    }

}
    
const handlePrint =()=>{
    let url=''
    if(curSale.saleStatus==='RETURN')
      url=`/prints/printsalereturn?saleID=${curSale.saleID}`
    else
       url=`/prints/printsale?saleID=${curSale.saleID}`

       window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
    
      handleCloseAnchor()
    }

useEffect(() => {

if(textFiedState.name.length)
{
    FindBills()
}
   
}, [textFiedState.name, onlyReceiveables])

useEffect(() => {
    if(sales && sales.length)
       CalculatePayable()
    }, [sales])

const columns=[
    { field: 'more', headerName:'More', width:60, headerClassName: 'super-app-theme--header',
    renderCell: (params)=>{
      const handleMore =(e)=>{
        const data =sales.find(sale=>sale.id === params.row.id)
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
        <MenuItem onClick={OpenSaleDetail}>
        Detail
        </MenuItem>
        <MenuItem onClick={handlePrint}>
        Print
        </MenuItem>
        <MenuItem>
        {isLoading.Delete ? <CircularProgress size='1.5rem'/> : (curSale && curSale.isDeleted) ? 'Revert' : 'Delete'}
        </MenuItem>
        </Menu>
        </React.Fragment>
      )
    }},
      { field: 'saleID',headerName: 'Sale ID',width: 80, headerClassName: 'super-app-theme--header'}, 
      {field: 'subTotal', headerName: 'Sub Total', width: 100, headerClassName: 'super-app-theme--header'},
      {field:'discount', headerName:'Discount', width:100, headerClassName: 'super-app-theme--header'},
      {field: 'gTotal', headerName: 'Total', width: 100, headerClassName: 'super-app-theme--header'},
      {field: 'amountReceived', headerName: 'Received',width: 120, headerClassName: 'super-app-theme--header',},
      {field:'soldBy', headerName:'Sold By', width:100, headerClassName: 'super-app-theme--header',},
      {field: 'paymentStatus',headerName: 'Pay Status',width: 150, headerClassName: 'super-app-theme--header'},
      { field: 'createdAt', headerName: 'Bill Date', width: 200, headerClassName: 'super-app-theme--header' },
      { field: 'updatedAt', headerName: 'Last Update', width: 200, headerClassName: 'super-app-theme--header' },
      { field: 'customerName', headerName: 'Customer Name', width: 200, headerClassName: 'super-app-theme--header', hide:true },
      { field: 'id', headerName: 'Object ID', width: 200,headerClassName: 'super-app-theme--header', hide:true  },
      ]

      function Toolbar() {
        return (
          <GridToolbarContainer sx={{display:'flex', gap:0.5}}>
            <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
            <GridToolbarExport variant='contained'/>
            <Button disabled={onlyReceiveables || !sales.length || disableMore} variant='contained' startIcon={<MoreTime sx={{color:'white', }}/>}
            onClick={LoadMore}>
            {moreLoading ? <CircularProgress size='1.5rem'/> : 'More'}
            </Button>
          </GridToolbarContainer>
        );
      }

return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
        <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>
        <form onSubmit={e=>RecieveDialog(e)}>
            <SearchBoxStyle theme={theme.themes[theme.active]} >
           <SearchTextBoxStyle theme={theme.themes[theme.active]}>
            <SearchTextStyle theme={theme.themes[theme.active]} size='small' variant='outlined' label='Customer Name' placeholder='Customer Name' name='name' value={textFiedState.name} disabled/>
            <SearchTextStyle  theme={theme.themes[theme.active]} size='small' variant='outlined' placeholder='Amount to Receive' label={`Receive ${receiveableAmount}/-`} name='amount' value={textFiedState.amount}
             disabled={!textFiedState.name.length || !onlyReceiveables} onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})} />
           </SearchTextBoxStyle>
            <SearchTextBoxStyle theme={theme.themes[theme.active]}>
            <FormControlLabel label={isLoading.Search ? <CircularProgress size='2rem' color='success' />: 'Pendings'} control={
            <Checkbox  checked={onlyReceiveables}  onChange={toggleOnlyReceiveables} name='onlyReceiveables'/>
            }/>
            <SearchButtonStyle  theme={theme.themes[theme.active]} type='submit' variant='contained' color='primary' disabled={!textFiedState.name.length || !onlyReceiveables} endIcon={<CalculateOutlined />}>Receive</SearchButtonStyle>
        
            <SearchButtonStyle   theme={theme.themes[theme.active]} variant='contained' disabled={!textFiedState.name} onClick={handleGotoLedger} endIcon={<PaidOutlined />}> Ledger</SearchButtonStyle>
            </SearchTextBoxStyle>

            </SearchBoxStyle>
        </form>
       
            <DataGridBoxStyle>
            {isLoading.Search ? <Linearprogress /> : !isLoading.Search && sales &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={sales}
            columns={columns}
            density='compact'
            rowsPerPageOptions={[15,50,100]}
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



        {openModal && <DetailModal sale={curSale} open={openModal} onclose={toggleModal} />}
    </MainBoxStyle>


  )
})

export default CustomerLoan