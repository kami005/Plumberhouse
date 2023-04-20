import { Checkbox, Collapse, Divider,  FormControlLabel,  IconButton,  MenuItem,  Modal, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import { DataBox, FooterBox, ItemBox, ListItemStyle, LogsButtonBox, MainBox, ModalBox, RecDataBox } from '../../styles/DetailModelStyle'
import { FindPurchaseReport } from '../BackendConnect/ExpenseStorage'
import {FindSaleReport } from '../BackendConnect/IncomeStorage'
import { findPurchases } from '../BackendConnect/PurchaseStorage'
import { findSales } from '../BackendConnect/SaleStorage'
import { useToggle } from '../CustomHooks/RandHooks'
import Linearprogress from '../../pages/api/linearprogress'
import { SessionContext } from '../Context/SessionContext'
import { ExpandLess, ExpandMore, Refresh, Search } from '@mui/icons-material'
import { FindLogsByQuery } from '../BackendConnect/LogsStorage'

const DetailModal = (props) => {
    let Limit=50
    const {sale, purchase, item, open, onclose, logs, income, expense}= props
    const tables=['items', 'expense', 'income']
    const [isLoading, toggleLoading] = useToggle(true)
    const [data, setData] = useState()
    const context = useContext(SessionContext)
    const {session, theme} = context
    const [searchBy, setSearchBy] = useState(tables[0])
    const [checked, toggleChecked] = useToggle(false)
    const [textVal, setTextVal] = useState('')
    const FindReport = async()=>{
        try
        {
            let res
            if(sale)
            {  
                res = await FindSaleReport({saleID:sale.saleID, myToken:session[0].token, myId:session[0]._id})
                if(res && res.length)
                {
    
                    for( let i=0;i<res.length;i++)
                    {
                        res[i].open=false
                    }
                 setData({saleData:res, type:'SALE',  rec:{...sale, open:false}})
                }
                else
                    setData({rec:{...sale, open:false}})
       
            }
            else if (purchase)
            {
          
                res =await FindPurchaseReport({purchaseID:purchase.purchaseID, myToken:session[0].token, myId:session[0]._id})
                for( let i=0;i<res.length;i++)
                {
                    res[i].open=false
                }
                if (res && res.length)
                {
                    setData({purchaseData:res, type:'PURCHASE', rec:{...purchase, open:false}})
                }
                else
                {
                    setData({rec:{...purchase, open:false}})
                }
               
            }
               
            else if (item)
            {
                let saleFreq=0, qtySold=0, purchaseFreq=0, qtyPurchased=0
            
                const saleRec = await findSales({'orders._id':item._id, myToken:session[0].token, myId:session[0]._id})
                
                if(saleRec)
                    for(let i=0; i<saleRec.length;i++)
                    {
                        saleFreq+=1
                        for(let j=0;j<saleRec[i].orders.length;j++)
                        {
                            if(saleRec[i].orders[j]._id===item._id)
                                qtySold+=saleRec[i].orders[j].qty
                        }
                    }
    
                const purchaseRec = await findPurchases({'orders._id':item._id, myToken:session[0].token, myId:session[0]._id})

                if(purchaseRec)
                for(let i=0; i<purchaseRec.length;i++)
                {
                    purchaseFreq+=1
                    for(let j=0;j<purchaseRec[i].orders.length;j++)
                    {
                        if(purchaseRec[i].orders[j]._id===item._id)
                            qtyPurchased+=purchaseRec[i].orders[j].qty
                    }
                }
                
                let itemLogs = await FindLogsByQuery({id:item._id})
                if(itemLogs && itemLogs.length)
                for( let i=0;i<itemLogs.length;i++)
                {
                    itemLogs[i].open=false
                }
                setData({saleFreq, qtySold, purchaseFreq, qtyPurchased, type:'ITEM', logs:itemLogs})
            }
            else if(logs !== undefined && logs !== null)
            {
                setData({logs:[], type:'LOGS'})
            }
            else if(income)
            {
                setData({saleData:{...income, open:false}, type:'INCOME'})
            }
            else if(expense)
            {
                setData({purchaseData:{...expense, open:false}, type:'EXPENSE'})
            }

            toggleLoading()
        }catch(err)
        {
            toggleLoading()
            console.log(err)
        }

    }

    const LoadLogs = async(e)=>{
        try
        {
            if(e)
                e.preventDefault()
            toggleLoading()
            let skip= 0
            let searchVal
            searchVal = document.getElementById('searchByUsername')       
            let filter ={limit:Limit, skip:skip, table:searchBy}
            if(checked)
                filter=   {...filter, $or:[ {'type':'qty'}, {'type':'Delete'} ]}
            if(searchVal && searchVal.value && searchVal.value.length>2)
                        filter.by=searchVal.value.trim()
            let logRec= await FindLogsByQuery({...filter})
            for( let i=0;i<logRec.length;i++)
            {
                logRec[i].open=false
            }
            setData({logs:logRec, type:'LOGS'})
           
            toggleLoading()
                   
        }catch(err)
        {
            toggleLoading()
            console.log(err)
        }
 
    }
    
    const LoadMoreLogs=async()=>{
        toggleLoading()
        let skip= data.logs.length
        let logData = data.logs
        let searchVal
        searchVal = document.getElementById('searchByUsername')       
        let filter ={limit:Limit, skip:skip, table:searchBy}
        if(checked)
        filter=   {...filter, $or:[ {'type':'qty'}, {'type':'Delete'} ]}
        if(searchVal && searchVal.value && searchVal.value.length>2)
                    filter.by=searchVal.value.trim()
        let logRec = await FindLogsByQuery({...filter})
        for( let i=0;i<logRec.length;i++)
        {
            logData.push({...logRec[i], open:false})
        }
        setData({logs:logData, type:'LOGS'})
        toggleLoading()
    }

    const HandleOpen =(type, index)=>{
           if(type==='saleData')
           {
            let saleData = data.saleData
            saleData[index].open=! saleData[index].open
            setData({...data, saleData})
           }
           else if(type==='purchaseData')
           {
            let purchaseData = data.purchaseData
            purchaseData[index].open=! purchaseData[index].open
            setData({...data, purchaseData})
           }
           else if(type ==='itemData')
           {
            let logsData = data.logs
            logsData[index].open=! logsData[index].open
            setData({...data, logsData})
           }
           else if(type ==='EXPENSE')
           {
            setData({purchaseData:{...data.purchaseData, open:!data.purchaseData.open}, type:'EXPENSE'})
           }
           else if(type ==='INCOME')
           {
            setData({saleData:{...data.saleData, open:!data.saleData.open}, type:'INCOME'})
           }
    }

    const handlesearchByChange=(e)=>{
        setSearchBy(e.target.value)
      }
    useEffect(()=>{
        FindReport()
    },[])

    useEffect(()=>{
        if(data && data.type==='LOGS')
        LoadLogs()
    },[checked])

    const ConvertDate =(date)=>{
        let newDate = date
        newDate = new Date(newDate)
        newDate = `${newDate.getDate()}-${newDate.getMonth()+1}-${newDate.getFullYear()} at ${newDate.getHours()}:${newDate.getMinutes()} hours`
        return newDate.toString()
    }
    
    const GetHeader =()=>{
        if(sale && data && data.rec)
        {
            return <React.Fragment>
                        <RecDataBox theme={theme.themes[theme.active]} onClick={()=>setData({...data, rec:{...data.rec, open:!data.rec.open}})} >
                        <Typography variant='body1'>Sale Price Rs. { data.rec && data.rec.gTotal}</Typography>
                        <Typography variant='body1'>Purchase Price Rs.{data.rec && data.rec.pAmount}</Typography>
                        <Typography variant='body1'>Profit Rs.{data.rec && (data.rec.gTotal - data.rec.pAmount)}</Typography>
                        {(data && data.rec && data.rec.desc) && <Typography variant='body1'>,Desc: {data.rec.desc}</Typography>}
                        {(data.rec && data.rec.open) ? <ExpandLess />:<ExpandMore /> }
                        </RecDataBox>
                        {(data.rec && data.rec.open) &&  <ListItemStyle theme={theme.themes[theme.active]}>
                        <Typography variant='body1' sx={{width:'70%', fontWeight:700,  marginLeft:'0.5rem'}}>Item</Typography>
                        <Typography variant='body1' sx={{width:'15%',fontWeight:700}}>Price</Typography>
                        <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>Qty</Typography>
                        <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>unitDisc</Typography>
                        <Divider variant='middle'/>
                        </ListItemStyle>}
                        {data.rec && data.rec.orders.map(item=>
                        <Collapse in={data.rec && data.rec.open} timeout="auto" unmountOnExit key={item._id}>
                            <ListItemStyle theme={theme.themes[theme.active]} >
                            <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{item.itemName}</Typography>
                            <Typography variant='body1' sx={{width:'15%'}}>{item.price}</Typography>
                            <Typography variant='body1' sx={{width:'15%'}}>{item.qty}</Typography>
                            <Typography variant='body1' sx={{width:'10%'}}>{item.unitDisc}</Typography>
                            </ListItemStyle>
                        </Collapse>)}
            </React.Fragment>
        }
        else if(purchase && data && data.rec)
        {
            return <React.Fragment>
            <RecDataBox onClick={()=>setData({...data, rec:{...data.rec, open:!data.rec.open}})} theme={theme.themes[theme.active]}>
            <Typography variant='body1'>Stock Price Rs. {data.rec.gTotal }</Typography>
            <Typography variant='body1'>Paid Rs. {data.rec.paid }</Typography>
            <Typography variant='body1'>Remaining Rs. {data.rec.gTotal - data.rec.paid }</Typography>
            {data.rec.open ? <ExpandLess />:<ExpandMore /> }
            </RecDataBox>
            {data.rec.open &&  <ListItemStyle theme={theme.themes[theme.active]}>
            <Typography variant='body1' sx={{width:'70%', fontWeight:700,  marginLeft:'0.5rem'}}>Item</Typography>
            <Typography variant='body1' sx={{width:'15%',fontWeight:700}}>Price</Typography>
            <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>Qty</Typography>
            <Divider variant='middle'/>
            </ListItemStyle>}
            {data.rec && data.rec.orders.map(item=>
            <Collapse in={data.rec.open} timeout="auto" unmountOnExit key={item._id}>
                <ListItemStyle theme={theme.themes[theme.active]}>
                <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{item.itemName}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{item.price}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{item.qty}</Typography>
                </ListItemStyle>
            </Collapse>)}
            </React.Fragment>
        }
        else if (logs && data && data.logs)
        {
            return  <form onSubmit={e=>LoadLogs(e)}>
            <LogsButtonBox theme={theme.themes[theme.active]}>
            <TextField select size='small' variant='outlined' label='Search By' placeholder='Search By' 
            name='selectSearchBy' value={searchBy} onChange={handlesearchByChange}>
            {tables.map(table=><MenuItem key={table} value={table}>{table.toUpperCase()}</MenuItem>)}
             </TextField>
            <TextField size ='small' variant='outlined' value={textVal} onChange={e=>setTextVal(e.target.value)} placeholder='Search By DEO' id='searchByUsername'    
             InputProps={{endAdornment: (<IconButton type='submit'><Search /></IconButton>),}} />
                 <FormControlLabel label='Danger Only' control={<Checkbox onChange={toggleChecked} checked={checked}/> }  />
                 <FooterBox>
                     <IconButton disabled={!data || !data.logs || !data.logs.length} onClick={()=>LoadMoreLogs()}>
                     <Refresh />
                     </IconButton>
                     <Typography variant='body2'>Rows {data && data.logs ? data.logs.length : 0}</Typography>
                 </FooterBox>
            </LogsButtonBox>

            </form>
        }
     

    }

    const GetLogsDetail =(index)=>{
        let status=[] 
        let from = data.logs[index].from, to = data.logs[index].to

        for (var key of Object.keys(from))
        {
            status.push(`${key}: ${from[key]}=>${to[key]}`) 
        }
        return   <React.Fragment>
                {status.map((stat, i)=>
                 <Collapse in={data.logs[index].open} timeout="auto" unmountOnExit key={i}>
                 <ListItemStyle theme={theme.themes[theme.active]}>
                <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{stat}</Typography>
                </ListItemStyle>
                </Collapse>)} 
                </React.Fragment>
    }


    const FindPayment = (dataFinding, id)=>{
        if(purchase)
        {
            const payment = dataFinding.find(payment=>payment.purchaseID===id)
           return payment.amount
        }
        else if(sale)
        {
            const payment = dataFinding.find(payment=>payment.saleID===id)
           return payment.amount
        }
       
    }
    const GetItem =()=>{
        if(data && data.type==='ITEM')
        return <MainBox theme={theme.themes[theme.active]}>
            <ItemBox theme={theme.themes[theme.active]}>
             <Typography variant='body1' sx={{fontWeight:700}}>{item.itemName}, Stock : {item.qty}</Typography>
            <Typography variant='body1'>Sold {data.saleFreq} times, Sold Quantity {data.qtySold} </Typography>
            <Typography variant='body1'>Purchased {data.purchaseFreq} times, Purchase Quantity {data.qtyPurchased} </Typography>
            </ItemBox>
            {data.logs && data.logs.length ? data.logs.map((log, i)=>
            <React.Fragment key={log._id}>
            <DataBox className={log.type} theme={theme.themes[theme.active]} onClick={()=>HandleOpen('itemData', i)} >
                <Typography variant='body2'>{log.by+' '+log.status+' '+log.type} on {ConvertDate(log.createdAt)}</Typography>
                {log.open ? <ExpandLess />:<ExpandMore /> }
            </DataBox>
            {GetLogsDetail(i)}
            </React.Fragment>
            ): null}
        </MainBox>

        else 
        if(data && (data.type==='SALE'))
        return<MainBox theme={theme.themes[theme.active]}>

        {data.saleData.map((incomeData,i)=>
        <React.Fragment key={incomeData._id}>
        
        <DataBox theme={theme.themes[theme.active]} onClick={()=>HandleOpen('saleData', i)}>
        <Typography variant='body1'>{incomeData.cat}:</Typography>
        <Typography variant='body1'>{incomeData.addedBy} {incomeData.amount>0 ? 'RECEIVED': 'RETURNED'} Rs. {incomeData.title  !== 'BULKPAYMENT' ?
         incomeData.amount: incomeData.sales.length && FindPayment(incomeData.sales, data.rec.saleID)} on {ConvertDate(incomeData.createdAt) }</Typography>
        {incomeData.open ? <ExpandLess />:<ExpandMore />}
        </DataBox>
        {(incomeData.open && incomeData.items.length) ?
        <React.Fragment>
        <ListItemStyle theme={theme.themes[theme.active]} >
        <Typography variant='body1' sx={{width:'70%', fontWeight:700,  marginLeft:'0.5rem'}}>Item</Typography>
        <Typography variant='body1' sx={{width:'15%',fontWeight:700}}>Price</Typography>
        <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>Qty</Typography>
        <Divider variant='middle'/>
        </ListItemStyle>
        {incomeData.items.map(items=>
        <Collapse in={incomeData.open} timeout="auto" unmountOnExit key={items.id}>
            <ListItemStyle theme={theme.themes[theme.active]}>
            <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{items.name}</Typography>
            <Typography variant='body1' sx={{width:'15%'}}>{items.price}</Typography>
            <Typography variant='body1' sx={{width:'15%'}}>{items.qty}</Typography>
            </ListItemStyle>
        </Collapse>)}
        </React.Fragment> :
       null
        }

        </React.Fragment>)}
        </MainBox>
        else 
            if(data && (data.type==='PURCHASE'))
            return<MainBox theme={theme.themes[theme.active]}>
            {data.purchaseData.map((expenseData,i)=>
            <React.Fragment key={expenseData._id}>
            <DataBox theme={theme.themes[theme.active]} onClick={()=>HandleOpen('purchaseData', i)}>
            <Typography variant='body1'>{expenseData.cat}:</Typography>
            <Typography variant='body1'>{expenseData.addedBy} {expenseData.amount>0 ? 'PAID': 'REIMBURSED'} Rs. {expenseData.title  !== 'BULKPAYMENT' ? 
            expenseData.amount: expenseData.purchases.length && FindPayment(expenseData.purchases, data.rec.purchaseID)} on {ConvertDate(expenseData.createdAt) }</Typography>
            {expenseData.open ? <ExpandLess />:<ExpandMore />}
            </DataBox>
            {(expenseData.open && expenseData.items.length) ?
            <React.Fragment>
            <ListItemStyle theme={theme.themes[theme.active]}>
            <Typography variant='body1' sx={{width:'70%', fontWeight:700,  marginLeft:'0.5rem'}}>Item</Typography>
            <Typography variant='body1' sx={{width:'15%',fontWeight:700}}>Price</Typography>
            <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>Qty</Typography>
            <Divider variant='middle'/>
            </ListItemStyle>
            {expenseData.items.map(items=>
            <Collapse in={expenseData.open} timeout="auto" unmountOnExit key={items.id}>
                <ListItemStyle theme={theme.themes[theme.active]}>
                <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{items.name}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{items.price}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{items.qty}</Typography>
                </ListItemStyle>
            </Collapse>)}
            </React.Fragment> :null}

            </React.Fragment>)}
            </MainBox>
        else if (data && (data.type==='LOGS' ))
        {
            return <MainBox  sx={{ overflow:'auto',height:'85%'}} theme={theme.themes[theme.active]}>
            {data.logs && data.logs.length ? data.logs.map((log, i)=>
            <React.Fragment key={log._id}>
            <DataBox type={log.type}  theme={theme.themes[theme.active]} onClick={()=>HandleOpen('itemData', i)} >
                <Typography variant='body2'>{log.by+' '+log.status+' '} {log.name && log.name!==undefined ? log.name : ' id: '+log.id} {' from '+ log.table+' '} on {ConvertDate(log.createdAt)}</Typography>
                {log && log.open ? <ExpandLess />:<ExpandMore /> }
            </DataBox>
            {GetLogsDetail(i)}
            </React.Fragment>
            ): null}
        </MainBox>
        }
        else if (data && data.type==='INCOME')
        {
            return<MainBox theme={theme.themes[theme.active]}>

            <React.Fragment>
            <DataBox theme={theme.themes[theme.active]} onClick={()=>HandleOpen('INCOME')}>
            <Typography variant='body1'>{data.saleData.cat}:</Typography>
            <Typography variant='body1'>{data.saleData.addedBy} {data.saleData.amount>0 ? 'RECEIVED': 'RETURNED'} Rs. {data.saleData.amount} on {ConvertDate(data.saleData.createdAt) }</Typography>
            {data.saleData.open ? <ExpandLess />:<ExpandMore />}
            </DataBox>
            {(data.saleData.open && data.saleData.title !=='BULKPAYMENT' && data.saleData.items.length  ) ?
            <React.Fragment>
            <ListItemStyle theme={theme.themes[theme.active]}>
            <Typography variant='body1' sx={{width:'70%', fontWeight:700,  marginLeft:'0.5rem'}}>Item</Typography>
            <Typography variant='body1' sx={{width:'15%',fontWeight:700}}>Price</Typography>
            <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>Qty</Typography>
            <Divider variant='middle'/>
            </ListItemStyle>
            {data.saleData.items.map(items=>
            <Collapse in={data.saleData.open} timeout="auto" unmountOnExit key={items.id}>
                <ListItemStyle theme={theme.themes[theme.active]}>
                <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{items.name}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{items.price}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{items.qty}</Typography>
                </ListItemStyle>
            </Collapse>)}
            </React.Fragment> : 
            (data.saleData.open && data.saleData.title ==='BULKPAYMENT' && data.saleData.sales.length  ) && 
            <React.Fragment>
           {data.saleData.sales.map(items=>
           <Collapse in={data.saleData.open} timeout="auto" unmountOnExit key={items.id}>
               <ListItemStyle theme={theme.themes[theme.active]}>
               <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>Sale ID:{ items.saleID}, amount:  Rs. {items.amount}</Typography>
               </ListItemStyle>
           </Collapse>)}
           </React.Fragment> 
                    }

            </React.Fragment>
            </MainBox>
        }
        else if (data && data.type==='EXPENSE')
        {
            return<MainBox theme={theme.themes[theme.active]}>

            <React.Fragment>
            <DataBox theme={theme.themes[theme.active]} onClick={()=>HandleOpen('EXPENSE')}>
            <Typography variant='body1'>{data.purchaseData.cat}:</Typography>
            <Typography variant='body1'>{data.purchaseData.addedBy} {data.purchaseData.amount>0 ? 'PAID': 'REIMBURSED'} Rs. {data.purchaseData.amount} on {ConvertDate(data.purchaseData.createdAt) }</Typography>
            {data.purchaseData.open ? <ExpandLess />:<ExpandMore />}
            </DataBox>
            {(data.purchaseData.open && data.purchaseData.title !=='BULKPAYMENT' && data.purchaseData.items.length  ) ?
            <React.Fragment>
            <ListItemStyle theme={theme.themes[theme.active]}>
            <Typography variant='body1' sx={{width:'70%', fontWeight:700,  marginLeft:'0.5rem'}}>Item</Typography>
            <Typography variant='body1' sx={{width:'15%',fontWeight:700}}>Price</Typography>
            <Typography variant='body1' sx={{width:'10%',fontWeight:700}}>Qty</Typography>
            <Divider variant='middle'/>
            </ListItemStyle>
            {data.purchaseData.items.map(items=>
            <Collapse in={data.purchaseData.open} timeout="auto" unmountOnExit key={items.id}>
                <ListItemStyle theme={theme.themes[theme.active]}>
                <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>{items.name}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{items.price}</Typography>
                <Typography variant='body1' sx={{width:'15%'}}>{items.qty}</Typography>
                </ListItemStyle>
            </Collapse>)}
            </React.Fragment> : 
            (data.purchaseData.open && data.purchaseData.title ==='BULKPAYMENT' && data.purchaseData.purchases.length  ) && 
            <React.Fragment>
           {data.purchaseData.purchases.map(items=>
           <Collapse in={data.purchaseData.open} timeout="auto" unmountOnExit key={items.id}>
               <ListItemStyle theme={theme.themes[theme.active]}>
               <Typography variant='body1' sx={{width:'70%', marginLeft:'0.5rem'}}>Bill ID:{ items.purchaseID}, amount:  Rs. {items.amount} </Typography>
               </ListItemStyle>
           </Collapse>)}
           </React.Fragment> 
                    }

            </React.Fragment>
            </MainBox>
        }
    }

  return (
    <Modal
    open={open}
    onClose={onclose}
    aria-labelledby="parent-modal-title"
    aria-describedby="parent-modal-description">
    <ModalBox theme={theme.themes[theme.active]} sx={{ overflow:'auto',height:'100%'}} >
    {isLoading ?
    <React.Fragment>
        <Linearprogress />
        <Typography variant='h6' sx={{color:'white', textAlign:'center'}}>Generating Report...</Typography>
    </React.Fragment>
     :
    data && <React.Fragment>
    {GetHeader()}
    {GetItem()}
     </React.Fragment>
    }
    </ModalBox>

  </Modal>
  )
}

export default DetailModal