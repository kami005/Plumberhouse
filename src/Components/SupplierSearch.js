import React, {useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DataGridBoxStyle, DataGridStyle, SelectStyle, SearchFilterBoxStyle } from '../../styles/CustomerSearchStyle'
import { alertReducer, useTextboxVal } from '../CustomHooks/RandHooks';
import { IconButton, Menu, MenuItem, CircularProgress, Snackbar, Alert} from '@mui/material';
import { MoreHoriz, SearchOutlined } from '@mui/icons-material';
import {loadingReducer} from '../CustomHooks/RandHooks'
import { DeleteSupplier, FindSuppliers } from '../BackendConnect/SupplierStorage';
import { mainTheme, SUPPLIERDATAKEY } from '../DataSource/RandData';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import { SessionContext } from '../Context/SessionContext';
import { findPurchases } from '../BackendConnect/PurchaseStorage';
import { GetAccess } from '../Utils/Rand';

const SupplierSearch =  (props) => {
const {EditSupplier, EditLoan, GotoLedger} = props
const [suppliers, setSuppliers] = useState(null)
const [searchField, handleChange] = useTextboxVal('')
const [curSupplier, setCurSupplier]= useState()
const [anchorEl, setAnchorEl]= useState()
const [searchBy, setSearchBy] = useState('name')
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const context = useContext(SessionContext)
const {session, theme} = context

const SetInStrogate = ()=>{
  
  localStorage.setItem(SUPPLIERDATAKEY, JSON.stringify(suppliers))
}
const GetFromStorage = ()=>{

 const data = JSON.parse(localStorage.getItem(SUPPLIERDATAKEY))
 let rowData =[]
 if(data && data.length)
 {
 
  data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 if(rowData.length)
  setSuppliers(rowData)
}


const getSuppliers =async (e)=>{
      if(e)
        e.preventDefault()
        try
        {
          const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'suppliers', 'Search' )
          if(!access)
          {
            dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
           return
          }
          dispatchLoading({type:'SEARCHSTART'})
         
          if(searchBy==='payable')
          {
            const filter ={name:''}
            let supplierResp = await FindSuppliers({...filter, myToken:session[0].token, myId:session[0]._id})
            let rowData =[]
            if (supplierResp)
            {
              const payableResp = await findPurchases({'supplier.name':'', $or:[ {paymentStatus:'UNPAID'}, {paymentStatus:'PARTIALPAID'}],
              myToken:session[0].token, myId:session[0]._id})
            

              for (let i=0;i<supplierResp.length;i++)
              {
                supplierResp[i].payableAmount=0
                for (let j=0;j<payableResp.length;j++)
                  {
                     if(supplierResp[i].name === payableResp[j].supplierInfo.name)
                    {
                      const totalPayable = payableResp[j].gTotal-payableResp[j].paid

                      if(!supplierResp[i].payableAmount)
                      supplierResp[i].payableAmount= totalPayable
                      else
                      supplierResp[i].payableAmount += totalPayable
                    }
                  }
               
    
              }
              for (let i=0;i<supplierResp.length;i++)
              {
                if(supplierResp[i].payableAmount && supplierResp[i].payableAmount>0 )
                rowData.push({...supplierResp[i], createdAt:new Date(supplierResp[i].createdAt),
                updatedAt:new Date(supplierResp[i].updatedAt)})
              }
              setSuppliers(rowData)
            }

          }
          else
          {
            
            const filter ={[searchBy]:searchField}
            const resp = await FindSuppliers({...filter, myToken:session[0].token, myId:session[0]._id})
            let rowData =[]
            if (resp)
            {
                await resp.map(supplier=>rowData.push({...supplier, createdAt:new Date(supplier.createdAt), updatedAt:new Date(supplier.updatedAt), payableAmount:0}))
                setSuppliers(rowData)
            }
          }
          dispatchLoading({type:'SEARCHEND'})
        }
        catch(err)
        {
          console.log(err)
          dispatchLoading({type:'SEARCHEND'})
        }
       

        
}   

const handleMoreClick=(e, supplier)=>{
  setCurSupplier(supplier)
  setAnchorEl(e.currentTarget);
}

const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const handleEditSupplier=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'suppliers', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
   return
  }

  if(curSupplier && !curSupplier.isDeleted)
      EditSupplier(curSupplier)
}

const handleEditLoan=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'purchases', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
   return
  }
  if(curSupplier && !curSupplier.isDeleted)
     EditLoan(curSupplier)
}
const handleGotoLedger=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'expenses', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
   return
  }
  if(curSupplier && !curSupplier.isDeleted)
  GotoLedger(curSupplier)
}

const handlesearchByChange=(e)=>{
  setSearchBy(e.target.value)
}

const handleToggleDelete = async()=>{
  try
  {
    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'suppliers', 'Delete' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
     return
    }
    dispatchLoading({type:'DELETESTART'})
    const Limit = 2
    const res = await findPurchases({'supplierInfo.id':curSupplier.id, limit:Limit, myToken:session[0].token, myId:session[0]._id,})
    if(res && res.length)
    {
      dispatchSnack({type:'OTHER', message:'Unable to Delete Supplier with purchase record', msgColor:'error'})
    }else
    {
      
      let toggleDelete= Boolean(curSupplier.isDeleted)
          toggleDelete=!toggleDelete
    const resp= await DeleteSupplier(curSupplier._id, toggleDelete, {myToken:session[0].token, myId:session[0]._id})
    if(resp && resp.message && resp.message ==='SUCCESS')
    {
      handleCloseAnchor()
      getSuppliers()
    }
    }
  }catch(err)
  {
    console.log(err)
  }

    dispatchLoading({type:'DELETEEND'})
}

