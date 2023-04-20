import axios from "axios";
import { ServerIP } from "../DataSource/BackendIP";

export const AddMessage=async(message)=>{
    try{
       const resp= await axios.post(`${ServerIP}/messages/add`, message)
       
        return {message:'SUCCESS' ,data:resp.data}

    }catch(err)
    {
        console.log(err)
        return err
    }
   
}

export const GetSentMessages=async(query)=>{
    try{
       const resp= await axios.put(`${ServerIP}/messages/getsentmessages`, {...query})
       
        return resp.data

    }catch(err)
    {
        console.log(err)
        return err
    }
   
}

export const GetReceiveMessages=async(query)=>{
    try{
       const resp= await axios.put(`${ServerIP}/messages/getreceivemessages`, {...query})
       
        return resp.data

    }catch(err)
    {
        console.log(err)
        return err
    }
}

export const SendTicketMessage=async(query)=>{
    try{
       const resp= await axios.post(`${ServerIP}/messages/addTicket`, query)
        return resp.data
    }catch(err)
    {
        console.log(err)
        return err
    }
}

export const GetTicketMessage=async(query)=>{
    try{
       const resp= await axios.put(`${ServerIP}/messages/getTicketMessage`, query)
        return resp.data
    }catch(err)
    {
        console.log(err)
        return err
    }
}
