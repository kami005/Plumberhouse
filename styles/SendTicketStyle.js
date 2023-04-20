import { Box} from "@mui/material";
import styled from '@emotion/styled'

export const MainBox = styled(Box)(props=>(
    {
      height:'80vh',
      display:'flex',
      background: props.theme.tabBackground,
      flexDirection:'column',
      textAlign:'center',
      '& input, h6, textarea':{
        color:props.theme.text
      },
      '& h6':{
        fontWeight:600,
        fontSize:'1.5rem'
      }
  } ))

export const InputBox = styled (Box)({
    display:'flex',
    flexDirection:'column',
    gap:5,
})

export const ButtonBox = styled (Box)({
    display:'flex',
    margin:'0.5rem',
    justifyContent:'center',
    alignItems:'center',
    gap:5,
    '& button':{
        width:'10rem',
        height:'3rem'
    }
})
