import React, {useState, useReducer, useEffect, useContext} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DataGridBoxStyle, DataGridStyle, SelectStyle, SearchFilterBoxStyle } from '../../styles/ItemSearchStyle'
import { alertReducer, useTextboxVal } from '../CustomHooks/RandHooks';
import { findItems, DeleteItem, UpdateItem, DeleteItemForever } from '../BackendConnect/ItemStorage';
import { IconButton, Menu, MenuItem, CircularProgress, Snackbar, Alert, Button} from '@mui/material';
import { ManageHistory, MoreHoriz, MoreTime, Search } from '@mui/icons-material';
import {loadingReducer} from '../CustomHooks/RandHooks'
import { ITEMSGRIDDATAKEY } from '../DataSource/RandData';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import DetailModal from './DetailModal';
import { SessionContext } from '../Context/SessionContext';
import { AddLog } from '../BackendConnect/LogsStorage';
import { GetAccess } from '../Utils/Rand';

const ItemSearch =  (props) => {
const Limit=50
const {EditItem} = props
const [items, setItems] = useState({data:[], showAll:false})
const [searchField, handleChange] = useTextboxVal('')
const [curItem, setCurItem]= useState()
const [anchorEl, setAnchorEl]= useState()
const [searchBy, setSearchBy] = useState('itemName')
const [openModal, toggleModal] = useState({open:false, item:true})
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false, Save:false, toggleVal:false})
const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
const context = useContext(SessionContext)
const {session, theme} = context

function CustomToolbar() {
  return (
    <GridToolbarContainer sx={{display:'flex', gap:0.5,  marginBottom:'0.2rem'}} >
      <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
      <GridToolbarColumnsButton variant='contained' />
      <GridToolbarExport variant='contained'/>
      <Button variant='contained' startIcon={<ManageHistory sx={{color:'white' }}/>}
      onClick={()=>toggleModal({open:true, item:false})}>
      Logs
     </Button>
      <Button disabled={!items.data.length || searchField!=='' || !items.showAll}  variant='contained' startIcon={<MoreTime sx={{color:'white' }}/>}
       onClick={LoadMore}>
       More
      </Button>
    </GridToolbarContainer>
  );
}

