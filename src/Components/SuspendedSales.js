import { Divider,  CardHeader, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import React, { useContext, useEffect, useReducer, useState} from 'react'
import { CardGraphStyle, CardContentStyle, DataGridStyle} from '../../styles/IndexStyle'
import {  loadingReducer } from '../CustomHooks/RandHooks'
import { MoreHoriz } from '@mui/icons-material'
import { useRouter} from 'next/router';
import { SUSPENDSALEKEY } from '../DataSource/RandData'
import { SessionContext } from '../Context/SessionContext'

const SuspendedSales = (props) => {
    const navigate= useRouter()
    const [suspendedData, setSuspended] = useState()
    const [curItem, setCurItem]= useState()
    const [anchorEl, setAnchorEl]= useState()
    const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
    const context = useContext(SessionContext)
    const {theme}= context
    const GetLocalStorage =()=>{
        const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
        if(sale)
        {
          if(!props.type)
          setSuspended(sale)
        else
        {
                let rowData=[]
                  for (let i=sale.length-1;i>=0;i--)
                  {
                    if(sale[i].type===props.type)
                      rowData.push(sale[i])
                  }
                  if(rowData.length)
                  {
                    setSuspended(rowData)
                  }
        }
        }
          
    }
 
    const handleMoreClick=(e, item)=>{
        setCurItem(item)
        setAnchorEl(e.currentTarget);
      }

      const handleCloseAnchor=()=>{
        setAnchorEl(null)
      }
      
      const handlePrint =()=>{
        handleCloseAnchor()
        const url=`/prints/printsuspended?id=${curItem.id}`
        window.open(url, '_blank', 'toolbar=0,location=0,menubar=0,width=600,height=800');
      }

      const handleEditItem=()=>{  
        handleCloseAnchor()
        if(curItem.type==='SALE')
        navigate.push({
          pathname:'/saleclassic', 
          query:{suspendediting:true, id:curItem.id}})
        else if (curItem.type === 'SALERETURN')
        navigate.push({
          pathname:'/salereturn', 
          query:{suspendediting:true, id:curItem.id}})
        else if (curItem.type ==='PURCHASE')
        navigate.push({
          pathname:'/purchases', 
          query:{suspendediting:true, id:curItem.id}})
      }
      
      const handleToggleDelete= async ()=>{
        handleCloseAnchor()
        dispatchLoading({type:'DELETESTART'})

        const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
        let remainingSale = sale.filter(data=>data.id !== curItem.id)
        localStorage.setItem(SUSPENDSALEKEY, JSON.stringify(remainingSale))
        setSuspended(remainingSale)
        dispatchLoading({type:'DELETEEND'})
        }
    
  const columns=[
    { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header',width: 60, 
    renderCell: (params)=>{
      const handleMore =(e)=>{
        const data =suspendedData.find(sale=>sale.id === params.row.id)
        handleMoreClick(e, data)
      }
  
      return(
        <React.Fragment>
        <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
        <MoreHoriz style={{color:'red', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}} />
        </IconButton>
  
        <Menu
          id='more-menu'
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleCloseAnchor}
        >
        <MenuItem onClick={handleEditItem}>
        Edit
        </MenuItem>
        {curItem && curItem.type!=='PURCHASE' && <MenuItem onClick={handlePrint}>
        Print
        </MenuItem>} 
        <MenuItem onClick={handleToggleDelete}>
        {isLoading.Delete ? <CircularProgress /> : (curItem &&  curItem.isDeleted) ? 'Revert' : 'Delete'}
        </MenuItem>
        </Menu>
        </React.Fragment>
      )
    }},
    {field: 'type',headerName: 'Type',width: 120, height:20, headerClassName: 'super-app-theme--header',},
      { field: 'itemCount', headerName: 'No of Items', width: 100, height:20, headerClassName: 'super-app-theme--header', },
      {field: 'subTotal',headerName: 'Sub Total',width: 80, height:20, headerClassName: 'super-app-theme--header',},
      {field:'gTotal', headerName:'Total', width:80, height:20, headerClassName: 'super-app-theme--header',},
      {field: 'unitDisc', headerName: 'Discount',width: 80, height:20, headerClassName: 'super-app-theme--header',}, 
      { field: 'suspendedBy', headerName: 'Suspended By', width: 150, height:20 , headerClassName: 'super-app-theme--header',},
      { field: 'suspendedAt', headerName: 'Suspended At', width: 200, height:20 , headerClassName: 'super-app-theme--header',},
      { field: 'id', headerName: 'Object ID', width: 300, height:20, headerClassName: 'super-app-theme--header'}]
      
useEffect(()=>{
    GetLocalStorage()
},[])
if((!suspendedData || !suspendedData.length))
  return null
else
  return (
    <CardGraphStyle theme={theme.themes[theme.active]}>
    <CardHeader title={!props.type ?'Suspended Sales / Purchases' : `Suspended ${props.type.charAt(0) + props.type.slice(1).toLowerCase()}`}/>
    <Divider />
   <CardContentStyle sx={{  height:'20rem'}} theme={theme.themes[theme.active]}>
   {suspendedData &&
    <DataGridStyle
     theme={theme.themes[theme.active]}
    rows={suspendedData}
    columns={columns}
    density='compact'
    rowsPerPageOptions={[15,20,50,100]}
    checkboxSelection = {false}
    disableSelectionOnClick
    getRowClassName={(params) =>
      `super-app-theme--${params.row.type}`
      }
    /> }
   </CardContentStyle>
    </CardGraphStyle>
  )
}

export default SuspendedSales