import { Box, alpha, Paper, Typography } from "@mui/material";
import styled from '@emotion/styled'
import { themeVar } from "../src/DataSource/themeVar";
import { TextValidator } from "react-material-ui-form-validator";
import { myEffect } from "./UserManageStyle";

export const MainBoxStyle = styled(Box)(props=>({
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
   padding:'2rem',
  })

  export const HeaderTypographyStyle = styled(Typography)({
    fontWeight:'800',
    marginBottom:themeVar.spacing(2),
    textTransform:'uppercase',
    textShadow:'0.2rem 0.2rem 0.2rem rgba(10,10,10,0.8)',
    animation: `${myEffect} 30s ${themeVar.transitions.easing.easeInOut} infinite`,
    [themeVar.breakpoints.down('mobile')]:{
        fontSize:'1.8rem'
    }
  })
export const ContainerBoxStyle = styled(Box)(props=>({
    width:'100%',
    display:'flex',
    marginTop:themeVar.spacing(3),
    justifyContent:'center',
    alignItems:'center',
    flexDirection:'column',
    '& button':{
        width:'7.5rem',
        height:'3rem',
        cursor:'pointer',
        color:'azure',
        backgroundColor:'rgba(60,179,113, 0.8)',
        marginTop:themeVar.spacing(),
        marginBottom:themeVar.spacing(),
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
    }
}))


export const TextFieldStyle = styled(TextValidator)(props=>({
    width:'500px',
    '& input':{
        color:props.theme.text,
    }  ,
    '& label':{
        color:alpha (props.theme.text, 0.5)
    },
    margin:themeVar.spacing(1),
    [themeVar.breakpoints.down('mobile')]:{
        width:'80vw',
        margin:'0.3rem'
    },
}))

export const VerifiedButtonBoxStyle = styled(Box)({
    width:'100%',
    display:'flex',
    justifyContent:'space-between',
    alignItems:'center',
    '& button:last-child':{
        boxShadow:`0.2em 0.2em 2em ${alpha(themeVar.palette.common.black, 0.7)}`,
       backgroundColor:alpha(themeVar.palette.common.black, 0.7),
       border:'none',
       '&:hover':{
        backgroundColor: 'rgba(207, 44, 19, 0.9)',
        boxShadow:`0.2em 0.2em 2em rgba(207, 44, 19, 0.9)`,

       }
    }
})
