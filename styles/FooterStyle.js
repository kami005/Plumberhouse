import styled from "@emotion/styled";
import { Box, Button, ListItem, ListItemText, Paper, TextField, ListSubheader, Modal, Select, Typography    } from "@mui/material";
import { alpha } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";


export const MainBox = styled(Paper)(props=>(
    {
      width:'100%',
      display:'flex',
      background: alpha(props.theme.sidebar,1),
      flexDirection:'column',
      textAlign:'center',
      '& input, h6, textarea,p, svg, a, span':{
        color:props.theme.text
      },
      '& h6, svg':{
        fontWeight:600,
        fontSize:'1.5rem'
      },
      '& p, a':{
        fontSize:'0.8rem'
      },
      '& span':{
        fontSize:'0.7rem',
        color:alpha(props.theme.text, 0.7),
        margin:'1rem'
      },
      bottom:0,
      position:props.active==='true' ? 'static':'fixed',
      [themeVar.breakpoints.down('mobile')]:{
        position:'static'
       },
  } ))

  export const TopBox = styled(Box)({
    display:'flex',
   gap:10,
   margin:'0.5rem',

   [themeVar.breakpoints.down('tablet')]:{
    flexDirection:'column'
   }
  })

  export const FindUsBox = styled(Box)({
    display:'flex',
    flexDirection:'column',
    gap:10,
    width:'100%',
    alignItems:'center',
    '& a':{
    '&:hover':{
      cursor:'pointer'
    }
    },
    })


    export const BodyBox2 = styled(Box)({
      display:'flex',
      gap:10,
      alignItems:'center',
      '& a':{
      '&:hover':{
        cursor:'pointer'
      }
      },
      })
