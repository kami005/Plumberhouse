import styled from "@emotion/styled"
import { Box, Paper, TextField, Button, Select, DialogActions, DialogTitle } from "@mui/material"
import {themeVar} from '../src/DataSource/themeVar'
import { alpha } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"


export const DataGridStyle = styled(DataGrid)(props=>({
    borderRadius:'0.5rem',
    '& input,svg, p':{
        color:props.theme.text
    },
    '& button':{
        height:'1.7rem',
        [themeVar.breakpoints.down('tablet')]:{
            fontSize:'0.5rem',
        }
        
    },
    [themeVar.breakpoints.down('laptop')]:{
        height:'65vh'
    },
    '& .super-app-theme--header':{
            backgroundColor: alpha('#152D32', 0.8),
            color:'azure',
            fontSize:'1rem'
    },

  '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
    borderRight: `1px solid #303030`
  },

  '& .MuiDataGrid-cell': {
    color: 'rgba(255,255,255,0.9)'
  },
    '& .super-app-theme--PAID':{
        backgroundColor: alpha(themeVar.palette.success.main, 0.8),
    '&:hover':{
        backgroundColor: themeVar.palette.success.main,
    }
    },
    '& .super-app-theme--PARTIALPAID':{
        backgroundColor: alpha(themeVar.palette.warning.main, 0.8),
    '&:hover':{
        backgroundColor: themeVar.palette.warning.main  ,
    }
    },
    '& .super-app-theme--UNPAID':{
        backgroundColor: alpha(themeVar.palette.error.main, 0.8),
    '&:hover':{
        backgroundColor: themeVar.palette.error.main,
    }
    },
    '& .super-app-theme--RETURN':{
        backgroundColor: alpha(themeVar.palette.info.main, 0.8),
    '&:hover':{
        backgroundColor: themeVar.palette.info.main,
    }
    }
}))

export const MainBoxStyle= styled(Box)(props=>({
    backgroundColor:props.theme.tabBackground,
    borderRadius:'0.5rem',
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
    alignItems:'center',
    padding:'0.5rem',
    [themeVar.breakpoints.down('mobile')]:{
        flexDirection:'column',
        justifyContent:'flex-end',
    }
})

export const SearchFilterBoxStyle = styled(Box)({
    display:'flex',
    [themeVar.breakpoints.down('tablet')]:{
        width:'100%'
    }
})
export const SearchTextBoxStyle = styled(Box)(props=>({
    display:'flex',
    alignItems:'center',
    '& span':{
        color:props.theme.text,
    },
    [themeVar.breakpoints.down('laptop')]:{
        '& span':{
            fontSize:'0.8rem'
           }
        },
    [themeVar.breakpoints.down('tablet')]:{
       '& span':{
        fontSize:'0.7rem'
       }
    }
}))
export const SearchTextStyle = styled(TextField)(props=>({
    margin:'0.2rem',
    '& input, label':{
        color:props.theme.text
    }
    // [themeVar.breakpoints.down('tablet')]:{
    //     width:'100%',
    // }
   
}))

export const SearchButtonStyle = styled(Button)(props=>({
   width:'8rem',
   height:'2.5rem',
   borderRadius:'1rem',
   margin:'0.2rem',
   [themeVar.breakpoints.down('laptop')]:{
    width:'7rem',
    fontSize:'0.7rem',
    height:'2.5rem',
    },
   [themeVar.breakpoints.down('tablet')]:{
    width:'6rem',
    fontSize:'0.5rem',
    fontWeight:600,
    height:'2rem',
    }
}))

export const DataGridBoxStyle = styled(Box)(props=>({
    width:'100%',
    height:'65vh',
    '& div, svg':{
        color:props.theme.text
    },
    borderRadius:'1rem',
    '& .super-app-theme--stockout':{
        backgroundColor: alpha(themeVar.palette.error.main, 0.6),
    '&:hover':{
        backgroundColor: themeVar.palette.error.main,
    },      
    },
    '& .super-app-theme--soonstockout':{
        backgroundColor: alpha(themeVar.palette.warning.main, 0.6),
    '&:hover':{
        backgroundColor: themeVar.palette.warning.main,
    },      
    }
}))

export const SelectStyle = styled(Select)({
    width:'9rem',
    textAlign:'left',
    height:'3.5rem',
    
})  
export const DialogActionStyle = styled(DialogActions)({
    backgroundColor:alpha('#355C7D', 0.4),
})

export const DialogTitleStyle = styled(DialogTitle)({
    backgroundColor:alpha('#355C7D', 0.4),
})