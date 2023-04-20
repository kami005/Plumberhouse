import styled from "@emotion/styled"
import {Card} from "@mui/material"
import { alpha } from "@mui/material"
import { Box } from "@mui/system"
import { themeVar } from "../src/DataSource/themeVar"


export const CardGraphStyle =styled(Card)(props=>(
    {
      backgroundColor:props.theme.tabBackground,
      margin:'0.5rem 0',
      '& span':{
        fontWeight:700,
        fontSize:'1.5rem',
        letterSpacing:'0.1em',
        color:props.theme.tabText,
        [themeVar.breakpoints.down('mobile')]:{
          fontSize:'1rem',
        }
      }
    }
  ))

  export const GraphBoxStyle = styled(Box)(props=>(
    {
      height:300,
      '& p':{
        color:props.theme.tabText,
      },
      [themeVar.breakpoints.down('desktop')]:{
        height:300,
      },
      [themeVar.breakpoints.down('laptop')]:{
        height:200,
      },
    }
  ))

  export const PieBoxStyle = styled(Box)(
    {
       height:400,
       [themeVar.breakpoints.down('bigTab')]:{
        height:300,
      },
      // width:300,
    }
  )
