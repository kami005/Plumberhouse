import { DataGrid } from '@mui/x-data-grid'
import React, { useContext, useEffect, useReducer, useState} from 'react'
import { CircularProgress, Snackbar, Alert, MenuItem , Menu, IconButton, LinearProgress, Button} from '@mui/material';
import {MoreHoriz, ManageSearch, Create, DeleteForever} from '@mui/icons-material'
import {findSessions, LogoutUserById, deleteSession, FindUserData} from '../BackendConnect/AuthenticateUser'
import { DataGridBoxStyle, MainBoxStyle, MainPaper, SearchBtnStyle, SearchFilterBoxStyle } from '../../styles/UserSessionsStyle';
import { alertReducer, useToggle } from '../CustomHooks/RandHooks';
import { SessionContext } from '../Context/SessionContext';
import { GridToolbarContainer, GridToolbarColumnsButton, GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import { userType } from '../DataSource/RandData';

const UserSessions=(props)=> {
    const {toggleSession, user} = props
    const [sessionRow, setSession] = useState()
    const [anchorEl, setAnchorEl] = useState(null)
    const [curSession, setCurSession] = useState(null)
    const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'Session Deleted Successfully', isOpen:false, msgColor:'warning'})
    const [isLoading, toggleLoading] = useToggle(false)
    const sessionButton =isLoading ? <CircularProgress /> : 'Sessions'
    const context = useContext(SessionContext)
    const {session, theme} = context
    const [selectedRows, SetRows] = useState([])
    const handleMoreClick=(e, user)=>{
        setCurSession(user)
        setAnchorEl(e.currentTarget);
      }
      const handleCloseAnchor=()=>{
          setAnchorEl(null)
      }
      const columns=[
        {
            field: "more",
            headerName: 'More',
            renderCell: (params) => {
                const handleMore =(e)=>{
                  handleMoreClick(e, params.row)
                } 
                const onClickLogout = async () => {
                  try
                  {
                    toggleLoading()
                    handleCloseAnchor()
                    const myIndex = userType.findIndex(val=>val=== session[0].userType)
                    let curUserType='User'
                    const user = await FindUserData(curSession.token,  curSession._id)
                    if(user && user.userType)
                       curUserType= user.userType
                      
                    const userIndex= userType.findIndex(val=>val=== curUserType)
                    if(myIndex>-1 && userIndex>-1)
                    {
                      if(userIndex>myIndex)
                      {
                        dispatchSnack({type:'OTHER', message:`Unable to Force Logout ${curSession.username}`, msgColor:'error'})
                      }
                      else
                      {
                        if(session[0])
                        {
                            const res = await LogoutUserById({token:curSession.id, myToken:session[0].token, myId:session[0]._id})
                            if(res){
                             dispatchSnack({type:'OTHER', message:`${curSession.username} has been Loggedout Successfully`, msgColor:'info'})
                            loadSessions()
                           }
                            else{
                             dispatchSnack({type:'OTHER', message:`Unknown Error occured!`, msgColor:'error'})
         
                            }
                        }
                      }
                    }
                    toggleLoading()
                  }catch(er)
                  {
                    toggleLoading()
                    console.log(er)
                  }
                  


                  }
                  const onClickDelete = async () => {
                    try
                    {
                      toggleLoading()
                      handleCloseAnchor()
                      const myIndex = userType.findIndex(val=>val=== session[0].userType)
                      let curUserType='User'
                      const user = await FindUserData(curSession.token,  curSession._id)
                      if(user && user.userType)
                         curUserType= user.userType
                        
                      const userIndex= userType.findIndex(val=>val=== curUserType)
                      if(myIndex>-1 && userIndex>-1)
                      {
                        if(userIndex>myIndex)
                        {
                          dispatchSnack({type:'OTHER', message:`Unable to Delete Session of ${curSession.username}`, msgColor:'error'})
                        }
                        else  
                          {
                            if(session)
                            {
                                const res = await deleteSession({_id:curSession.id, myToken:session[0].token, myId:session[0]._id})
                                if(res && res.id){
                                    dispatchSnack({type:'OTHER', message:`Session has been deleted Successfully`, msgColor:'warning'})
                
                              await  loadSessions()
                              
                            }
           
                          }
                          else{
                            dispatchSnack({type:'OTHER', message:`Unknown Error occured!`, msgColor:'error'})
                          }
                         }
                          }

                          toggleLoading()
                    }catch(er)
                    {
                      toggleLoading()
                      handleCloseAnchor()
                      console.log(er)
                    }

                    }
                    

           
              return (
                  <React.Fragment>
              
                  <IconButton aria-controls="more-menu" aria-haspopup="true" onClick={e=>handleMore(e)}>
                      <MoreHoriz style={{color:'red', backgroundColor:'rgba(106,121,247,0.8)', borderRadius:'50%'}}/>
                  </IconButton>
                  <Menu
                    id="more-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleCloseAnchor}>
                    <MenuItem onClick={onClickLogout}>Log out</MenuItem>
                    <MenuItem onClick={onClickDelete}>Delete</MenuItem>
                    </Menu>
                  </React.Fragment>
              );
            },
            width:60
        },
        
        { field: 'username',headerName: 'Username',width: 150}, 
        {field: 'duration', headerName: 'Duration',width: 80,},
        { field: 'id', headerName: 'Session ID', width: 170 },
        {field: 'isDeleted', headerName: 'Offline', width: 120,cellClassName:(params)=>`status-${params.value}`},
        { field: 'createdAt', headerName: 'Create Date', width: 200 },
        { field: 'updatedAt', headerName: 'Last Updated', width: 200 },]
      const loadSessions =async ()=>{
        try{
            if(session[0])
            {
                toggleLoading()
                let res =null
                if(user && user.id)
                    res=await findSessions({token:user.id, myToken:session[0].token, myId:session[0]._id})
                else
                    res=await findSessions({myToken:session[0].token, myId:session[0]._id})
                let rowData=[]
                if(res){
                    await res.map(session=>rowData.push({id:session._id,...session}))
                    setSession(rowData)
                }
                else{
                    setSession([])
                }
                toggleLoading()
            }
      
    }
        catch(err){
            console.log(err)
        }
    }
    const DeleteRows =async()=>{
      try
      {
        const myIndex = userType.findIndex(val=>val=== session[0].userType)
        if(session[0] && session[0].username)
        {
            toggleLoading()
            for (let i=0; i<selectedRows.length;i++)
            {

              let curUserType='User'
              const user = await FindUserData(selectedRows[i].token,  selectedRows[i]._id)
              if(user && user.userType)
              curUserType = user.userType
              const userIndex= userType.findIndex(val=>val=== curUserType)
              if(myIndex>-1 && userIndex>-1 && userIndex<myIndex)
              {
                await deleteSession({_id:selectedRows[i].id, myToken:session[0].token, myId:session[0]._id})
              }
            }

            dispatchSnack({type:'OTHER', message:`Multiple Sessions have been deleted!`, msgColor:'info'})

           await loadSessions()
          
        }
        toggleLoading()

      }catch(er)
      {
        toggleLoading()
        console.log(er)
      }

    }

    function CustomToolbar() {
        return (
          <GridToolbarContainer sx={{display:'flex', gap:0.5,  marginBottom:'0.2rem'}} >
            <GridToolbarQuickFilter sx={{color:'white', width:'42%'}}/>
            <GridToolbarColumnsButton variant='contained' />
            <GridToolbarExport variant='contained'/>
            <Button disabled={!selectedRows || !selectedRows.length}  variant='contained' startIcon={<DeleteForever sx={{color:'white' }}/>}
             onClick={DeleteRows}>
             Delete
            </Button>
          </GridToolbarContainer>
        );
      }

