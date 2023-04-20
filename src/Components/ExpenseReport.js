import React, { useContext, useReducer} from 'react'
import { ModalTextFieldStyle, BodyPaperStyle,ListItemStyle, ListTextStyle, ModalBtnBox, ListItemHeadStyle, ModalSelectStyle, ListSubFooterStyle,
ListSubHeaderStyle, ModalStyle, ModalBoxStyle, FieldsBox, ModalBtn, BtnStyle, TypographyStyle} from '../../styles/ExpenseReportStyle'
import { alertReducer, itemReducer, loadingReducer, useToggle } from '../CustomHooks/RandHooks';
import {MenuItem, CircularProgress, Collapse, IconButton, List, ListItemButton, ListItemIcon, Typography, Alert, Snackbar, Dialog,
DialogTitle, DialogActions, Divider, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CancelOutlined, CheckCircleOutline, Delete, ExpandLess, ExpandMore} from '@mui/icons-material'
import { AddIncome, convert } from '../BackendConnect/IncomeStorage';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AddExpense, DeleteExpense, UpdateExpense } from '../BackendConnect/ExpenseStorage';
import { SessionContext } from '../Context/SessionContext';
import { AddLog } from '../BackendConnect/LogsStorage';
import { GetAccess } from '../Utils/Rand';

