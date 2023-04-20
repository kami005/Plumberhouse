import React, {useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle,MainPaperStyle, SearchBoxStyle, SearchFirstBoxStyle, DateTextFieldStyle, 
SearchButtonStyle, BodyBoxStyle, GTotalBox, TypographyStyle, SearchFieldBox} from '../../styles/IncomeExpenseStyle'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {  alertReducer, incomeReducer, loadingReducer, useToggle } from '../CustomHooks/RandHooks';
import { FindIncomes, FindPendingIncomes } from '../BackendConnect/IncomeStorage';
import { Alert, Box, Checkbox, CircularProgress, FormControlLabel, Snackbar } from '@mui/material';
import IncomeReport from './IncomeReport';
import ExpenseReport from './ExpenseReport';
import {  SearchOutlined } from '@mui/icons-material';
import { FindExpenses, FindPendingExpense } from '../BackendConnect/ExpenseStorage';
import { EXPENSEKEY, INCOMEKEY } from '../DataSource/RandData';
import { FindPurchaseData } from '../BackendConnect/PurchaseStorage';
import { FindSalesData } from '../BackendConnect/SaleStorage';
import { SessionContext } from '../Context/SessionContext';
import { GetAccess } from '../Utils/Rand';
const IncomeExpense = () => {

    const [date, setDates] = useState(new Date())
    const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false, Save:false})
    const [saleData, dispatchSaleData] =  useReducer(incomeReducer, {sales:null, cat:null, total:0})
    const [purchaseData, dispatchPurchaseData] = useReducer(incomeReducer, {purchases:null, cat:null, total:0})
    const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
    const [searchPending, togglePending] = useToggle()
    const context = useContext(SessionContext)
    const {session, theme} = context
    const SetLocalStorage =async ()=>{
        localStorage.setItem(EXPENSEKEY, JSON.stringify(purchaseData))
        localStorage.setItem(INCOMEKEY, JSON.stringify(saleData))
    }

    const GetLocalStorage =()=>{
        const sale = JSON.parse(localStorage.getItem(INCOMEKEY));
        if(sale)
            dispatchSaleData({type:'STORAGE', data:sale})

        const purchase = JSON.parse(localStorage.getItem(EXPENSEKEY));
        if(purchase)
            dispatchPurchaseData({type:'STORAGE', data:purchase})

        if(sale && sale.cat && sale.cat.length && sale.cat[0].titles && sale.cat[0].titles.length && sale.cat[0].titles[0].status === 'PENDING')
            togglePending()
        else if (purchase && purchase.cat && purchase.cat.length && purchase.cat[0].titles && purchase.cat[0].titles.length && purchase.cat[0].titles[0].status === 'PENDING')
            togglePending()
    }

    const findIncome =async ()=>{
        const incomeAccess = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Search')
        if(incomeAccess)
        {
             if(searchPending)
            {
                    const saleRes = await FindSalesData({myToken:session[0].token, myId:session[0]._id})
                    if(saleRes && saleRes.receiveableAmount)
                    dispatchSaleData({type:'RECEIVEABLE', title:'Receiveable From Sales', total:saleRes.receiveableAmount})
                    else
                        dispatchSaleData({type:'RESET'})
        
                    const incomeRes =await FindPendingIncomes({myToken:session[0].token, myId:session[0]._id})
                    if(incomeRes && incomeRes.other )
                        dispatchSaleData({type:'OTHER', other:incomeRes.other})
                    else
                        dispatchSaleData({type:'RESET'})
    
            }
            else if(date)
            {
    
                    const res = await FindIncomes(date, {myToken:session[0].token, myId:session[0]._id})
                    if(res )
                    {
                        if(res.sales && res.sales[0])
                             dispatchSaleData({type:'SALES', sales:res.sales[0]})
                        else    
                            dispatchSaleData({type:'RESET'})
                        if(res.other)
                             dispatchSaleData({type:'OTHER', other:res.other})
                        if((!res.sales || !res.sales.length) && (!res.other || !res.other.length))
                            dispatchSaleData({type:'RESET'})
                    }  
      
            }
            dispatchSaleData({type:'CALC'})
        }

    }
    
    const findExpense =async ()=>{
        const expenseAccess = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Search' )
        if(expenseAccess)
        {
            if (searchPending)
            {
                const purchaseRes = await FindPurchaseData({myToken:session[0].token, myId:session[0]._id})
                if(purchaseRes && purchaseRes.payableAmount)
                dispatchPurchaseData({type:'PAYABLE', title:'Payable From Purchases', total:purchaseRes.payableAmount})
                else
                    dispatchPurchaseData({type:'RESET'})
                const expenseRes = await FindPendingExpense({myToken:session[0].token, myId:session[0]._id})
             
                if(expenseRes && expenseRes.other)
                    dispatchPurchaseData({type:'OTHER', other:expenseRes.other})
                else
                    dispatchPurchaseData({type:'RESET'})
            }
           else if(date)
            {
                const res = await FindExpenses(date, {myToken:session[0].token, myId:session[0]._id})
                if(res )
                {
                    if(res.purchases && res.purchases[0])
                        dispatchPurchaseData({type:'PURCHASES', purchases:res.purchases[0]})
                    else
                        dispatchPurchaseData({type:'RESET'})
                    if(res.other)
                        dispatchPurchaseData({type:'OTHER', other:res.other})
                    if((!res.purchases || !res.purchases.length) && (!res.other || !res.other.length))
                       dispatchPurchaseData({type:'RESET'})
                }    
            }
            dispatchPurchaseData({type:'CALC'})
        }
    }

    const handleSearch = async(e)=>{
        if(e)
        e.preventDefault()
        const incomeAccess = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Search')
        const expenseAccess = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Search' )
        if(!incomeAccess && !expenseAccess)
        {
          dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
        }
        else
        {
            dispatchLoading({type:'SEARCHSTART'})
            await findExpense()
            await findIncome()
            dispatchLoading({type:'SEARCHEND'})
        }
    }
    const GetGrandTotal=()=>{
        let amount = 0
        let isComplete = true
        if(saleData && saleData.cat && saleData.cat.length && saleData.cat[0].titles.length )
        {
            if(saleData.cat[0].titles[0].status==='COMPLETE')
            isComplete=true
            else if(saleData.cat[0].titles[0].status==='PENDING')
            isComplete=false
        }
        else if(purchaseData && purchaseData.cat && purchaseData.cat.length && purchaseData.cat[0].titles.length)
        {
            if(purchaseData.cat[0].titles[0].status==='COMPLETE')
            isComplete=true
            else if (purchaseData.cat[0].titles[0].status==='PENDING')
            isComplete=false
        }
       else
        isComplete =!searchPending

        if(saleData.total)
        amount +=saleData.total
        if(purchaseData.total)
        amount -=purchaseData.total
        
        //return amount
        if(isComplete)
        {
            if(amount>=0)
             return `Cash Balance Rs. ${amount}`
            else
             return `Negative Balance Rs. ${amount}`
        }
        else
        {
            if(amount>=0)
             return `Receiveables Rs. ${amount}`
            else
             return `Payables Rs. ${amount}`
        }


    }