const LoadMore =async()=>{

  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
    return
  }

  dispatchLoading({type:'SEARCHSTART'})
  let filter
  if(searchBy!=='fault')
  { 
    let skip =0
    if(searchField==='')
         skip = items.data.length
    filter ={[searchBy]:searchField, skip}
  }
  else
  {
    filter = {$expr:{$gt:["$pPrice", "$sPrice"]}, qty:0, limit:Limit, skip:items.data.length, pPrice:0, sPrice:0}
  }
   
    const resp = await findItems({...filter, myToken:session[0].token, myId:session[0]._id})
    let rowData =[...items.data]
    if (resp)
      {
          await resp.map(item=>rowData.push({id:item._id, ...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
          setItems({data:rowData, showAll:true})
      }
  dispatchLoading({type:'SEARCHEND'})
}

const SetInStrogate = ()=>{
  localStorage.setItem(ITEMSGRIDDATAKEY, JSON.stringify(items))
}
const GetFromStorage = ()=>{
 const data = JSON.parse(localStorage.getItem(ITEMSGRIDDATAKEY))
 let rowData =[]
 if(Array.isArray(data))
 {
  data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 
 else if(data && data.data.length)
 {
 
  data.data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 if(rowData.length)
 setItems({data:rowData, showAll:data.showAll})
}

const onRowEditCommit = (data) => {
  
  let itemsArray= [...items.data]
  let val 
  const index = itemsArray.findIndex(item =>item._id===data.id)

  if(data.field === "qty" || data.field === "sPrice" || data.field === "pPrice" || data.field === "itemID")
  {
    val = parseInt(data.value)
    if(isNaN(val) || val ==='')
    {
      setItems({...items, data:itemsArray})
      return
    }
   
  }
  else
    val= data.value
  itemsArray[index][data.field]= val
  setItems({...items, data:itemsArray})
}

const getItems =async (e)=>{
      if(e)
        e.preventDefault()
        const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Search' )
      if(!access)
      {
        dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
        return
      }

        dispatchLoading({type:'SEARCHSTART'})
        let filter
        if(searchBy==='fault')
        { 
          filter = {$expr:{$gt:["$pPrice", "$sPrice"]},  qty:0, limit:Limit, pPrice:0, sPrice:0}
        }
        else if(searchBy==='isDeleted')
        {
          filter ={[searchBy]:true}
        }
        else
          filter ={[searchBy]:searchField}
        const resp = await findItems({...filter, myToken:session[0].token, myId:session[0]._id})
        let rowData =[]
        if (resp)
        {
            await resp.map(item=>rowData.push({id:item._id, ...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
            setItems({data:rowData, showAll: (searchField ==='' && searchBy !=='isDeleted') ? true:false})
        }
        dispatchLoading({type:'SEARCHEND'})
}   

const handleMoreClick=(e, item)=>{
  setCurItem(item)
  setAnchorEl(e.currentTarget);
}

const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const CheckChanges= async()=>{
  let newItem = {...curItem}
  delete newItem.createdAt
  delete newItem.id
  delete newItem._id
  delete newItem.updatedAt
  delete newItem.__v   
  const oldItem = await findItems({'id':curItem._id, myToken:session[0].token, myId:session[0]._id})
  let from={}, to={}
  for (var key of Object.keys(newItem)) {
    if(oldItem[key]!==newItem[key])
    {
      from[key]=oldItem[key]
      to[key]=newItem[key]
    }}

if(Object.keys(from).length)
{
  let type='other'
  if(to.qty || from.qty)
    type='qty'
  await AddLog({table:'items', type, from, to, id:oldItem._id, by:session[0].username, name:oldItem.itemName,
  status:'update' })
}
}

const handleUpdate=async()=>{

  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
   return
  }

  if(curItem.pPrice> curItem.sPrice)
  {
    dispatchSnack({type:'OTHER', message:'Adding Purchase Price greater than Sale Price!', msgColor:'warning'})
    return
  }
dispatchLoading({type:'SAVESTART'})
await CheckChanges()
const res = await UpdateItem(curItem.id, curItem, {myToken:session[0].token, myId:session[0]._id})
if(res && res.message==='SUCCESS')
{
 
  dispatchSnack({type:"OTHER", message:'Updated!', msgColor:'success'})
}

else
dispatchSnack({type:"OTHER", message:'ERROR!', msgColor:'error'})
handleCloseAnchor()
dispatchLoading({type:'SAVEEND'})
}

const handleEditItem=()=>{

    const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Modify' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
    return
  }

  if(curItem && !curItem.isDeleted)
      EditItem(curItem)
}
const handlesearchByChange=(e)=>{
  setSearchBy(e.target.value)
}
const OpenItemDetail=async()=>{

  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Search' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
    return
  }

  toggleModal({open:true, item:true})
  handleCloseAnchor()
  }

const handleToggleDelete = async()=>{

  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Delete' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
    return
  }

  dispatchLoading({type:'DELETESTART'})
      let toggleDelete= Boolean(curItem.isDeleted)
          toggleDelete=!toggleDelete
    const resp= await DeleteItem(curItem._id, toggleDelete, {myToken:session[0].token, myId:session[0]._id})
    if(resp && resp.message && resp.message ==='SUCCESS')
    {
      handleCloseAnchor()
      getItems()
    }
    dispatchLoading({type:'DELETEEND'})
}

const handleDeleteForever =async()=>{

  const access = GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Delete' )
  if(!access)
  {
    dispatchSnack({type:'OTHER', message:"Access Denied!", msgColor:'warning'})
    return
  }

dispatchLoading({type:'TOGGLE', toggleVal:true})

const resp = await DeleteItemForever(curItem._id, {myToken:session[0].token, myId:session[0]._id, itemID:curItem.itemID})

if(resp && resp.message==='SUCCESS')
{
  dispatchSnack({type:'OTHER', message:`Item with ID: ${resp.data.itemID} has been deleted`, msgColor:'warning'})
  let itemsArray = items.data.filter(item =>item._id !==resp.data._id)
  setItems({...items, data:itemsArray})
  dispatchLoading({type:'TOGGLE', toggleVal:false})
}
handleCloseAnchor()
}

useEffect(()=>{
  GetFromStorage()
},[])

useEffect(()=>{
  SetInStrogate()
}, [items])


const columns=[
  { field: 'more', headerName:'More', headerClassName: 'super-app-theme--header', width:60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =params.row
      handleMoreClick(e, data)
    }

    return(
      <React.Fragment>
      <IconButton aria-controls='more-menu' aria-haspopup='true' onClick={e=>handleMore(e)}>
      <MoreHoriz style={{color:'#81c784', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}} />
      </IconButton>

      <Menu id='more-menu' anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseAnchor}>
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Modify' ) && 
      <MenuItem onClick={handleEditItem}>Edit</MenuItem>}
      <MenuItem onClick={OpenItemDetail}>Detail</MenuItem>
      {(GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Modify' )  && curItem && !curItem.isDeleted ) ? 
      <MenuItem onClick={handleUpdate}>{isLoading.Save ? <CircularProgress /> :'Update'}</MenuItem> : null}
      {GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Delete' ) ?
      <MenuItem onClick={handleToggleDelete}>
      {isLoading.Delete ? <CircularProgress /> : (curItem && curItem.isDeleted) ? 'Restore' : 'Delete'}
      </MenuItem> : null
      }
      {(GetAccess(session[0].userType, session[0].rights, 'TABLES', 'items', 'Delete' ) && curItem && curItem.isDeleted ) ? 
     <MenuItem onClick={handleDeleteForever} sx={{backgroundColor:'#FFCCCB'}}>{isLoading.toggleVal ? <CircularProgress /> :'Delete Forever'}
     </MenuItem>
      : null}
      </Menu>
      </React.Fragment>
    )
  }},
  { field: 'itemID', headerName: 'ID', width: 80, headerClassName: 'super-app-theme--header',  },
    { field: 'itemName',headerName: 'Item name',width: 220, editable:true, headerClassName: 'super-app-theme--header',}, 
    {field: 'pPrice',headerName: 'Purchase',width: 100, editable:true, headerClassName: 'super-app-theme--header',},
    {field:'sPrice', headerName:'Price', width:100, editable:true, headerClassName: 'super-app-theme--header',},
    {field:'qty', headerName:'Quantity', width:100, editable:true, headerClassName: 'super-app-theme--header',},
    {field: 'type', headerName: 'Type', width: 100, editable:true, headerClassName: 'super-app-theme--header',},
    {field: 'vendor', headerName: 'Vendor', width: 100, editable:true, headerClassName: 'super-app-theme--header',},
    {field: 'model', headerName: 'Model',width: 100, editable:true, headerClassName: 'super-app-theme--header',},
    { field: 'desc', headerName: 'Description', width: 150, editable:true, headerClassName: 'super-app-theme--header',hide:true },
    { field: 'itemAddedBy', headerName: 'Added By', width: 100, headerClassName: 'super-app-theme--header', },
    { field: 'stockOut', headerName: 'Stock Out', width: 100, editable:true, headerClassName: 'super-app-theme--header',hide:true},
    { field: 'createdAt', headerName: 'Created At', width: 150, type: 'date', headerClassName: 'super-app-theme--header', hide:true},
    { field: 'updatedAt', headerName: 'Last Updated', width: 150, type: 'date',headerClassName: 'super-app-theme--header', hide:true},
    { field: 'id', headerName: 'obj ID', width: 100,headerClassName: 'super-app-theme--header',hide:true  },
    ]

  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10} theme={theme.themes[theme.active]}>
            <form onSubmit={e=>getItems(e)}>
            <SearchBoxStyle>
         
          <SearchTextStyle theme={theme.themes[theme.active]} size='small' variant='outlined' label ='Search...' placeholder='Search....' value={searchField} onChange={e=>handleChange(e)}/>
          <SearchFilterBoxStyle theme={theme.themes[theme.active]}>
          <SelectStyle select
          theme={theme.themes[theme.active]}
                label='Search By'
                name='selectSearchBy'
                size='small'
                value={searchBy}
                onChange={handlesearchByChange}
                >
                <MenuItem value='itemID'>Item ID</MenuItem>
                <MenuItem value='itemName'>Item Name</MenuItem>
                <MenuItem value='type'>Item Type</MenuItem>
                <MenuItem value='model'>Model</MenuItem>
                <MenuItem value='vendor'>Vendor</MenuItem>
                <MenuItem value='desc'>Description</MenuItem>
                <MenuItem value='itemAddedBy'>DEO</MenuItem>
                <MenuItem value='fault'>Req Actions</MenuItem>
                <MenuItem value='isDeleted' sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>Deleted Items</MenuItem>

            </SelectStyle>
      
            <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<Search />}>{isLoading.Search ? <CircularProgress color='inherit' size='2rem'/> : 'Search'}</SearchButtonStyle>
            </SearchFilterBoxStyle>
            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle>
            {items.data &&
            <DataGridStyle
             theme={theme.themes[theme.active]}
            rows={items.data}
            columns={columns}
            components={{
              Toolbar: CustomToolbar,
            }}
            rowsPerPageOptions={[15, 25, 50, 100]}
            checkboxSelection = {false}
            density='compact'
            onCellEditCommit={onRowEditCommit}
            disableSelectionOnClick 
            getRowClassName={(params) =>  params.row.isDeleted ? 'super-app-theme--DELETED' : (params.row.stockOut || parseInt(params.row.qty)<=0) ? `super-app-theme--stockout`: parseInt(params.row.qty)<=10 ? `super-app-theme--soonstockout` :'super-app-theme--stockOk'}
            /> }

            </DataGridBoxStyle>
     
            </MainPaperStyle>

            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000}
            onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
            anchorOrigin={{ vertical:'top',horizontal:'center' }}
            >
           <Alert  severity={alertSnack.msgColor}  elevation={6} variant="filled">
            {alertSnack.message}
           </Alert>
           </Snackbar>
           {openModal.open &&  <DetailModal logs={!openModal.item ? true:null} item={openModal.item ? curItem:null} open={openModal.open} onclose={()=>toggleModal({open:false, item:true})} />}
          
    </MainBoxStyle>
  )
}

export default ItemSearch