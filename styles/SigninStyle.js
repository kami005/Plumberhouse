import { Box, alpha, Button} from "@mui/material";
import styled from '@emotion/styled'
import {themeVar} from '../src/DataSource/themeVar'
import {  TextValidator } from "react-material-ui-form-validator";
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

export const MainBoxStyle =styled(Box)({
  display:'flex',
  flex:'10',
  position:'relative',
  justifyContent:'center',
  width:'100%',
})

export const LogoStyle = styled.img({
  width:'200px',
  height:'200px',
  position:'absolute',
  zIndex:1,
  marginLeft:'auto',
  marginTop:'5rem',
  opacity:0.7
})


export const SigninBoxStyle =styled(Box)({
    width:'600px',
    marginTop:'5rem',
    display:'flex',
    flexDirection:'column',
    backgroundColor:'transparent',
    [themeVar.breakpoints.down('tablet')]:{
        width:'500px',
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'80%',
        
    },
    '& h4':{
        textTransform:'uppercase',
        fontWeight:'700',
        textShadow:'0.2rem 0.2rem 0.2rem rgba(10,10,10,0.8)',
        animation: `${myEffect} 30s ${themeVar.transitions.easing.easeInOut} infinite`
},

})



export const SignInInputBoxStyle =styled(Box)({
    width:'100%',
})

export const TextFieldStyle = styled(TextValidator)(props=>({
    width:'100%',
    zIndex:2,
    margin:'0.2rem 0',
    '& input':{
      color:props.theme.text
    },
    '& label':{
      color:alpha(props.theme.text, 0.6)
    }
}))

export const SignupBtnBoxStyle = styled(Box)({
    display:'flex',
    justifyContent:'space-between',
    width:'100%',
    alignItems:'center',
    [themeVar.breakpoints.down('mobile')]:{
      transform:'scale(0.9)', transformrigin:'0 0',
      justifyContent:'flex-start',
     flexDirection:'column'
    }
})
export const SigninBtnStyle = styled(Button)(props=>({
  width:'10rem',
  margin:'0.5rem',
  zIndex:2,
  height:'4.5rem',
  backgroundColor:'#90C8AC',
  marginBottom:themeVar.spacing(),
  color:props.theme.text,
  boxShadow:'0.2em 0.2em 1em rgba(20, 20, 20, 0.8)',
  borderRadius:'1em',
  fontSize:'1.2rem',
  '&:hover':{
     color:alpha(themeVar.palette.common.white, 0.8),
     transform:'scale(1.05)',
     transition:'all 300ms ease-in-out',
     backgroundColor: '#7D9D9C',
     boxShadow:'0.2em 0.2em 2em #7D9D9C',
     borderRadius:'0.5em',
     fontWeight:'700',
  },

  [themeVar.breakpoints.down('mobile')]:{
      width:'100%',
  }
}))




