import styled from "@emotion/styled";
import { alpha, ListItemButton, Paper, Switch, ToggleButtonGroup } from "@mui/material";
import {themeVar} from '../src/DataSource/themeVar'
import { Box } from "@mui/system";

const drawerWidth=100

export const BoxMainStyle =styled(Paper)(props=>({
    minHeight:'90.4vh',
    maxHeight: '100%',
    overflow:'hidden',
    backgroundColor:props.theme.sidebar,
    flexDirection:'column',
    alignItems:'center',
    width:drawerWidth,
    '& svg, span':{
      color:props.theme.text,
      fontWeight:600
  },
    width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
    '.hideText':{
        '& span':{
            display:'none'
        } ,
    },

    '.showText':{
        alignItems:'flex-end',
        maxWidth:180,
    },

    [themeVar.breakpoints.down('tablet')]:{
        display:'none'
    },

    '.activeLink':{
      borderRadius:'0.8rem',
        backgroundColor:alpha('#355C7D', 0.2),
        '& svg, span':{
            // textShadow:'0.5rem 0.5rem 1rem #fff176',
            color:'#fff176',
            transform:'scale(1.1)'
        }
    },
}))

export const ListItemBtnStyle = styled(ListItemButton)(props=>({
    transition:'all 300ms ease-in-out',
    display:'flex',
    justifyContent:'flex-start',
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

export const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 40,
    height: 20,
    padding: 0,
    display: 'flex',
    margin:'0.5rem auto',
    alignSelf:'center',
    '&:active': {
        
      '& .MuiSwitch-thumb': {
        width: 20,
      },
      '& .MuiSwitch-switchBase.Mui-checked': {
        transform: 'translateX(20px)',
      },
    },
    '& .MuiSwitch-switchBase': {
      padding: 2,
      '&.Mui-checked': {
        transform: 'translateX(22px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: themeVar.palette.mode === 'dark' ? '#177ddc' : '#1890ff',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
      width: 15,
      height: 15,
      borderRadius: 10,
      transition: themeVar.transitions.create(['width'], {
        duration: 200,
      }),
    },
    '& .MuiSwitch-track': {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
      themeVar.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
      boxSizing: 'border-box',
    },
}));

export const ToggleBtnGrp  = styled(ToggleButtonGroup)(props => ({
  display: 'flex',
  margin:'0.5rem 0.2rem',
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: themeVar.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: themeVar.shape.borderRadius,
    },
  },
  flexDirection: props.showsidebar==='false' && 'column',
  '& svg':{
    color:props.theme.text
  }
}))