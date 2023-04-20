import styled from "@emotion/styled";
import { Box, Button, ListItem, ListItemText, Paper, TextField, ListSubheader, Modal, Select, Typography    } from "@mui/material";
import { alpha } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";

export const BodyPaperStyle = styled(Paper)(props=>({
        width:'100%',
        //overflow:'auto',
        height:'70vh',
        backgroundColor:'transparent',
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-between'
})  )

export const ListSubHeaderStyle = styled(ListSubheader)(props=>({

    backgroundColor:alpha(props.theme.tabBackground,0.7),
    color: props.theme.text,
    display:'flex',
    height:'2.5rem',
    justifyContent:"space-between",
    alignItems:'center',
    textTransform:'uppercase',
    width:'100%'
}))
export const ListSubFooterStyle = styled(ListSubheader)(props=>({
  
    backgroundColor:alpha(props.theme.tabBackground,0.7),
    color: props.theme.text,
    display:'flex',
    height:'2.5rem',
    alignItems:'center',
    textTransform:'uppercase',
    justifyContent:"flex-end",
    margin:'0',
}))

export const ListItemHeadStyle = styled(ListItem)(props=>({
    padding:'0 0 0.2rem 0.1rem',
    margin:'0.1rem 0',
    backgroundColor:alpha(props.theme.tabBackground, 0.9),
    '& svg':{
        width:'20px'
    },
}))

export const ListItemStyle = styled(ListItem)(props=>({
    padding:'0 0 0 1rem',
    margin:0,
    backgroundColor:alpha(props.theme.tabBackground, 0.4),
    '& svg':{
        width:'20px'
    }
}))

export const ListTextStyle = styled(ListItemText)(props=>({
    color:props.theme.text,
    '& span':{
        fontSize:'0.9rem',
        fontWeight:600,
    },
}))

export const ModalStyle = styled(Modal)({

    
})

export const ModalBoxStyle = styled(Box)({
    backgroundColor:alpha('#355C7D ', 0.8),
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 420,
    boxShadow: 24,
    p: 4,
    [themeVar.breakpoints.down('mobile')]:{
        width:'95%'
    }
})

export const ModalTextFieldStyle = styled(TextField)({
    width:'100%',
   '& input':{
    color:'azure'
   }
})
export const FieldsBox = styled(Box)({
    display:'flex',
    flexDirection:'column',
    gap:10
   
})

export const ModalBtn = styled(Button)(props=>({
    margin:'0.2rem',
    height:'3rem',
    width:'8rem',
}))

export const ModalBtnBox =styled(Box)({
    display:'flex', 
    justifyContent:'center'
})

export const ModalSelectStyle = styled(Select)({
    color:'azure',
})

export const BtnStyle = styled(Button)(props=>({
    borderRadius:'1rem',
    height:'2rem',
    width:'6rem !important',
    fontWeight:700,
}))

export const TypographyStyle = styled(Typography)(props=>({
  fontSize:'1rem',
  fontWeight:600,
  letterSpacing:'0.1em',
})  )