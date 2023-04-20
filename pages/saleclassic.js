import React, {useState, useEffect, useRef, useReducer, useCallback, useContext} from 'react'
import {InputBase,IconButton,CircularProgress, Divider,  Autocomplete, Snackbar,Alert, Dialog, TextField, InputAdornment, Modal, Backdrop, Typography} from '@mui/material'
import { StyledBoxMain,StyledSearchTextPaper, StyledCartPaperTitle,StyledCartPaper, StyledSearchPaper, StyledTypographyItems, StyledBox, StyledTotalPaper,
StyledIconButtonBox, StyledTotalTypography, ModalBox,StyledBoxTotal, StyledOtherBtnsPaper,StyledOtherBtn, DialogActionStyle, DialogTitleStyle, DialogContentStyle,
StyledTypographyHeader, StyledCartBoxTitles, SearchInputStyle, SearchOtherField, OtherInputStyle, IconBtnDivStyle, StyleCartPaperHeader, SpanOptions, DividerStyle,} from '../styles/SaleClassicStyle'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import DiscountIcon from '@mui/icons-material/Discount';
import SendIcon from '@mui/icons-material/Send';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { grandTotalReducer, loadingReducer, useItemCart, useTextboxVal, useToggle } from '../src/CustomHooks/RandHooks';
import { searchItems } from '../src/BackendConnect/ItemStorage';
import { alertReducer, dialogReducer} from '../src/CustomHooks/RandHooks';
import {CheckCircleOutline, CancelOutlined, FindInPage, Description, Gavel} from '@mui/icons-material'
import { AddSale, UpdateSale, toggleDeleteSale, findonesale, DeletePermanent } from '../src/BackendConnect/SaleStorage';
import { withRouter, useRouter } from 'next/router';
import { UpdateItem } from '../src/BackendConnect/ItemStorage';
import { FindCustomers } from '../src/BackendConnect/CusotmerStorage';
import Header from '../src/Components/HeaderText';
import {  SUSPENDSALEKEY } from '../src/DataSource/RandData';
import { AddIncome } from '../src/BackendConnect/IncomeStorage';
import { SessionContext } from '../src/Context/SessionContext';
import  SuspendedSales from '../src/Components/SuspendedSales'

import {v4} from "uuid";

 const SaleClassic = (props) => {

  var location= props.router
  const uuId = v4()

  var route = useRouter()
  const btnAddNewRef = useRef()
  const btnCancelRef = useRef()
  const ConstumerSchema= [{customerName:'MISC', customerID:1}]
  const btnSuspendRef = useRef()
  const btnCheckoutRef = useRef()
  const btnConfirmCheckout = useRef()
  const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Checkout:false, Delete:false})
  const [saleEditing, setSaleEdit] = useState(false)
  const [itemsFound, setFoundItems] = useState([])
  const [descriptionTxt, setDescText] = useState('')
  const [customerFound, setCustomerFound] = useState(ConstumerSchema)
  const [saleRec, setSaleRec] = useState()
  const [totalValues, dispatchTotal] = useReducer(grandTotalReducer, {subTotal:0, unitDiscount:0, furtherDisc:0, grandTotal:0, change:0, gst:0})
  const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Sale Cancelled', isOpen:false, msgColor:'error'})
  const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Cancel Sale', isOpen:false, msgColor:'warning', status:'cancel'})
  const [items, addtoCart, deleteFromCart, handleUpdateQty, resetCart, updatingSale, reloadSuspended] = useItemCart()
  const [text, handleChange, handleReset] = useTextboxVal()
  const [customerText, handleCustomerChange, handleCustomerReset] =useTextboxVal()
  const [saleStarted, toggleSaleStarted] =useToggle()
  const [searchByID, toggleSearchBy]= useToggle()
  const [showPurchaseRate, toggleShowPurchaseRate] = useToggle()
  const [openModal, toggleModal] = useToggle()
  const [saleLoading, toggleSaleLoading] = useToggle()
  const context = useContext(SessionContext)
  const {session, theme} = context

  const resetEveryThing =()=>{
    resetCart()
    setFoundItems([])
    handleReset()
    setSaleEdit(false)
    toggleSaleStarted()
    setCustomerFound(ConstumerSchema)
    dispatchDialog({type:"CLOSEMSG"})
    dispatchTotal({type:'RESET'})
    handleCustomerReset()
    setDescText('')
  }

  const SetLocalStorage =async ()=>{
    localStorage.removeItem(SUSPENDSALEKEY)
    let rowData=[]
    const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
    if(sale)
    rowData=sale
    if(rowData.length)
    localStorage.setItem(SUSPENDSALEKEY, JSON.stringify([...rowData, {id:uuId, itemCount:items.length, items:items, suspendedBy:session[0].username,
     gTotal:totalValues.grandTotal, unitDisc:totalValues.unitDiscount, subTotal:totalValues.subTotal, type:'SALE', suspendedAt:new Date()}]))
     else
     localStorage.setItem(SUSPENDSALEKEY, JSON.stringify([{id:uuId, itemCount:items.length, items:items, suspendedBy:session[0].username,
      gTotal:totalValues.grandTotal, unitDisc:totalValues.unitDiscount, subTotal:totalValues.subTotal, type:'SALE', suspendedAt:new Date()}]))


      const url=`/prints/printsuspended?id=${uuId}`
      window.open(url, '_blank', 'toolbar=0,location=0,scrollbars=0,resizable=0,menubar=0,width=600,height=800');
  }

