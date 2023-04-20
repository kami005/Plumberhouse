import styled from "@emotion/styled";
import { Box, Button, Paper, TextField } from "@mui/material";
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
[themeVar.breakpoints.down('tablet')]:{
    flexDirection:'column',
},
[themeVar.breakpoints.down('mobile')]:{
   alignItems:'flex-end'
}
})

export const SearchTextStyle = styled(TextField)(props=>({
    width:'9rem',
    textAlign:'left',
    '& input,fieldset,input, div':{
        color:props.theme.text
    },
    '& label':{
        color:alpha(props.theme.text, 0.6)
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%'
    }
}))

export const SearchButtonStyle = styled(Button)(props=>({
    height:'2.5rem',
    width:'8rem',
    borderRadius:'1rem',
    margin:'0.5rem',
    [themeVar.breakpoints.down('laptop')]:{
        fontSize:'0.8rem'
     },
}))

export const DataGridBoxStyle = styled(Box)({
    height:'67vh',
})

export const DataGridStyle = styled(DataGrid)(props=>({
    borderRadius:'0.5rem',

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
'& .super-app-theme--PARTIALPAID':{
    backgroundColor: alpha(themeVar.palette.warning.dark, 0.7),
'&:hover':{
    backgroundColor: alpha(themeVar.palette.warning.dark, 1),
},      
},
'& .super-app-theme--PAID':{
    backgroundColor: alpha(themeVar.palette.success.dark, 0.7),
'&:hover':{
    backgroundColor: alpha(themeVar.palette.success.dark, 1),
},   
},
'& .super-app-theme--RETURN':{
    backgroundColor: alpha(themeVar.palette.info.dark, 0.7),
'&:hover':{
    backgroundColor: alpha(themeVar.palette.info.dark, 1),
},   
},
'& .super-app-theme--DELETED':{
    backgroundColor: alpha('#212121', 0.5),
'&:hover':{
    backgroundColor: alpha('#212121', 0.9),
},      
},

}))


export const SearchFirstBoxStyle = styled(Box)({
    display:'flex',
    alignItems:'center',
    margin:'0.5rem',
    gap:10,
    [themeVar.breakpoints.down('mobile')]:{
        width:'95%',
        flexDirection:'column'
    }
    
})

export const SearchBoxField = styled(Box)({
    display:'flex',

    gap:10,
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%',
    },
})

export const DateTextFieldStyle = styled(TextField)(props=>({
    width:'12rem',
    '& svg, input':{
        color:props.theme.text
    },
    '& label':{
        color:alpha(props.theme.text, 0.6)
    },
    [themeVar.breakpoints.down('laptop')]:{
        width:'10rem',
    },
    [themeVar.breakpoints.down('laptop')]:{
        width:'100%',
    },

}))

export const FooterBoxStyle = styled(Box)(props=>({
    background:alpha(props.theme.tabBackground, 0.4),
    margin:'0.3rem',
    color:'white',
    display:'flex',
    justifyContent:'flex-end',
    alignItems:'center',
    borderRadius:'0.5rem',
    justifyContent:'center',
    '& p':{
        fontWeight:700,
        letterSpacing:'0.1em',
        color:props.theme.text,
    },
}))