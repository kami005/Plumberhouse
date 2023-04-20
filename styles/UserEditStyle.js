import styled from "@emotion/styled"
import { Box, Button, Card, CardContent } from "@mui/material"
import {themeVar} from '../src/DataSource/themeVar'
import { alpha } from "@mui/material"
import { SelectValidator, TextValidator } from "react-material-ui-form-validator"
import { DataGrid } from "@mui/x-data-grid"
import { keyframes} from "@emotion/react";

const myEffect = keyframes`
     from  0%  {
          opacity:  0.2;
          color:#E6AEAE;
        }
        3% {
          opacity: 1;
         color:#AEE6AE;
        }
        10% {
            opacity:  0.2;
           color:#E8DAB2;
          }
          12% {
            opacity: 1;
           color: #E8DAB2;
            }
          20% {
            opacity: 0.2;
           color:#34568B;
          }
          22% {
            opacity: 1;
           color:#34568B;
          }
          30% {
            opacity:  0.2;
           color:#FF6F61;
          }
          32%  {
            opacity: 1;
           color:#FF6F61;
          }
          40% {
            opacity:  0.2;
           color:#6B5B95;
          }
          42% {
            opacity: 1;
           color:#6B5B95;
          }
          50% {
            opacity:  0.2;
           color:#88B04B;
          }
          52% {
            opacity: 1;
           color:#88B04B;
          }
          60% {
            opacity:  0.2;
           color:#F7CAC9;
          }
          "62%": {
            opacity: 1;
           color:#F7CAC9;
          }
          70% {
            opacity:  0.2;
           color:#955251;
          }
          72% {
            opacity: 1;
           color:#955251;
          }
          80% {
            opacity:  0.2;
           color:#B565A7;
          }
          82% {
            opacity: 1;
           color:#B565A7;
          }
          90% {
            opacity: 0;
           color:#9B2335;
          }
          92% {
            opacity:  1;
           color:#9B2335;
          }`;
export const MainBoxStyle = styled(Box)({
    width:'100%', height:'100%',
    '& .super-app-themeVar--false': {
      backgroundColor: alpha(themeVar.palette.success.main, 0.6),
      fontWeight:700,
      '&:hover': {
        backgroundColor: alpha(themeVar.palette.success.main, 0.9),
      },
    },
    '& .super-app-themeVar--true': {
      backgroundColor: alpha(themeVar.palette.info.main, 0.6),
      fontWeight:700,
      '&:hover': {
      backgroundColor: alpha(themeVar.palette.info.main, 0.9),
      },
    },
})

export const UserInfoBoxStyle = styled(Box)({
    display:'flex',
    flexDirection:'column',
    height:'100%',
    '& h4':{
        textTransform:'uppercase',
        fontWeight:'700',
        textShadow:'0.2rem 0.2rem 0.2rem rgba(10,10,10,0.8)',
        animation: `${myEffect} 30s ${themeVar.transitions.easing.easeInOut} infinite`
},
})

export const InputsBoxStyle = styled(Box)({
    display:'flex',
    flexDirection:'column',
})


export const TextFieldStyle = styled(TextValidator)({
    margin:`${themeVar.spacing()} 0`,
    width:'100%',
    textAlign:'left'
})
export const SelectStyle = styled(SelectValidator)({
    margin:`${themeVar.spacing()} 0`,
    width:'100%',
    textAlign:'left'
})


export const BtnBoxStyle = styled(Box)({
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
     width:'100%',
    '& button':{
        margin:themeVar.spacing(2),
        width:'200px',
        height:'50px'
    },
    [themeVar.breakpoints.down('tablet')]:{
        flexDirection:'column',
        '& button':{
           width:'70%',
       },
    },
     [themeVar.breakpoints.down('mobile')]:{
     flexDirection:'column',
     '& button':{
        width:'100%',
    },
 },

})

export const DataGridStyled = styled(DataGrid)({
    background:alpha(themeVar.palette.common.white, .7),
    width:'100%',
    height:'80vh',
})


// gridRow:{
//     background:alpha(themeVar.palette.common.white, .7),
// },
// gridHeader:{
//   background:alpha(themeVar.palette.common.white, .8),
//     textTransform:'uppercase',
//     fontWeight:800,
//     '& button':{
//       color:'azure'
//     }
// }