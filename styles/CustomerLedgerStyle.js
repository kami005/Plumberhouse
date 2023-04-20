import styled from "@emotion/styled";
import { Box, Button, DialogActions, DialogTitle, Paper, TextField } from "@mui/material";
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
    alignItems:'center',
    padding:'0.5rem',
    gap:10,
})

export const SearchTextStyle = styled(TextField)({
    margin:'0 0.2rem',
    width:'35vw',
    [themeVar.breakpoints.down('tablet')]:{
        width:'100%'
    }
   
})

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

export const DataGridBoxStyle = styled(Box)(props=>({
    width:'100%',
    height:'65vh',
    borderRadius:'1rem',
    '&  svg, p, input':{
        color:props.theme.text
    },
    '& button':{
        height:'1.7rem',
        [themeVar.breakpoints.down('tablet')]:{
            fontSize:'0.5rem',
        }
        
    },
    '& .super-app-theme--stockout':{
        backgroundColor: alpha(themeVar.palette.error.main, 0.8),
    ':hover':{
        backgroundColor: themeVar.palette.error.main,
    },      
    },
    '& .super-app-theme--soonstockout':{
        backgroundColor: alpha(themeVar.palette.warning.main, 0.8),
    ':hover':{
        backgroundColor: themeVar.palette.warning.main,
    },      
    },
    '& .super-app-theme--SALES, .super-app-theme--PURCHASES':{
        backgroundColor: alpha(themeVar.palette.success.dark, 0.8),
    ':hover':{
        backgroundColor: themeVar.palette.success.dark,
    },      
    },
    '& .super-app-theme--SALERETURN, .super-app-theme--PURCHASERETURN':{
        backgroundColor: alpha(themeVar.palette.warning.dark, 0.8),
    ':hover':{
        backgroundColor: themeVar.palette.warning.dark,
    },      
    },
}))

export const DataGridStyle = styled(DataGrid)({
    borderRadius:'0.5rem'
})

export const DialogActionStyle = styled(DialogActions)({
    backgroundColor:alpha('#355C7D', 0.4),
})

export const DialogTitleStyle = styled(DialogTitle)({
    backgroundColor:alpha('#355C7D', 0.4),
})