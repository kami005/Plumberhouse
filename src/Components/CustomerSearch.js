import React, {useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DataGridBoxStyle, DataGridStyle, SelectStyle, SearchFilterBoxStyle } from '../../styles/CustomerSearchStyle'
import { alertReducer, useTextboxVal } from '../CustomHooks/RandHooks';
import { IconButton, Menu, MenuItem, CircularProgress, Snackbar, Alert} from '@mui/material';
import { MoreHoriz, ScreenSearchDesktopOutlined } from '@mui/icons-material';
import {loadingReducer} from '../CustomHooks/RandHooks'
import { DeleteCustomer, FindCustomers } from '../BackendConnect/CusotmerStorage';
import { CUSTOMERDATAKEY } from '../DataSource/RandData';
import { GridToolbarColumnsButton, GridToolbarContainer, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import { SessionContext } from '../Context/SessionContext';
import { findSales } from '../BackendConnect/SaleStorage';
import { GetAccess } from '../Utils/Rand';

const CustomerSearch =  (props) => {
const {EditCustomer, EditLoan, GotoLedger} = props
const [customers, setCustomers] = useState(null)
const [searchField, handleChange] = useTextboxVal('')
const [curCustomer, setCurCustomer]= useState()
const [anchorEl, setAnchorEl]= useState()
const [searchBy, setSearchBy] = useState('customerName')
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const context = useContext(SessionContext)
const {session, theme} = context

const SetInStrogate = ()=>{
  localStorage.setItem(CUSTOMERDATAKEY, JSON.stringify(customers))
}
const GetFromStorage = ()=>{
 const data = JSON.parse(localStorage.getItem(CUSTOMERDATAKEY))
 let rowData =[]
 if(data && data.length)
 {
 
  data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 if(rowData.length)
 setCustomers(rowData)
}

const getCustomers =async (e)=>{
      if(e)
        e.preventDefault()

        try{
          const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Search' )
          if(!access)
          {
            dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
           return
          }
          dispatchLoading({type:'SEARCHSTART'})

          if(searchBy==='receiveable')
          {
            const filter ={customerName:''}
            let customerResp = await FindCustomers({...filter, myToken:session[0].token, myId:session[0]._id})
         
            let rowData =[]
            if (customerResp)
            {
              const receiveableResp = await findSales({'customer.name':'', $or:[ {paymentStatus:'UNPAID'}, {paymentStatus:'PARTIALPAID'}],
              myToken:session[0].token, myId:session[0]._id})
              for (let i=0;i<customerResp.length;i++)
              {
                customerResp[i].receiveableAmount=0
                for (let j=0;j<receiveableResp.length;j++)
                  {
                     if(customerResp[i].customerName === receiveableResp[j].customerInfo.name)
                    {
                      const totalPayable = receiveableResp[j].gTotal-receiveableResp[j].amountReceived

                      if(!customerResp[i].receiveableAmount)
                      customerResp[i].receiveableAmount= totalPayable
                      else
                      customerResp[i].receiveableAmount += totalPayable
                    }
                  }
               
    
              }
              for (let i=0;i<customerResp.length;i++)
              {
                if(customerResp[i].receiveableAmount && customerResp[i].receiveableAmount>0 )
                rowData.push({...customerResp[i], id:customerResp[i]._id, createdAt:new Date(customerResp[i].createdAt),
                updatedAt:new Date(customerResp[i].updatedAt)})
              }
              setCustomers(rowData)
            }

          }
          else
          {
            const filter ={[searchBy]:searchField}
            const resp = await FindCustomers(filter, { myToken:session[0].token, myId:session[0]._id})
            var rowData =[]
            if (resp)
            {
    
              for(let j=0; j<resp.length; j++)
              {
                rowData.push({id:resp[j]._id, ...resp[j], createdAt:new Date(resp[j].createdAt), updatedAt:new Date(resp[j].updatedAt), receiveableAmount:0})
              }
              
              setCustomers(rowData)
            }
          }
          dispatchLoading({type:'SEARCHEND'})
        }catch(err)
        {
          console.log(err)
          dispatchLoading({type:'SEARCHEND'})
        }  
}   

const handleMoreClick=(e, customer)=>{
  setCurCustomer(customer)
  setAnchorEl(e.currentTarget);
}

const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const handleGotoLedger=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'incomes', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
   return
  }

  if(curCustomer && !curCustomer.isDeleted)
  GotoLedger(curCustomer)
}
const handleEditCustomer=()=>{
 
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
   return
  }
  if(curCustomer && !curCustomer.isDeleted)
      EditCustomer(curCustomer)
}
const handlesearchByChange=(e)=>{
  setSearchBy(e.target.value)
}
const handleEditLoan=()=>{
  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'sales', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
   return
  }
  if(curCustomer && !curCustomer.isDeleted)
     EditLoan(curCustomer)
}

const handleToggleDelete = async()=>{
  try
  {

    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'customers', 'Delete' )
    if(!access)
    {
      dispatchSnack({type:'OTHER', message:"Unauthorized Access!", msgColor:'warning'})
     return
    }
  dispatchLoading({type:'DELETESTART'})
  const Limit = 2
  const res = await findSales({'customerInfo.id':curCustomer.customerID, limit:Limit, myToken:session[0].token, myId:session[0]._id})
  if(res && res.length)
   {
    handleCloseAnchor()
    dispatchSnack({type:'OTHER', message:'Unable to Delete Customer with sale record', msgColor:'error'})
   }
   else
   {
    
    let toggleDelete= Boolean(curCustomer.isDeleted)
        toggleDelete=!toggleDelete
    const resp= await DeleteCustomer(curCustomer._id, toggleDelete, {myToken:session[0].token, myId:session[0]._id})
  if(resp && resp.message && resp.message ==='SUCCESS')
  {
    handleCloseAnchor()
    getCustomers()
  }
   }
   

  dispatchLoading({type:'DELETEEND'})
  }
  catch(err)
  {
    dispatchLoading({type:'DELETEEND'})
    console.log(err)
  }

}

