import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";
import addDays from "date-fns/addDays";

export const AddSale=async(sale)=>{
    try{

        const res= await axios.post(`${ServerIP}/sales/add`, sale)
        if(res && res.data && res.data && res.data.saleID)
                     return {message:'SUCCESS', saleID:res.data.saleID}
        else
            return null

    }catch(err)
    {
        console.log(err)
        return null
    }
   
}


export const UpdateSale = async (id, sale, userAuth)=>{
    try
    {
            const res  = await axios.put(`${ServerIP}/sales/update`, {_id:id, ...sale, ...userAuth})
            if(res && res.data && res.data && res.data.saleID)
                return {message:'SUCCESS', saleID:res.data.saleID}
            else
                return null
    }
    catch(err)
    {
        console.log(err)
        return null
    }
}
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
export const findSales = async (filter)=>{
    try
    {
        let searchFilter=filter
        let resItems = null
        if(searchFilter.dates)
        {
            const date1 = convert(searchFilter.dates[0], 0)
            const date2 = convert(searchFilter.dates[1], 1)
            const newFilter = {...searchFilter, dates:[date1, date2]}
             resItems = await axios.get(`${ServerIP}/sales/findbyquery`, {params:newFilter})
        }
        else
        {
            resItems = await axios.get(`${ServerIP}/sales/findbyquery`, {params:searchFilter})
        }
        
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const findonesale = async (filter)=>{
    try
    {
        let resItems = null
        resItems = await axios.get(`${ServerIP}/sales/findone`, {params:filter})
        if (resItems && resItems.data)
            return resItems.data
        else 
            return null

    }catch(err){
        return null
    }
}

export const findDeletedSales = async (authUser)=>{
    try
    {
        let resItems = null
        resItems = await axios.get(`${ServerIP}/sales/finddeletedsale`, {params:{...authUser}})
        if (resItems && resItems.data)
            return resItems.data
        else 
            return null

    }catch(err){
        return null
    }

}

export const toggleDeleteSale = async (id, isDeleted, authUser)=>{
    try
    {
        const res  = await axios.put(`${ServerIP}/sales/update`, {_id:id, isDeleted:isDeleted, ...authUser})
            if(res && res.data && res.data.saleID)
                return {message:'SUCCESS'}
            else
                return null
    }
    catch(err)
    {
        console.log(err)
        return null
    }
}

export const DeletePermanent = async (_id, authUser)=>{
    try
    {
        let resItems = null
        resItems = await axios.delete(`${ServerIP}/sales/deletepermanent`, {params:{_id, ...authUser}})
        if (resItems && resItems.data )
            return {message:'SUCCESS', data:resItems.data}
        else 
            return null

    }catch(err){
        return null
    }

}

export const getGraphs = async (filter)=>{
    try{
        let searchFilter={...filter}

        if(filter[0]!==null && filter[1]!== null)
            {
            searchFilter.fromDate=convert(filter[0])
            const toDate = new Date(filter[1]).setDate(filter[1].getDate()+1)
            searchFilter.toDate= convert(toDate)
            }
            const res = await axios.get(`${ServerIP}/sales/getgraphs`, {params:searchFilter} )
            if(res && res.data)
                return res.data
            else
                return null
        }
        catch (err)
        {
            return (null)
        }
            
}

export const GetSales = async (authUser, date)=>{
    try
    {   
        let today = new Date(), tomorrow= new Date()
        if(date!==null && date!==undefined)
        {
        today = convert(date, 0)
        tomorrow= convert(date, 1)
        }
        else
        {
            today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
            tomorrow= new Date(today.getFullYear(), today.getMonth(), today.getDate()+1)
            
        }
        const resItems = await axios.get(`${ServerIP}/sales/getsales` , {params:{today, tomorrow, ...authUser}})
    
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const FindSalesData = async (userAuth)=>{
    try
    {
        const today = new Date(), tomorrow = new Date()
        today = convert(today,0)
        tomorrow= convert (tomorrow, 1)
        const resItems = await axios.get(`${ServerIP}/sales/getsalesinfo` , {params:{today, tomorrow, ...userAuth}})
    
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}