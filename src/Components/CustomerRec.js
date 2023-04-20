import React, {forwardRef, useEffect, useImperativeHandle, useReducer, useState, useRef, useCallback, useContext} from 'react'
import { MainBoxStyle, PaperStyle,TextFieldStyle, TextFieldBoxStyle, DialogActionStyle, DialogTitleStyle,
ButtonBoxStyle, ButtonStyle } from '../../styles/ItemRecStyle'
import { AddCustomer, DeleteCustomer, FindCustomer , UpdateCustomer } from '../BackendConnect/CusotmerStorage'
import { customerReducer, itemStatusReducer, useToggle, alertReducer, dialogReducer, loadingReducer} from '../CustomHooks/RandHooks'
import { customerSchema } from '../DataSource/RandData'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { Snackbar, Alert, Dialog, CircularProgress,  IconButton} from '@mui/material'
import {CheckCircleOutline, CancelOutlined} from '@mui/icons-material'
import { SessionContext } from '../Context/SessionContext'
import { GetAccess } from '../Utils/Rand'

const CustomerRec = forwardRef((props, ref) => {
  
  const inputRef = useRef()
  const btnNewRef = useRef()
  const btnSaveRef = useRef()
  const btnConfrimRef = useRef()
  const [customerEditing, setEditing] = useState(null)
  const [editing, toggleEditing]= useToggle(false)
  const [isLoading, dispatchLoading] =useReducer(loadingReducer, {Save:false, Delete:false})
  const [textFiedState, dispatchData]=useReducer(customerReducer, customerSchema)  
  const [customerStatus, dispatchItem] = useReducer(itemStatusReducer, {disabled:true, status:'SAVE'})
  const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
  const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Update', isOpen:false, msgColor:'warning', status:'update'})
  const context = useContext(SessionContext)
  const {session, theme} = context
  
  useImperativeHandle(ref, ()=>({

    childFunction1(customer){
      
      setEditing(customer)
      dispatchData({type:'UPDATE', payload:customer})
      dispatchItem({type:'UPDATE'})
      toggleEditing()
    }
  }))

const handleSaveUpdate = async ()=>{
  
  if(customerStatus.status==='SAVE')
  {
    
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Insert' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      return
    }

    dispatchItem({type:'RESET'})
    const res=await AddCustomer({...textFiedState, customerAddedBy:session[0].username, myToken:session[0].token, myId:session[0]._id})
    
    if(res && res.message && res.message==='SUCCESS'){
          dispatchSnack({type:'SAVESUCCESS'})
      }
      else
      dispatchSnack({type:'FAILED'})

      dispatchData({type:'RESET', payload:customerSchema})
        
  }
  else if(customerStatus.status ==='UPDATE')
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Modify' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      return
    }
    dispatchDialog({type:'UPDATE'})
      
  }
 }

 const handleConfirmDelete = async ()=>{
dispatchLoading({type:'DELETESTART'})
  if(editing && customerEditing)
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Delete' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
     return
    }
    const resp = await DeleteCustomer(customerEditing.id, true, {myToken:session[0].token, myId:session[0]._id})
    if(resp && resp.message && resp.message ==='SUCCESS')
      dispatchSnack({type:'DELETESUCCESS'})
    else
      dispatchSnack({type:'FAILED'})
    setEditing(null)
    dispatchData({type:'RESET', payload:customerSchema})
    dispatchItem({type:'CANCEL'})
    toggleEditing()

  }
  dispatchLoading({type:'DELETEEND'})
  dispatchDialog({type:'CLOSEMSG'})
 }

 const handleConfrimUpdate = async ()=>{
    dispatchData({type:'SAVESTART'})
    dispatchItem({type:'RESET'})
      const res= await UpdateCustomer(customerEditing.id, textFiedState, {myToken:session[0].token, myId:session[0]._id})
      if(res && res.message && res.message==='SUCCESS'){
        dispatchSnack({type:'UPDATESUCCESS'})
       }
       else
        dispatchSnack({type:'FAILED'})

       dispatchData({type:'RESET', payload:customerSchema})
       setEditing(null)
       toggleEditing()
       dispatchLoading({type:'SAVEEND'})
       dispatchDialog({type:'CLOSEMSG'})
      
 }
 
 const handleAddNew = ()=>{
  dispatchItem({type:'SAVE'})
  inputRef.current.focus()
 }
 const handleCancleAddUpdate =()=>{
  dispatchData({type:'RESET', payload:customerSchema})
  dispatchItem({type:'CANCEL'})
 }

 const handleDeleteCustomer = ()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Delete' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
    return
  }
  dispatchDialog({type:'DELETE'})
 }

 const handleUserKeyPress = useCallback(e => {
  if((e.ctrlKey || e.metaKey) && e.key === 'b' && btnNewRef.current && !btnNewRef.current.disabled)
      {
        e.preventDefault()
        btnNewRef.current.click()
     }
        if((e.ctrlKey || e.metaKey) && e.key === 's' && btnSaveRef.current && !btnSaveRef.current.disabled && !openDialog.isOpen)
        {
          e.preventDefault()
          btnSaveRef.current.click()
        }
        if((e.ctrlKey || e.metaKey) && e.key === 'Enter' && btnConfrimRef.current && !btnConfrimRef.current.disabled)
        {
          e.preventDefault()
          btnConfrimRef.current.click()
        }

}, []);
useEffect(() => {
  window.addEventListener("keydown", handleUserKeyPress);
  return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
  };
}, [handleUserKeyPress]);

 useEffect(()=>{

  ValidatorForm.addValidationRule('isItemNameOk', (value)=>{
    if(value && value.length<3)
      return false
    else  
      return true
  })

  ValidatorForm.addValidationRule('isItemNameUnique', (value)=>{
    if(value && value.length>2 && editing===false)
    {
      const isAvailable =  FindCustomer(value, {myToken:session[0].token, myId:session[0]._id})
      return isAvailable
    }
    else if(editing===true && customerEditing && value && value.length>2 && textFiedState.customerName.trim().toLowerCase() !== customerEditing.customerName.trim().toLowerCase()){
      const isAvailable =  FindCustomer(value, {myToken:session[0].token, myId:session[0]._id})
      return isAvailable
    }
    else
      return true
  })
 },[textFiedState])
  return (

    <MainBoxStyle theme={theme.themes[theme.active]}>
    
      <ValidatorForm onSubmit={handleSaveUpdate} instantValidate={true}>
        <PaperStyle elevation={10} theme={theme.themes[theme.active]}>
      
        <TextFieldBoxStyle flex={4} theme={theme.themes[theme.active]}>
        <TextFieldStyle name="customerID" label="ID " id='customerID' inputRef={inputRef} disabled={true} theme={theme.themes[theme.active]}
        variant="outlined" value={textFiedState.customerID} onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})}/>
        <TextFieldStyle name="customerName" label="name" id='customerName' autoFocus inputRef={inputRef}
        variant="outlined" value={textFiedState.customerName}
        onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} 
        validators={['required', 'isItemNameUnique','isItemNameOk']}
        errorMessages={['Enter Customer Name','Customer with same name already in Items List', 'Enter valid Customer Name']} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="address" label="Address" variant="outlined" value={textFiedState.address} 
        onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} theme={theme.themes[theme.active]}/>
         <TextFieldStyle name="contactNo" label="Contact No" variant="outlined" value={textFiedState.contactNo}
         onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}
         validators={['required']}
         errorMessages={['Enter Contact No']} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="customerType" label="Customer Type" variant="outlined" value={textFiedState.customerType} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="description" label="Description" 
        multiline rows={3} variant="outlined"  value={textFiedState.description} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} theme={theme.themes[theme.active]}/>
       
        </TextFieldBoxStyle>

        <ButtonBoxStyle flex={2} theme={theme.themes[theme.active]}>
            <ButtonStyle variant='contained' onClick={handleAddNew} disabled={!customerStatus.disabled} ref={btnNewRef} theme={theme.themes[theme.active]}>New</ButtonStyle>
            <ButtonStyle variant='contained' type='submit' disabled={customerStatus.disabled || openDialog.isOpen} ref ={btnSaveRef} theme={theme.themes[theme.active]}>{customerStatus.status}</ButtonStyle>
            <ButtonStyle variant='contained' disabled={customerStatus.status!=='UPDATE'} onClick={handleDeleteCustomer}theme={theme.themes[theme.active]}>Delete</ButtonStyle>
            <ButtonStyle variant='contained' disabled ={customerStatus.disabled} onClick={handleCancleAddUpdate} theme={theme.themes[theme.active]}>Cancel</ButtonStyle>
        </ButtonBoxStyle>
      
        </PaperStyle>
        </ValidatorForm>
   

      {/* Dialog Box is here */}
        <Dialog open={openDialog.isOpen} 
        onClose={()=>dispatchDialog({type:'CLOSEMSG'})}
        aria-labelledby="dialoge-title">
        <DialogTitleStyle id='dialoge-title' >{openDialog.message}</DialogTitleStyle>
        <DialogActionStyle > 
        <IconButton onClick={openDialog.status==='update'? handleConfrimUpdate : handleConfirmDelete} ref={btnConfrimRef}>
          {isLoading.Save ? <CircularProgress /> :  <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
        </IconButton>
        <IconButton onClick={()=>dispatchDialog({type:'CLOSEMSG'})}>
            <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
        </IconButton>
        </DialogActionStyle>
        </Dialog>

        {/* Snackbar Alert are here */}
        <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
         onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
         anchorOrigin={{ vertical:'top',horizontal:'center' }}
         >
        <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
         {alertSnack.message}
        </Alert>
        </Snackbar>
    </MainBoxStyle>

    
  )
})

export default CustomerRec