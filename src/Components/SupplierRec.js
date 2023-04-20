import React, {forwardRef, useEffect, useImperativeHandle, useReducer, useState, useRef, useCallback, useContext} from 'react'
import { MainBoxStyle, PaperStyle,TextFieldStyle, TextFieldBoxStyle, DialogActionStyle, DialogTitleStyle,
ButtonBoxStyle, ButtonStyle } from '../../styles/ItemRecStyle'
import { AddSupplier, DeleteSupplier, FindSupplier , UpdateSupplier } from '../BackendConnect/SupplierStorage'
import { supplierReducer, itemStatusReducer, useToggle, alertReducer, dialogReducer, loadingReducer} from '../CustomHooks/RandHooks'
import { supplierSchema } from '../DataSource/RandData'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { Snackbar, Alert, Dialog, CircularProgress,  IconButton} from '@mui/material'
import {CheckCircleOutline, CancelOutlined} from '@mui/icons-material'
import { SessionContext } from '../Context/SessionContext'
import { GetAccess } from '../Utils/Rand'

const SupplierRec = forwardRef((props, ref) => {
  
  const inputRef = useRef()
  const btnNewRef = useRef()
  const btnSaveRef = useRef()
  const btnConfrimRef = useRef()
  const [supplierEditing, setEditing] = useState(null)
  const [editing, toggleEditing]= useToggle(false)
  const [isLoading, dispatchLoading] =useReducer(loadingReducer, {Save:false, Delete:false})
  const [textFiedState, dispatchData]=useReducer(supplierReducer, supplierSchema)  
  const [supplierStatus, dispatchItem] = useReducer(itemStatusReducer, {disabled:true, status:'SAVE'})
  const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
  const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Update', isOpen:false, msgColor:'warning', status:'update'})
  const context = useContext(SessionContext)
  const {session, theme} = context
  
  useImperativeHandle(ref, ()=>({

    childFunction1(supplier){
      setEditing(supplier)
      dispatchData({type:'UPDATE', payload:supplier})
      dispatchItem({type:'UPDATE'})
      toggleEditing()
    }
  }))

const handleSaveUpdate = async ()=>{
  if(supplierStatus.status==='SAVE')
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'suppliers', 'Insert' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
      return
    }

    dispatchItem({type:'RESET'})
    const res=await AddSupplier({...textFiedState, addedBy:session[0].username, myToken:session[0].token, myId:session[0]._id})
    if(res && res.message && res.message==='SUCCESS'){
          dispatchSnack({type:'SAVESUCCESS'})
      }
      else
      dispatchSnack({type:'FAILED'})

      dispatchData({type:'RESET', payload:supplierSchema})
        
  }
  else if(supplierStatus.status ==='UPDATE')
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'suppliers', 'Modify' )
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
  if(editing && supplierEditing)
  {
    const resp = await DeleteSupplier(supplierEditing._id, true, {myToken:session[0].token, myId:session[0]._id})
    if(resp && resp.message && resp.message ==='SUCCESS')
      dispatchSnack({type:'DELETESUCCESS'})
    else
      dispatchSnack({type:'FAILED'})
    setEditing(null)
    dispatchData({type:'RESET', payload:supplierSchema})
    dispatchItem({type:'CANCEL'})
    toggleEditing()

  }
  dispatchLoading({type:'DELETEEND'})
  dispatchDialog({type:'CLOSEMSG'})
 }

 const handleConfrimUpdate = async ()=>{
    dispatchData({type:'SAVESTART'})
    dispatchItem({type:'RESET'})
      const res= await UpdateSupplier(supplierEditing._id, textFiedState, {myToken:session[0].token, myId:session[0]._id} )
      if(res && res.message && res.message==='SUCCESS'){
        dispatchSnack({type:'UPDATESUCCESS'})
       }
       else
        dispatchSnack({type:'FAILED'})

       dispatchData({type:'RESET', payload:supplierSchema})
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
  dispatchData({type:'RESET', payload:supplierSchema})
  dispatchItem({type:'CANCEL'})
 }

 const handleDeleteSupplier = ()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'suppliers', 'Delete' )
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
      const isAvailable =  FindSupplier(value, {myToken:session[0].token, myId:session[0]._id})
      return isAvailable
    }
    else if(editing===true && supplierEditing && value && value.length>2 && textFiedState.name !== supplierEditing.name){
      const isAvailable =  FindSupplier(value, {myToken:session[0].token, myId:session[0]._id})
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
        <TextFieldStyle name="id" label="Supplier ID " id='Supplier ID' inputRef={inputRef} disabled={true}
        variant="outlined" value={textFiedState.id} onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="name" label="Supplier Name" id='name' autoFocus inputRef={inputRef}
        variant="outlined" value={textFiedState.name}
        onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} 
        validators={['required', 'isItemNameUnique','isItemNameOk']}
        errorMessages={['Enter Supplier Name','Supplier with same name already in Items List', 'Enter valid Supplier Name']} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="address" label="Address" variant="outlined" value={textFiedState.address} 
        onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} theme={theme.themes[theme.active]}/>
         <TextFieldStyle name="contactNo" label="Contact No" variant="outlined" value={textFiedState.contactNo}
         onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}
         validators={['required']}
         errorMessages={['Enter Contact No']} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="type" label="Supplier Type" variant="outlined" value={textFiedState.type} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} theme={theme.themes[theme.active]}/>
        <TextFieldStyle name="desc" label="Description" 
        multiline rows={3} variant="outlined"  value={textFiedState.desc} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} theme={theme.themes[theme.active]}/>
       
        </TextFieldBoxStyle>

        <ButtonBoxStyle flex={2} theme={theme.themes[theme.active]}>
            <ButtonStyle variant='contained' onClick={handleAddNew} disabled={!supplierStatus.disabled} ref={btnNewRef}theme={theme.themes[theme.active]}>New</ButtonStyle>
            <ButtonStyle variant='contained' type='submit' disabled={supplierStatus.disabled || openDialog.isOpen} ref ={btnSaveRef} theme={theme.themes[theme.active]}>{supplierStatus.status}</ButtonStyle>
            <ButtonStyle variant='contained' disabled={supplierStatus.status!=='UPDATE'} onClick={handleDeleteSupplier} theme={theme.themes[theme.active]}>Delete</ButtonStyle>
            <ButtonStyle variant='contained' disabled ={supplierStatus.disabled} onClick={handleCancleAddUpdate} theme={theme.themes[theme.active]}>Cancel</ButtonStyle>
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

export default SupplierRec