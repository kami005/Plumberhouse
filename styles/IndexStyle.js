import styled from '@emotion/styled'
import { Paper, Card, Box, CardContent, IconButton } from "@mui/material"
import { alpha } from "@mui/system"
import { DataGrid } from '@mui/x-data-grid'
import { themeVar } from '../src/DataSource/themeVar'

export const StyledBoxMain = styled(Box)(
    {
      display:'flex',
      flexDirection:'column',
      padding:'0 0.2rem',
  } )

  export const PaperStyled = styled(Paper)(props=>({
    backgroundColor:props.theme.tabBackground,
  }))

  export const CardGraphStyle =styled(Card)(props=>(
    {
      backgroundColor:props.theme.tabBackground,
      margin:'0.5rem 0',
      '& span':{
        fontWeight:700,
        fontSize:'1.5rem',
        letterSpacing:'0.1em',
        color:props.theme.text,
        [themeVar.breakpoints.down('mobile')]:{
          fontSize:'1.3rem',
        }
      },
      
    }
  ))

  export const IconBtnStyle = styled(IconButton)(props=>({
    
    '& svg':{
      color:props.theme.text,
      width:'25px',
      height:'25px',
      filter:`drop-shadow(0 0 5px ${props.theme.shadowText}) drop-shadow(1.5px 1.5px ${props.theme.shadowText}) drop-shadow(0 0 20px ${props.theme.shadowText})`,
    }
  }))
  export const CardContentStyle = styled(CardContent)(props=>({
    display:'flex',
    flexDirection:'column',
    margin:'0',
    '& h6':{
      fontWeight:700,
      fontSize:'1.5rem',
      letterSpacing:'0.1em',
      color:props.theme.text,
      [themeVar.breakpoints.down('mobile')]:{
        fontSize:'1.2rem',
      } 
    },
  
  }))

  export const DataGridStyle = styled(DataGrid)(props=>({
    borderRadius:'0.5rem',
    border: 0,
    '& svg, p, input':{
      color:props.theme.text
    },
    '& .super-app-theme--header':{
            backgroundColor: alpha('#152D32', 0.8),
            color:'azure',
            fontSize:'1rem'
    },

  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: alpha('#152D32', 0.8),
  },
  '& .MuiDataGrid-iconSeparator': {
    display: 'none',
  },
  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid #303030`
  },

  '& .MuiDataGrid-cell': {
    color: 'rgba(255,255,255,0.9)'
  },
  '& .super-app-theme--UNPAID':{
    border: `1px solid black`,
    backgroundColor: alpha(themeVar.palette.error.dark, 0.7),

'&:hover':{
    backgroundColor: alpha(themeVar.palette.error.dark, 1),

},      
},
'& .super-app-theme--PARTIALPAID, .super-app-theme--PURCHASE':{
    backgroundColor: alpha(themeVar.palette.warning.dark, 0.7),

'&:hover':{
    backgroundColor: alpha(themeVar.palette.warning.dark, 1),
},      
},
'& .super-app-theme--RETURN, .super-app-theme--SALERETURN':{
  backgroundColor: alpha(themeVar.palette.info.dark, 0.7),

'&:hover':{
  backgroundColor: alpha(themeVar.palette.info.dark, 1),
},      
},
'& .super-app-theme--PAID, .super-app-theme--SALE':{
    backgroundColor: alpha(themeVar.palette.success.dark, 0.7),

'&:hover':{
    backgroundColor: alpha(themeVar.palette.success.dark, 1),
},      
}
}))