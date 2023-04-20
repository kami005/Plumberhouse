import React, {useState, useEffect, useRef, useReducer, useCallback, useContext} from 'react'
import {InputBase,IconButton, Divider, CircularProgress, Autocomplete, Snackbar,Alert, Dialog, TextField, InputAdornment, Modal, Backdrop} from '@mui/material'
import { StyledBoxMain,
  StyledSearchTextPaper, StyledCartPaperTitle,
  StyledCartPaper, StyledSearchPaper, StyledTypographyItems, 
  StyledBox, StyledTotalPaper, StyledIconButtonBox, StyledTotalTypography,
  StyledBoxTotal, StyledOtherBtnsPaper,StyledOtherBtn, DialogActionStyle, DialogTitleStyle, DialogContentStyle,
   StyledTypographyHeader, StyledCartBoxTitles, SearchInputStyle, OtherInputStyle, SearchOtherField, IconBtnDivStyle, StyleCartPaperHeader, ModalBox, SpanOptions
   } from '../styles/PurchasesStyle'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { grandTotalReducer, loadingReducer, useItemCartPurchase, useTextboxVal, useToggle, alertReducer, dialogReducer } from '../src/CustomHooks/RandHooks';
import { searchItems } from '../src/BackendConnect/ItemStorage';
import {CheckCircleOutline, CancelOutlined, Receipt, FindInPage} from '@mui/icons-material'
import { AddPurchase, UpdatePurchase, toggleDeleteBill, DeletePermanent } from '../src/BackendConnect/PurchaseStorage';
import { useRouter, withRouter } from 'next/router';
import { findoneBill } from '../src/BackendConnect/PurchaseStorage';
import { UpdateItem } from '../src/BackendConnect/ItemStorage';
import {FindSuppliers} from '../src/BackendConnect/SupplierStorage'
import Header from '../src/Components/HeaderText';
import { AddExpense } from '../src/BackendConnect/ExpenseStorage';
import { SessionContext } from '../src/Context/SessionContext';
import { v4 } from 'uuid';
import { SUSPENDSALEKEY } from '../src/DataSource/RandData';
import SuspendedSales from '../src/Components/SuspendedSales';

 const Purchases = (props) => {

  var location= props.router
  var route = useRouter()
  const btnAddNewRef = useRef()
  const btnCancelRef = useRef()
  const btnSuspendRef = useRef()
  const btnCheckoutRef = useRef()
  const btnConfirmCheckout = useRef()
  const [purchaseEditing, setPurchaseEdit] = useState(false)
  const [itemsFound, setFoundItems] = useState([])
  const [purchaseRec, setPurchaseRec] = useState()
  const [supplierFound, setSupplierFound] = useState([{name:'MISC', id:1}])
  const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Checkout:false, Delete:false})
  const [totalValues, dispatchTotal] = useReducer(grandTotalReducer, {subTotal:0, grandTotal:0})
  const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Purchase Cancelled', isOpen:false, msgColor:'error'})
  const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Cancel Sale', isOpen:false, msgColor:'warning', status:'cancel'})
  const [items, addtoCart, deleteFromCart, handleUpdateQty, resetCart, updatingSale, reloadSuspended] = useItemCartPurchase()
  const [text, handleChange, handleReset] = useTextboxVal()
  const [supplierText, handleSupplierChange, handleSupplierReset] =useTextboxVal()
  const [purchaseStarted, togglepurchaseStarted] =useToggle()
  const [searchByID, toggleSearchBy]= useToggle()
  const [openModal, toggleModal] = useToggle()
  const [purchaseLoading, togglePurchaseLoading]= useToggle()
  const context = useContext(SessionContext)
  const {session, theme} = context
 
  const resetEveryThing =()=>{
    resetCart()
    setFoundItems([])
    handleReset()
    togglepurchaseStarted()
    dispatchDialog({type:"CLOSEMSG"})
    dispatchTotal({type:'RESET'})
    handleSupplierReset()
  }


  const SetLocalStorage =async ()=>{
    const uuId =v4()
    let rowData=[]
    const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
    if(sale)
    rowData=sale
    if(rowData.length)
    localStorage.setItem(SUSPENDSALEKEY, JSON.stringify([...rowData, {id:uuId, itemCount:items.length, items:items, suspendedBy:session[0].username,
     gTotal:totalValues.gTotal,  subTotal:totalValues.gTotal, type:'PURCHASE', suspendedAt:new Date()}]))
     else
     localStorage.setItem(SUSPENDSALEKEY, JSON.stringify([{id:uuId, itemCount:items.length, items:items, suspendedBy:session[0].username,
      gTotal:totalValues.gTotal,  subTotal:totalValues.gTotal, type:'PURCHASE', suspendedAt:new Date()}]))


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
        togglepurchaseStarted()
        reloadSuspended(suspendedSaleData.items)
        dispatchTotal({type:'CALCSUSPEND', items:suspendedSaleData.items, furtherDisc:suspendedSaleData.furtherDisc})
      }
  }
  route.replace({ path: 'purchases'})
}


  const addItemtoCart =async (e)=>{
    e.preventDefault()
    let qtyE = document.getElementById('qtyInput')
    let discE= document.getElementById('discInput')
    let searchE = document.getElementById('searchTextbar')
    let unitPriceE= document.getElementById('unitpriceInput')
    var curItem
    

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
      else if (itemsFound.length)
      {
        curItem = itemsFound.filter(item=>text === item.itemName)
        if(!curItem || !curItem.length)
          return null
        if(isNaN(qtyE.value) || qtyE.value === '')
        qtyE.value=1
      if(isNaN(discE.value) || discE.value ==='')    
            discE.value=0
      if(!isNaN(unitPriceE.value) && unitPriceE.value !=='' && unitPriceE.value !== '0')
            curItem[0].pPrice=parseInt(unitPriceE.value)
        unitPriceE.value=''
        curItem[0].qty=qtyE.value
        curItem[0].discount= discE.value
        addtoCart(curItem[0])
        handleReset()
        
        qtyE.value=1
        discE.value=0
        setFoundItems([])
        searchE.focus()
      }
  }


  const handleSearch= async (e)=>{
    e.preventDefault()
    try
    {
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
    catch(err)
    {
      dispatchSnack({type:'OTHER', message:'Check your Connection', msgColor:'error'})
    }

  }


  const handleAddNew =()=>{
    togglepurchaseStarted()
    let searchE = document.getElementById('searchTextbar')
    searchE.focus()
  }

  const handleCancelSale = ()=>{
    if(location.query && location.query.purchaseID )
    {
      route.replace('/purchases', undefined, { shallow: true });
      setPurchaseEdit(false)
    }
    resetEveryThing()
    dispatchSnack({type:'OTHER', message:'Purchase Cancelled', msgColor:'warning'})
  
  }

  const handleCheckoutConfirm = async ()=>{
    try
    { 
      let newItems=[]
      let prevReceivedAmount = 0
      let supplierInfo = {name:'MISC', id:1}
      let supplierE = document.getElementById('supplierText')
      let supplierBillE = document.getElementById('supplierBill')
        if(purchaseEditing && (supplierE.value.trim()==='' || supplierE.value.toUpperCase() === purchaseRec.supplierInfo.name.toUpperCase()) )
        {
          supplierInfo=purchaseRec.supplierInfo
        }        
        else if(supplierE.value.toUpperCase() !=='MISC' && supplierE.value.trim() !=='' )
        {
          const index = supplierFound.findIndex(supplier=>  supplier.name.toUpperCase() === supplierE.value.toUpperCase())
          if(index>=0)
          {
            supplierInfo={name:supplierFound[index].name, id:supplierFound[index].id}
          }
          else
          {
            dispatchSnack({type:'OTHER', message:'Enter Valid Supplier Name or Leave Empty for default Name', msgColor:'error'})
            return null
          }
        }
       dispatchLoading({type:'CHECKOUTSTART'})
      if(purchaseEditing )
      {
        prevReceivedAmount = purchaseRec.paid
      }
      let cashPaid= document.getElementById('cashPaidTxt')
      let payStatus ='PAID'
      let purchaseStatus = 'COMPLETE'
  
      if(!purchaseEditing)
      {
        if(!cashPaid || !cashPaid.value || cashPaid.value==='' || isNaN(cashPaid.value))
        {
          cashPaid.value=totalValues.gTotal
        }
        else if(parseInt(cashPaid.value) === 0 )
        {
          payStatus='UNPAID'
        }
        else if(parseInt(cashPaid.value) < totalValues.gTotal)
        {
          payStatus='PARTIALPAID'
        }
      }
      else
      {
        if(purchaseRec.paymentStatus==='PARTIALPAID' || purchaseRec.paymentStatus ==='UNPAID' )
        {
          if(!cashPaid || !cashPaid.value || cashPaid.value==='' || (isNaN(cashPaid.value) && !(cashPaid.value<0)))
          {
            if(prevReceivedAmount >= totalValues.gTotal )
            {
              payStatus = 'PAID'
              cashPaid.value =totalValues.gTotal
            }
            else if (prevReceivedAmount < totalValues.gTotal && prevReceivedAmount===0)
            {
                payStatus='UNPAID'
                cashPaid.value=0
            }
            else if (prevReceivedAmount < totalValues.gTotal)
            {
                payStatus='PARTIALPAID'
                cashPaid.value=prevReceivedAmount
            }
          }
          else if(parseInt(cashPaid.value)+prevReceivedAmount>=totalValues.gTotal)
          {
            payStatus='PAID'
            cashPaid.value= totalValues.gTotal
          }
          else if(parseInt(cashPaid.value)+prevReceivedAmount<totalValues.gTotal && parseInt(cashPaid.value)+prevReceivedAmount===0)
          {
            payStatus='UNPAID'
            cashPaid.value= 0
          }
          else if(parseInt(cashPaid.value)+prevReceivedAmount<totalValues.gTotal)
          {
            payStatus='PARTIALPAID'
            cashPaid.value= parseInt(cashPaid.value)+prevReceivedAmount
          }
          else{
            payStatus=purchaseRec.paymentStatus
            cashPaid.value=purchaseRec.paid
          }
        }
        else if(purchaseRec.paymentStatus === 'PAID')
        { 
          if(!cashPaid || !cashPaid.value || cashPaid.value==='' || (isNaN(cashPaid.value) && !(parseInt(cashPaid.value) < 0) ))
          {
            
           payStatus=purchaseRec.paymentStatus
           cashPaid.value=totalValues.gTotal
          }
          else if (prevReceivedAmount+parseInt(cashPaid.value) >= totalValues.gTotal && !(parseInt(cashPaid.value) < 0)) 
          {
          
              payStatus ='PAID'
              cashPaid.value= totalValues.gTotal
          }
          else if (prevReceivedAmount+parseInt(cashPaid.value) < totalValues.gTotal && !(parseInt(cashPaid.value) < 0) ){
              if(prevReceivedAmount+parseInt(cashPaid.value) === 0)
              {
                payStatus ='UNPAID'
                cashPaid.value= prevReceivedAmount+parseInt(cashPaid.value)
              }
              else
              {
                payStatus ='PARTIALPAID'
                cashPaid.value= prevReceivedAmount+parseInt(cashPaid.value)
              }
          }
          else if(parseInt(cashPaid.value)<0)
          {
            cashPaid.value = 0
            payStatus='UNPAID'
          }
        }
      }

      for (let i =0; i<items.length;i++)
      {
         newItems.push({_id:items[i]._id,qty:parseInt(items[i].qty), itemName:items[i].itemName, price:items[i].price})
      }
       
      const itemsRec=await handleStockQtyPrice()
      if(purchaseEditing)
      {
        const res =await UpdatePurchase(purchaseRec._id, {purchaseID:purchaseRec.purchaseID, purchaseStatus:purchaseStatus, orders:newItems,
       procuredBy:purchaseRec.procuredBy, supplierInfo:supplierInfo, subTotal:totalValues.subTotal, 
        otherAmount:0, gst:0, paymentStatus:payStatus, gTotal:totalValues.gTotal, paid:cashPaid.value, supplierBill:supplierBillE.value }, {myToken:session[0].token, myId:session[0]._id})
        if(res && res.message && res.message ==='SUCCESS')
        {

          let cashAmount =  parseInt(cashPaid.value) - purchaseRec.paid

          if(purchaseRec.paymentStatus==='UNPAID' && payStatus!=='UNPAID' && !itemsRec.length)
          for (let i=0;i<newItems.length;i++)
          {
            itemsRec.push({id:newItems[i]._id, name:newItems[i].itemName, price:newItems[i].price, qty:newItems[i].qty})
          }

          if(cashAmount!==0)
            {
              await AddExpense({cat:'PURCHASES', title:`FromBillID:${res.purchaseID}`, amount:cashAmount, supplier:supplierInfo, status:'COMPLETE',
               addedBy:session[0].username, isDeleted:false, items:itemsRec, purchases:[{purchaseID:res.purchaseID}], myToken:session[0].token, myId:session[0]._id})  
            }
            const url=`/prints/printpurchase?purchaseID=${res.purchaseID}`
            window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
          dispatchSnack({type:'OTHER', message:'Purchase Updated', msgColor:'success'})
        }
          
        else 
          dispatchSnack({type:'OTHER', message:'Error occurred', msgColor:'error'})
      }
      else{
        const res = await AddPurchase({purchaseStatus:purchaseStatus, orders:newItems, procuredBy:session[0].username, supplierInfo:supplierInfo,
        subTotal:totalValues.subTotal, otherAmount:0, paymentStatus:payStatus, gTotal:totalValues.gTotal, paid:cashPaid.value, supplierBill:supplierBillE.value, myToken:session[0].token, myId:session[0]._id})
        
        if(res && res.message && res.message ==='SUCCESS')
         {

          if(parseInt(cashPaid.value)!==0)
          {
            await AddExpense({cat:'PURCHASES', title:`FromBillID:${res.purchaseID}`, amount:cashPaid.value, supplier:supplierInfo, status:'COMPLETE', addedBy:session[0].username,
             isDeleted:false, items:itemsRec, purchases:[{purchaseID:res.purchaseID},], myToken:session[0].token, myId:session[0]._id})  
          } 
          const url=`/prints/printpurchase?purchaseID=${res.purchaseID}`
            window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,width=600,height=800');
          dispatchSnack({type:'OTHER', message:'Purchase Completed', msgColor:'success'})
         }
         else 
          dispatchSnack({type:'OTHER', message:'Error occurred', msgColor:'error'})
      }

      resetCart()
      setPurchaseEdit(false)
      setFoundItems([])
      handleReset()
      dispatchDialog({type:"CLOSEMSG"})
      dispatchTotal({type:'RESET'})
      handleSupplierReset()

      if(location.query && location.query.purchaseID )
      {
        route.replace('/purchases', undefined, { shallow: true });
        setPurchaseEdit(false)
      }
      dispatchLoading({type:'CHECKOUTEND'})
    }
    catch (err)
    {
      console.log(err)
      dispatchSnack({type:'OTHER', message:'Error occurred contact Developer', msgColor:'error'})
      dispatchDialog({type:"CLOSEMSG"})
      dispatchLoading({type:'CHECKOUTEND'})
    }
   
  }


  const handleCloseDialog =()=>{
    togglepurchaseStarted()
    dispatchDialog({type:"CLOSEMSG"})
    handleSupplierReset()
  }

  const startUpdateSale = async(query)=>{
    try
    {
      togglePurchaseLoading()
      const res = await findoneBill({purchaseID:query.purchaseID, myToken:session[0].token, myId:session[0]._id})
      if(res)
      {
        togglePurchaseLoading()
        setPurchaseEdit(true)
        togglepurchaseStarted()
        setPurchaseRec({...res})
        updatingSale(res.orders)
      }
      else
      {
        dispatchSnack({type:'OTHER', message:'No Purchase was Found', msgColor:'info'})
        togglePurchaseLoading()
        route.replace('/purchases', undefined, { shallow: true });
      }
    }
    catch(err)
    {
      togglePurchaseLoading()
      dispatchSnack({type:'OTHER', message:'Some Error Occurred', msgColor:'error'})
    }


  }

const handleBtnClick=async (btnName)=>{
  if(btnName ==='CHECKOUT' || btnName ==='UPDATE' || btnName===undefined)
  {
    if(items.length)
    {
      togglepurchaseStarted()
      await dispatchDialog({type:'OTHER', message:'', status:'checkout'})

      if(purchaseEditing)
      {
        let supplierE = document.getElementById('supplierText')
        supplierE.value=purchaseRec.supplierInfo.name
        let supplierBillE = document.getElementById('supplierBill')
        if(purchaseRec.supplierBill)
          supplierBillE.value = purchaseRec.supplierBill
      }
    }

  }
  else if(btnName ==='SUSPEND' && items.length)
  {
    SetLocalStorage()
    resetEveryThing()
    dispatchSnack({type:'OTHER', message:'Purchase Suspended', msgColor:'info'})
  }
  else if (btnName ==='DELETE')
  {
      togglepurchaseStarted()
      dispatchDialog({type:'DELETESALE', message:`Confirm to Delete Bill with ID: ${purchaseRec.purchaseID}`, status:'DELETESALE'})
  }
}
const handleDeleteBill=async ()=>{
  try
  {
    dispatchLoading({type:'DELETESTART'})
    let res
    if(!items.length)
    {
     const itemsRec= await handleStockQtyPrice()
      res = await DeletePermanent(purchaseRec._id, {myToken:session[0].token, myId:session[0]._id})
      if(res.data.paid!==0)
      await AddExpense({cat:'PURCHASERETURN', title:`FromBillID:${res.data.purchaseID}`,
      amount:-res.data.paid, status:'COMPLETE', 
      supplier:res.data.supplierInfo, addedBy:session[0].username, isDeleted:false, items:itemsRec, purchases:[{purchaseID:res.data.purchaseID}],
       myToken:session[0].token, myId:session[0]._id})  
    }
  else
     res = await toggleDeleteBill (purchaseRec._id, true, {myToken:session[0].token, myId:session[0]._id})

    if(res && res.message && res.message === 'SUCCESS')
    {
      dispatchSnack({type:'OTHER', message:'Bill Deleted Successfully', msgColor:'warning'})
    
    }
    else
    {
      dispatchSnack({type:'OTHER', message:'Error Occurred while deleting Bill', msgColor:'error'})
    }
  
  
    if(location.query && location.query.purchaseID )
    {
      route.replace('/purchases', undefined, { shallow: true });
      setPurchaseEdit(false)
    }
    resetCart()
    setFoundItems([])
    handleReset()
    setPurchaseEdit(false)
  
    dispatchDialog({type:"CLOSEMSG"})
    dispatchTotal({type:'RESET'})
    dispatchLoading({type:'DELETEEND'})
  }
  catch(err)
  {
    dispatchDialog({type:"CLOSEMSG"})
    dispatchSnack({type:'OTHER', message:'Error Occurred while deleting Bill', msgColor:'error'})
    dispatchLoading({type:'DELETEEND'})
  }

}
const handleStockQtyPrice = async ()=>{
  let itemsRec=[]
  if(!purchaseEditing)
  {

      for (let i=0; i<items.length;i++)
      {
        itemsRec.push({id:items[i]._id, name:items[i].itemName, qty:items[i].qty, price:items[i].pPrice ? items[i].pPrice:items[i].price})
        await UpdateItem(items[i]._id, {qty:parseInt(items[i].qty), price:items[i].price, myToken:session[0].token, myId:session[0]._id})
      }
  }
  else if(items.length)
  {
    let newItems=[]
    let oldOders = purchaseRec.orders
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
      itemsRec.push({id:newItems[i]._id, name:newItems[i].itemName, qty:newItems[i].qty, price:newItems[i].pPrice ? newItems[i].pPrice:newItems[i].price})
       await UpdateItem(newItems[i]._id, {qty:parseInt(newItems[i].qty), price:parseInt(newItems[i].price), myToken:session[0].token, myId:session[0]._id})
    }

  }
  else
  {
   
    let orders = purchaseRec.orders
    for(let i=0;i<orders.length;i++)
    {
      itemsRec.push({id:orders[i]._id, name:orders[i].itemName, qty:orders[i].qty, price:orders[i].pPrice ? orders[i].pPrice:orders[i].price})
      await UpdateItem(orders[i]._id, {qty:-parseInt(orders[i].qty), price:orders[i].price, myToken:session[0].token, myId:session[0]._id})
    }
  
  }
  return itemsRec
  
}
  const handleSupplierSearch=async (e)=>{
      e.preventDefault()
      try
      {
        if(e && e.target && e.target.value && e.target.value.length>1)
        {
          
          handleSupplierChange(e)
          const resData = await FindSuppliers({name:e.target.value}, {myToken:session[0].token, myId:session[0]._id})
           if(resData && resData.length)
             setSupplierFound(resData)
        }
        else
        setSupplierFound([{name:'MISC', id:1}]) 
      }
      catch (err)
      {
        dispatchSnack({type:'OTHER', message:'Error occurred while searching Supplier', msgColor:'error'})
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
      route.replace({ path: 'purchases', query: {editing:true, purchaseID: textfield.value  }})
     // startUpdateSale({purchaseID: textfield.value})
    }
  }
