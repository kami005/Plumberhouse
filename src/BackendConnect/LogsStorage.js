import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";

export const AddLog=async(log)=>{
    try{
        const res=await axios.post(`${ServerIP}/logs/add`, log)
        if(res && res.data)
        return {message:'SUCCESS', data:res.data}

    }catch(err)
    {
        console.log(err)
        return err
    }
}

export const FindLogsByQuery=async(filter)=>{
    try{
        const res=await axios.get(`${ServerIP}/logs/findbyquery`, {params:{...filter}})
        if(res && res.data)
        return res.data
        else
            return []
    }catch(err)
    {
        console.log(err)
        return err
    }
}

