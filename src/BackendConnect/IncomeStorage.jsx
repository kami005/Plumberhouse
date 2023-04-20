import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";
import addDays from "date-fns/addDays";

export const AddIncome=async(income)=>{
    try{
        const res= await axios.post(`${ServerIP}/income/add`, income)
        if(res && res.data && res.data && res.data._id)
                     return {message:'SUCCESS'}
        else
            return null

    }catch(err)
    {
        console.log(err)
        return null
    }
   
}

export const UpdateIncome=async(id, income, authUser)=>{
    try{
        const res= await axios.put(`${ServerIP}/income/update`, {_id:id, income, ...authUser})
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


export function convert(str, add) {
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



export const FindIncomes = async (date, userAuth)=>{
    try
    {
        let resItems 
        const newDate = convert(date, 0)
        resItems = await axios.get(`${ServerIP}/income/findIncomes`, {params:{date:newDate, ...userAuth}})

        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        return null
    }

}

export const DeleteIncome = async (id, authUser)=>{
    try
    {  
    const resItems = await axios.delete(`${ServerIP}/income/delete/?`, {params:{_id:id, ...authUser}})
    if (resItems && resItems.data)
         return resItems.data
    return null

    }
    catch(err){
        return null
    }

}

export const FindPendingIncomes = async (userAuth)=>{
    try
    {
      const  resItems = await axios.get(`${ServerIP}/income/findpending` , {params:{...userAuth}})

        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        return null
    }

}
export const FindIncomeWithQuery = async (query)=>{
    try
    {
        let resItems 
        resItems = await axios.get(`${ServerIP}/income/findiwthquery`, {params:query})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }

}

export const FindSaleReport = async (query)=>{
    try
    {
        let resItems 
        resItems = await axios.get(`${ServerIP}/income/findsalereport`, {params:{...query}})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }
}

export const IncomeFinancialReport = async (query)=>{
    try
    {
        let resItems 
        resItems = await axios.get(`${ServerIP}/income/financialreport`, {params:query})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }
    catch(err){
        console.log(err)
        return null
    }
}