useEffect(()=>{
GetFromStorage()
},[])

useEffect(()=>{
  SetInStrogate()
  },[suppliers])

const columns=[
  { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header', width:60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =suppliers.find(supplier=>supplier.id === params.row.id)
      handleMoreClick(e, data)
    }

    return(
      <React.Fragment>
      <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
      <MoreHoriz style={{color:'#81c784', backgroundColor:'#d32f2f', borderRadius:'50%'}} />
      </IconButton>

      <Menu
        id='more-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseAnchor}
      >
      <MenuItem onClick={handleEditSupplier}>
      Edit
      </MenuItem>
      <MenuItem onClick={handleEditLoan}>
      Payables
      </MenuItem>
      <MenuItem onClick={handleGotoLedger}>
      Ledgers
      </MenuItem>
      <MenuItem onClick={handleToggleDelete} sx={{backgroundColor:(curSupplier && !curSupplier.isDeleted) && '#FFCCCB'}}>
      {isLoading.Delete ? <CircularProgress /> : (curSupplier && curSupplier.isDeleted) ? 'Revert' : 'Delete'}
      </MenuItem>
      </Menu>
      </React.Fragment>
    )
  }},
  { field: 'id', headerName: 'ID', width: 70, headerClassName: 'super-app-theme--header', },
    { field: 'name',headerName: 'Supplier name',width: 170, headerClassName: 'super-app-theme--header',}, 
    {field:'payableAmount', headerName:'Payables', width:100, headerClassName: 'super-app-theme--header',},
    {field: 'contactNo',headerName: 'Contact No',width: 150, headerClassName: 'super-app-theme--header',},
    {field:'address', headerName:'Address', width:120, headerClassName: 'super-app-theme--header'},
    {field: 'type', headerName: 'Type', width: 120, headerClassName: 'super-app-theme--header',},
    {field: 'desc', headerName: 'Description',width: 150, headerClassName: 'super-app-theme--header',hide:true},
    {field:'addedBy', headerName:'DEO', width:120, headerClassName: 'super-app-theme--header',},
    {field:'isDeleted', headerName:'Deleted', width:200, headerClassName: 'super-app-theme--header',hide:true},
    {field:'createdAt', headerName:'Create Date', width:200, headerClassName: 'super-app-theme--header',},
    {field:'updatedAt', headerName:'Last Updated', width:200, headerClassName: 'super-app-theme--header'},
    { field: '_id', headerName: 'Object ID', width: 200, headerClassName: 'super-app-theme--header', hide:true   },
    ]
    function CustomToolbar() {
      return (
        <GridToolbarContainer sx={{display:'flex', gap:0.5}} >
          <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
          <GridToolbarColumnsButton variant='contained'/>
          <GridToolbarExport variant='contained'/>
        </GridToolbarContainer>
      );
    }
  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10}>
            <form onSubmit={e=>getSuppliers(e)}>
            <SearchBoxStyle>
         
            <SearchTextStyle size='small' label={`Search By ${searchBy}`}
             variant='outlined' placeholder='Search....' value={searchField} onChange={e=>handleChange(e)} theme={theme.themes[theme.active]}/>
            <SearchFilterBoxStyle theme={theme.themes[theme.active]}>
            <SelectStyle select size='small'
            theme={theme.themes[theme.active]}
          label='Search By' placeholder='Search By' 
            name='selectSearchBy'
            value={searchBy}
            onChange={handlesearchByChange}
            >
            <MenuItem value='id'>Supplier ID</MenuItem>
            <MenuItem value='name'>Supplier Name</MenuItem>
            <MenuItem value='type'>Supplier Type</MenuItem>
            <MenuItem value='address'>Address</MenuItem>
            <MenuItem value='contactNo'>Contact No</MenuItem>
            <MenuItem value='desc'>Description</MenuItem>
            <MenuItem value='addedBy'>DEO</MenuItem>
            <MenuItem value='payable' sx={{backgroundColor:'rgba(173, 216, 230, 0.8)'}}>Payables</MenuItem>
            <MenuItem value='isDeleted' sx={{backgroundColor:'rgba(235, 64, 52, 0.7)'}}>Deleted suppliers</MenuItem>

        </SelectStyle>
        <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<SearchOutlined />}>{isLoading.Search ? <CircularProgress color='inherit' size='2rem'/> : 'Search'}</SearchButtonStyle>
  
            </SearchFilterBoxStyle>

            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle>
            {suppliers &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={suppliers}
            columns={columns}
            density='compact'
            components={{
              Toolbar: CustomToolbar,
            }}
            rowsPerPageOptions={[15,50,100]}
            checkboxSelection = {false}
            disableSelectionOnClick 
            getRowClassName={params=>   params.row.isDeleted ? 'super-app-theme--DELETED' :  (params.row.payableAmount &&   params.row.payableAmount>0) ? 'super-app-theme--PAYABLE' : params.row.isDeleted ? 'super-app-theme--DELETED' : `super-app-theme--OTHER` }
            /> }

            </DataGridBoxStyle>
            </MainPaperStyle>
            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
            onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
            anchorOrigin={{ vertical:'top',horizontal:'center' }}>
            <Alert  severity={alertSnack.msgColor}  elevation={6} variant="standard">
            {alertSnack.message}
            </Alert>
            </Snackbar>
    </MainBoxStyle>
  )
}

export default SupplierSearch