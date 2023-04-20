import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";

export const AddSupplier=async(supplier)=>{
    try{
        await axios.post(`${ServerIP}/suppliers/add`, supplier)
        return {message:'SUCCESS'}

    }catch(err)
    {
        console.log(err)
        return err
    }
   
}

export const UpdateSupplier =async (id, item, authUser)=>{
    try
    {
        const updateRes = await axios.put(`${ServerIP}/suppliers/update`, {_id:id, ...item,...authUser })
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


export const DeleteSupplier = async(id, isDeleted, authUser)=>{
    try{
        const deleteRes= await axios.put(`${ServerIP}/suppliers/update`, {_id:id, isDeleted, ...authUser})
        if(deleteRes.data)
            return {message:'SUCCESS'}
        else
            return {message:'FAILED'}
    }catch(err)
    {
        return err
    }
}

export const FindSupplier = async (filter, autUser)=>{
    var isAvailable;
    if(filter.length>2)
    {
      const res=  await axios.get(`${ServerIP}/suppliers/findone`, {params:{name:filter,...autUser}})
      if(res && (res.data===null||res.data===false))
      {
          isAvailable=false
      }
      else
          isAvailable=true 
    }
    return isAvailable
}

export const FindSuppliers = async (filter, authUser)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/suppliers/findbyquery`, {params:{...filter, ...authUser}})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const SearchSuppliers = async (filter)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/suppliers/searchbyquery`, {params:filter})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

