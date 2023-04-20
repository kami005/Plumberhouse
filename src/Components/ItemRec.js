import React, {forwardRef, useEffect, useImperativeHandle, useReducer, useState, useRef, useCallback, useContext} from 'react'
import { MainBoxStyle, PaperStyle,TextFieldStyle, TextFieldBoxStyle, DialogActionStyle, DialogTitleStyle,
ButtonBoxStyle, ButtonStyle,  } from '../../styles/ItemRecStyle'
import { AddItem, DeleteItem, findItem, UpdateItem } from '../BackendConnect/ItemStorage'
import { itemReducer, itemStatusReducer, useToggle, alertReducer, dialogReducer, loadingReducer} from '../CustomHooks/RandHooks'
import { itemSchema } from '../DataSource/RandData'
import { ValidatorForm } from 'react-material-ui-form-validator'
import { Snackbar, Alert, Dialog, CircularProgress,  IconButton} from '@mui/material'
import {CheckCircleOutline, CancelOutlined} from '@mui/icons-material'
import { SessionContext } from '../Context/SessionContext'
import { AddLog } from '../BackendConnect/LogsStorage'
import { GetAccess } from '../Utils/Rand'

const ItemRec = forwardRef((props, ref) => {
  
  const inputRef = useRef()
  const btnNewRef = useRef()
  const btnSaveRef = useRef()
  const btnConfrimRef = useRef()
  const [itemEditing, setEditing] = useState(null)
  const [editing, toggleEditing]= useToggle(false)
  const [isLoading, dispatchLoading] =useReducer(loadingReducer, {Save:false, Delete:false})
  const [textFiedState, dispatchData]=useReducer(itemReducer, itemSchema)  
  const [itemStatus, dispatchItem] = useReducer(itemStatusReducer, {disabled:true, status:'SAVE'})
  const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
  const [openDialog, dispatchDialog] = useReducer(dialogReducer, {message:'Confirm to Update', isOpen:false, msgColor:'warning', status:'update'})
  const context = useContext(SessionContext)
  const {session, theme} = context
  
  useImperativeHandle(ref, ()=>({

    childFunction1(item){
      setEditing(item)
      dispatchData({type:'UPDATE', payload:item})
      dispatchItem({type:'UPDATE'})
      toggleEditing()
    }
  }))

const handleSaveUpdate = async ()=>{
  if(parseInt(textFiedState.pPrice)> parseInt(textFiedState.sPrice))
  {
    dispatchSnack({type:'OTHER', message:'Adding Purchase Price greater than Sale Price!', msgColor:'warning'})
    return
  }
  if(itemStatus.status==='SAVE')
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Modify' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
     return
    }
  
    dispatchItem({type:'RESET'})
    const res=await AddItem({...textFiedState, itemAddedBy:session[0].username, myToken:session[0].token, myId:session[0]._id})
    
    if(res && res.message && res.message==='SUCCESS'){
          dispatchSnack({type:'SAVESUCCESS'})
      }
      else
      dispatchSnack({type:'FAILED'})

      dispatchData({type:'RESET', payload:itemSchema})
        
  }
  else if(itemStatus.status ==='UPDATE')
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Modify' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
     return
    }
    dispatchDialog({type:'UPDATE'})
      
  }
 }

 const CheckChanges= async()=>{
  let from={}, to={}
  const oldItem = itemEditing
  for (var key of Object.keys(textFiedState)) {
   
    if(itemEditing[key]!==textFiedState[key])
    {
      from[key]=oldItem[key]
      to[key]=textFiedState[key]
    }
}

if(Object.keys(from).length)
{
  let type='other'
  if(from.qty || to.qty)
    type='qty'
  await AddLog({table:'items', type, from, to, id:itemEditing._id, by:session[0].username, name:oldItem.itemName, status:'update' })
}

 }

 const handleConfirmDelete = async ()=>{
dispatchLoading({type:'DELETESTART'})
if(editing && itemEditing)
  {
    const resp = await DeleteItem(itemEditing.id, true, {myToken:session[0].token, myId:session[0]._id})
    if(resp && resp.message && resp.message ==='SUCCESS')
    {
      dispatchSnack({type:'DELETESUCCESS'})
    }
     
    else
      dispatchSnack({type:'FAILED'})
    setEditing(null)
    dispatchData({type:'RESET', payload:itemSchema})
    dispatchItem({type:'CANCEL'})
    toggleEditing()

  }
  dispatchLoading({type:'DELETEEND'})
  dispatchDialog({type:'CLOSEMSG'})
 }

 const handleConfrimUpdate = async ()=>{

    dispatchLoading({type:'SAVESTART'})
      dispatchItem({type:'RESET'})

      const res= await UpdateItem(itemEditing.id, textFiedState, {myToken:session[0].token, myId:session[0]._id})
      
      if(res && res.message && res.message==='SUCCESS'){
        await CheckChanges()
        dispatchSnack({type:'UPDATESUCCESS'})
       }
       else
        dispatchSnack({type:'FAILED'})

       dispatchData({type:'RESET', payload:itemSchema})
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
  dispatchData({type:'RESET', payload:itemSchema})
  dispatchItem({type:'CANCEL'})
 }

 const handleDeleteItem = ()=>{
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

  ValidatorForm.addValidationRule('isItemNameUnique',async(value)=>{
    if(value && value.length>2 && editing===false)
    {
      const isAvailable =  await findItem(value, {myToken:session[0].token, myId:session[0]._id})
      return isAvailable
    }
    else if(editing===true && itemEditing && textFiedState.itemName.toLowerCase() !== itemEditing.itemName.toLowerCase()){
      const isAvailable =  await findItem(value, {myToken:session[0].token, myId:session[0]._id})
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
        <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="itemID" label="ID " id='itemID' inputRef={inputRef} disabled={true}
        variant="outlined" value={textFiedState.itemID} onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})}/>
        <TextFieldStyle theme={theme.themes[theme.active]}  size='small' name="itemName" label="name" id='itemName' autoFocus inputRef={inputRef}
        variant="outlined" value={textFiedState.itemName}
        onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})} 
        validators={['required', 'isItemNameUnique','isItemNameOk']}
        errorMessages={['Enter Item Name','Item with same name already in Items List', 'Enter valid Item Name']}/>
         <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="pPrice" label="Purchase Price" variant="outlined" value={textFiedState.pPrice}
        onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})}
        validators={['required']}
        errorMessages={['Enter Purchase Price']}
         />
        <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="sPrice" label="Price" variant="outlined" value={textFiedState.sPrice} 
        onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})}
        validators={['required']}
        errorMessages={['Enter Sale Price']}
        />
         <TextFieldStyle  theme={theme.themes[theme.active]} size='small' name="qty" label="Quantity" variant="outlined" value={textFiedState.qty}
         onChange={e=>dispatchData({type:'CHANGEVALINT', payload:e})}
         validators={['required']}
         errorMessages={['Enter Purchase Price']}
          />
        <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="type" label="Product Type" variant="outlined" value={textFiedState.type} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}/>
        <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="model" label="Model" variant="outlined" value={textFiedState.model} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}/>
        <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="vendor" label="Vendor" variant="outlined" value={textFiedState.vendor} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}/>
        <TextFieldStyle theme={theme.themes[theme.active]} size='small' name="desc" label="Description" 
        multiline rows={3} variant="outlined"  value={textFiedState.desc} onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}/>
        </TextFieldBoxStyle>

        <ButtonBoxStyle theme={theme.themes[theme.active]} flex={2}>
            <ButtonStyle theme={theme.themes[theme.active]} variant='contained' onClick={handleAddNew} disabled={!itemStatus.disabled} ref={btnNewRef}>New</ButtonStyle>
            <ButtonStyle theme={theme.themes[theme.active]} variant='contained' type='submit' disabled={itemStatus.disabled || openDialog.isOpen} ref ={btnSaveRef}>{itemStatus.status}</ButtonStyle>
            <ButtonStyle theme={theme.themes[theme.active]} variant='contained' disabled={itemStatus.status!=='UPDATE'} onClick={handleDeleteItem}>Delete</ButtonStyle>
            <ButtonStyle theme={theme.themes[theme.active]} variant='contained' disabled ={itemStatus.disabled} onClick={handleCancleAddUpdate}>Cancel</ButtonStyle>
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

export default ItemRec