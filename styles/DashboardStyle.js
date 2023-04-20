import styled from "@emotion/styled"
import { alpha, Box, Button, Card, CardContent } from "@mui/material"
import {themeVar} from '../src/DataSource/themeVar'


export const StyledBoxMain = styled(Box)(
    {
      display:'flex',
      width:'100%',
      flexDirection:'column',
  } )


  export const CardGraphStyle =styled(Card)(props=>(
    {
      background:props.theme.tabBackground,
      margin:'0.5rem 0',
      borderRadius:'0.5rem',
      height:'10.8rem',
      '& span':{
        fontWeight:700,
        fontSize:'1.5rem',
        letterSpacing:'0.1em',
        color:props.theme.tabText,
        [themeVar.breakpoints.down('mobile')]:{
          fontSize:'1rem',
        }
      },
      '& input':{
        color:props.theme.tabText,
      }
    }
  ))

  export const FormFilterStyle = styled.form(
    {
      display:'flex',
      gap:5,
      alignItems:'center',
        [themeVar.breakpoints.down('mobile')]:{
             justifyContent:'center',
        }
    }
  )

    export const DatesDivStyle = styled.div(props=>(
        {
          display:'flex',
          gap:5,
          '& label, svg':{
              color:alpha(props.theme.text, 0.6)
          },

          [themeVar.breakpoints.down('mobile')]:{
            justifyContent:'center',
            alignItems:'center',
            '& input, label, svg':{
              fontSize:'0.7rem'
            },
        }
        }
    ))
export const ButtonStyle = styled(Button)(props=>({
    borderRadius:'2rem',
    width:"10rem",
    height:'2.5rem',
    fontSize:'0.8rem',
    [themeVar.breakpoints.down('laptop')]:{
        fontSize:'0.6rem'
    },
    [themeVar.breakpoints.down('mobile')]:{
      height:'2.5rem',
      width:"55%",
  },
}))

export const CardContentStyle = styled(CardContent)(props=>({
  '& h6':{
    fontWeight:700,
    fontSize:'1.3rem',
    letterSpacing:'0.1em',
    color:props.theme.tabText,
    display:'flex',
    [themeVar.breakpoints.down('mobile')]:{
      fontSize:'1rem'
    }
  },
  '& p':{
    fontWeight:400,
    fontSize:'0.8rem',
    letterSpacing:'0.1rem',
    color:props.theme.tabText,
  },
  '& span':{
    fontSize:'0.5rem !important',
  },
  '.arrowUp':{
    color:props.theme.up
  },
  '.arrowDown':{
    color:props.theme.down
  }
}))