const ExpenesReport = (props) => {
    const {purchaseData, dispatchPurchaseData, findExpense} = props
    const context = useContext(SessionContext)
    const {session, theme} = context
    const categories = ['PAYROLL', 'INVESTMENT', 'LOANRETURN', 'SERVICE', 'LOAN', 'UTILITY/RENT', 'OTHER']
    const expenseSchmea = {cat:categories[0], title:'',amount:'', date:convert(new Date(), 0), status:'COMPLETE', addAmount:''}
    const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false, Save:false})
    const [modalOpen, toggleModal] = useToggle()
    const [deleteDialog, toggleDeleteDialog] =useToggle()
    const [addIncomeDialog, toggleIncomeDialog] =useToggle()
    const [expenseData, dispatchExpenes] =useReducer(itemReducer, expenseSchmea)
    const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'Record Saved', isOpen:false, msgColor:'success'})
  
    const ResetEveryThing =()=>{
        toggleModal()
        dispatchExpenes({type:'RESET', payload:expenseSchmea})
    }

    const OpenAddNew=()=>{
        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Insert' )
        if(!access)
        {
            dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else
        {
        toggleModal()
        }
    }

    const handleOpenUpdate = async (expense, cat)=>{
        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Modify' )
        if(!access)
        {
            dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else
        {
        let date = new Date()
        if(expense.date)
            date=convert(new Date (expense.date), 0)
        else
            date =convert(new Date (expense.createdAt), 0)
   
        let updateExpense = {cat:cat, title:expense.title, amount:expense.amount, date:date, 
        status:expense.status, id:expense.id, addAmount:''}
    
        dispatchExpenes({type:'UPDATEDATA', payload:updateExpense})
        toggleModal()}
    }

    const handleConfrimAddIncome =async(type)=>{
        try
        {
            if(type)
            {
                toggleIncomeDialog()
                await AddIncome({cat:'LOANRETURN', title:`From Expense: ${expenseData.title}`, amount:expenseData.amount, status:'PENDING', date:expenseData.date, myToken:session[0].token, myId:session[0]._id  })
                const res = await AddExpense({...expenseData, addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})
                if(res && res.message && res.message ==='SUCCESS')
                    dispatchSnack({type:'SAVESUCCESS'})
                else
                     dispatchSnack({type:'FAILED'})
    
                findExpense()
                dispatchLoading({type:'SAVEEND'})
                ResetEveryThing()
            }
            else
            {
                toggleIncomeDialog()
                const res = await AddExpense({...expenseData, addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})
                if(res && res.message && res.message ==='SUCCESS')
                    dispatchSnack({type:'SAVESUCCESS'})
                else
                     dispatchSnack({type:'FAILED'})
                findExpense()
                dispatchLoading({type:'SAVEEND'})
                ResetEveryThing()
            }
        }
        catch(err)
        {
            console.log(err)
        }

       
    }


    const CheckChanges= async(status)=>{
        let newItem = {...expenseData}
        delete newItem.createdAt
        delete newItem.id
        delete newItem._id
        delete newItem.updatedAt
        delete newItem.__v 
        
        if(!newItem.addAmount.length)
            delete newItem.addAmount
        let oldItem
        
        for (let i in purchaseData.cat)
        {       

                 oldItem = purchaseData.cat[i].titles.find(data=>data.id===expenseData.id)
                
                 if(oldItem)
                 {
                    oldItem.cat = purchaseData.cat[i].cat
                    oldItem.date =  convert(new Date (oldItem.date ), 0)
                    break
                 }
                    
        }
    
        let from={}, to={}
        for (var key of Object.keys(newItem)) {
          if(oldItem[key]!==newItem[key])
          {
            from[key]=oldItem[key]? oldItem[key] : 0
            to[key]=newItem[key] ? newItem[key] : 0
          }}
      if(Object.keys(from).length)
      {
        let type='other'
        if(to.qty || from.qty)
          type='qty'
        await AddLog({table:'expense', type, from, to, id:oldItem.id, by:session[0].username, name:`${oldItem.cat} => ${oldItem.title}`,
        status})
      }
      }

    
    const handleSubmitExpense =async(e)=>{
        try
        {
            e.preventDefault()
            if(isLoading.Save)
                return
            dispatchLoading({type:'SAVESTART'})
            if(expenseData.title.length>2 && expenseData.amount>0)
            {   let res
                if(expenseData.id)
                {
                    const id = expenseData.id
                    let addAmount = 0
                    if(expenseData.addAmount && expenseData.addAmount!==0)
                            addAmount+= parseInt(expenseData.addAmount)
                    let data= {...expenseData, amount:parseInt(expenseData.amount)+addAmount}
                    delete data.id, data.isDeleted
    
                    res = await UpdateExpense(id, data, {myToken:session[0].token, myId:session[0]._id})
    
                    await CheckChanges('update')
                    if(res && res.message && res.message ==='SUCCESS')
                        dispatchSnack({type:'UPDATESUCCESS'})
                    else
                        dispatchSnack({type:'FAILED'})
    
                        findExpense()
                        dispatchLoading({type:'SAVEEND'})
                        ResetEveryThing()
                    }
                else
                {
                    if(expenseData.cat==='LOAN')
                        {
                            toggleIncomeDialog()
                            
                        }
                    else
                        {
                            res = await AddExpense({...expenseData, addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})
                            if(res && res.message && res.message ==='SUCCESS')
                                dispatchSnack({type:'SAVESUCCESS'})
                            else
                                 dispatchSnack({type:'FAILED'})
                                 findExpense()
                                 dispatchLoading({type:'SAVEEND'})
                                 ResetEveryThing()
                        }
    
                }
            }
        }catch(err)
        {
            dispatchLoading({type:'SAVEEND'})
            console.log(err)
        }

    
       
    }

    const handleDeleteExpense =(expense)=>{
        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Delete' )
        if(!access)
        {
            dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else
        {
        let updateExpense = {id:expense.id}
        dispatchExpenes({type:'UPDATEDATA', payload:updateExpense})
        toggleDeleteDialog()}
    }
    
    const handleCloseDeleteDialog=()=>{
        toggleDeleteDialog()
        dispatchExpenes({type:'RESET', payload:expenseSchmea})
    }
    
    const handleConfirmDelete =async ()=>{
        dispatchLoading({type:'DELETESTART'})
        const res = await DeleteExpense(expenseData.id, {myToken:session[0].token, myId:session[0]._id})
        findExpense()
        dispatchLoading({type:'DELETEEND'})
        handleCloseDeleteDialog()
        if(res)
            dispatchSnack({type:'DELETESUCCESS'})
        else
            dispatchSnack({type:'FAILED'})
    }

return (
<React.Fragment>

<ModalStyle
theme={theme.themes[theme.active]}
       open={modalOpen}
       onClose={toggleModal}
       aria-labelledby="modal-modal-title"
       aria-describedby="modal-modal-description"
       >
        <ModalBoxStyle theme={theme.themes[theme.active]} >
           <form onSubmit={e=>handleSubmitExpense(e)}>

           <Typography id="modal-modal-title" variant="h6" sx={{color:'azure', textAlign:'center'}} >{expenseData.id ? 'UPDATE EXPENSE':'ADD EXPENSE'}</Typography>
           <FieldsBox theme={theme.themes[theme.active]}>
           <ModalSelectStyle
           theme={theme.themes[theme.active]}
           labelId='cat'
           name='cat'
           value={expenseData.cat}
           onChange={(e)=>dispatchExpenes({type:'CHANGEVAL', payload:e})}
           >
           {categories.map((cat, i)=>
           <MenuItem value={cat} key={i}>
               {cat}
           </MenuItem>)}
           </ModalSelectStyle> 
           <ModalTextFieldStyle theme={theme.themes[theme.active]} onChange={(e)=>dispatchExpenes({type:'CHANGEVAL', payload:e})} value={expenseData.title}
            name='title' variant='outlined' placeholder='Expense Title...' color='secondary'/>   
            <Box style={{display:'flex', gap:5}}>
            <ModalTextFieldStyle theme={theme.themes[theme.active]} onChange={(e)=>dispatchExpenes({type:'CHANGEVALINT', payload:e})} value={expenseData.amount}
            name='amount' variant='outlined' placeholder='Amount...' color='secondary'/>   
            {expenseData.id && <ModalTextFieldStyle theme={theme.themes[theme.active]} name='addAmount' onChange={(e)=>dispatchExpenes({type:'CHANGEVALINT', payload:e})} value={expenseData.addAmount}
            variant='outlined' placeholder='Add Amount...' color='secondary'/>    }
            </Box>  
            <ModalSelectStyle
            theme={theme.themes[theme.active]}
           labelId='status'
           name='status'
           value={expenseData.status}
           onChange={(e)=>dispatchExpenes({type:'CHANGEVAL', payload:e})}
           >
           <MenuItem value='COMPLETE'>COMPLETE</MenuItem>
           <MenuItem value='PENDING'>PENDING</MenuItem>
           </ModalSelectStyle> 
           <ModalTextFieldStyle theme={theme.themes[theme.active]}  onChange={(e)=>dispatchExpenes({type:'CHANGEVAL', payload:e})} value={expenseData.date}
           name='date' type='date' variant='outlined' color='secondary'/>   
          
           </FieldsBox>
           <ModalBtnBox theme={theme.themes[theme.active]}>
           <ModalBtn theme={theme.themes[theme.active]}  variant='contained' color='success' type='submit'>{isLoading.Save ? <CircularProgress /> : expenseData.id ? 'UPDATE':'SAVE'}</ModalBtn>
           <ModalBtn theme={theme.themes[theme.active]} variant='contained' color='success' onClick={ResetEveryThing} >CANCEL</ModalBtn>
           </ModalBtnBox>                
           </form>
           </ModalBoxStyle>
</ModalStyle>

<Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
        onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
         anchorOrigin={{ vertical:'top',horizontal:'center' }}>
            <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
                    {alertSnack.message}
            </Alert>
</Snackbar>

<BodyPaperStyle theme={theme.themes[theme.active]} >
    <List sx={{overflow:'auto', margin:0, padding:0}}>
    <ListSubHeaderStyle  theme={theme.themes[theme.active]} component="div" id="nested-list-subheader" >
    <TypographyStyle theme={theme.themes[theme.active]} variant='h6' >Expense</TypographyStyle>
    <BtnStyle theme={theme.themes[theme.active]} variant='contained' endIcon={<AddCircleOutlineIcon />} onClick={OpenAddNew} color='primary'>Add</BtnStyle>
    </ListSubHeaderStyle>
    {purchaseData.purchases  && 
       <ListItemHeadStyle component='div' theme={theme.themes[theme.active]}>
      
       <ListTextStyle variant='h6' theme={theme.themes[theme.active]}> 
       {purchaseData.purchases.title}
        </ListTextStyle>  
        
           <ListItemIcon>
           <ListTextStyle theme={theme.themes[theme.active]} variant='h6'> PKR. {purchaseData.purchases.amount} </ListTextStyle>
           </ListItemIcon>
    
       </ListItemHeadStyle> }

           {purchaseData.cat && purchaseData.cat && purchaseData.cat.map((cat, i)=>
           <React.Fragment key={i}>
           <ListItemHeadStyle onClick={()=>dispatchPurchaseData({type:'TOGGLEOPEN', index:i})} theme={theme.themes[theme.active]}>
           <ListItemButton sx={{padding:'0'}}>
           <ListTextStyle theme={theme.themes[theme.active]} variant='h6'> {cat.cat} </ListTextStyle> 
           <ListItemIcon >{cat.open ? <ExpandLess sx={{color:theme.themes[theme.active].icon}}/> :<ExpandMore sx={{color:theme.themes[theme.active].text}}/>}</ListItemIcon> 
           </ListItemButton>
           </ListItemHeadStyle>
           {cat.titles && cat.titles.length && cat.titles.map(title=>
               <Collapse in={cat.open} timeout="auto" unmountOnExit key={title.id}>
               <List sx={{padding:0}}>
                   <ListItemStyle theme={theme.themes[theme.active]} >
                       <ListTextStyle theme={theme.themes[theme.active]}  sx={{width:'60%'}}>{title.title}  </ListTextStyle>
                       <ListTextStyle theme={theme.themes[theme.active]}  sx={{width:'30%'}}>PKR. {title.amount} </ListTextStyle>
                           <ListItemIcon>
                               <IconButton onClick={()=>handleOpenUpdate(title, cat.cat)}> <EditIcon  sx={{color:theme.themes[theme.active].icon}}/> </IconButton>
                               <IconButton onClick={()=>handleDeleteExpense(title)}> <Delete  sx={{color:theme.themes[theme.active].down}}/> </IconButton>
                           </ListItemIcon>
                   </ListItemStyle>
              
               </List>
               <Divider/>
               </Collapse>
           )}
           </React.Fragment>
       )}
  
   </List>
   <ListSubFooterStyle theme={theme.themes[theme.active]} component="div" id="nested-list-subheader" >
   <TypographyStyle theme={theme.themes[theme.active]} variant ='body1'>Total: {purchaseData.total}</TypographyStyle>
   </ListSubFooterStyle>
</BodyPaperStyle>
 
<Dialog open={deleteDialog} 
       onClose={handleCloseDeleteDialog}
       aria-labelledby="dialoge-title">
       <DialogTitle id='dialoge-title' >Confirm to Delete</DialogTitle>
       <DialogActions > 
       <IconButton onClick={handleConfirmDelete}>
         {isLoading.Delete ? <CircularProgress /> :  <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
       </IconButton>
       <IconButton onClick={handleCloseDeleteDialog}>
           <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
       </IconButton>
       </DialogActions>
</Dialog>

<Dialog open={addIncomeDialog} 
       onClose={toggleIncomeDialog}
       aria-labelledby="dialoge-title">
       <DialogTitle id='dialoge-title' >Do you Want to Add this Expense to Receivables?</DialogTitle>
       <DialogActions > 
       <IconButton onClick={()=>handleConfrimAddIncome(true)}>
         {isLoading.Delete ? <CircularProgress /> :  <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
       </IconButton>
       <IconButton onClick={()=>handleConfrimAddIncome(false)}>
           <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
       </IconButton>
       </DialogActions>
</Dialog>

</React.Fragment>

  )
}

export default ExpenesReport