const LoadSuspended =()=>{
  if(openModal)
    toggleModal()
  const id = location.query.id
  if(id)
  {
      const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
      const id =location.query.id
      let suspendedSaleData = sale.find(data=>data.id===id) 
      let remainingSales = sale.filter(data=>data.id !== suspendedSaleData.id)
      localStorage.setItem(SUSPENDSALEKEY, JSON.stringify(remainingSales))

      if(suspendedSaleData)
      {
        toggleSaleStarted()
        reloadSuspended(suspendedSaleData.items)
        dispatchTotal({type:'CALCSUSPEND', items:suspendedSaleData.items, unitDisc:suspendedSaleData.unitDisc, furtherDisc:suspendedSaleData.furtherDisc})
      }
  }
  route.push({ path: 'saleclassic'})
}

  const addItemtoCart =async (e)=>{
    e.preventDefault()
    let qtyE = document.getElementById('qtyInput')
    let discE= document.getElementById('discInput')
    let searchE = document.getElementById('searchTextbar')
 
    var  curItem 
 
    if(searchByID && !isNaN(text) && text!=='')
    {
      const filter = parseInt(text)
      const resData = await searchItems({itemID:filter})
      if(resData && resData.length)
      {
        searchE.value=resData[0].itemName
        setFoundItems(resData)
      }
    }
    else if(itemsFound.length)
    {
        curItem = itemsFound.filter(item=>text === item.itemName)
      
      if(!curItem || !curItem.length)
        return
  
      if(isNaN(qtyE.value) || qtyE.value === '')
              qtyE.value=1
      if(isNaN(discE.value) || discE.value ==='')    
            discE.value=0
  
      if(parseInt(qtyE.value)>parseInt(curItem[0].qty))
          dispatchSnack({type:'OTHER', message:'Adding quanity more than avaialble in Stock !!', msgColor:'error'})
       if(parseInt(discE.value)>curItem[0].sPrice)
       {
        dispatchSnack({type:'OTHER', message:'Adding Discount more than actual Price!!', msgColor:'error'})
        return null
       }
       
        curItem[0].qty=qtyE.value
        curItem[0].discount= discE.value
        addtoCart(curItem[0])
        handleReset()
        
        qtyE.value=1
        discE.value=0
        setFoundItems([])
        searchE.focus()
        searchE.value=''
        
    }
  }

  const addFurtherDisc = ()=>{

    const furtherDisc = document.getElementById('furtherDiscText')
    
    if(furtherDisc && furtherDisc.value && !isNaN(furtherDisc.value) && furtherDisc.value !== '')
      dispatchTotal({type:'CALC', items, furtherDisc:parseInt(furtherDisc.value)})
    else 
      dispatchTotal({type:'CALC', items, furtherDisc:0})
  }

  const AddOtherAmount = ()=>{

    const otherAmountTitle = document.getElementById('otherAmountText')
    const otherAmount = document.getElementById('otherAmount')

    if(otherAmountTitle.value && otherAmount.value && !isNaN(otherAmount.value) && otherAmount.value!==0)
    {
      return {title:otherAmountTitle.value, amount:otherAmount.value}
    }
    else
      return {}
  }

  const AddGST = ()=>{

    const gstPercentage = document.getElementById('gstPercentage')

    if(gstPercentage.value && !isNaN(gstPercentage.value))
    {
      dispatchTotal({type:'ADDGST', gst:parseInt(gstPercentage.value)})
    }
  }

  const handleSearch= async (e)=>{
    e.preventDefault()
    let resData
    if(!searchByID)
    {
      if(e && e.target && e.target.value && e.target.value.trim().length>2)
      { 
        if(e.target.value.length>3 && e.target.value.includes('|')){
          const itemNameTrim = e.target.value.split('|')[0]
           e.target.value=itemNameTrim
          handleChange(e)
        }
        else
          handleChange(e)
         resData = await searchItems({itemName:e.target.value})
        if(resData)
            setFoundItems(resData)
        else
             setFoundItems([]) 
      }
      else if (e && e.target&& e.target.value.length<3)
      {
        setFoundItems([])
      }
    }
    else
    {
      if(e.target.value.includes('|') && itemsFound.length)
      {
        const itemNameTrim = e.target.value.split('|')[0]
        e.target.value=itemNameTrim
        handleChange(e)
      }
      else
        handleChange(e)
    }

  }

  const handleCustomerSearch=async (e)=>{
    if(e && e.preventDefault)
      e.preventDefault()
     
      if(e && e.target && e.target.value && e.target.value.length>1)
      {
        handleCustomerChange(e)
        const resData = await FindCustomers({customerName:customerText}, {myToken:session[0].token, myId:session[0]._id})
      if(resData && resData.length)
        setCustomerFound(resData)
      }
      else
      {
        setCustomerFound(ConstumerSchema)

      }
    
  }
  const handleAddNew =()=>{
    toggleSaleStarted()
    let searchE = document.getElementById('searchTextbar')
    searchE.focus()
  }

  const handleCancelSale = ()=>{
    if(location.query && location.query.saleID )
    {
      route.replace('/saleclassic', undefined, { shallow: true });
      setSaleEdit(false)
      setSaleRec({})
    }
    resetEveryThing()
    dispatchSnack({type:'OTHER', message:'Sale Cancelled', msgColor:'warning'})
  
  }

  const handleStockQty = async ()=>{
    let itemsRet=[]
    if(!saleEditing)
    {
        for (let i=0; i<items.length;i++)
        {
            await UpdateItem(items[i]._id, {qty:parseInt(items[i].qty), type:'SALE'}, {myToken:session[0].token, myId:session[0]._id})
            itemsRet.push({id:items[i]._id, name:items[i].itemName, qty:items[i].qty, price:items[i].sPrice})
        }
    }
    else if(items.length)
    {
      let newItems=[]

      let oldOders = saleRec.orders
      let newOrders = items

      //item added
     loop1: 
        for(let i=0;i<newOrders.length;i++)
      {
      loop2:  
          for (let j=0;j<oldOders.length;j++)
        {
          if(oldOders[j]._id === newOrders[i]._id)
          {
            if(oldOders[j].qty === newOrders[i].qty)
                  break loop2;
            else
              {
                 const addedQty = parseInt(newOrders[i].qty) - parseInt(oldOders[j].qty)
                 newItems.push({...newOrders[i], qty:addedQty})
                 break loop2;
              }
          }
          if(oldOders[j]._id !== newOrders[i]._id && j===oldOders.length-1)
          {
            newItems.push({...newOrders[i], qty:parseInt(newOrders[i].qty)})
          }
        }
      
      }

    //item deleted
    loop1: 
     for (let i =0; i< oldOders.length;i++)
        {
        loop2:
          for(let j=0;j<newOrders.length;j++)
          {
            if(oldOders[i]._id === newOrders[j]._id && newOrders[j].qty === oldOders[i].qty)
            {
              break loop2
            }
            if(newOrders[j]._id !== oldOders[i]._id && j === newOrders.length-1)
            {
              const found = newItems.find(item=>item._id === oldOders[i]._id)
              if(!found)
                 newItems.push({...oldOders[i], qty:-parseInt(oldOders[i].qty)})
            }
          }
        }
      for (let i=0; i<newItems.length;i++)
      { 
        itemsRet.push({id:newItems[i]._id, name:newItems[i].itemName, qty:newItems[i].qty, price:newItems[i].sPrice ? newItems[i].sPrice:newItems[i].price})
        await UpdateItem(newItems[i]._id, {qty:newItems[i].qty, type:'SALE', myToken:session[0].token, myId:session[0]._id})
      }
    }
    else
    {
      let orders = saleRec.orders
      for(let i=0;i<orders.length;i++)
      {
        itemsRet.push({id:orders[i]._id, name:orders[i].itemName, qty:-orders[i].qty, price:orders[i].sPrice ? orders[i].sPrice:orders[i].price})
        await UpdateItem(orders[i]._id, {qty:-orders[i].qty, type:'SALE', myToken:session[0].token, myId:session[0]._id})
      }
    
    }
    return itemsRet
  }

  const handleCheckoutConfirm = async ()=>{
    let purchaseAmount = 0
    let desc = descriptionTxt
    let newItems=[]
    let prevReceivedAmount = 0
    let totalDisc = totalValues.furtherDisc+totalValues.unitDiscount
    let customerInfo = {name:'MISC', id:1}
    let customerE = document.getElementById('customerTxt')
   
      if(saleEditing && (customerE.value.trim()==='' || customerE.value.toUpperCase() === saleRec.customerInfo.name.toUpperCase()) )
      {
        customerInfo=saleRec.customerInfo
      }
       
      else if(customerE.value.toUpperCase() !=='MISC' && customerE.value.trim() !=='' )
      {
        const index = customerFound.findIndex(customer=>  customer.customerName.toUpperCase() === customerE.value.toUpperCase())
        if(index>=0)
        {
          customerInfo={name:customerFound[index].customerName, id:customerFound[index].customerID}
        }
        else
        {
          dispatchSnack({type:'OTHER', message:'Enter Valid Customer Name or Leave Empty for default Name', msgColor:'error'})
          return null
        }
      }

    dispatchLoading({type:'CHECKOUTSTART'})

    if(saleEditing)
    {
      prevReceivedAmount = saleRec.amountReceived
    }
    let cashReceived= document.getElementById('cashReceivedTxt')

    let payStatus ='PAID'
    let saleStatus = 'COMPLETE'

    if(!saleEditing)
    {
      if(!cashReceived || !cashReceived.value || cashReceived.value==='' || isNaN(cashReceived.value))
      {
        cashReceived.value=totalValues.grandTotal
      }
      else if(parseInt(cashReceived.value) === 0 )
      {
        payStatus='UNPAID'
      }
      else if(parseInt(cashReceived.value) < totalValues.grandTotal)
      {
        payStatus='PARTIALPAID'
      }
    }
    else
    {

      if(saleRec.paymentStatus==='PARTIALPAID' || saleRec.paymentStatus ==='UNPAID' )
      {
        if(!cashReceived || !cashReceived.value || cashReceived.value==='' || isNaN(cashReceived.value))
        {
         cashReceived.value=prevReceivedAmount
         if(prevReceivedAmount >= totalValues.grandTotal)
         {
              payStatus ='PAID'
              cashReceived.value =totalValues.grandTotal
         }
         else if (prevReceivedAmount < totalValues.grandTotal && prevReceivedAmount>0)
         {
          payStatus = 'PARTIALPAID'
          cashReceived.value = prevReceivedAmount
         }
         else if (prevReceivedAmount < totalValues.grandTotal && prevReceivedAmount===0)
         {
          payStatus = 'UNPAID'
          cashReceived.value = 0
         }
         else 
         {
          payStatus=saleRec.paymentStatus
         }
        }
        else if((parseInt(cashReceived.value) + prevReceivedAmount) >= totalValues.grandTotal )
        {

          payStatus = 'PAID'
          cashReceived.value =totalValues.grandTotal
        }
        else if(parseInt(cashReceived.value)>0)
        {
          payStatus='PARTIALPAID'
          cashReceived.value= parseInt(cashReceived.value)+prevReceivedAmount
        }
        else{
          payStatus=saleRec.paymentStatus
          cashReceived.value=prevReceivedAmount
        }
      }
      else if(saleRec.paymentStatus === 'PAID')
      {
      
        if(!cashReceived || !cashReceived.value || cashReceived.value==='' || (isNaN(cashReceived.value) && !(parseInt(cashReceived.value) < 0) ))
        {
         payStatus=saleRec.paymentStatus
         cashReceived.value=totalValues.grandTotal
        }
     
        else if(parseInt(cashReceived.value)+prevReceivedAmount >= totalValues.grandTotal && !(parseInt(cashReceived.value) < 0)){

              cashReceived.value =totalValues.grandTotal
              payStatus='PAID'
        }

        else if(parseInt(cashReceived.value)+prevReceivedAmount < totalValues.grandTotal && !(parseInt(cashReceived.value) < 0))
        {
           const receivedMoney = parseInt(cashReceived.value)+prevReceivedAmount
          cashReceived.value = receivedMoney
        }
        else if(parseInt(cashReceived.value)<0)
        {
          cashReceived.value = 0
          payStatus='UNPAID'
          let checkunitDisc =0
          if(saleRec && saleRec.orders && saleRec.orders.length)
          {
     
            for (let i =0 ; i<saleRec.orders.length;i++)
          {
            checkunitDisc +=saleRec.orders[i].unitDisc*saleRec.orders[i].qty
          }
          }     
          totalDisc=checkunitDisc
        }
      }
    }

    for (let i =0; i<items.length;i++)
    {
       purchaseAmount += items[i].pPrice*items[i].qty
       newItems.push({_id:items[i]._id,qty:parseInt(items[i].qty), itemName:items[i].itemName, price:items[i].sPrice, pPrice:items[i].pPrice, unitDisc:items[i].discount })
    }

    if(saleEditing)
    {
      if (saleRec.saleStatus==='RETURN')
        {
          saleStatus='RETURN'
          payStatus='RETURN'
          cashReceived.value = totalValues.grandTotal
        }
    }
     let itemsRec=await handleStockQty()
    let res, incomeRes
    if(saleEditing)
    {
      const getOtherAmount= AddOtherAmount()
       res =await UpdateSale(saleRec._id, {saleID:saleRec.saleID, saleStatus:saleStatus, orders:newItems, soldBy:saleRec.soldBy, customerInfo:customerInfo,
         subTotal:totalValues.subTotal, discount:totalDisc,pAmount:purchaseAmount, otherAmount:getOtherAmount, gst:totalValues.gst, paymentStatus:payStatus, desc,
         gTotal:totalValues.grandTotal, amountReceived:cashReceived.value}, {myToken:session[0].token, myId:session[0]._id })

      if(saleRec.paymentStatus==='UNPAID' && payStatus!=='UNPAID' && !itemsRec.length)
      for (let i=0;i<newItems.length;i++)
      {
        itemsRec.push({id:newItems[i]._id, name:newItems[i].itemName, price:newItems[i].price, qty:newItems[i].qty})
      }

      if(res && res.message && res.message ==='SUCCESS')
      {
        let cashAmount =  parseInt(cashReceived.value) - saleRec.amountReceived

        if(saleRec.saleStatus==='RETURN')
        {
          if(saleRec.gTotal !== totalValues.grandTotal && totalValues.grandTotal!==0)
          {  
            incomeRes = await AddIncome({cat:'SALERETURN', title:`FromSALEID:${res.saleID}`, amount:totalValues.grandTotal, status:'COMPLETE', customer:customerInfo, 
            addedBy:session[0].username, isDeleted:false, sales:[{saleID:res.saleID}], items:itemsRec, myToken:session[0].token, myId:session[0]._id}) 
          }
        }
        else if(cashAmount!==0 && cashAmount !=='')
            {
                incomeRes = await AddIncome({cat:'SALES', title:`FromSALEID:${res.saleID}`,  amount:cashAmount, status:'COMPLETE', customer:customerInfo, 
                addedBy:session[0].username, isDeleted:false, sales:[{saleID:res.saleID}], items:itemsRec, myToken:session[0].token, myId:session[0]._id}) 
            }
        dispatchSnack({type:'OTHER', message:'Sale Updated', msgColor:'success'})
      }
      else 
        dispatchSnack({type:'OTHER', message:'Error occurred', msgColor:'error'})
    }
    else
    {

      const getOtherAmount= AddOtherAmount()
    
      res = await AddSale({saleStatus:saleStatus, orders:newItems, soldBy:session[0].username, customerInfo:customerInfo,
      subTotal:totalValues.subTotal, discount:totalDisc, pAmount:purchaseAmount, otherAmount:getOtherAmount, gst:totalValues.gst, desc,
       paymentStatus:payStatus, gTotal:totalValues.grandTotal, amountReceived:cashReceived.value, myToken:session[0].token, myId:session[0]._id})
      
       if(res && res.message && res.message ==='SUCCESS')
       {  
          if(parseInt(cashReceived.value)!==0)
          {
            incomeRes = await AddIncome({cat:'SALES', title:`FromSALEID:${res.saleID}`, amount:cashReceived.value, customer:customerInfo, status:'COMPLETE',
             addedBy:session[0].username, isDeleted:false, sales:[{saleID:res.saleID}], items:itemsRec, myToken:session[0].token, myId:session[0]._id})  
          } 
          
          dispatchSnack({type:'OTHER', message:'Sale Completed', msgColor:'success'})
       }
             
       else 
       dispatchSnack({type:'OTHER', message:'Error occurred', msgColor:'error'})
    }

  
    resetCart()
    setFoundItems([])
    handleReset()
    setSaleEdit(false)
    await dispatchDialog({type:"CLOSEMSG"})
    dispatchTotal({type:'RESET'})
    setDescText('')
    if(location.query && location.query.saleID )
    {
      route.replace('/saleclassic', undefined, { shallow: true });
      setSaleEdit(false)
      setSaleRec()
    }

    setCustomerFound(ConstumerSchema)
    dispatchLoading({type:'CHECKOUTEND'})
    const url=`/prints/printsale?saleID=${res.saleID}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
  }
  const SuspendSales =()=>{
    SetLocalStorage()
    resetEveryThing()
    dispatchSnack({type:'OTHER', message:'Sale Suspended', msgColor:'info'})
  }

  const handleDeleteSale = async()=>{
    dispatchLoading({type:'DELETESTART'})
    let res
  
    if(!items.length)
    {
     const itemsRec= await handleStockQty()
      res = await DeletePermanent(saleRec._id, {myToken:session[0].token, myId:session[0]._id})
      if(res.data.amountReceived!==0)
      await AddIncome({cat:'SALERETURN', title:`FromSALEID:${res.data.saleID}`, amount:-res.data.amountReceived,
       status:'COMPLETE', customer:res.data.customerInfo, addedBy:session[0].username, isDeleted:false, sales:[{saleID:res.data.saleID}], 
       items:itemsRec, myToken:session[0].token, myId:session[0]._id}) 
    }
    else
       res = await toggleDeleteSale (saleRec._id, true, {myToken:session[0].token, myId:session[0]._id})

    if(res && res.message && res.message === 'SUCCESS')
    {
      dispatchSnack({type:'OTHER', message:'Sale Deleted Successfully', msgColor:'warning'})
    }
    else
    {
      dispatchSnack({type:'OTHER', message:'Error Occurred while deleting Sale', msgColor:'error'})
    }
  
    if(location.query && location.query.saleID )
    {
      route.replace('/saleclassic', undefined, { shallow: true });
      setSaleEdit(false)
      setSaleRec({})
    }
    resetCart()
    setFoundItems([])
    handleReset()
    setPurchaseEdit(false)
    setCustomerFound(ConstumerSchema)
    dispatchDialog({type:"CLOSEMSG"})
    dispatchTotal({type:'RESET'})
    dispatchLoading({type:'DELETEEND'})
    handleCustomerReset()
  }


  const handleBtnClick = async (button)=>{
    if(button === 'CHECKOUT' || button==='UPDATE' || button === undefined)
    {
      if(items.length)
      {
       toggleSaleStarted()
       dispatchDialog({type:'OTHER', message:'', status:'checkout'})

      }
    }
    else if(button ==='SUSPEND' && items.length)
    {
      SuspendSales()
   
    }
    else if(button ==='DELETE')
    {

      toggleSaleStarted()
      dispatchDialog({type:'DELETESALE', message:`Confirm to Delete Sale with ID: ${saleRec.saleID}`, status:'DELETESALE'})
    }
   
  }
  const handleCloseDialog =()=>{
    toggleSaleStarted()
    dispatchDialog({type:"CLOSEMSG"})
    handleCustomerReset()
  }

  const startUpdateSale = async(query)=>{
    try
    {
      toggleSaleLoading()
      const res = await findonesale({saleID:parseInt(query.saleID), myToken:session[0].token, myId:session[0]._id})
      if(res && !saleEditing)
      {
        if(res.saleStatus==='RETURN')
        {
        dispatchSnack({type:'OTHER', message:'Editing Sale Return is Not allowed', msgColor:'warning'})        
          setTimeout(() => {
            toggleSaleLoading()
            route.back()
          }, 2000);
         
        }
       else
       {
        setSaleEdit(true)
        toggleSaleStarted()
        setSaleRec({...res})
        updatingSale(res.orders)
        dispatchTotal({type:'CALCFURTHER', items:res.orders, discount:res.discount, gst:res.gst})
        toggleSaleLoading()
       }   
      }
      else  
      {
        toggleSaleLoading()

        dispatchSnack({type:'OTHER', message:'No Sale was Found', msgColor:'info'})
        route.replace('/saleclassic', undefined, { shallow: true });
      }
   
    }catch(err)
    {
      toggleSaleLoading()
      dispatchSnack({type:'OTHER', message:'Some Error Occurred', msgColor:'error'})
    }


    
  }
  const GetProfit =()=>{
      if(items.length)
      {
        let totalPurchase =0, totalSale=0, discountGiven=0

        for(let i=0;i<items.length;i++)
        {
          totalPurchase+=items[i].pPrice*items[i].qty
          totalSale+=items[i].sPrice* items[i].qty
          discountGiven+=items[i].discount*items[i].qty
        }
        return (
          <ModalBox theme={theme.themes[theme.active]}>
           <Typography variant='body2'>Total Purchase : {totalPurchase}</Typography>
              <Typography variant='body2'>Sub Total Sale : {totalSale}</Typography>
              <Typography variant='body2'>Discount Given : {discountGiven}</Typography>
              <Typography variant='body2'>Grand Total : {totalSale - discountGiven}</Typography>
              <Typography variant='body2'>Profit: { totalSale - discountGiven- totalPurchase}</Typography>
          </ModalBox>

         
        )
       
      }
  }
  const toggleSearch = ()=>{
    toggleSearchBy()
  }

  const FindSales =(e)=>{
    e.preventDefault()
    const textfield = document.getElementById('findModalTextfield')
    toggleModal()
    if(textfield && textfield.value && !isNaN(textfield.value))
    {
      route.replace({ path: 'saleclassic', query: {editing:true, saleID: textfield.value  }})
    } 
  }



  const handleUserKeyPress = useCallback(e => {
    if((e.ctrlKey || e.metaKey) && e.key === 'b' && btnAddNewRef.current && !btnAddNewRef.current.disabled)
      {
        e.preventDefault()
        btnAddNewRef.current.click()
     }

     if((e.ctrlKey || e.metaKey) && e.key === 'c' && btnCancelRef.current && !btnCancelRef.current.disabled)
     {
       e.preventDefault()
       btnCancelRef.current.click()
    }

     if((e.altKey || e.metaKey) && e.key === 's' && btnSuspendRef.current && !btnSuspendRef.current.disabled)
    {
      e.preventDefault()
      btnSuspendRef.current.click()
    }


      if((e.ctrlKey || e.metaKey) && e.key === 's' && btnCheckoutRef.current && !btnCheckoutRef.current.disabled)
    {
      e.preventDefault()
      btnCheckoutRef.current.click()
    }

      if( (e.ctrlKey || e.metaKey) && e.key === 'Enter' && btnConfirmCheckout.current && !btnConfirmCheckout.current.disabled && !isLoading.Checkout && !isLoading.Delete)
    {
      e.preventDefault()
      btnConfirmCheckout.current.click()  
    }
    if( (e.ctrlKey || e.metaKey) && e.key === 'q')
    {
      e.preventDefault()
      toggleShowPurchaseRate() 
    }
      if( (e.ctrlKey || e.metaKey) && e.key === 'f' )
    {
      e.preventDefault()
      toggleModal()
    }
     if( (e.ctrlKey || e.metaKey) && e.key === '1' )
    {
        e.preventDefault()
        handleReset()
        toggleSearch()
    }
  
  }, []);

  const CalcGst =()=>{
    let total = totalValues.gst * totalValues.grandTotal/100
    return Math.round(total)
  }
  const CalculateRemaining=(e)=>{
    let money = e.target.value
    if (!isNaN(money))
    {
      money= parseInt(money)
      dispatchTotal({type:'CHANGE', money})
    }
    else
    dispatchTotal({type:'CHANGE', money:0})
  }
  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
        window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [handleUserKeyPress]);

  useEffect(()=>{
    if(location.query)
    {
      if(location.query.editing && !saleEditing && location.query.editing)
      {
        const saleid = location.query.saleID
        const query= {saleID:saleid}
        startUpdateSale(query)
      }
      else if(location.query.suspendediting)
      { LoadSuspended()}
    }
  },[location])

  useEffect(()=>{
    if(openDialog.isOpen)
    {
      let val = {target:{value:'MISC'}}
      if(saleEditing)
      {
        val.target.value = saleRec.customerInfo.name
        handleCustomerSearch(val)
        setDescText(saleRec.desc ? saleRec.desc : '')
        
      }

    }
  },[openDialog.isOpen ])

    useEffect(()=>{
      dispatchTotal({type:'CALC', items, furtherDisc:0, saleEditing, saleRec})
    }, [JSON.stringify(items)])


  return (
    <StyledBoxMain>
    <Header name={saleEditing ? `UPDATE SALE ID: ${saleRec && saleRec.saleID}` :'MANAGE SALES'} />
    <React.Fragment>
    <StyledBox flex={4}  >
    <StyledSearchPaper theme={theme.themes[theme.active]}  elevation={10}>
    <form onSubmit={addItemtoCart}>
    <StyledSearchTextPaper theme={theme.themes[theme.active]}  elevation={6}>

    <Autocomplete
    id="searchTextbar"
    value={text}
    name='itemName'
    disableClearable
    freeSolo
    filterOptions={x => x}
    onSelect={e=>handleSearch(e)}
    options={itemsFound.map((item) =>`${item.itemName}|Rs.${item.sPrice}|Qty:${item.qty}|${item.model}${showPurchaseRate ?  '|Rs. ' + item.pPrice:''}`)}
    noOptionsText="Not Found"
    renderOption={(props) => {
    const wordArray = props.key.split("|");
    return (
      <div key={props.key}>
      <span {...props}>
      {wordArray.map((word, i)=>
      <React.Fragment key={word}>
      <SpanOptions style={{color:i===0 ? "#936b5e": i === 1 ? '#2B7A0B': i===2 ? "#525E75" : i === 4 && "#FF5B00"}}> 
      { word }|&nbsp;
       </SpanOptions> 
      </React.Fragment>
      )}
      </span>
      <Divider  variant='middle'/>
      </div>

  
    );
  }}
    sx={{ width: '100%'}}
    renderInput={(params) => {
      const {InputLabelProps,InputProps,...rest} = params;
      return <SearchInputStyle theme={theme.themes[theme.active]} {...params.InputProps} {...rest}  placeholder={searchByID ? 'Search By ID...': 'Search By Name....'} />}}
    />
    
    <SearchOtherField theme={theme.themes[theme.active]} >
    <Divider orientation='vertical' flexItem variant='middle'/>
    <OtherInputStyle theme={theme.themes[theme.active]}  placeholder='Qty'  id='qtyInput'  />
    <Divider orientation='vertical' flexItem variant='middle'/>
    <OtherInputStyle theme={theme.themes[theme.active]}  placeholder='Disc' id ='discInput' />
    <Divider orientation='vertical' flexItem variant='middle'/>
    <IconBtnDivStyle theme={theme.themes[theme.active]} >
    <IconButton type="submit" sx={{ p: '08px' }} aria-label="search">
    <AddShoppingCartIcon />
    </IconButton>
    </IconBtnDivStyle>

    </SearchOtherField>

    </StyledSearchTextPaper>
    </form>
    
    <StyledOtherBtnsPaper elevation={4}>
    <StyledOtherBtn variant='contained' disabled={!saleStarted} ref={btnCancelRef} onClick={handleCancelSale} color='error' endIcon={<CancelIcon />}>Cancel</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={!saleStarted} ref={btnSuspendRef} onClick={()=>saleEditing ? handleBtnClick('DELETE'):handleBtnClick('SUSPEND')} color='warning' endIcon={<RemoveShoppingCartIcon />}>{ saleEditing ? 'DELETE' :'SUSPEND'}</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={saleStarted} ref={btnAddNewRef} onClick={handleAddNew} color='success' endIcon={<AddIcon />}>New</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={!saleStarted} ref={btnCheckoutRef} color='success' endIcon={<ShoppingCartCheckoutIcon />} 
    onClick={()=> !isLoading.Checkout && handleBtnClick('CHECKOUT')}>{ saleEditing ? 'UPDATE' : "CHECKOUT"}
    </StyledOtherBtn>
       
    </StyledOtherBtnsPaper>

    </StyledSearchPaper>

    <StyledCartPaper theme={theme.themes[theme.active]}  elevation={10}>
    <StyleCartPaperHeader theme={theme.themes[theme.active]}>
    <StyledCartBoxTitles theme={theme.themes[theme.active]}>
    <StyledTypographyHeader theme={theme.themes[theme.active]}  variant='body1' sx={{width:'10% '}}>
      Sr.
      </StyledTypographyHeader>
      
      <StyledTypographyHeader theme={theme.themes[theme.active]}  variant='body1'  sx={{width:'90% '}} >
      Item
      </StyledTypographyHeader>
      <StyledTypographyHeader theme={theme.themes[theme.active]}  variant='body1'  sx={{width:'20% '}}>
      Rate
      </StyledTypographyHeader>
      <StyledTypographyHeader theme={theme.themes[theme.active]} variant='body1'   sx={{width:'20% '}}>
      Qty
      </StyledTypographyHeader>
      <StyledTypographyHeader theme={theme.themes[theme.active]} variant='body1'   sx={{width:'20% '}}>
      Disc
      </StyledTypographyHeader>
      <StyledTypographyHeader theme={theme.themes[theme.active]} variant='body1'  sx={{width:'30% '}}>
      Total
      </StyledTypographyHeader>
    </StyledCartBoxTitles>

    <StyledIconButtonBox>
    </StyledIconButtonBox>
    </StyleCartPaperHeader>
    
    <Divider />
    
    {items.map((item, i)=>
      <StyledCartPaperTitle key={i} elevation={2} theme={theme.themes[theme.active]} >
      <StyledCartBoxTitles theme={theme.themes[theme.active]} >
      <StyledTypographyItems theme={theme.themes[theme.active]} variant='body2' sx={{width:'10% '}}>
      {i+1}
      </StyledTypographyItems>
        <StyledTypographyItems theme={theme.themes[theme.active]} variant='body2'  sx={{width:'90% '}}>
        {item.itemName}
        </StyledTypographyItems>
        <StyledTypographyItems theme={theme.themes[theme.active]} variant='body2' sx={{width:'20% '}}>
        {item.sPrice}
        </StyledTypographyItems>
        <StyledTypographyItems theme={theme.themes[theme.active]} variant='body2' sx={{width:'20% '}}>
        {item.qty}
        </StyledTypographyItems>
        <StyledTypographyItems theme={theme.themes[theme.active]} variant='body2' sx={{width:'20% '}}>
        {item.discount*item.qty}
        </StyledTypographyItems>
        <StyledTypographyItems theme={theme.themes[theme.active]} variant='body2' sx={{width:'30% '}}>
          {item.unitDisc ? item.subTotal-item.unitDisc*item.qty : parseInt(item.qty)*item.sPrice-parseInt(item.qty)*item.discount}
        </StyledTypographyItems>
      </StyledCartBoxTitles>

        <StyledIconButtonBox >
        
        <IconButton onClick={()=>handleUpdateQty(i, -1)} disabled={item.qty<2} >
        <RemoveCircleIcon  sx={{color:theme.themes[theme.active].text}} />
        </IconButton>
        <IconButton onClick={()=>handleUpdateQty(i, 1)}>
        <AddCircleIcon sx={{color:theme.themes[theme.active].text}}  />
        </IconButton>
   
        <IconButton onClick={()=>deleteFromCart(i)} >
        <DeleteIcon sx={{color:theme.themes[theme.active].down}}/>
        </IconButton>
        </StyledIconButtonBox>

        </StyledCartPaperTitle>
    )}

    </StyledCartPaper>
    </StyledBox>

    <StyledBoxTotal flex={2}> 
    
    <StyledTotalPaper elevation={4} theme={theme.themes[theme.active]} >
    <StyledTotalTypography theme={theme.themes[theme.active]} >
       Sub Total : {totalValues.subTotal}
    </StyledTotalTypography>
    <DividerStyle variant='middle'  flexItem  theme={theme.themes[theme.active]}/>
    <StyledTotalTypography theme={theme.themes[theme.active]} >
       Discount :    {totalValues.unitDiscount+totalValues.furtherDisc}
    </StyledTotalTypography>
    <DividerStyle variant='middle'  flexItem theme={theme.themes[theme.active]}/>
   {totalValues.gst ?  <StyledTotalTypography theme={theme.themes[theme.active]} >
       GST {totalValues.gst}% :   {CalcGst()}
    </StyledTotalTypography >:null}
    <DividerStyle variant='middle'  flexItem  theme={theme.themes[theme.active]}/>
    <StyledTotalTypography className={!saleEditing && 'lastTotal'} theme={theme.themes[theme.active]} >
       Grand total :   {totalValues.grandTotal+CalcGst()}
    </StyledTotalTypography >

    {saleEditing &&
    <React.Fragment>
    <DividerStyle variant='middle'  flexItem theme={theme.themes[theme.active]}/>
    <StyledTotalTypography theme={theme.themes[theme.active]} >
       Cash Received :   {saleRec && saleRec.amountReceived}
    </StyledTotalTypography>
    <DividerStyle variant='middle'  flexItem theme={theme.themes[theme.active]} />
    <StyledTotalTypography className='lastTotal' theme={theme.themes[theme.active]} >
       Remaining Cash :   {saleRec && totalValues.grandTotal-saleRec.amountReceived}
    </StyledTotalTypography>
    </React.Fragment>
    }

  </StyledTotalPaper>
  </StyledBoxTotal>
    </React.Fragment>
  

          {/* Snackbar Alert is here */}
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
        onClose={handleCloseDialog}
        aria-labelledby="dialoge-title">
        <DialogTitleStyle id='dialoge-title' >{openDialog.message}</DialogTitleStyle>
        {openDialog.status !== 'DELETESALE' &&
        <DialogContentStyle>
      
        <StyledTotalPaper elevation={4} theme={theme.themes[theme.active]}>
        
        <StyledTotalTypography theme={theme.themes[theme.active]}>
          Sub Total :  {totalValues.subTotal}
        </StyledTotalTypography>
        <Divider variant='middle'  flexItem />
        <StyledTotalTypography theme={theme.themes[theme.active]}>
          Discount :    {totalValues.unitDiscount+totalValues.furtherDisc}
        </StyledTotalTypography >
        <Divider variant='middle'  flexItem />
        {totalValues.gst ? <StyledTotalTypography theme={theme.themes[theme.active]} >
       GST {totalValues.gst}% :   {CalcGst()}
        </StyledTotalTypography >:null}
        <Divider variant='middle'  flexItem />
        <StyledTotalTypography theme={theme.themes[theme.active]}>
          Grand total :   {totalValues.grandTotal+CalcGst()}
        </StyledTotalTypography>
        {saleEditing && 
          <React.Fragment>
          <Divider variant='middle'  flexItem />
          <StyledTotalTypography theme={theme.themes[theme.active]}>
             Cash Received :   {saleRec && saleRec.amountReceived}
          </StyledTotalTypography>
          <Divider variant='middle'  flexItem />
          <StyledTotalTypography theme={theme.themes[theme.active]}>
             Remaining Cash :   {saleRec && totalValues.grandTotal-saleRec.amountReceived}
          </StyledTotalTypography>
          </React.Fragment>
          }
          <Divider variant='middle'  flexItem />
          <StyledTotalTypography theme={theme.themes[theme.active]}>
          Change :   {!saleEditing ? totalValues.change: totalValues.change}
        </StyledTotalTypography>
        </StyledTotalPaper>
        

        <Autocomplete
          id="customerTxt"
          value={customerText}
          name='customerName'
          freeSolo
          disableClearable
          onSelect={e=>handleCustomerSearch(e)}
          options={customerFound.map((customer) =>customer.customerName)}
          filterOptions={x => x}
          sx={{ width: '100%' }}
          noOptionsText="Not Found"
          renderInput={(params) => {
          const {InputLabelProps,InputProps,...rest} = params;
          return <InputBase {...params.InputProps} sx={{borderBottom:'0.5px solid'}} id='inputBaseCustomerFound' fullWidth {...rest} placeholder='MISC'    
          endAdornment= {
          <IconButton>
          <SendIcon color='primary'/>
          </IconButton>
          }/>}}/>

          <TextField
            margin="dense"
            id="furtherDiscText"
            label="Discount"
            fullWidth
            variant="standard"
            InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={addFurtherDisc}>
                  <DiscountIcon color='primary'/>
                </IconButton>
              </InputAdornment>
            )
           }}
          />

          <TextField
          margin="dense"
          id="descText"
          label="Description"
          fullWidth
          onChange={e=>setDescText(e.target.value)}
          variant="standard"
          value={descriptionTxt}
          InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton>
                <Description color='primary'/>
              </IconButton>
            </InputAdornment>
          )
          }}
        />
  
          <TextField
            autoFocus
            margin="dense"
            onChange={e=>CalculateRemaining(e)}
            id="cashReceivedTxt"
            label="Cash Received"
            fullWidth
            variant="standard"
            InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton>
                  <AttachMoneyIcon color='primary'/>
                </IconButton>
              </InputAdornment>
            )
            }}
          />

          
          {/* other amount and gst here */}
            <TextField
            autoFocus
            margin="dense"
            id="gstPercentage"
            label="GST Percentage"
            fullWidth
            defaultValue={totalValues.gst}
            variant="standard"
            
            InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton onClick={AddGST}>
                  <Gavel color='primary'/>
                </IconButton>
              </InputAdornment>
            )
            }}
          />
          <div style={{display:'flex', gap:5}}>
          <TextField
            autoFocus
            margin="dense"
            id="otherAmountText"
            label="Other Charges Title"
            fullWidth
            variant="standard"
          />
            <TextField
            autoFocus
            margin="dense"
            id="otherAmount"
            label="Amount"
            fullWidth
            variant="standard"
          />
          </div>

        </DialogContentStyle>
      }
        <DialogActionStyle > 
        <IconButton onClick={()=>!(isLoading.Checkout || isLoading.Delete) && openDialog.status!=='DELETESALE' ? handleCheckoutConfirm() : (openDialog.status==='DELETESALE' && !isLoading.Delete) && handleDeleteSale() } ref={btnConfirmCheckout} disabled={!openDialog.isOpen}>
         {(isLoading.Checkout || isLoading.Delete) ? <CircularProgress /> :   <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
        </IconButton>
        <IconButton onClick={handleCloseDialog}>
            <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
        </IconButton>
        </DialogActionStyle>
        </Dialog>

        <Modal
          open={openModal}
          onClose={toggleModal}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description">
         <form onSubmit={e=>FindSales(e)}>
          { !saleStarted ? <ModalBox theme={theme.themes[theme.active]}>
          <TextField size='small' autoFocus variant='outlined' id='findModalTextfield' 
          placeholder='Search Sale ID'
            className='modalTextfield'
            InputProps={{
            endAdornment: (
              <IconButton type='submit'>
                <FindInPage color='success'  />
              </IconButton>)}}/>
          <SuspendedSales type='SALE' />
          </ModalBox> : 
          GetProfit()
          }
          </form>
        </Modal> 

          <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={saleLoading}
        >
        <CircularProgress color='success' />
        </Backdrop>
    </StyledBoxMain>
  )
}

export default withRouter(SaleClassic)
