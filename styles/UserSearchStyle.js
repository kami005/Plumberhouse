import styled from "@emotion/styled";
import { Box, Button, Paper, Select, TextField } from "@mui/material";
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
  flexWrap:'wrap',
  [themeVar.breakpoints.down('mobile')]:{
    justifyContent:'flex-end',
    alignItems:'flex-end'
},
'& span':{
    fontSize:'0.8rem'
}
})

export const SearchTextStyle = styled(TextField)(props=>({
    margin:'0.3rem',
    '& input':{
        color:props.theme.text
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%'
    }
}))

export const SearchButtonStyle = styled(Button)(props=>({
    height:'2.5rem',
    width:'10rem',
    borderRadius:'2rem',
    margin:'0.3rem',
}))

export const DataGridBoxStyle = styled(Box)(props=>({
    width:'100%',
    borderRadius:'0.5rem',
    height:'70vh',
    [themeVar.breakpoints.down('laptop')]:{
        height:'65vh'
    },
}))

export const DataGridStyle = styled(DataGrid)(props=>({
    borderRadius:'0.5rem',
    '& svg, p':{
        color:props.theme.text
    },
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
    '& .super-app-theme--ACTIVE':{
        backgroundColor: alpha(themeVar.palette.success.main, 0.6),
    '&:hover':{
        backgroundColor: themeVar.palette.success.main,
    }
    },
    '& .super-app-theme--SUSPENDED':{
        backgroundColor: alpha(themeVar.palette.warning.main, 0.6),
    '&:hover':{
        backgroundColor: themeVar.palette.warning.main  ,
    }
    },
    '& .super-app-theme--BLOCKED':{
        backgroundColor: alpha(themeVar.palette.warning.main, 0.6),
    '&:hover':{
        backgroundColor: themeVar.palette.warning.main  ,
    }
    },
    '& .super-app-theme--DELETED':{
        backgroundColor: alpha(themeVar.palette.error.main, 0.6),
    '&:hover':{
        backgroundColor: themeVar.palette.error.main,
    }
    }
}))


export const SelectStyle = styled(TextField)(props=>({
    width:'9rem',
    textAlign:'left',
    margin:'0.2rem',
    '& div':{
        color:props.theme.text
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%',
    }
}))

export const SearchFirstBoxStyle = styled(Box)({
    display:'flex',
    alignItems:'center',
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%',
        justifyContent:'space-between'
    }
    
})

export const DateTextFieldStyle = styled(TextField)({
    margin:'0 0.5rem',

})
