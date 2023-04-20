import { Box,  alpha, Paper, Typography } from "@mui/material";
import styled from '@emotion/styled'
import { themeVar } from "../src/DataSource/themeVar";
import { TextValidator } from "react-material-ui-form-validator";
import { myEffect } from "./UserManageStyle";


export const MainBoxStyle =styled(Box)(props=>({
    display:'flex',
    flex:'10',
    height:'80vh',
    borderRadius:'0.5rem',
    justifyContent:'center',
    backgroundColor:props.theme.tabBackground,
    [themeVar.breakpoints.down('tablet')]:{
        flexDirection:'column',
        height:'100%'
    },
      
  }))
  export const MainPaper=styled(Paper)({
    width:'100%',
    height:'100%',
    display:'flex',
    background:'transparent',
    borderRadius:'0.5rem',
   flexDirection:'column',
   alignItems:'center',
   padding:'1rem',
  })
  export const HeaderTypographyStyle = styled(Typography)({
    fontWeight:'800',
    marginBottom:themeVar.spacing(2),
    textTransform:'uppercase',
    animation: `${myEffect} 30s ${themeVar.transitions.easing.easeInOut} infinite`,
  })
export const TextBoxStyle = styled(Box)({
    width:'100%'
}) 

export const TextFieldStyle = styled(TextValidator)(props=>({
    width:'500px',  
    margin:themeVar.spacing(1),
    '& input':{
        color:props.theme.text
    },
    '& label':{
        color:alpha (props.theme.text, 0.5)
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'80vw',
        margin:'0.3rem'
    },
}))

export const ButtonBoxStyle = styled(Box)(props=>({
    display:'flex',
    justifyContent:'space-between',

    '& button':{
        width:'7.5rem',
        height:'3rem',
        cursor:'pointer',
        color:'azure',
        backgroundColor:'rgba(60,179,113, 0.8)',
        margin:'1rem 0',
        boxShadow:'0.2em 0.2em 1em rgb(60,179,113)',
        borderRadius:'0.5rem',
        '&:hover':{
           color:alpha(themeVar.palette.common.white, 0.8),
           transform:'scale(1.1)',
           transition:'all 200ms ease-in-out',
           backgroundColor: 'rgba(207, 44, 19, 0.9)',
           boxShadow:'0.2em 0.2em 2em rgba(207, 44, 19, 0.9)',
           borderRadius:'0.2em',
           fontWeight:'700',
        },
        '&:active':{
            transform:'scale(1)',
            borderRadius:'0.5rem'
        }
    },
    '& button:last-child':{
        boxShadow:`0.2em 0.2em 2em ${alpha(themeVar.palette.common.black, 0.7)}`,
       backgroundColor:alpha(themeVar.palette.common.black, 0.7),
       border:'none',
       '&:hover':{
        backgroundColor: 'rgba(207, 44, 19, 0.9)',
        boxShadow:`0.2em 0.2em 2em rgba(207, 44, 19, 0.9)`,
       }
    },
}))