useEffect(() => {
    GetLocalStorage()
}, []);

useEffect(() => {
    SetLocalStorage()
}, [saleData, purchaseData]);
  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
        <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}> 
            <form onSubmit={e=>handleSearch(e)}>
            <SearchBoxStyle theme={theme.themes[theme.active]}>
                <SearchFirstBoxStyle theme={theme.themes[theme.active]}>
                <SearchFieldBox theme={theme.themes[theme.active]}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                    views={['year', 'month']}
                    label="Year and Month"
                    minDate={new Date('2021-01-01')}
                    maxDate={new Date()}
                    value={date}
                    
                    onChange={(newValue) => {
                        setDates(newValue);
                    }}
                    renderInput={(params) => <DateTextFieldStyle theme={theme.themes[theme.active]} size='small' {...params} helperText={null} />}
                    />
                    </LocalizationProvider>
                    <FormControlLabel label='Pending' control={<Checkbox  checked={searchPending}  onChange={togglePending}/>}/>
                  
                    </SearchFieldBox>
                    <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' endIcon={<SearchOutlined />}>{isLoading.Search ? <CircularProgress color='inherit' /> :'Search'}</SearchButtonStyle>
                    

            </SearchFirstBoxStyle>
            </SearchBoxStyle>
            </form>
            
            <BodyBoxStyle theme={theme.themes[theme.active]}>
                    <IncomeReport  saleData={saleData} dispatchSaleData={dispatchSaleData} findIncome={findIncome}/>
                    <ExpenseReport  purchaseData={purchaseData} dispatchPurchaseData={dispatchPurchaseData} findExpense={findExpense}/>
                    <GTotalBox theme={theme.themes[theme.active]}> 
                    <TypographyStyle theme={theme.themes[theme.active]} variant='body1'>{GetGrandTotal()}</TypographyStyle>
                    </GTotalBox>
            </BodyBoxStyle>
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
    </MainBoxStyle>
  )
}

export default IncomeExpense