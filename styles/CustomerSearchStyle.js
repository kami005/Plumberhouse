import styled from "@emotion/styled";
import { Box, Button, DialogActions, DialogTitle, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { alpha } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";

export const MainBoxStyle= styled(Box)(props=>({
    background:props.theme.tabBackground,
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
    alignItems:'center',
    padding:'0.5rem',
    gap:10,

    [themeVar.breakpoints.down('mobile')]:{
        flexDirection:'column',
        justifyContent:'flex-end',
        alignItems:'flex-end'
    }
})

export const SearchFilterBoxStyle = styled(Box)({
    display:'flex',
    gap:10,
    
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%',
        justifyContent:'center',
        alignItems:"center"
    }
})
export const SearchTextBoxStyle = styled(Box)({
    display:'flex',
    alignItems:'center',
    flexDirection:'row'
})
export const SearchTextStyle = styled(TextField)(props=>({
    width:'35vw',
    '&   input':{
        color:props.theme.text
    },
    '& label':{
        color:alpha (props.theme.text, 0.6)
    },
    [themeVar.breakpoints.down('tablet')]:{
        width:'100%'
    }
   
}))

export const SearchButtonStyle = styled(Button)(props=>({
   width:'8rem',
   height:'2.5rem',
   borderRadius:'1rem',
   [themeVar.breakpoints.down('mobile')]:{
    width:'7rem',
    height:'2rem',
    fontSize:'0.6rem'
   }
}))

export const DataGridBoxStyle = styled(Box)({
    height:'70vh',

})
export const DataGridStyle = styled(DataGrid)(props=>({
    [themeVar.breakpoints.down('laptop')]:{
        height:'65vh'
    },
    '&  svg, p, input':{
        color:props.theme.text
    },
    '& button':{
        height:'1.7rem',
        [themeVar.breakpoints.down('tablet')]:{
            fontSize:'0.5rem',
        }
        
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

    '& .super-app-theme--PLUMBER':{
        backgroundColor: alpha(themeVar.palette.info.dark, 0.7),
    '&:hover':{
        backgroundColor: alpha(themeVar.palette.info.dark, 1),
    },      
    },
    '& .super-app-theme--PAYABLE':{
        backgroundColor: alpha(themeVar.palette.warning.dark, 0.7),
    '&:hover':{
        backgroundColor: alpha(themeVar.palette.warning.dark, 1),
    },      
    },
    '& .super-app-theme--OTHER':{
        backgroundColor: alpha(themeVar.palette.success.dark, 0.7),
    '&:hover':{
        backgroundColor: alpha(themeVar.palette.success.dark, 1),
    },      
    },
    '& .super-app-theme':{
        backgroundColor: alpha(themeVar.palette.success.dark, 0.7),
    '&:hover':{
        backgroundColor: alpha(themeVar.palette.success.dark, 1),
    },      
    },
    '& .super-app-theme--DELETED':{
        backgroundColor: alpha('#212121', 0.5),
    '&:hover':{
        backgroundColor: alpha('#212121', 0.9),
    },      
    },
}))
export const SelectStyle = styled(TextField)(props=>({
    '& fieldset, input, div':{
        color:props.theme.text
    },
    '& label':{
        color:alpha (props.theme.text, 0.5)
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%',
       }
    
})  )
export const DialogActionStyle = styled(DialogActions)({
    backgroundColor:alpha('#355C7D', 0.4),
})

export const DialogTitleStyle = styled(DialogTitle)({
    backgroundColor:alpha('#355C7D', 0.4),
})