import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";
import addDays from "date-fns/addDays";


export const AddPurchase=async(sale)=>{
    try{

        const res= await axios.post(`${ServerIP}/purchases/add`, sale)
        if(res && res.data && res.data && res.data.purchaseID)
                     return {message:'SUCCESS', purchaseID:res.data.purchaseID}
        else
            return null

    }catch(err)
    {
        console.log(err)
        return null
    }
   
}
export const DeletePermanent = async (_id, authUser)=>{
    try
    {
        let resItems = null
        resItems = await axios.delete(`${ServerIP}/purchases/deletepermanent`, {params:{_id, ...authUser }})
        if (resItems && resItems.data )
            return {message:'SUCCESS', data:resItems.data}
        else 
            return null

    }catch(err){
        return null
    }

}
export const UpdatePurchase = async (id, purchase, useAuth)=>{
    try
    {
            const res  = await axios.put(`${ServerIP}/purchases/update`, {_id:id, purchase, ...useAuth})
            if(res && res.data && res.data && res.data.purchaseID)
                return {message:'SUCCESS', purchaseID:res.data.purchaseID}
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
  
export const findPurchases = async (filter)=>{
    try
    {
        let searchFilter=filter
        let resItems = null
        if(searchFilter.dates && searchFilter.dates.length)
        {
            const date1 = convert(searchFilter.dates[0], 0)
            const date2 = convert(searchFilter.dates[1], 1)
            const newFilter = {...searchFilter, dates:[date1, date2]}
             resItems = await axios.get(`${ServerIP}/purchases/findbyquery`, {params:newFilter})
        }
        else
        {
            resItems = await axios.get(`${ServerIP}/purchases/findbyquery`, {params:searchFilter})
        }
        
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const findoneBill = async (filter)=>{
    try
    {
        let resItems = null
        resItems = await axios.get(`${ServerIP}/purchases/findone`, {params:filter})
        if (resItems && resItems.data)
            return resItems.data
        else 
            return null

    }catch(err){
        return null
    }

}

export const findDeletedBills = async (auth)=>{
    try
    {
        let resItems = null
        resItems = await axios.get(`${ServerIP}/purchases/finddeletedbill` , {params:auth})
        if (resItems && resItems.data)
            return resItems.data
        else 
            return null

    }catch(err){
        return null
    }

}

export const toggleDeleteBill = async (id, isDeleted, authUser)=>{
    try
    {
        const res  = await axios.put(`${ServerIP}/purchases/update`, {_id:id, isDeleted:isDeleted, ...authUser})
            if(res && res.data && res.data === true)
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

export const getPurchasesGraph = async (filter)=>{
    try{
        let searchFilter={}

        if(filter[0]!==null && filter[1]!== null)
            {
            searchFilter.fromDate=convert(filter[0])
            const toDate = new Date(filter[1]).setDate(filter[1].getDate()+1)
            searchFilter.toDate= convert(toDate)
            }
            const res = await axios.get(`${ServerIP}/purchases/getgraphs`, {params:searchFilter} )
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
export const FindPurchaseData = async (authUser)=>{
    try
    {
        const today = new Date(), tomorrow = new Date()
        today = convert(today,0)
        tomorrow= convert (tomorrow, 1)
        const resItems = await axios.get(`${ServerIP}/purchases/getpurchaseinfo` , {params:{today, tomorrow, ...authUser}})
    
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}