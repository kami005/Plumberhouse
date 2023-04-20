import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";
import addDays from "date-fns/addDays";

 function convert(str, add) {
    let dateStr= str
    if(add ===undefined)
            add=0
   if (dateStr===null)
   {
    dateStr=new Date()
   
   }
   dateStr= addDays(dateStr, add)
    var date = new Date(dateStr),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
}

export const AddExpense=async(expense)=>{
    try{
        const res= await axios.post(`${ServerIP}/expense/add`, expense)
        if(res && res.data && res.data && res.data._id)
                     return {message:'SUCCESS', expenseID:res.data._id}
        else
            return null

    }catch(err)
    {
        console.log(err)
        return null
    }
   
}

export const UpdateExpense=async(id, expense, authUser)=>{
    try{
        const res= await axios.put(`${ServerIP}/expense/update`, {_id:id, expense, ...authUser})
        if(res && res.data && res.data._id)
                     return {message:'SUCCESS'}
        else
            return null

    }catch(err)
    {
        console.log(err)
        return null
    }
}

export const FindExpenses = async (date, userAuth)=>{
    try
    {
        let resItems 
        const newDate = convert(date, 0)
        resItems = await axios.get(`${ServerIP}/expense/findexpenses`, {params:{date:newDate, ...userAuth}})

        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }
}

export const FindExpensesWithQuery = async (query)=>{
    try
    {
        let resItems 
        resItems = await axios.get(`${ServerIP}/expense/findiwthquery`, {params:query})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }
}

export const DeleteExpense = async (id, authUser)=>{
    try
    {  
    const resItems = await axios.delete(`${ServerIP}/expense/delete/?`, {params:{_id:id, ...authUser}})

    if (resItems && resItems.data)
         return resItems.data
    return null

    }
    catch(err){
        return null
    }
}
export const FindPendingExpense = async (authUser)=>{
    try
    {
      const  resItems = await axios.get(`${ServerIP}/expense/findpending`, {params:{...authUser}} )

        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        return null
    }

}

export const FindPurchaseReport = async (query)=>{
    try
    {
        let resItems 
        resItems = await axios.get(`${ServerIP}/expense/findpurchasereport`, {params:query})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }
}

export const ExpenseFinancialReport = async (query)=>{
    try
    {
        let resItems 
        resItems = await axios.get(`${ServerIP}/expense/financialreport`, {params:query})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }
}