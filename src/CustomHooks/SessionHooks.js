
import { useState} from "react";


export function useLocalStorageState(key, defaultVal={}) {

  const [userState, setState] = useState(defaultVal)

    const getFromStorage=key=>{
      const obj = getData(key)
      setState(obj)
    }
    const setInStorage=(key, obj)=>{
       
        setData(key, obj)
        setState(obj)          
    }

    const addUserType =(userType, right)=>{
      setState({...userState, userType, rights:right ? right :[]})
    }
    
    return [userState, getFromStorage, setInStorage, addUserType]
}

export function getData(key){
  if (!key){
    return null
  }
try{
  if (typeof localStorage !== "undefined") {
    const valueStr =  localStorage.getItem(key)
    if(valueStr && valueStr!==undefined){
      return JSON.parse(valueStr)
  }


}
return null


}catch(err){
  console.log(err.message)
  return null
}
}

export function setData(key, obj){
  if (!key){
    console.log('Error retrieving Key')
  }
  try{
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, JSON.stringify(obj))
    }
   
  }catch(err){
    console.log(err.message)
  }
}