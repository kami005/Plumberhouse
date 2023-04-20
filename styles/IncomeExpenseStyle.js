import styled from "@emotion/styled";
import { Box, Button, Paper, TextField, Typography    } from "@mui/material";
import { alpha } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";

export const MainBoxStyle= styled(Box)(props=>({
    backgroundColor:alpha(props.theme.tabBackground, 0.6),
    borderRadius:'1rem',
    '& button':{
       width:'20px'
    }
}))

export const MainPaperStyle = styled(Paper)({
    backgroundColor:'transparent',
    overflow:'auto',
    borderRadius:'1rem',
    height:'100%',
})

export const SearchBoxStyle = styled(Box)(props=>({
    display:'flex',
    flexDirection:'column',
        '& label':{
            color:alpha(props.theme.text, 0.6)
        },
}))
export const SearchFieldBox = styled(Box)({
    display:'flex',
    gap:10,
    [themeVar.breakpoints.down('mobile')]:{
        '& span':{
            fontSize:'0.8rem',
            fontWeight:'600'
        }
    }
})


export const SearchFirstBoxStyle = styled(Box)({
    display:'flex',
    alignItems:'center',
    padding:'0 0.5rem',
    justifyContent:'flex-start',
    [themeVar.breakpoints.down('mobile')]:{
        padding:'0',
        alignItems:'flex-end',
        margin:'0.5rem',
        '& span':{
            fontSize:'0.7rem',
            fontWeight:600
        }
    }
    
})
export const DateTextFieldStyle = styled(TextField)(props=>({
    marginTop:themeVar.spacing(1),
    '& input, svg':{
        color:props.theme.text
    },
    [themeVar.breakpoints.down('mobile')]:{
        marginTop:themeVar.spacing(1),
        width:'100%'
    }
}))
export const SearchButtonStyle = styled(Button)({
        width:'7.5rem !important',
        height:'2.5rem',
        cursor:'pointer',
        color:'azure',
        backgroundColor:'rgba(60,179,113, 0.8)',
        margin:'0.3rem 0',
        boxShadow:'0.2em 0.2em 1em rgb(60,179,113)',
        borderRadius:'1rem',
        '&:hover, :active':{
           color:alpha(themeVar.palette.common.white, 0.8),
           transform:'scale(1.05)',
           transition:'all 200ms ease-in-out',
           backgroundColor: 'rgba(207, 44, 19, 0.9)',
           boxShadow:'0.2em 0.2em 2em rgba(207, 44, 19, 0.9)',
           fontWeight:'700',
        },
        [themeVar.breakpoints.down('mobile')]:{
            fontSize:'0.7rem'
        }
})

export const BodyBoxStyle = styled(Box)(props=>({
    width:'100%',
    display:'flex',
    height:'70vh',
    position:'relative',
    height:"100%",
    gap:2,
    backgroundColor:props.theme.sidebar,
    [themeVar.breakpoints.down('tablet')]:{
        flexDirection:'column'
    }
}))
export const GTotalBox = styled(Box)(props=>({
    width:'100%', height:'40px', 
    bottom:1,
    zIndex:themeVar.zIndex.drawer+2,
    position:'absolute' ,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
     [themeVar.breakpoints.down('tablet')]:{
        position:'static',
        backgroundColor:alpha(props.theme.tabBackground,0.7),
     }
}))

export const TypographyStyle = styled(Typography)(props=>({
    fontSize:'1.5rem',
    fontWeight:'600',
    color:props.theme.text,
    letterSpacing:'0.1em',
    [themeVar.breakpoints.down('bigTab')]:{
        fontSize:'1.1rem',
    }
  })  )