import { Box, alpha, Button, Paper} from "@mui/material";
import styled from '@emotion/styled'
import {themeVar} from '../src/DataSource/themeVar'

export const MainBoxStyle = styled(Box)(props=>({
  display:'flex',
  flex:'10',
  height:'80vh',
  borderRadius:'0.5rem',
  justifyContent:'center',
  backgroundColor:props.theme.tabBackground,
  [themeVar.breakpoints.down('tablet')]:{
      flexDirection:'column',
      width:'100%',
      height:'100%'
  },
        
}))

export const MainPaper=styled(Paper)({
  width:'100%',
  height:'100%',
  background:'transparent',
  display:'flex',
  flexDirection:'column',
  borderRadius:'0.5rem'
})
export const SearchFilterBoxStyle = styled(Box)({
    display:'flex',
    width:'100%',
    justifyContent:'flex-end',
    [themeVar.breakpoints.down('mobile')]:{
      justifyContent:'space-between'
    }
})

export const DataGridBoxStyle = styled(Box)({
  '& button':{
    height:'1.7rem',
    [themeVar.breakpoints.down('tablet')]:{
        fontSize:'0.5rem',
    }
    
},
  '& .header':{
    backgroundColor: alpha('#152D32', 0.8),
    color:'azure',
    fontSize:'1rem'
},

  '& .MuiDataGrid-cell': {
    color: 'rgba(255,255,255,0.9)'
  },
    '& .super-app-themeVar--true': {
        backgroundColor: alpha(themeVar.palette.warning.dark, 0.6),
        '&:hover': {
          backgroundColor: alpha(themeVar.palette.warning.dark, 0.9),
        },
      },
      '& .super-app-themeVar--false': {
        backgroundColor: alpha(themeVar.palette.success.dark, 0.6),
        '&:hover': {
        backgroundColor: alpha(themeVar.palette.success.dark, 0.9),
        },
      },   
   height:'70vh',
})

export const SearchBtnStyle = styled(Button)({
  margin:'0.5rem',
  width:'10rem',
  height:'3rem',
  fontSize:'0.8rem',
  borderRadius:'0.5rem',
  [themeVar.breakpoints.down('mobile')]:{
    width:'30vw',
    height:'2rem',
    fontSize:'0.6rem',
  }
})
