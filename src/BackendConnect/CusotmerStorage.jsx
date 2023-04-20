import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";

export const AddCustomer=async(customer)=>{
    try{
        await axios.post(`${ServerIP}/customers/add`, customer)
        return {message:'SUCCESS'}

    }catch(err)
    {
        console.log(err)
        return err
    }
   
}

export const UpdateCustomer =async (id, item, authUser)=>{
    try
    {
        const updateRes = await axios.put(`${ServerIP}/customers/update`, {...item, _id:id, ...authUser})
        if(updateRes && updateRes.data)
            return {message:'SUCCESS'}
        else
            return {message:'FAILED'}
    }
    catch(err)
    {
        return err
    }
}


export const DeleteCustomer = async(id, isDeleted, authUser)=>{
    try{
        const deleteRes= await axios.put(`${ServerIP}/customers/update`, {_id:id, isDeleted, ...authUser})
        if(deleteRes.data)
            return {message:'SUCCESS'}
        else
            return {message:'FAILED'}
    }catch(err)
    {
        return err
    }
}

export const FindCustomer = async (filter, authUser)=>{
    var isAvailable;
    if(filter.length>2)
    {
      const res=  await axios.get(`${ServerIP}/customers/findone`, {params:{customerName:filter,...authUser}})
      if(res && (res.data===null||res.data===false))
      {
          isAvailable=false
      }
      else
          isAvailable=true 
    }
    return isAvailable
}

export const FindCustomers = async (filter, autUser)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/customers/findbyquery`, {params:{...filter,...autUser}})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const searchCustomers = async (filter)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/customers/searchbyquery`, {params:filter})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

