import { AppBar, Box, IconButton, Toolbar, Typography, alpha } from "@mui/material";
import styled from '@emotion/styled'
import { themeVar } from "../src/DataSource/themeVar";

export const StyledAppbar = styled(AppBar)(props=>({
    backgroundColor:'transparent',
    position:'relative',
}))

export const StyledToolbar = styled(Toolbar)(props=>(
    {
        display:'flex',
        justifyContent:'space-between',
        backgroundColor:alpha(props.theme.sidebar,0.9),
        maxHeight:5
    }
))

export const StyledTypographyTitle = styled(Typography)(props=>({
    fontWeight:600,
    color:props.theme.title,
    [themeVar.breakpoints.down('tablet')]:{
     fontSize:'1rem'
    },

    [themeVar.breakpoints.down('mobile')]:{
        fontSize:'0.8rem'
       },
    ':hover':{
        transition:'transform 200ms ease-in-out',
        transform:'scale(1.05)'
    },
    cursor:'pointer'
}))

export const LogoStyle = styled.img(props=>({
    width:'50px',
    height:'50px',
    marginRight:'0.5rem',
    marignLeft:0,
    transition:'transform 300ms ease-in-out',
    borderRadius:'0.3rem',
    boxShadow: `2px 2px ${props.theme.shadowText}`,
    ':hover':{
        cursor:'pointer',
        transform:'scale(1.05)',
        boxShadow: `2px 2px ${props.theme.shadowText}, 3px 3px ${props.theme.shadowText}, 0 0 5px #fff`,
    }
}))

export const StyledUserBox = styled(Box)({
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
   })

export const StyledTypographyUsername = styled(Typography)(props=>(
    {
        fontWeight:600,
        color:props.theme.title,
        [themeVar.breakpoints.down('tablet')]:{
         display:'none'
        },
        ':hover':{
            transition:'transform 200ms ease-in-out',
            transform:'scale(1.05)'
        },
        ':active':{
            transition:'transform 1ms ease-in-out',
            transform:'scale(1)'
        },
        cursor:'pointer'
    }
))

export const DrawerBtnStyle = styled(IconButton)(props=>({
    '& svg:last-of-type':{
        color:props.theme.sidebar,
        background:props.theme.text,
        borderRadius:'50%'
    },

    [themeVar.breakpoints.up('tablet')]:{
        ':last-of-type': {
            display: 'none'
          },
    },
}))

export const DrawerBoxStyle = styled (Box)(props=>({
    display:'flex',
    margin:'0 -1rem',
    justifyContent:'center',
    alignItems:'center',
    [themeVar.breakpoints.down('mobile')]:{
        margin:'0 -.5rem',
    }
}))