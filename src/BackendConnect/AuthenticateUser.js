import axios from "axios"
import { ServerIP } from "../DataSource/BackendIP";

export const getCompId =async ()=>{

    const resp= await axios.get(`${ServerIP}/session/getmac`)
    if (resp && resp.data)
        return resp.data
    else
        return null
}

export const signupUser =async (user)=>{
    const res = await axios.post(`${ServerIP}/user/add`, user)
    if(res)
        return res.data
    else
        return null
}

export const SigninUser=async(username, password)=>{
    if(username.length>2){
        try{
            //authenicate user
        const authUser= await axios.get(`${ServerIP}/session/authenticate/?`, {params:{username,password}} ) 
        
        if(authUser && authUser.data && authUser.data.session && authUser.data.new===false)
        {
            return {message:'WARN', activeSession:authUser.data.session}
        }
        else if(authUser && authUser.data && authUser.data.session && authUser.data.new===true)
        {
            return {message:'SUCCESS', activeSession:authUser.data.session}
        }
        else if(authUser.data && authUser.data.status)
        {
            return({message:authUser.data.status, token:null})
        }
        else if(authUser && authUser.data===false )
        {
            return({message:'Username / Password Error', token:null})
        }
        else 
        {
            return({message:'Signin in Failed', token:null})
        }
        }
        catch(err){
          console.log(err.message)
          return({message:'Network Error', token:null})
        }
        }
      
      else
      return({message:'FAILED', token:null})
      }

 export const findActiveSession = async (token, id)=>{
    const currSession = await axios.get(`${ServerIP}/session/find/?`, {params:{token, _id:id}})
    return currSession.data

 }     

 export const LogoutUser = async(myToken, myId)=>{
     if(!myToken)
     return {message:'ERROR'}
     try{
        const res= await axios.put(`${ServerIP}/session/logout`, {myToken, myId})
        return res.data
    }catch(err){
        return null
    }
      }
      export const LogoutUserById = async(filter)=>{
        if(!filter)
        return {message:'ERROR'}
        try{
           const res= await axios.put(`${ServerIP}/session/logoutbyid`, {...filter})
           return res.data
       }catch(err){
           return null
       }
         }
export const deleteSession = async(filter)=>{
    try{
           const res= await axios.put(`${ServerIP}/session/delete`, {...filter})
           if(res)
           return res.data
            else 
            return null
        }
        catch (err){
            return null
        }
}
export const FindExistingUser =  async (searchBy, filter, authUser)=>{
    var isAvailable;
    try{
        if(filter.length && searchBy ==='username'){
            const res=  await axios.get(`${ServerIP}/user/find`, {params:{username:filter, ...authUser}})
            if(res && (res.data===null||res.data===false))
            {
                isAvailable=false
            }
            else
                isAvailable=true 

        return isAvailable
        }
        else if(filter.length>2 && searchBy ==='email'){
            const res=  await axios.get(`${ServerIP}/user/find`, {params:{email:filter, ...authUser}})
            if(res && (res.data===null||res.data===false))
            {
                isAvailable=false
            }
            else
                isAvailable=true 

        return isAvailable
        }

    }catch(err){
        console.log(err)
        return err
    }
}

export const FindUserData = async (token, myId) =>{
    try{
    const res =  await axios.get(`${ServerIP}/user/findData/?`, {params:{_id:token, myId}})
        if(res.data)
            return res.data
        else
        return {data:null}
}catch (err)
{
    console.log(err)
    return err
}
}

export const FindAllUsers = async (filter) =>{
    try{    
    const res =  await axios.get(`${ServerIP}/user/findall`, {params:filter})
    // const list =  await axios.get(`${ServerIP}/user/getdblist`, {params:filter})
    // console.log(list)
        if(res.data)
            return res.data
        else
        return {data:null}
}catch (err)
{
    console.log(err)
    return err
}
}

export const FindDBList = async(filter)=>{
    try
    {
        const res = await axios.get(`${ServerIP}/user/getdblist`,  {params:filter})
        if(res && res.data)
            return res.data
        else
            return null
    }
    catch(er)
    {
        return null
    }
}
export const findUser= async (searchBy, filter, auth)=>{
    var isAvailable;
    if(filter.length>2 && searchBy ==='username'){
        const res =   await axios.get(`${ServerIP}/user/find`, {params:{username:filter,...auth}})
        if(res && (res.data===null||res.data===false))
        {
            isAvailable=false
        }
        else
            isAvailable=true  
      }
      else if(filter.length>2 && searchBy ==='email'){
        const res =   await axios.get(`${ServerIP}/user/find`, {params:{email:filter,...auth}})
        if(res && (res.data===null||res.data===false))
        {
            isAvailable=false
        }
        else
            isAvailable=true  
      }
        return isAvailable  
}

export const FindAllSessions = async (token) =>{
    try{
    const res =  await axios.get(`${ServerIP}/session/findall`)
        if(res.data)
            return res.data
        else
        return {data:null}
}catch (err)
{
    console.log(err)
    return err
}
}

export const findSessions = async (filter) =>{
    try{
    const res =  await axios.get(`${ServerIP}/session/findsessions`, {params:filter})
        if(res.data)
            return res.data
        else
        return {data:null}
}catch (err)
{
    console.log(err)
    return err
}
}

export const FindUserPassword = async (_id, password) =>{
    try{
        const authUser= await axios.get(`${ServerIP}/session/verifypass`, {params:{_id,password}} ) 
        if(!authUser || authUser.data ===false || authUser=== undefined)
            return {message:'ERROR', token:null, username:null }
       else
       return {message:'VERIFIED'}
}catch (err)
{
    console.log(err)
    return err
}
}

export const UpdateUser = async (data) =>{
    try{
    const res =  await axios.put(`${ServerIP}/user/update`, data)
        if(res.data)
            return res
        else
        return null
}catch (err)
{
    console.log(err)
    return null
}
}

export const updateUserStatus = async (id, status) =>{
    try{
    const res =  await axios.put(`${ServerIP}/user/updateStatus/?`, {status:status, _id:id})
        if(res.data)
            return res
        else
        return null
}catch (err)
{
    console.log(err)
    return null
}
}

export const UpdateUserPassword = async (user) =>{
    try{
    const res =  await axios.post(`${ServerIP}/user/updatepass`, user)
        if(res.data)
            return res.data
        else
        return null
}catch (err)
{
    console.log(err)
    return null
}
}

export const SendOnline = async (id) =>{
    try{
        const currSession = await axios.put(`${ServerIP}/session/setonline/?`, {id})
        if(currSession.data)
            return currSession.data
        else
        return null
}catch (err)
{
    console.log(err)
    return null
}
}

export const FindOnlineSessions = async (filter) =>{
    try{
        const currSession = await axios.get(`${ServerIP}/session/find/?`, {params:{...filter}})
        if(currSession.data)
            return currSession.data
        else
        return null
}
catch (err)
{
    console.log(err)
    return null
}
}
