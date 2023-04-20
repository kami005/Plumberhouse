import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";

export const AddItem=async(item)=>{
    try{
        await axios.post(`${ServerIP}/items/add`, item)
        return {message:'SUCCESS'}

    }catch(err)
    {
        console.log(err)
        return err
    }
   
}

export const UpdateItem =async (id, item, authUser)=>{
    try
    {
        const updateRes = await axios.put(`${ServerIP}/items/update`, {...item, _id:id, ...authUser})
        if(updateRes && updateRes.data)
            return {message:'SUCCESS', data:updateRes.data}
        else
            return {message:'FAILED'}
    }
    catch(err)
    {
        return err
    }
}


export const DeleteItem = async(id, isDeleted, authUser)=>{
    try{
        const deleteRes= await axios.put(`${ServerIP}/items/update`, {_id:id, isDeleted, ...authUser})
        if(deleteRes.data)
            return {message:'SUCCESS'}
        else
            return {message:'FAILED'}
    }catch(err)
    {
        return err
    }
}

export const DeleteItemForever = async(id, authUser)=>{
    try{
        const deleteRes= await axios.delete(`${ServerIP}/items/delete`, {params:{_id:id, ...authUser}})
        if(deleteRes.data)
            return {message:'SUCCESS', data:deleteRes.data}
        else
            return {message:'FAILED'}
    }catch(err)
    {
        return err
    }
}


export const findItem = async (filter, authUser)=>{
    var isAvailable;
    if(filter.length>2)
    {
      const res=  await axios.get(`${ServerIP}/items/findone`, {params:{itemName:filter, ...authUser}})
      if(res && (res.data===null||res.data===false))
      {
          isAvailable=false
      }
      else
          isAvailable=true
    }
    return isAvailable
}

export const findItems = async (filter)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/items/findbyquery`, {params:filter})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const searchItems = async (filter)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/items/searchbyquery`, {params:filter})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

export const GetStockWorth = async (authUser)=>{
    try
    {
        const resItems = await axios.get(`${ServerIP}/items/findstockworth`, {params:{...authUser}})
        if (resItems && resItems.data)
            return resItems.data
        return null

    }catch(err){
        return null
    }

}

