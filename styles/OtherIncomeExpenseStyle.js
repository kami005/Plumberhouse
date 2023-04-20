import styled from "@emotion/styled";
import { Box, Button, Paper,TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { alpha } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";

export const MainBoxStyle= styled(Box)(props=>({
    backgroundColor:props.theme.tabBackground,
    borderRadius:'0.5rem'
}))

export const MainPaperStyle = styled(Paper)({
    minHeight:'20rem',
    backgroundColor:'transparent',
    borderRadius:'0.5rem',
    height:'80vh',
    [themeVar.breakpoints.down('tablet')]:{
        flexDirection:'column',
        width:'100%',
        height:'100%'
    }
})

export const SearchBoxStyle = styled(Box)({
  display:'flex',
  padding:'0.5rem',
  gap:5,
  [themeVar.breakpoints.down('mobile')]:{
    justifyContent:'center'
},
})

export const SearchTextStyle = styled(TextField)({
    height:'3.5rem',
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%'
    }
})

export const SearchButtonStyle = styled(Button)(props=>({
    width:'7.5rem !important',
    height:'2.5rem',
    cursor:'pointer',
    color:props.theme.text,
    backgroundColor:'rgba(60,179,113, 0.8)',
    boxShadow:'0.2em 0.2em 1em rgb(60,179,113)',
    borderRadius:'1rem',
    '&:hover':{
       color:alpha(themeVar.palette.common.white, 0.8),
       transform:'scale(1.1)',
       transition:'all 200ms ease-in-out',
       backgroundColor: 'rgba(207, 44, 19, 0.9)',
       boxShadow:'0.2em 0.2em 2em rgba(207, 44, 19, 0.9)',
       borderRadius:'0.2em',
       fontWeight:'700',
    },
    '&:active':{
        transform:'scale(1)',
        borderRadius:'0.5rem'
    },
    [themeVar.breakpoints.down('mobile')]:{
        fontSize:'0.7   rem'
    }
}))

export const DataGridBoxStyle = styled(Box)({
    width:'100%',
    display:'flex',
    height:'70vh',
    gap:5,
    [themeVar.breakpoints.down('laptop')]:{
        height:'65vh'
    },
    [themeVar.breakpoints.down('tablet')]:{
        flexDirection:'column',
        height:'100vh'
    }
})

export const DataGridStyle = styled(DataGrid)(props=>({
    borderRadius:'0.5rem',
    '& span, svg,p, input':{
        color:props.theme.text
    },
    '& button':{
        height:'1.7rem',
        [themeVar.breakpoints.down('bigTab')]:{
            fontSize:'0.5rem',
        }
    },
        '& .super-app-theme--header':{
            backgroundColor: alpha('#152D32', 0.8),
            color:'azure',
            fontSize:'1rem'
        },
  '& .MuiDataGrid-columnsContainer': {
    backgroundColor: themeVar.palette.mode === 'light' ? '#fafafa' : '#1d1d1d',
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
    backgroundColor: alpha(themeVar.palette.error.dark, 0.7),
'&:hover':{
    backgroundColor: alpha(themeVar.palette.error.dark, 1),

},      
},
'& .super-app-theme--SALERETURN, .super-app-theme--PURCHASERETURN ':{
    backgroundColor: alpha(themeVar.palette.warning.dark, 0.7),

'&:hover':{
    backgroundColor: alpha(themeVar.palette.warning.dark, 1),
},      
},
'& .super-app-theme--SALES, .super-app-theme--PURCHASES':{
    backgroundColor: alpha(themeVar.palette.success.dark, 0.7),

'&:hover':{
    backgroundColor: alpha(themeVar.palette.success.dark, 1),
},      
},

}))


export const DateTextFieldStyle = styled(TextField)(props=>({
width:'12rem',
'& input, svg':{
    color:props.theme.text
},
    '& label':{
        color:alpha(props.theme.text, 0.6)
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'50%',
    },

}))