useEffect(()=>{
  if(location.query && location.query.editing && !purchaseEditing)
  {
    const purchaseID = location.query.purchaseID
   // route.push({ path: 'purchases', query: { purchaseID: purchaseID }})
    const query= {purchaseID:purchaseID}
    startUpdateSale(query)
  }
  else if(location.query && location.query.suspendediting)
  {
    LoadSuspended()
  }
},[location])


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

if((e.ctrlKey || e.metaKey) &&  e.key === 'Enter' && btnConfirmCheckout.current && !btnConfirmCheckout.current.disabled && !isLoading.Checkout && !isLoading.Delete)
{
  e.preventDefault()
  btnConfirmCheckout.current.click()
}
if( (e.ctrlKey || e.metaKey) && e.key === 'f' && btnAddNewRef.current && !btnAddNewRef.current.disabled)
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

useEffect(() => {
  window.addEventListener("keydown", handleUserKeyPress);
  return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
  };
}, [handleUserKeyPress]);
  useEffect(()=>{
    dispatchTotal({type:'CALCPURCHASE', items})
  }, [JSON.stringify(items)])

  return (
    <StyledBoxMain>
    <Header name={purchaseEditing ? `UPDATING BILL ID: ${purchaseRec.purchaseID}` :'MANAGE BILL'} />
    <React.Fragment>
    <StyledBox  flex={4}>
    <StyledSearchPaper elevation={4}>
    <form onSubmit={addItemtoCart}>
    <StyledSearchTextPaper elevation={6}>

    <Autocomplete
    id="searchTextbar"
    value={text}
    name='itemName'
    freeSolo
    onSelect={e=>handleSearch(e)}
    options={itemsFound.map((item) =>`${item.itemName}|Sale Rs.${item.sPrice}|Qty:${item.qty}|${item.model}|Rs. ${item.pPrice}`)}
    filterOptions={x => x}
    renderOption={(props) => {
    const wordArray = props.key.split("|");
    return (
      <div key={props.key}>
      <span {...props} >
      {wordArray.map((word, i)=>
      <React.Fragment key={word}>
      <SpanOptions style={{ color:i===0 ? "#936b5e": i === 1 ? '#2B7A0B': i===2 ? "#525E75" : i === 4 && "#FF5B00"}}> 
      { word }|&nbsp;
       </SpanOptions> 
      </React.Fragment>
      )}
      </span>
      <Divider  variant='middle'/>
      </div>

  
    );
  }}
    sx={{ width: '100%' }}
    renderInput={(params) => {
      const {InputLabelProps,InputProps,...rest} = params;
      return <SearchInputStyle {...params.InputProps} {...rest}  placeholder={searchByID ? 'Search By ID...': 'Search By Name....'} sx={{color:'azure'}} />}}
  />
    <SearchOtherField>
    <Divider orientation='vertical' flexItem variant='middle'/>
    <OtherInputStyle placeholder='Qty'  id='qtyInput' sx={{color:'azure'}}/>
    <Divider orientation='vertical' flexItem variant='middle'/>
    <OtherInputStyle placeholder='Rate' id ='unitpriceInput' sx={{color:'azure'}}/>
    <Divider orientation='vertical' flexItem variant='middle'/>
    <OtherInputStyle placeholder='Disc. in %' id ='discInput' sx={{color:'azure'}}/>
    <Divider orientation='vertical' flexItem variant='middle'/>
    <IconBtnDivStyle>
    <IconButton type="submit" sx={{ p: '10px' }} aria-label="search" >
    <AddShoppingCartIcon sx={{color:'azure'}}/>
  </IconButton>
    </IconBtnDivStyle>

    </SearchOtherField>

    </StyledSearchTextPaper>
    </form>
    
    <StyledOtherBtnsPaper elevation={4}>
    <StyledOtherBtn variant='contained' disabled={!purchaseStarted} ref={btnCancelRef} onClick={handleCancelSale} color='error' endIcon={<CancelIcon />}>Cancel</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={!purchaseStarted} ref={btnSuspendRef} onClick={()=>purchaseEditing ? handleBtnClick('DELETE'):handleBtnClick('SUSPEND')} color='warning' endIcon={<RemoveShoppingCartIcon />}>{ purchaseEditing ? 'DELETE' :'SUSPEND'}</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={purchaseStarted} ref={btnAddNewRef} onClick={handleAddNew} color='info' endIcon={<AddIcon />}>New</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={!purchaseStarted} ref={btnCheckoutRef} color='success' endIcon={<ShoppingCartCheckoutIcon />} 
    onClick={()=>handleBtnClick('CHECKOUT')}>{purchaseEditing ? 'UPDATE' : "CHECKOUT"}
    </StyledOtherBtn> 
    </StyledOtherBtnsPaper>
    </StyledSearchPaper>


    <StyledCartPaper elevation={4}>
    <StyleCartPaperHeader >
    <StyledCartBoxTitles>
    <StyledTypographyHeader variant='body1' sx={{width:'12%'}}>
    Sr.
    </StyledTypographyHeader>
    <StyledTypographyHeader variant='body1' sx={{width:'90% '}}>
    Item
    </StyledTypographyHeader>
    <StyledTypographyHeader variant='body1' sx={{width:'20% '}}>
    Rate
    </StyledTypographyHeader>
    <StyledTypographyHeader variant='body1' sx={{width:'20% '}}>
    Qty
    </StyledTypographyHeader>
    <StyledTypographyHeader variant='body1' sx={{width:'30% '}}>
    Subtotal
    </StyledTypographyHeader>
    </StyledCartBoxTitles>

    <StyledIconButtonBox>
    </StyledIconButtonBox>
    </StyleCartPaperHeader>
    
    <Divider />
    
    {items.map((item, i)=>
      <StyledCartPaperTitle key={i} >
      <StyledCartBoxTitles>
      <StyledTypographyItems variant='body2' sx={{width:'12% '}} >
      {i+1}
      </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'90% '}}>
        {item.itemName}
        </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'20% '}}>
        {item.price}
        </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'20% '}}>
        {item.qty}
        </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'30% '}}>
        {item.qty*item.price}
        </StyledTypographyItems>
      </StyledCartBoxTitles>

        <StyledIconButtonBox>
        
        <IconButton onClick={()=>handleUpdateQty(i, -1)} disabled={item.qty<2} >
        <RemoveCircleIcon  sx={{color:'azure'}} />
        </IconButton>
        <IconButton onClick={()=>handleUpdateQty(i, 1)}>
        <AddCircleIcon sx={{color:'azure'}}  />
        </IconButton>
   
        <IconButton onClick={()=>deleteFromCart(i)} >
        <DeleteIcon  color='error' />
        </IconButton>
        </StyledIconButtonBox>

        </StyledCartPaperTitle>
    )}

    </StyledCartPaper>
    </StyledBox>

    <StyledBoxTotal flex={2} > 
    
    <StyledTotalPaper elevation={4} >
    <StyledTotalTypography >
       Sub Total : {totalValues.subTotal}
    </StyledTotalTypography>
    <Divider variant='middle'  flexItem />
    <StyledTotalTypography className={!purchaseEditing && 'lastTotal'}>
       Grand total :   {totalValues.gTotal}
    </StyledTotalTypography>
    
    {purchaseEditing &&
    <React.Fragment>
    <Divider variant='middle'  flexItem />
    <StyledTotalTypography >
       Cash Received :   {purchaseRec.paid}
    </StyledTotalTypography>
    <Divider variant='middle'  flexItem />
    <StyledTotalTypography className='lastTotal'>
       Remaining Cash :   {totalValues.gTotal-purchaseRec.paid}
    </StyledTotalTypography>
    </React.Fragment>
    }

  </StyledTotalPaper>
  </StyledBoxTotal>
    </React.Fragment>


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
        onClose={handleCloseDialog}
        aria-labelledby="dialoge-title">
        <DialogTitleStyle id='dialoge-title' >{openDialog.message}</DialogTitleStyle>
        {openDialog.status !== 'DELETESALE' &&
        <DialogContentStyle>

        <StyledTotalPaper elevation={4} >
        <StyledTotalTypography >
          Sub Total :  {totalValues.subTotal}
        </StyledTotalTypography>
        <Divider variant='middle'  flexItem />
        <StyledTotalTypography >
          Grand total :   {totalValues.gTotal}
        </StyledTotalTypography>
        {purchaseEditing &&
          <React.Fragment>
          <Divider variant='middle'  flexItem />
          <StyledTotalTypography >
             Cash Received :   {purchaseRec.paid}
          </StyledTotalTypography>
          <Divider variant='middle'  flexItem />
          <StyledTotalTypography >
             Remaining Cash :   {totalValues.gTotal-purchaseRec.paid}
          </StyledTotalTypography>
          </React.Fragment>
          }
        </StyledTotalPaper>
       

        <Autocomplete
          id="supplierText"
          value={supplierText}
          name='supplierName'
          freeSolo
          disableClearable
          onSelect={e=>handleSupplierSearch(e)}
          options={supplierFound.map((supplier) =>supplier.name)}
          filterOptions={x => x}
          sx={{ width: '100%' }}
          renderInput={(params) => {
          const {InputLabelProps,InputProps,...rest} = params;
          return <InputBase {...params.InputProps} sx={{borderBottom:'0.5px solid'}} fullWidth {...rest} placeholder='MISC'    
          endAdornment= {
          <IconButton>
             <SendIcon color='primary'/>
          </IconButton>
          }/>}}/>
          <TextField
            autoFocus
            margin="dense"
            id="supplierBill"
            label="Supplier Bill No"
            fullWidth
            variant="standard"
            InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton >
                  <Receipt color='primary'/>
                </IconButton>
              </InputAdornment>
            )
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="cashPaidTxt"
            label="Cash Paid"
            fullWidth
            variant="standard"
            InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton >
                  <AttachMoneyIcon color='primary'/>
                </IconButton>
              </InputAdornment>
            )
            }}
          />

        </DialogContentStyle>
        }
        <DialogActionStyle > 
        <IconButton onClick={()=> !(isLoading.Checkout || isLoading.Delete) && openDialog.status!=='DELETESALE' ? handleCheckoutConfirm() : (!isLoading.Delete && openDialog.status ==='DELETESALE') && handleDeleteBill() } ref={btnConfirmCheckout} disabled={!openDialog.isOpen}>
        {(isLoading.Checkout || isLoading.Delete) ? <CircularProgress /> :     <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
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
          <ModalBox theme={theme.themes[theme.active]}>
          <TextField  
          autoFocus variant='outlined' id='findModalTextfield' 
          placeholder='Search Purchase ID'
           className='modalTextfield'
          InputProps={{
            endAdornment: (
              <IconButton type='submit'>
                <FindInPage color='success'  />
              </IconButton>)}}/>
                <SuspendedSales type='PURCHASE' />
          </ModalBox>
          </form>
        </Modal>


        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={purchaseLoading}
      >
      <CircularProgress color='success' />
      </Backdrop>

    </StyledBoxMain>
  )
}

export default withRouter(Purchases)
