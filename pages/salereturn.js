import React, {useState, useEffect, useRef, useReducer, useCallback, useContext} from 'react'
import {InputBase,IconButton,CircularProgress, Divider,  Autocomplete, Snackbar,Alert, Dialog, TextField, InputAdornment} from '@mui/material'
import { StyledBoxMain,StyledSearchTextPaper, StyledCartPaperTitle,StyledCartPaper, StyledSearchPaper, StyledTypographyItems, StyledBox, 
StyledTotalPaper, StyledIconButtonBox, StyledTotalTypography,StyledBoxTotal, StyledOtherBtnsPaper, StyledOtherBtn, DialogActionStyle, DialogTitleStyle, DialogContentStyle,
StyledCartBoxTitles, SearchInputStyle, SearchOtherField, OtherInputStyle, IconBtnDivStyle, StyleCartPaperHeader, StyledTypographyHeader, SpanOptions} from '../styles/SaleReturnStyle'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { grandTotalReducer, loadingReducer, useItemReturnCart, useTextboxVal, useToggle } from '../src/CustomHooks/RandHooks';
import { searchItems } from '../src/BackendConnect/ItemStorage';
import { alertReducer, dialogReducer} from '../src/CustomHooks/RandHooks';
import {CheckCircleOutline, CancelOutlined, Description} from '@mui/icons-material'
import { AddSale} from '../src/BackendConnect/SaleStorage';
import { useRouter, withRouter } from 'next/router';
import { UpdateItem } from '../src/BackendConnect/ItemStorage';
import { FindCustomers } from '../src/BackendConnect/CusotmerStorage';
import Header from '../src/Components/HeaderText';
import { AddIncome } from '../src/BackendConnect/IncomeStorage';
import { SessionContext } from '../src/Context/SessionContext';
import { SUSPENDSALEKEY } from '../src/DataSource/RandData';
import { v4 } from 'uuid';

 const saleReturn = (props) => {
  var location= props.router
  const route = useRouter()
  const btnAddNewRef = useRef()
  const btnCancelRef = useRef()
  const btnSuspendRef = useRef()
  const btnCheckoutRef = useRef()
  const btnConfirmCheckout = useRef()
  const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Checkout:false, Delete:false})
  const [itemsFound, setFoundItems] = useState([])
  const [showPurchaseRate, toggleShowPurchaseRate] = useToggle()
  const [descriptionTxt, setDescText] = useState('')
  const [customerFound, setCustomerFound] = useState([{customerName:'MISC', customerID:1}])
  const [totalValues, dispatchTotal] = useReducer(grandTotalReducer, {subTotal:0, grandTotal:0})
  const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Sale Return Cancelled', isOpen:false, msgColor:'error'})
  const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Cancel Sale Return', isOpen:false, msgColor:'warning', status:'cancel'})
  const [items, addtoCart, deleteFromCart, handleUpdateQty, resetCart, reloadSuspended] = useItemReturnCart()
  const [text, handleChange, handleReset] = useTextboxVal()
  const [customerText, handleCustomerChange, handleCustomerReset] =useTextboxVal()
  const [saleStarted, toggleSaleStarted] =useToggle()
  const [searchByID, toggleSearchBy]= useToggle()
  const context = useContext(SessionContext)
  const {session, theme} = context

const resetEveryThing =()=>
{
    resetCart()
    setFoundItems([])
    handleReset()
    toggleSaleStarted()
    dispatchDialog({type:"CLOSEMSG"})
    dispatchTotal({type:'RESET'})
    handleCustomerReset()
}

const SetLocalStorage =async ()=>
{
    const uuId =v4()
    let rowData=[]
    const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
    if(sale)
    rowData=sale
    if(rowData.length)
    localStorage.setItem(SUSPENDSALEKEY, JSON.stringify([...rowData, {id:uuId, itemCount:items.length, items:items, suspendedBy:session[0].username,
     gTotal:totalValues.subTotal, subTotal:totalValues.subTotal, type:'SALERETURN', suspendedAt:new Date()}]))
     else
     localStorage.setItem(SUSPENDSALEKEY, JSON.stringify([{id:uuId, itemCount:items.length, items:items, suspendedBy:session[0].username,
    gTotal:totalValues.subTotal, subTotal:totalValues.subTotal, type:'SALERETURN', suspendedAt:new Date()}]))
}

const LoadSuspended =()=>{
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
        dispatchTotal({type:'CALCSUSPEND', items:suspendedSaleData.items, furtherDisc:suspendedSaleData.furtherDisc})
      }
  }
  route.replace({ path: 'salereturn'})
}