useEffect(()=>{
  GetFromStorage()
  },[])
  
  useEffect(()=>{
    SetInStrogate()
    },[customers])

const columns=[
  { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header', width:60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =customers.find(customer=>customer.id === params.row.id)
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
      <MenuItem onClick={handleEditCustomer}>
      Edit
      </MenuItem>
      <MenuItem onClick={handleEditLoan}>
      Receiveables
      </MenuItem>
      <MenuItem onClick={handleGotoLedger} >
      Ledgers
      </MenuItem>
      <MenuItem>
      Detail
      </MenuItem>
      <MenuItem onClick={handleToggleDelete} sx={{backgroundColor:(curCustomer && !curCustomer.isDeleted) && '#FFCCCB'}}>
      {isLoading.Delete ? <CircularProgress /> : (curCustomer && curCustomer.isDeleted) ? 'Revert' : 'Delete'}
      </MenuItem>
      </Menu>
      </React.Fragment>
    )
  }},
  { field: 'customerID', headerName: 'ID', width: 70, headerClassName: 'super-app-theme--header',   },
    { field: 'customerName',headerName: 'Customer Name',width: 170, headerClassName: 'super-app-theme--header', }, 
    {field:'receiveableAmount', headerName:'Receiveables', width:120, headerClassName: 'super-app-theme--header',},
    {field: 'contactNo',headerName: 'Contact No',width: 150, headerClassName: 'super-app-theme--header', },
    {field:'address', headerName:'Address', width:100, headerClassName: 'super-app-theme--header', },
    {field:'customerAddedBy', headerName:'DEO', width:100, headerClassName: 'super-app-theme--header', },
    {field: 'customerType', headerName: 'Type', width: 120, headerClassName: 'super-app-theme--header', },
    {field: 'description', headerName: 'Description',width: 150, headerClassName: 'super-app-theme--header', hide:true},
    { field: 'isDeleted', headerName: 'Deleted', width: 150, headerClassName: 'super-app-theme--header', hide:true  },
    { field: 'createdAt', headerName: 'Created At', width: 150, headerClassName: 'super-app-theme--header',   },
    { field: 'updatedAt', headerName: 'Last Updated', width: 150, headerClassName: 'super-app-theme--header',  },
    { field: 'id', headerName: 'Object ID', width: 200, headerClassName: 'super-app-theme--header',  hide:true  },
    ]
    
    function CustomToolbar() {
      return (
        <GridToolbarContainer sx={{display:'flex', gap:0.5}}>
          <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
          <GridToolbarColumnsButton variant='contained'/>
          <GridToolbarExport variant='contained'/>
        </GridToolbarContainer>
      );
    }
  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10}>
            <form onSubmit={e=>getCustomers(e)}>
            <SearchBoxStyle>
    
            <SearchTextStyle size='small' label={`Search By ${searchBy}`}
            variant='outlined' placeholder='Search....' value={searchField} onChange={e=>handleChange(e)} theme={theme.themes[theme.active]}/>
            <SearchFilterBoxStyle theme={theme.themes[theme.active]}>
            <SelectStyle select  size='small'
            name='searchBy'
            label='Search By' placeholder='Search By' 
            value={searchBy}
            onChange={handlesearchByChange}
            theme={theme.themes[theme.active]}
            >
            <MenuItem value='customerID'>Customer ID</MenuItem>
            <MenuItem value='customerName'>Customer Name</MenuItem>
            <MenuItem value='customerType'>Customer Type</MenuItem>
            <MenuItem value='address'>Address</MenuItem>
            <MenuItem value='contactNo'>Contact No</MenuItem>
            <MenuItem value='description'>Description</MenuItem>
            <MenuItem value='customerAddedBy'>DEO</MenuItem>
            <MenuItem value='receiveable' sx={{backgroundColor:'rgba(173, 216, 230, 0.8)'}}>Receiveables</MenuItem>
            <MenuItem value='isDeleted' sx={{backgroundColor:'rgba(235, 64, 52, 0.7)'}}>Deleted Customers</MenuItem>

           </SelectStyle>

            <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<ScreenSearchDesktopOutlined />}>{isLoading.Search ? <CircularProgress color='inherit' size='2rem'/> : 'Search'}</SearchButtonStyle>
  
            </SearchFilterBoxStyle>

            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle>
            {customers &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={customers}
            columns={columns}
            density='compact'
            components={{
              Toolbar: CustomToolbar,
            }}
            rowsPerPageOptions={[15,50,100]}
            checkboxSelection = {false}
            disableSelectionOnClick 
            getRowClassName={(params) => params.row.isDeleted ? 'super-app-theme--DELETED' :  (params.row.receiveableAmount &&   params.row.receiveableAmount>0) ? 'super-app-theme--PAYABLE' :  params.row.customerType.toUpperCase() ==='PLUMBER'  ? `super-app-theme--PLUMBER`: `super-app-theme--OTHER`}
            /> }
              
            </DataGridBoxStyle>
   
            </MainPaperStyle>
            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
            onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
            anchorOrigin={{ vertical:'top',horizontal:'center' }}>
          <Alert   severity={alertSnack.msgColor}   elevation={0} variant="standard">
          {alertSnack.message}
          </Alert>
          </Snackbar>
    </MainBoxStyle>
  )
}

export default CustomerSearch