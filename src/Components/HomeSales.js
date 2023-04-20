import { Divider,  CardHeader, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import React, { useContext, useReducer, useState} from 'react'
import { CardGraphStyle, CardContentStyle, DataGridStyle, IconBtnStyle} from '../../styles/IndexStyle'
import {   toggleDeleteSale } from '../BackendConnect/SaleStorage'
import {  loadingReducer, useToggle } from '../CustomHooks/RandHooks'
import { MoreHoriz, Refresh } from '@mui/icons-material'
import { useRouter} from 'next/router';
import { SessionContext } from '../Context/SessionContext'
import DetailModal from './DetailModal'
import { GetAccess } from '../Utils/Rand'


const HomeSales = (props) => {

    const {recentSales, FindSales} = props
    const navigate= useRouter()
    const [salesLoading, toggleSalesLoading] = useToggle(false)
    const [curItem, setCurItem]= useState()
    const [anchorEl, setAnchorEl]= useState()
    const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
    const context = useContext(SessionContext)
    const [openModal, toggleModal] = useToggle()
    const {session, theme} = context


    const handleMoreClick=(e, item)=>{
        setCurItem(item)
        setAnchorEl(e.currentTarget);
      }

      const handleCloseAnchor=()=>{
        setAnchorEl(null)
      }
  
      const handleEditItem=()=>{  
        navigate.push({
          pathname:'/saleclassic', 
          query:{editing:true, saleID:curItem.saleID}})
      }
      
      const OpenSaleDetail=()=>{
        handleCloseAnchor()
        toggleModal()
        }
        const GetSaleData =async()=>{
          toggleSalesLoading()
          await FindSales()
          toggleSalesLoading()
        }

      const handleToggleDelete= async ()=>{
        dispatchLoading({type:'DELETESTART'})
        let res = await toggleDeleteSale(curItem.id, true, {myToken:session[0].token, myId:session[0]._id})
         handleCloseAnchor()
        if(res && res.message && res.message ==='SUCCESS')
        {
          res = await FindSales({myToken:session[0].token, myId:session[0]._id})
        }
       
        dispatchLoading({type:'DELETEEND'})
        }
    
        const handlePrint =()=>{
          let url=''
          if(curItem.saleStatus==='RETURN')
            url=`/prints/printsalereturn?saleID=${curItem.saleID}`
          else
             url=`/prints/printsale?saleID=${curItem.saleID}`

             window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
          
            handleCloseAnchor()
          }
  const columns=[
    { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header',width: 50,
    renderCell: (params)=>{
      const handleMore =(e)=>{
        e.preventDefault()
        const data =recentSales.find(sale=>sale.id === params.row.id)
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
          onClose={handleCloseAnchor}>
        {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Modify' ) &&
        <MenuItem onClick={handleEditItem}> Edit</MenuItem>}
        <MenuItem onClick={OpenSaleDetail}>Detail </MenuItem> 
        <MenuItem onClick={handlePrint}>Print</MenuItem>
        {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Delete' ) && <MenuItem onClick={handleToggleDelete} sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>
        {isLoading.Delete ? <CircularProgress /> : (curItem &&  curItem.isDeleted) ? 'Revert' : 'Delete'}</MenuItem>}
        </Menu>
        </React.Fragment>
      )
    }},
      { field: 'saleID', headerName: 'ID', width: 60, height:20, headerClassName: 'super-app-theme--header', },
      {field:'gTotal', headerName:'Total', width:80, height:20, headerClassName: 'super-app-theme--header',},
      {field: 'amountReceived', headerName: 'Received',width: 80, height:20, headerClassName: 'super-app-theme--header',},
      {field: 'discount', headerName: 'Discount',width: 80, height:20, headerClassName: 'super-app-theme--header',},
      { field: 'customerInfo', headerName: 'Customer', width: 100, height:20, headerClassName: 'super-app-theme--header', },
      { field: 'soldBy', headerName: 'DEO', width: 100, height:20, headerClassName: 'super-app-theme--header', },
      {field: 'paymentStatus',headerName: 'Pay Status',width: 100, height:20, headerClassName: 'super-app-theme--header',},
      { field: 'createdAt', headerName: 'Sale Date', width: 200, height:20, headerClassName: 'super-app-theme--header', },
      { field: 'updatedAt', headerName: 'Last Updated', width: 200, height:20, headerClassName: 'super-app-theme--header', hide:true },
      { field: 'saleStatus', headerName: 'Status',width: 100, height:20, headerClassName: 'super-app-theme--header', hide:true}, 
      { field: 'id', headerName: 'Obj Id', width: 100, height:20, headerClassName: 'super-app-theme--header', hide:true},
      ]
      
  return (
    <CardGraphStyle elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title='Recent Sales' action={salesLoading ? <CircularProgress  /> : <IconBtnStyle aria-label="settings" onClick={GetSaleData} theme={theme.themes[theme.active]}><Refresh /></IconBtnStyle>}/>
    <Divider />
   <CardContentStyle sx={{  height:'20rem'}} theme={theme.themes[theme.active]}>
   {recentSales &&
    <DataGridStyle
    theme={theme.themes[theme.active]}
    rows={recentSales}
    columns={columns}
    getRowId={(row) => row._id}
    pageSize={50}
    density='compact'
    oncellcon
    rowsPerPageOptions={[50]}
    checkboxSelection = {false}
    disableSelectionOnClick
    getRowClassName={(params) =>
        `super-app-theme--${params.row.paymentStatus}`
        }
    /> }
   </CardContentStyle>
   {openModal && <DetailModal sale={curItem} open={openModal} onclose={toggleModal} />}
    </CardGraphStyle>
  )
}

export default HomeSales