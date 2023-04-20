import React, { useContext, useReducer} from 'react'
import { ModalTextFieldStyle, BodyPaperStyle,ListItemStyle, ListTextStyle, ModalBtnBox, ListItemHeadStyle,ListSubFooterStyle,  ModalSelectStyle, 
ListSubHeaderStyle, ModalStyle, ModalBoxStyle, FieldsBox, ModalBtn, BtnStyle, TypographyStyle} from '../../styles/IcomeReportStyle'
import { alertReducer, itemReducer, loadingReducer, useToggle } from '../CustomHooks/RandHooks';
import { AddIncome, DeleteIncome, UpdateIncome } from '../BackendConnect/IncomeStorage';
import {MenuItem, CircularProgress, Collapse, IconButton, List, ListItemButton, ListItemIcon, Typography, Alert, Snackbar, Dialog,
DialogTitle, DialogActions, Divider, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { CancelOutlined, CheckCircleOutline, Delete, ExpandLess, ExpandMore} from '@mui/icons-material'
import { convert } from '../BackendConnect/IncomeStorage';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { SessionContext } from '../Context/SessionContext';
import { AddExpense } from '../BackendConnect/ExpenseStorage';
import { AddLog } from '../BackendConnect/LogsStorage';
import { GetAccess } from '../Utils/Rand';

const IncomeReport = (props) => {
    
    const {saleData, dispatchSaleData, findIncome} = props
    const context = useContext(SessionContext)
    const {session, theme} = context
    const categories = ['INVESTMENT', 'LOANRETURN', 'SERVICE', 'LOAN', 'OTHER']
    const IncomeSchmea ={cat:categories[0], title:'',amount:'', date:convert(new Date(), 0), status:'COMPLETE', addAmount:0}
    const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false, Save:false})
    const [modalOpen, toggleModal] = useToggle()
    const [deleteDialog, toggleDeleteDialog] =useToggle()
    const [addExpDialog, toggleExpDialog] =useToggle()
    const [incomeData, dispatchIncome] =useReducer(itemReducer, IncomeSchmea )
    const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'Record Saved', isOpen:false, msgColor:'success'})
  
    const ResetEveryThing =()=>{
        toggleModal()
        dispatchIncome({type:'RESET', payload:IncomeSchmea})
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

    const handleOpenUpdate = async (income, cat)=>{
        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Modify' )
        if(!access)
        {
            dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else
        {
        let date = new Date()
        if(income.date)
            date=convert(new Date (income.date), 0)
        else
            date =convert(new Date (income.createdAt), 0)
        let updateIncome = {cat:cat, title:income.title, amount:income.amount, date:date, 
        status:income.status, id:income.id, addAmount:''}
    
        dispatchIncome({type:'UPDATEDATA', payload:updateIncome})
        toggleModal()}
    }
    

    const handleConfirmAddExpnse =async(type)=>{
        try
        {
            if(type)
            {
                toggleExpDialog()
                await AddExpense({cat:'LOANRETURN', title:`From Income: ${incomeData.title}`, amount:incomeData.amount, status:'PENDING', date:incomeData.date,myToken:session[0].token, myId:session[0]._id  })
                const res=await AddIncome({...incomeData, addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})

                if(res && res.message && res.message ==='SUCCESS')
                    dispatchSnack({type:'SAVESUCCESS'})
                else
                    dispatchSnack({type:'FAILED'})
    
                findIncome()
                dispatchLoading({type:'SAVEEND'})
                ResetEveryThing()
            }
            else
            {
                toggleExpDialog()
                const res=await AddIncome({...incomeData, addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})
                if(res && res.message && res.message ==='SUCCESS')
                    dispatchSnack({type:'SAVESUCCESS'})
                else
                    dispatchSnack({type:'FAILED'})
                findIncome()
                dispatchLoading({type:'SAVEEND'})
                ResetEveryThing()
            }
        }
        catch(err)
        {

        }

       
    }

    const CheckChanges= async(status)=>{
        let newItem = {...incomeData}
        delete newItem.createdAt
        delete newItem.id
        delete newItem._id
        delete newItem.updatedAt
        delete newItem.__v 
        
        if(!newItem.addAmount.length)
            delete newItem.addAmount
        let oldItem
        for (let i in saleData.cat)
        {       
                 oldItem = saleData.cat[i].titles.find(data=>data.id===incomeData.id)
                 if(oldItem)
                 {
                    oldItem.cat = saleData.cat[i].cat
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
        await AddLog({table:'income', type, from, to, id:oldItem.id, by:session[0].username, name:`${oldItem.cat} / ${oldItem.title}`,
        status})
      }
      }


    const handleSubmitIncome =async(e)=>{
        try
        {
            e.preventDefault()
            if(isLoading.Save)
                return
            dispatchLoading({type:'SAVESTART'})
            if(incomeData.title.length>2 && incomeData.amount>0)
            {   let res
                if(incomeData.id)
                {
                    const id = incomeData.id
                    let addAmount = 0
                    if(incomeData.addAmount && incomeData.addAmount!==0)
                        addAmount+=parseInt(incomeData.addAmount)
    
                    let data= {...incomeData, amount:parseInt(incomeData.amount)+addAmount}
                    delete data.id, data.isDeleted

                    await CheckChanges('update')
                    
                    res = await UpdateIncome(id, data, {myToken:session[0].token, myId:session[0]._id})
    
                    if(res && res.message && res.message ==='SUCCESS')
                        dispatchSnack({type:'UPDATESUCCESS'})
                    else
                        dispatchSnack({type:'FAILED'})
    
                        findIncome()
                        dispatchLoading({type:'SAVEEND'})
                        ResetEveryThing()
                }
                else
                {
                    if(incomeData.cat==='LOAN')
                {
                    toggleExpDialog()
                    return
                }
                else
                {
                    res = await AddIncome({...incomeData, addedBy:session[0].username, isDeleted:false, myToken:session[0].token, myId:session[0]._id})
                    if(res && res.message && res.message ==='SUCCESS')
                        dispatchSnack({type:'SAVESUCCESS'})
                    else
                         dispatchSnack({type:'FAILED'})
    
                         findIncome()
                         dispatchLoading({type:'SAVEEND'})
                         ResetEveryThing()
                }
    
                }
            }
        }catch(er)
        {
            console.log(er)
            dispatchLoading({type:'SAVEEND'})
        }

    
    
    }

    const handleDeleteIncome =(income)=>{
        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Delete' )
        if(!access)
        {
            dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else
        {
            let updateIncome = {id:income.id}
            dispatchIncome({type:'UPDATEDATA', payload:updateIncome})
            toggleDeleteDialog()
        }
    
    }
    
    const handleCloseDeleteDialog=()=>{
        toggleDeleteDialog()
        dispatchIncome({type:'RESET', payload:IncomeSchmea})
    }
    
    const handleConfirmDelete =async ()=>{
        dispatchLoading({type:'DELETESTART'})
        const res = await DeleteIncome(incomeData.id, {myToken:session[0].token, myId:session[0]._id})
        findIncome()
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
       aria-describedby="modal-modal-description">
        <ModalBoxStyle theme={theme.themes[theme.active]}>
           <form onSubmit={e=>handleSubmitIncome(e)}>

           <Typography id="modal-modal-title" variant="h6" sx={{color:'azure', textAlign:'center', fontWeight:700}} >{incomeData.id ? 'UPDATE INCOME':'ADD INCOME'}</Typography>
           <FieldsBox theme={theme.themes[theme.active]}>
           <ModalSelectStyle
           theme={theme.themes[theme.active]}
           labelId='cat'
           name='cat'
           value={incomeData.cat}
           onChange={(e)=>dispatchIncome({type:'CHANGEVAL', payload:e})}
           >
           {categories.map((cat, i)=>
           <MenuItem value={cat} key={i}>
               {cat}
           </MenuItem>)}
           </ModalSelectStyle> 
           <ModalTextFieldStyle onChange={(e)=>dispatchIncome({type:'CHANGEVAL', payload:e})} value={incomeData.title}
            name='title' variant='outlined' label='Income Title...' placeholder='Income Title...' color='success'/>   
            <Box style={{display:'flex', gap:5}}>
            <ModalTextFieldStyle onChange={(e)=>dispatchIncome({type:'CHANGEVALINT', payload:e})} value={incomeData.amount}
            name='amount' variant='outlined' label='Amount...' placeholder='Amount...' color='success'/>   
            {incomeData.id && <ModalTextFieldStyle name='addAmount' onChange={(e)=>dispatchIncome({type:'CHANGEVALINT', payload:e})} value={incomeData.addAmount}
             variant='outlined' label='Add Amount...' placeholder='Add Amount...' color='success'/>    }
            </Box>

            <ModalSelectStyle
            theme={theme.themes[theme.active]}
            color='success'
           labelId='status'
           name='status'
           value={incomeData.status}
           onChange={(e)=>dispatchIncome({type:'CHANGEVAL', payload:e})}
           >
           <MenuItem value='COMPLETE'>COMPLETE</MenuItem>
           <MenuItem value='PENDING'>PENDING</MenuItem>
           </ModalSelectStyle> 
           <ModalTextFieldStyle theme={theme.themes[theme.active]}  onChange={(e)=>dispatchIncome({type:'CHANGEVAL', payload:e})} value={incomeData.date}
           name='date' type='date' variant='outlined' color='success'/>   
          
           </FieldsBox>
           <ModalBtnBox theme={theme.themes[theme.active]}>
           <ModalBtn  theme={theme.themes[theme.active]} variant='contained' color='success' type='submit'>{isLoading.Save ? <CircularProgress /> : incomeData.id ? 'UPDATE':'SAVE'}</ModalBtn>
           <ModalBtn theme={theme.themes[theme.active]}  variant='contained' color='success' onClick={ResetEveryThing} >CANCEL</ModalBtn>
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

<BodyPaperStyle  theme={theme.themes[theme.active]}>
    <List sx={{overflow:'auto', margin:0, padding:0}}>
    <ListSubHeaderStyle theme={theme.themes[theme.active]} component="div" id="nested-list-subheader" >
    <TypographyStyle theme={theme.themes[theme.active]} variant='h6'>Income</TypographyStyle>
    
    <BtnStyle theme={theme.themes[theme.active]} variant='contained' endIcon={<AddCircleOutlineIcon />} onClick={OpenAddNew} color='primary'>Add</BtnStyle>
    </ListSubHeaderStyle>
    {saleData.sales  && 
       <ListItemHeadStyle  component='div' theme={theme.themes[theme.active]}>
      
       <ListTextStyle variant='h6' theme={theme.themes[theme.active]}> 
       {saleData.sales.title}
        </ListTextStyle>  
        
           <ListItemIcon>
           <ListTextStyle theme={theme.themes[theme.active]} variant='h6'> PKR. {saleData.sales.amount} </ListTextStyle>
           </ListItemIcon>
    
       </ListItemHeadStyle> }

           {saleData.cat && saleData.cat && saleData.cat.map((cat, i)=>
           <React.Fragment key={i}>
           <ListItemHeadStyle theme={theme.themes[theme.active]} onClick={()=>dispatchSaleData({type:'TOGGLEOPEN', index:i})} >
           <ListItemButton sx={{padding:'0'}}>
           <ListTextStyle theme={theme.themes[theme.active]} variant='h6'> {cat.cat} </ListTextStyle> 
           <ListItemIcon >{cat.open ? <ExpandLess sx={{color:theme.themes[theme.active].icon}}/> :<ExpandMore sx={{color:theme.themes[theme.active].text}}/>}</ListItemIcon> 
           </ListItemButton>
           </ListItemHeadStyle>
           {cat.titles && cat.titles.length && cat.titles.map(title=>
               <Collapse in={cat.open} timeout="auto" unmountOnExit key={title.id}>
               <List sx={{padding:0}}>
                   <ListItemStyle theme={theme.themes[theme.active]} >
                       <ListTextStyle theme={theme.themes[theme.active]} sx={{width:'60%'}}>{title.title}  </ListTextStyle>
                       <ListTextStyle theme={theme.themes[theme.active]} sx={{width:'30%'}}>PKR. {title.amount} </ListTextStyle>
                           <ListItemIcon >
                               <IconButton onClick={()=>handleOpenUpdate(title, cat.cat)} > <EditIcon  sx={{color:theme.themes[theme.active].icon}}/> </IconButton>
                               <IconButton onClick={()=>handleDeleteIncome(title)}> <Delete  sx={{color:theme.themes[theme.active].down}}/> </IconButton>
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
   <TypographyStyle  theme={theme.themes[theme.active]}  variant ='body1'>Total: {saleData.total}</TypographyStyle>
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

<Dialog open={addExpDialog} 
       onClose={toggleExpDialog}
       aria-labelledby="dialoge-title">
       <DialogTitle id='dialoge-title' >Do you Want to Add this Income to Payables?</DialogTitle>
       <DialogActions > 
       <IconButton onClick={()=>handleConfirmAddExpnse(true)}>
         {isLoading.Delete ? <CircularProgress /> :  <CheckCircleOutline style={{color:'green', fontSize:'2rem'}} />}
       </IconButton>
       <IconButton onClick={()=>handleConfirmAddExpnse(false)}>
           <CancelOutlined style={{color:'red', fontSize:'2rem'}} />
       </IconButton>
       </DialogActions>
</Dialog>

</React.Fragment>

  )
}

export default IncomeReport