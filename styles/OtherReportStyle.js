import { Box, alpha, Paper, Typography, TextField, Button } from "@mui/material";
import styled from '@emotion/styled'
import { themeVar } from "../src/DataSource/themeVar";


export const MainBox= styled(Box)(props=>({
    backgroundColor:props.theme.tabBackground,
    borderRadius:'0.5rem',
    '& h6, label':{
        color:props.theme.text
    }
}))

export const HeaderText = styled(Typography)(props=>({
    textAlign:'center'
}))

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
        width:'50%',
    },
    [themeVar.breakpoints.down('tablet')]:{
        width:'100%',
    },
}))

export const SearchButtonStyle = styled(Button)(props=>({
    height:'2.5rem',
    width:'12rem',
    borderRadius:'1rem',
    margin:'0.5rem',
    [themeVar.breakpoints.down('laptop')]:{
        fontSize:'0.8rem'
     },
}))

export const SearchBox = styled(Box)(props=>({
 display:'flex',
 [themeVar.breakpoints.down('tablet')]:{
    flexDirection:'column'
 }
}))
export const SearchFirstBoxStyle = styled(Box)({
    display:'flex',
    alignItems:'center',
    padding:'0 0.5rem',
    justifyContent:'flex-start',
    [themeVar.breakpoints.down('mobile')]:{
        padding:'0',
        alignItems:'flex-end',
        margin:'0.5rem',
        '& span':{
            fontSize:'0.7rem',
            fontWeight:600
        }
    }
    
})