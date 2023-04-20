import React, {useContext, useEffect, useReducer, useState} from 'react'
import { MainBoxStyle, MainPaperStyle, SearchBoxStyle, SearchTextStyle, 
SearchButtonStyle, DataGridBoxStyle, DataGridStyle, SelectStyle, SearchFirstBoxStyle } from '../../styles/UserSearchStyle'
import { alertReducer, itemReducer, loadingReducer} from '../CustomHooks/RandHooks';
import {  Alert, CircularProgress, IconButton, Menu, MenuItem, Snackbar } from '@mui/material';
import { MoreHoriz, Search } from '@mui/icons-material';
import { FindAllUsers } from '../BackendConnect/AuthenticateUser.js';
import { USERSKEY } from '../DataSource/RandData';
import { SessionContext } from '../Context/SessionContext';
import { userType } from '../DataSource/RandData';

const UserSearch =  (props) => {

const {EditUser, GotoSessions}= props
const [users, setusers] = useState(null)
const [curUser, setCurUser]= useState()
const [anchorEl, setAnchorEl]= useState()
const [isLoading, dispatchLoading] = useReducer(loadingReducer, {Search:false, Delete:false})
const [textState, dispatchData]=useReducer(itemReducer, {searchBy:'email', status:'ACTIVE', text:''}) 
const context = useContext(SessionContext)
const {session, theme} = context
const [alertSnack, dispatchSnack ] = useReducer(alertReducer, {message:'Sale Cancelled', isOpen:false, msgColor:'error'})
const SetInStrogate = ()=>{
  localStorage.setItem(USERSKEY, JSON.stringify(users))
}
const GetFromStorage = ()=>{
 const data = JSON.parse(localStorage.getItem(USERSKEY))
 let rowData =[]
 if(data && data.length)
 {
 
  data.map(item=>rowData.push({...item, createdAt:new Date(item.createdAt), updatedAt:new Date(item.updatedAt)}))
 }
 if(rowData.length)
 setusers(rowData)
}

const GetUsers =async (e)=>{
    e.preventDefault()
  try
  {
    if(!isLoading.Search && session[0])
    {
      let rowData =[]
      dispatchLoading({type:'SEARCHSTART'})
      const filterVal = {[textState.searchBy]:textState.text}
      let searchFilter={...filterVal, status:textState.status==='SHOW ALL' ? undefined:textState.status}
      const res =await FindAllUsers({...searchFilter, myToken:session[0].token, myId:session[0]._id})
      if(res)
        {

          const myIndex = userType.findIndex(val=>val=== session[0].userType)
        
          if(myIndex>-1)
          {
    
            for (let i=0;i<res.length;i++)
            {
              const userIndex = userType.findIndex(val=>val=== res[i].userType)
              
              if(userIndex>myIndex)
              {
              rowData.push({...res[i], id:res[i]._id, fName:'****',  lName:'****', address:'****', email:'****',  createdAt:'****', updatedAt:'****'})
              }
              else
              {
              rowData.push({...res[i], id:res[i]._id,  createdAt:new Date(res[i].createdAt), updatedAt:new Date(res[i].updatedAt)})
              }
            }
          setusers(rowData)

        }
      }

        dispatchLoading({type:'SEARCHEND'})
   
    }
  }catch(err)
  {
    dispatchLoading({type:'SEARCHEND'})
    console.log(err)
  }
      
}   

const handleMoreClick=(e, item)=>{
  setCurUser(item)
  setAnchorEl(e.currentTarget);
}


const handleCloseAnchor=()=>{
  setAnchorEl(null)
}

const handleEditItem=async()=>{
  try{
    handleCloseAnchor()
    if(session[0] && session[0].userType && curUser)
    {
      if(session[0].token === curUser._id && curUser.userType !=='Developer')
      {
        dispatchSnack({type:'OTHER', message:'Go to "My Accounts" to update own User', msgColor:'primary'})
        return
      }

      const myIndex = userType.findIndex(val=>val=== session[0].userType)
      const userIndex = userType.findIndex(val=>val=== curUser.userType)
      if(myIndex>-1 && userIndex>-1)
      {
        if(userIndex>myIndex)
        {
          dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else  
        {
          let res = await FindAllUsers({_id:curUser.id, myToken:session[0].token, myId:session[0]._id})
          if(res && res.length)
          {
            let user = {...res[0], id:curUser.id}
            EditUser(user)
          }
          else
          EditUser(curUser)
        }
      }
     
    }
  }catch(er)
  {
console.log(er)
  }
 
}


const handleLoadSessions =()=>{
  try{
    handleCloseAnchor()
    if(session[0] && session[0].userType && curUser)
    {
      const myIndex = userType.findIndex(val=>val=== session[0].userType)
      const userIndex= userType.findIndex(val=>val=== curUser.userType)
      if(myIndex>-1 && userIndex>-1)
      {
        if(userIndex>myIndex)
        {
          dispatchSnack({type:'OTHER', message:'Access Denied!', msgColor:'warning'})
        }
        else  
        GotoSessions(curUser)
      }
     
    }
  }catch(er)
  {
console.log(er)
  }

}


const columns=[
  { field: 'more', headerName:'More', width: 60,
  renderCell: (params)=>{
    const handleMore =(e)=>{
      const data =users.find(user=>user.id === params.row.id)
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
      <MenuItem onClick={handleLoadSessions}>
      Sessions
      </MenuItem>
      </Menu>
      </React.Fragment>
    )
  }},
  { field: 'username',headerName: 'Username',width: 100}, 
  {field: 'email',headerName: 'Email',width: 120,},
  { field: 'userType', headerName: 'User Type', width: 100 },
  {field: 'fName', headerName: 'First Name', width: 120},
  {field: 'lName', headerName: 'Last Name',width: 120,},
  { field: 'address', headerName: 'Address', width: 100 },
  { field: 'id', headerName: 'ID', width: 80  },
  {field:'status', headerName:'Status', width:100, cellClassName:(params)=>`status-${params.value}`},
  { field: 'createdAt', headerName: 'Create Date', width: 150 },
  { field: 'updatedAt', headerName: 'Last Updated', width: 150 },
    ]

    useEffect(()=>{
      GetFromStorage()
      },[])

      useEffect(()=>{
        SetInStrogate()
        },[users])
  

  return (
    <MainBoxStyle theme={theme.themes[theme.active]}>
            <MainPaperStyle elevation={10}>
            <form onSubmit={e=>GetUsers(e)}>
            <SearchBoxStyle>
            <SearchTextStyle theme={theme.themes[theme.active]} size='small' variant='outlined' placeholder='Search....' value={textState.text} name='text' onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}/>
            <SearchFirstBoxStyle>
            
              <SelectStyle
              select
              theme={theme.themes[theme.active]}
                name='searchBy'
                size='small'
                value={textState.searchBy}
                onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}>
                <MenuItem value='username'>Username</MenuItem>
                <MenuItem value='email'>Email</MenuItem>
                <MenuItem value='address'>Address</MenuItem>
                <MenuItem value='fName'>First Name</MenuItem>
                <MenuItem value='lName'>Last Name</MenuItem>
                <MenuItem value='userType'>User Type</MenuItem>
                </SelectStyle>

                <SelectStyle
                theme={theme.themes[theme.active]}
               select
               size='small'
                name='status'
                value={textState.status}
                onChange={e=>dispatchData({type:'CHANGEVAL', payload:e})}>
                <MenuItem value='SHOW ALL'>SHOW ALL</MenuItem>
                <MenuItem value='ACTIVE'>ACTIVE</MenuItem>
                <MenuItem value='SUSPENDED'>SUSPENDED</MenuItem>
                <MenuItem value='BLOCKED'>BLOCKED</MenuItem>
                <MenuItem value='DELETED' sx={{backgroundColor:'rgba(235, 64, 52, 0.8)'}}>DELETED</MenuItem>     
                </SelectStyle>

            </SearchFirstBoxStyle>
             <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<Search />}>{isLoading.Search ? <CircularProgress color='inherit' /> :'Search'}</SearchButtonStyle>
      
            </SearchBoxStyle>
            </form>
            <DataGridBoxStyle>
            {users &&
            <DataGridStyle
            theme={theme.themes[theme.active]}
            rows={users}
            density='compact'
            columns={columns}
            pageSize={15}
            rowsPerPageOptions={[15]}
            checkboxSelection = {false}
            disableSelectionOnClick
            classes={{row:'row', columnHeader:'header'}}
            getRowClassName={(params) => 
                `super-app-theme--${params.row.status}`
                }
            /> }
         
            </DataGridBoxStyle>
            </MainPaperStyle>

            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={()=>dispatchSnack({type:'CLOSEMSG'})}
            anchorOrigin={{ vertical:'top',horizontal:'center' }} >
          <Alert  severity={alertSnack.msgColor}  elevation={6} variant="standard">
          {alertSnack.message}
          </Alert>
          </Snackbar>

    </MainBoxStyle>
  )
}

export default UserSearch