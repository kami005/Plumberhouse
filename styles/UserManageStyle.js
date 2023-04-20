import { Box, alpha, Button, Typography, Paper} from "@mui/material";
import styled from '@emotion/styled'
import {themeVar} from '../src/DataSource/themeVar'
import { TextValidator } from "react-material-ui-form-validator";
import { keyframes} from "@emotion/react";

export const myEffect = keyframes`
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

export const MainBoxStyle =styled(Box)(props=>({
  display:'flex',
  flex:'10',
  borderRadius:'0.5rem',
  width:'100%',
  justifyContent:'center',
  backgroundColor:props.theme.tabBackground,
  [themeVar.breakpoints.down('tablet')]:{
      flexDirection:'column', height:'100%'
    },  
}))

export const SelectStyle = styled(TextValidator)(props=>({
  margin:`${themeVar.spacing()} 0`,
  width:'100%',
  textAlign:'left',
  '& div':{
    color:props.theme.text
  }
}))
export const SigninBoxStyle =styled(Box)({
    width:'600px',
    [themeVar.breakpoints.down('tablet')]:{
        width:'500px',
    },
    [themeVar.breakpoints.down('mobile')]:{
        width:'100%',
    },

})

export const HeaderTypographyStyle = styled(Typography)({
  fontWeight:'800',
  marginBottom:themeVar.spacing(2),
  textTransform:'uppercase',
  textShadow:'0.2rem 0.2rem 0.2rem rgba(10,10,10,0.8)',
  animation: `${myEffect} 30s ${themeVar.transitions.easing.easeInOut} infinite`,
})

export const SignInInputBoxStyle =styled(Box)({
    width:'100%',
})

export const TextFieldStyle = styled(TextValidator)(props=>({
    width:'100%',
    margin:'0.2rem 0',
    '& input':{
      color:props.theme.text
    },
    '& label':{
      color:alpha(props.theme.text, 0.5)
    }
}))

export const SignupBtnBoxStyle = styled(Box)({
    display:'flex',
    justifyContent:'space-between',
    width:'100%',
    alignItems:'center',
    [themeVar.breakpoints.down('tablet')]:{
      alignItems:'space-between',
    }
})
export const SigninBtnStyle = styled(Button)({
    margin:'0.5rem',
    width:'8rem',
    height:'3rem',
    borderRadius:'0.5rem',
    [themeVar.breakpoints.down('tablet')]:{
      width:'25vw',
      height:'2.5rem',
      fontSize:'0.6rem',
    },
})

export const SingupNamesBoxStyle = styled (Box)({
    display:'flex',
    justifyContent:'space-between',
    textItems:'center',
    [themeVar.breakpoints.down('tablet')]:{
      flexDirection:'column'
    }
})


export const SingupBoxStyle = styled(Box)({
    width:'600px',
    marginTop:themeVar.spacing(2),
    [themeVar.breakpoints.down('tablet')]:{
        width:'95%',
    },
})

export const RightsBox = styled(Box)(props=>({



}))

export const RightHeader = styled(Box)(props=>({
'& p':{
  textAlign:'center',
  fontWeight:700,
  color:props.theme.text,
  textTransform:'uppercase',
  background:props.theme.sidebar,
  borderRadius:'0.5rem'
},
}))

export const RightBody = styled(Box)(props=>({
  '& p':{
    fontWeight:600,
    color:props.theme.text,
    margin: '0.3rem',
    padding:'0.2rem',
    textAlign:'center',
    borderRadius:'0.5rem',
    background:alpha(props.theme.sidebar, 0.8)
  },
  '.divider':{
    background:alpha(props.theme.text, 0.5)
  },
  '& label':{
    color:props.theme.text,
  },
  '& svg,': {color:props.theme.up},
  [themeVar.breakpoints.down('tablet')]:{
    // '& svg, label':{fontSize:'0.8rem'}
}
}))

export const RightBodyItem = styled(Box)({
  display:'flex',
  margin:'0.2rem',
  justifyContent:'space-between',
  alignItems:'center',
  '& p':{
    fontWeight:400,
    width:'30%',
    margin:'0',
    textTransform:'uppercase',
    [themeVar.breakpoints.down('tablet')]:{
      width:'25%'
    },
    [themeVar.breakpoints.down('mobile')]:{
      width:'50%'
    }
  },

  [themeVar.breakpoints.down('mobile')]:{
    
    flexDirection:'column',

  }
})