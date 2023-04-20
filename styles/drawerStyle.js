import styled from "@emotion/styled";
import { alpha, Box, IconButton, List, SwipeableDrawer, ListItemButton, Typography } from "@mui/material";

import { themeVar } from "../src/DataSource/themeVar";

export const MainBoxStyle = styled(Box)(props=>({
    backgroundColor:alpha(props.theme.sidebar,0.9),
}))


export const DrawerStyle = styled(SwipeableDrawer)({

    
})

export const DrawerBoxHeaderStyle = styled(Box)({
    width:200,
    display:'flex',
    justifyContent:'flex-start',
    alignItems:'flex-end',
    background:'transparent'
})


export const IconBtnStyle = styled(IconButton)(props=>({
    '& svg':{
        fontWeight:600,
        fontSize:'2rem',
        color:props.theme.sidebar,
        borderRadius:'50%',
        backgroundColor:props.theme.text,
    },
}))

export const DrawerBoxBodyStyle = styled(Box)({
    display:'flex',
    flexDirection:'column',
    textAlign:'center',
    '.activeLink':{
        backgroundColor:alpha('#594F4F', 0.3),
        '& svg, span':{
            color:'#fff176'
        }
    }
})

export const ListStyle = styled(List)({

})


export const ListItemBtnStyle = styled(ListItemButton)(props=>({
    transition:'all 200ms ease-in-out',
    display:'flex',
    justifyContent:'flex-end',
    width:'80%',
    margin:'0.4rem',
    padding:'0',
    '& span':{
        color:props.theme.text,
        fontSize:'0.8rem',
        fontWeight:600,
    },
    '& svg':{
      color:props.theme.text,
      fontSize:'1rem',
    },
    '&:hover, &:focus':{
        transform:'scale(1.1)',
        '& svg, span':{
            transition:'all 300ms ease-in-out',
            textShadow:`1rem 0.5rem 1rem ${props.theme.shadowText}` ,
        },
    },

}))


export const StyledTypographyUsername = styled(Typography)(props=>(
    {
        fontSize:'1rem',
        fontWeight:600,
        color:props.theme.title
        // [themeVar.breakpoints.down('tablet')]:{
        //  display:'none'
        // },
    }
))