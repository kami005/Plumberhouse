import { Divider,  CardHeader, IconButton, Menu, MenuItem, CircularProgress } from '@mui/material'
import React, { useContext, useReducer, useState} from 'react'
import { CardGraphStyle, CardContentStyle, DataGridStyle, IconBtnStyle} from '../../styles/IndexStyle'
import {  loadingReducer, useToggle } from '../CustomHooks/RandHooks'
import { MoreHoriz, Refresh } from '@mui/icons-material'
import { useRouter} from 'next/router';
import { toggleDeleteBill } from '../BackendConnect/PurchaseStorage'
import { SessionContext } from '../Context/SessionContext'
import DetailModal from './DetailModal'
import { GetAccess } from '../Utils/Rand'

const HomePurchases = (props) => {

    const {recentPurchases, FindPurchases} = props
    const navigate= useRouter()
    const [purchaseLoading, togglePurchaseLoading] = useToggle(false)
    const [curItem, setCurItem]= useState()
    const [anchorEl, setAnchorEl]= useState()
    const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
    const context = useContext(SessionContext)
    const {session, theme} = context
    const [openModal, toggleModal] = useToggle()
    const handleMoreClick=(e, item)=>{
        setCurItem(item)
        setAnchorEl(e.currentTarget);
      }

      const handleCloseAnchor=()=>{
        setAnchorEl(null)
      }
  
      const handleEditItem=()=>{  
        navigate.push({
          pathname:'/purchases', 
          query:{editing:true, purchaseID:curItem.purchaseID}})
      }
      const OpenPurchaseDetail=()=>{
        handleCloseAnchor()
        toggleModal()
        }

        const GetPurchaseData =async()=>{
          togglePurchaseLoading()
          await FindPurchases()
          togglePurchaseLoading()
        }
      
      const handleToggleDelete= async ()=>{
      
        dispatchLoading({type:'DELETESTART'})
        let res = await toggleDeleteBill(curItem.id, true, {myToken:session[0].token, myId:session[0]._id})
         handleCloseAnchor()
        if(res && res.message && res.message ==='SUCCESS')
        {
          res = await FindPurchases()
        }
       
        dispatchLoading({type:'DELETEEND'})
        }
    
        const handlePrint =()=>{
          const url=`/prints/printpurchase?purchaseID=${curItem.purchaseID}`
          window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=580,height=650');
          
            handleCloseAnchor()
          }
  const columns=[
    { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header', width:50,
    renderCell: (params)=>{
      const handleMore =(e)=>{
        const data =recentPurchases.find(sale=>sale.id === params.row.id)
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
       {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Modify' ) &&  <MenuItem onClick={handleEditItem}>Edit</MenuItem>}
        <MenuItem onClick={OpenPurchaseDetail}>Detail</MenuItem>
        <MenuItem onClick={handlePrint}>Print</MenuItem>
        {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Delete' ) &&  <MenuItem onClick={handleToggleDelete} 
        sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>{isLoading.Delete ? <CircularProgress /> : (curItem &&  curItem.isDeleted) ? 'Revert' : 'Delete'}</MenuItem>}
        </Menu>
        </React.Fragment>
      )
    }},
      { field: 'purchaseID', headerName: 'ID', width: 60, height:20, headerClassName: 'super-app-theme--header', },
      { field: 'supplierBill', headerName: 'Supplier Bill', width: 120, height:20, headerClassName: 'super-app-theme--header', },
      {field:'gTotal', headerName:'Total', width:80, height:20, headerClassName: 'super-app-theme--header',},
      {field: 'paid', headerName: 'Paid',width: 80, height:20, headerClassName: 'super-app-theme--header',},
      { field: 'supplierInfo', headerName: 'Supplier', width: 100, height:20, headerClassName: 'super-app-theme--header', },
      { field: 'procuredBy', headerName: 'DEO', width: 100, height:20, headerClassName: 'super-app-theme--header', },
      {field: 'paymentStatus',headerName: 'Pay Status',width: 100, height:20, headerClassName: 'super-app-theme--header',},
      { field: 'purchaseStatus',headerName: 'Bill Status',width: 100, height:20, headerClassName: 'super-app-theme--header', hide:true},
      { field: 'createdAt', headerName: 'Bill Date', width: 200, height:20, headerClassName: 'super-app-theme--header', },
      { field: 'updatedAt', headerName: 'Last Updated', width: 200, height:20, headerClassName: 'super-app-theme--header', hide:true},
      { field: 'id', headerName: 'Obj Id', width: 100, height:20, headerClassName: 'super-app-theme--header', hide:true},
      ]
      
  return (
    <CardGraphStyle  elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title='Recent Purchases'
    action={purchaseLoading ? <CircularProgress  /> : <IconBtnStyle aria-label="settings" onClick={GetPurchaseData} theme={theme.themes[theme.active]}> <Refresh /></IconBtnStyle>}
    />
    <Divider />
   <CardContentStyle sx={{  height:'20rem'}} theme={theme.themes[theme.active]}>
   {recentPurchases &&
    <DataGridStyle
     theme={theme.themes[theme.active]}
    rows={recentPurchases}
    columns={columns}
    getRowId={(row) => row._id}
    pageSize={50}
    density='compact'
    rowsPerPageOptions={[50]}
    checkboxSelection = {false}
    disableSelectionOnClick
    getRowClassName={(params) =>
        `super-app-theme--${params.row.paymentStatus}`
        }
    /> }
   </CardContentStyle>
   {openModal && <DetailModal purchase={curItem} open={openModal} onclose={toggleModal} />}
    </CardGraphStyle>
  )
}

export default HomePurchases