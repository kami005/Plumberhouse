import styled from "@emotion/styled";
import { Box, Button, DialogActions, DialogTitle, FormControlLabel, Paper} from '@mui/material'
import {themeVar as theme, themeVar} from '../src/DataSource/themeVar'
import { alpha } from "@mui/material";
import { TextValidator } from "react-material-ui-form-validator";


export const MainBoxStyle = styled(Box)(props=>({
    background:'tranparent',
    width: '100%',
    borderRadius:'0.5rem',
    height:'77vh',  
    [theme.breakpoints.down('tablet')]:{
        width:'100%',
        minHeight:'82vh'
    }
}))

export const PaperStyle = styled(Paper)(props=>({
    display:'flex',
    background:props.theme.tabBackground,
    borderRadius:'0.5rem',
    justifyContent:'center',
    [theme.breakpoints.down('tablet')]:{
        flexDirection:'column',
    }

}))
export const TextFieldBoxStyle= styled(Box)({
    display:'flex',
    flexWrap:'wrap',
    flexDirection:'column',
    marginTop:'1rem',
    [theme.breakpoints.down('tablet')]:{
        flexWrap:'nowrap',
        justifyContent:'center',
    }
})

export const ButtonBoxStyle = styled(Box)({
    display:'flex',
    justifyContent:'center',
    alignItems:'center',    
    flexWrap:'wrap',
    [themeVar.breakpoints.down('tablet')]:{
        margin:'1rem 0',
    }
   
})

export const ButtonStyle= styled(Button)(props=>({
        width:'8rem',
        margin:'0.5rem',
        height:'4rem',
        backgroundColor:'#90C8AC',
        color:props.theme.text,
        boxShadow:'0.2em 0.2em 1em rgba(20, 20, 20, 0.8)',
        borderRadius:'1em',
        fontSize:'1.2rem',
        '&:hover':{
           color:alpha(theme.palette.common.white, 0.8),
           transform:'scale(1.05)',
           transition:'all 300ms ease-in-out',
           backgroundColor: '#7D9D9C',
           boxShadow:'0.2em 0.2em 2em #7D9D9C',
           borderRadius:'0.5em',
           fontWeight:'700',
        },
        [theme.breakpoints.down('tablet')]:{
            width:'20%',
            height:'3rem'
        },
        [theme.breakpoints.down('mobile')]:{
            fontSize:"0.8rem",
            height:'2rem',
            margin:'0.2rem'
        }
}))

export const TextFieldStyle = styled(TextValidator)(props=>({
    width:'80%',
    margin:'0.2rem',
    '& input, textarea':{
        color: props.theme.text,
     },
     '& label':{
        color: alpha(props.theme.text, 0.6),
     },
    [theme.breakpoints.down('tablet')]:{
        margin:'0.2rem',
        width:'95%'
    }
}))

export const FormLabelStyle = styled(FormControlLabel)({
    width:'80%',
    margin:'0 4rem',
    '& svg':{
        fontSize:'2rem'
    },
    '& span':{
        fontWeight:600
    }
})
export const DialogActionStyle = styled(DialogActions)({
    backgroundColor:alpha('#355C7D', 0.4),
})

export const DialogTitleStyle = styled(DialogTitle)({
    backgroundColor:alpha('#355C7D', 0.4),
})