useEffect(()=>{
if(user && user.id)
loadSessions()
},[])

    return (
        <MainBoxStyle theme={theme.themes[theme.active]}>
        <MainPaper elevation={10}>
        <SearchFilterBoxStyle>
        
        <SearchBtnStyle  variant='contained' color='success' onClick={loadSessions} endIcon={<ManageSearch  />}>{sessionButton}</SearchBtnStyle>
        <SearchBtnStyle  variant='contained' color='success' onClick={toggleSession} endIcon={<Create  />}>Manage</SearchBtnStyle>
        </SearchFilterBoxStyle>
        {isLoading && <LinearProgress style={{background:'linear-gradient(90deg, red, yellow, green)'}}/>}
           
             <DataGridBoxStyle>
            {sessionRow && 
            <DataGrid
            density='compact'
                rows={sessionRow}
                columns={columns}
                classes={{row:'row', columnHeader:'header'}}
                pageSize={15}
                disableSelectionOnClick
                rowsPerPageOptions={[15]}
                components={{
                    Toolbar: CustomToolbar,
                  }}
                checkboxSelection = {true}
                onSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData = sessionRow.filter((sessionRow) =>
                      selectedIDs.has(sessionRow.id.toString())
                    );
                    SetRows(selectedRowData)
                  }}
                getRowClassName={(params) =>
                `super-app-themeVar--${params.row.isDeleted}`
                }
                /> }
        </DataGridBoxStyle>
        </MainPaper>

            <Snackbar open={alertSnack.isOpen} autoHideDuration={2000} onClose={()=>dispatchSnack({type:'CLOSEMSG'})} 
            anchorOrigin={{ vertical:'top',horizontal:'center' }}>
            <Alert  severity={alertSnack.msgColor}  elevation={6} variant="standard">
            {alertSnack.message}
            </Alert>
            </Snackbar>
        </MainBoxStyle>
    )
}

export default UserSessions