const addItemtoCart =async (e)=>
{
    e.preventDefault()
    let qtyE = document.getElementById('qtyInput')
    let searchE = document.getElementById('searchTextbar')
    let rateE=document.getElementById('rateInput')
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
      if(!isNaN(rateE.value) && parseInt(rateE.value)>0)
        curItem[0].sPrice =parseInt(rateE.value)

        curItem[0].qty=qtyE.value
        addtoCart(curItem[0])
        handleReset()
        
        qtyE.value=1
        setFoundItems([])
        searchE.focus()
        searchE.value=''
        qtyE.value=''
        rateE.value=''
        
    }
  }


const handleSearch= async (e)=>
{
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

const handleCustomerSearch=async (e)=>
{
      e.preventDefault()
     
      if(e && e.target && e.target.value && e.target.value.length>1)
      {
        handleCustomerChange(e)
        const resData = await FindCustomers({customerName:e.target.value}, {myToken:session[0].token, myId:session[0]._id})
      if(resData && resData.length)
        setCustomerFound(resData)
      }
      else
      setCustomerFound([{customerName:'MISC', customerID:1}]) 
  }

  const handleAddNew =()=>{
    toggleSaleStarted()
    let searchE = document.getElementById('searchTextbar')
    searchE.focus()
  }

  const handleCancelSale = ()=>{
    resetEveryThing()
    dispatchSnack({type:'OTHER', message:'Sale Return Cancelled', msgColor:'warning'})
  
}

const handleStockQty = async (newItems)=>
{
    let itemsRet=[]
        for (let i=0; i<newItems.length;i++)
        {
          itemsRet.push({id:newItems[i]._id, name:newItems[i].itemName, qty:-newItems[i].qty, price:newItems[i].sPrice ? newItems[i].sPrice:newItems[i].price})
            const res = await UpdateItem(newItems[i]._id, {qty:parseInt(items[i].qty), type:'SALERETURN'}, {myToken:session[0].token, myId:session[0]._id})
        }
        return itemsRet
}

const handleCheckoutConfirm = async ()=>
{
    let newItems=[]
    let customerInfo = {name:'MISC', id:1}
    let customerE = document.getElementById('customerTxt')
   
       if(customerE.value.toUpperCase() !=='MISC' && customerE.value.trim() !=='' )
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


    let payStatus ='RETURN'
    let saleStatus = 'RETURN'
    
    for (let i =0; i<items.length;i++)
    {
       newItems.push({_id:items[i]._id,qty:parseInt(items[i].qty), itemName:items[i].itemName, price:-items[i].sPrice, pPrice:items[i].pPrice, unitDisc:0})
    }

    const itemsRec=await handleStockQty(newItems)
    
    const res = await AddSale({saleStatus:saleStatus, orders:newItems, soldBy:session[0].username, customerInfo:customerInfo,
      subTotal:-totalValues.subTotal, discount:0, pAmount:0, otherAmount:{}, gst:0, desc:descriptionTxt,
       paymentStatus:payStatus, gTotal:-totalValues.subTotal, amountReceived:-totalValues.subTotal, myToken:session[0].token, myId:session[0]._id})
       if(res && res.message && res.message ==='SUCCESS')
       {

        await AddIncome({cat:'SALERETURN', title:`FromSALEID:${res.saleID}`, amount:-totalValues.subTotal, customer:customerInfo, status:'COMPLETE', addedBy:session[0].username,
         isDeleted:false, sales:[{saleID:res.saleID}], items:itemsRec, myToken:session[0].token, myId:session[0]._id})  
        dispatchSnack({type:'OTHER', message:'Sale Return Completed', msgColor:'success'})
       }
        
       else 
        dispatchSnack({type:'OTHER', message:'Error occurred', msgColor:'error'})
    

    resetCart()
    setFoundItems([])
    handleReset()
    await dispatchDialog({type:"CLOSEMSG"})
  
    dispatchTotal({type:'RESET'})

    dispatchLoading({type:'CHECKOUTEND'})
    const url=`/prints/printsalereturn?saleID=${res.saleID}`
    window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
}
 

const handleBtnClick = async (button)=>
{
    if(button === 'CHECKOUT' || button === undefined)
    {
      if(items.length)
      {

       toggleSaleStarted()
      await  dispatchDialog({type:'OTHER', message:'', status:'checkout'})

      }
    }
    else if(button ==='SUSPEND' && items.length)
    {
      SetLocalStorage()
      resetEveryThing()
      dispatchSnack({type:'OTHER', message:'Sale Return Suspended', msgColor:'info'})
    }

  }
  const handleCloseDialog =()=>{
    toggleSaleStarted()
    dispatchDialog({type:"CLOSEMSG"})
    handleCustomerReset()
  }

  const toggleSearch = ()=>{
    toggleSearchBy()
  }

  useEffect(()=>{
     if(location.query.suspendediting)
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
      dispatchTotal({type:'CALC', items, furtherDisc:0})
    }, [JSON.stringify(items)])


  return (
    <StyledBoxMain>
    <Header name={`SALE RETURN`} />
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
    disableClearable
    onSelect={e=>handleSearch(e)}
    options={itemsFound.map((item) =>`${item.itemName}|Rs.${item.sPrice}|Qty:${item.qty}|${item.model}${showPurchaseRate ?  '|Rs. ' + item.pPrice:''}`)}
    noOptionsText="Not Found"
    filterOptions={x => x}
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
    sx={{ width: '100%' }}
    renderInput={(params) => {
      const {InputLabelProps,InputProps,...rest} = params;
      return <SearchInputStyle {...params.InputProps} {...rest} placeholder={searchByID ? 'Search By ID...': 'Search By Name....'} sx={{color:'azure'}} />}}
    />

      <SearchOtherField>
      <Divider orientation='vertical' flexItem variant='middle'/>
      <OtherInputStyle placeholder='Qty'  id='qtyInput' sx={{color:'azure'}} />
      <Divider orientation='vertical' flexItem variant='middle'/>
      <OtherInputStyle placeholder='Rate'  id='rateInput' sx={{color:'azure'}} />
      <Divider orientation='vertical' flexItem variant='middle'/>
      <IconBtnDivStyle>
      <IconButton type="submit" sx={{ p: '08px' }} aria-label="search" >
      <AddShoppingCartIcon sx={{color:'azure'}}/>
     </IconButton>
      </IconBtnDivStyle>

      </SearchOtherField>

  
    </StyledSearchTextPaper>
    </form>
    
    <StyledOtherBtnsPaper elevation={4}>
    <StyledOtherBtn variant='contained' disabled={!saleStarted} ref={btnCancelRef} onClick={handleCancelSale} color='error' endIcon={<CancelIcon />}>Cancel</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={!saleStarted} ref={btnSuspendRef} onClick={()=>handleBtnClick('SUSPEND')} color='warning' endIcon={<RemoveShoppingCartIcon />}>{'SUSPEND'}</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={saleStarted} ref={btnAddNewRef} onClick={handleAddNew} color='secondary' endIcon={<AddIcon />}>New</StyledOtherBtn>
    <StyledOtherBtn variant='contained' disabled={!saleStarted} ref={btnCheckoutRef} color='success' endIcon={<ShoppingCartCheckoutIcon />} 
    onClick={()=> !isLoading.Checkout && handleBtnClick('CHECKOUT')}>{"CHECKOUT"}
    </StyledOtherBtn> 
    </StyledOtherBtnsPaper>

    </StyledSearchPaper>

    <StyledCartPaper elevation={4}>
    <StyleCartPaperHeader >
    <StyledCartBoxTitles>
    <StyledTypographyHeader variant='body1'  sx={{width:'12%'}}>
      Sr.
      </StyledTypographyHeader>
      <StyledTypographyHeader variant='body1'  sx={{width:'100%'}}>
      Item
      </StyledTypographyHeader>
      <StyledTypographyHeader variant='body1' sx={{width:'20%'}}>
      Rate
      </StyledTypographyHeader>
      <StyledTypographyHeader variant='body1'  sx={{width:'20%'}}>
      Qty
      </StyledTypographyHeader>
      <StyledTypographyHeader variant='body1'  sx={{width:'20%'}}>
      Subtotal
      </StyledTypographyHeader>
    </StyledCartBoxTitles>

    <StyledIconButtonBox>
    </StyledIconButtonBox>
    </StyleCartPaperHeader>
    
    <Divider />
    
    {items.map((item, i)=>
      <StyledCartPaperTitle key={i} elevation={2}>
      <StyledCartBoxTitles>
      <StyledTypographyItems variant='body2' sx={{width:'12%'}} >
      {i+1}
      </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'100%'}}>
        {item.itemName}
        </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'20%'}}>
        {item.sPrice}
        </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'20%'}}>
        {item.qty}
        </StyledTypographyItems>
        <StyledTypographyItems variant='body2' sx={{width:'20%'}}>
        {item.subTotal}
        </StyledTypographyItems>
      </StyledCartBoxTitles>

        <StyledIconButtonBox>
        
        <IconButton onClick={()=>handleUpdateQty(i, -1)} disabled={item.qty<2}>
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
    
    <StyledTotalPaper elevation={4} className='lastTotal'>
    <StyledTotalTypography >
       Total : {totalValues.subTotal}
    </StyledTotalTypography>


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
          renderInput={(params) => {
          const {InputLabelProps,InputProps,...rest} = params;
          return <InputBase {...params.InputProps} sx={{borderBottom:'0.5px solid'}} fullWidth {...rest} placeholder='MISC'    
          endAdornment= {
          <IconButton>
          <SendIcon color='primary'/>
          </IconButton>
          }/>}}/>

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
    </StyledBoxMain>
  )
}


// export function getStaticProps (){

//  return {
//       props:{state:'hellow'},
//       revalidate:10
//  }

// }
export default withRouter(saleReturn)
