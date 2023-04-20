import styled from "@emotion/styled";
import { alpha, Box, IconButton, Paper, TextField } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";

export const MainBox = styled(Box)({
    width:'100%',
    overflow:'hidden',
})


export const UsersBox =styled(Box)({
    width:'100%',
    display:"flex",
    marginTop:'0.2rem'
})

export const UsersPaper =styled(Paper)(props=>({
    width:'100%',
    display:'flex',
    justifyContent:'center',
    whiteSpace:'nowrap',
    overflow:'auto hidden',
    backgroundColor:props.theme.tabBackground,
    '& .active':{
      '& svg':
      {
        color:alpha('#50ff40', 0.7)
      },
      transition:'all 300ms ease-in-out',
      transform:'scale(1.03)',
      filter:`drop-shadow(0 0 1px ${props.theme.text})  drop-shadow(0 0 5px${props.theme.text})`,
    }
}))

export const IconBtnStyle = styled(IconButton)({
    '& svg':{ color:'#001128',}
})

export const UserBox =styled(Box)(props=>({
color:props.theme.text,
display:'flex',
justifyContent:'center',
alignItems:'center',
flexDirection:'column',
'& svg':{
    filter:'drop-shadow(0 0 1px #fff)   drop-shadow(1px 1px #594F4F) drop-shadow(0 0 5px #fff)',
},
}))


export const UsersChatBox =styled(Box)({
    width:'100%',
    height:'75vh',
    display:'flex',
    flexDirection:'column',
    overflowX:'auto',
})

export const UsersChatPaper =styled(Paper)(props=>({
    width:'100%',
    height:'75vh',
    backgroundColor:alpha(props.theme.tabBackground, 0.3),
    display:'flex',
    flexDirection:'column'
}))

export const TextFieldBox =styled(Box)(props=>({
    width:'100%',
    height:'100%',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:props.theme.tabBackground,
    whiteSpace:'nowrap',
}))


export const SendIconBtn = styled(IconButton)(props=>({
    '& svg':{
        color:props.theme.text,
        width:'35px',
        height:"35px"
    }
}))

export const TextFieldStyle =styled(TextField)(props=>({
    color:'white',
    '& input':{
      color:props.theme.text,
      fontWeight:700
    }
}))

export const UserHeaderCard =styled(Paper)(
    {
      backgroundColor:alpha('#355C7D ', 0.4),
      borderRadius:'0.5rem',
      width:'50%',
      alignSelf:'center',
      textAlign:'center',
      '& h6':{
        fontWeight:700,
        fontSize:'2rem',
        letterSpacing:'0.1em',
        color:'azure',
      }
    }
  )

export const MsgCard =styled(Paper)(
    {
      borderRadius:'1rem',
      width:'50%',
      margin:'0.3rem',
      display:'flex',
      flexDirection:'column',
    }
  )

  export const MessageBody = styled(Box)(props=>({
    overflowWrap: 'break-word',
    wordWrap:'break-word',
    hyphens: 'auto',
    padding:'0.3rem',
    marginLeft:'0.5rem',
    floa:'left',
    clear:'left',
    '& p':{
      fontWeight:400,
      fontSize:'0.8rem',
      color:props.theme.text
    },
    '& span':{
      fontSize:'0.6rem',
      [themeVar.breakpoints.down('bigTab')]:{
        fontSize:'0.5rem',
      },
      [themeVar.breakpoints.down('tablet')]:{
        letterSpacing:'0.1em',
        fontSize:'0.8rem',
      },
      [themeVar.breakpoints.down('mobile')]:{
        letterSpacing:'0',
        fontSize:'0.5rem',
      }
    },
  }))

  export const MessageFooter = styled(Box)(props=>({
    margin:'0 1rem',
    display:'flex',
    justifyContent:'flex-end',
    alignItems:'center',
    '& p':{
      fontWeight:400,
      fontSize:'0.7rem',
      letterSpacing:'0.1rem',
      color:props.theme.text,
      [themeVar.breakpoints.down('bigTab')]:{
        fontSize:'0.5rem',
      },
      [themeVar.breakpoints.down('tablet')]:{
        fontSize:'0.8rem',
      },
      [themeVar.breakpoints.down('mobile')]:{
        fontSize:'0.4rem',
      }
    },
    '& svg':{
      [themeVar.breakpoints.down('bigTab')]:{
        width:'15px', height:'15px'
      },
      [themeVar.breakpoints.down('tablet')]:{
        width:'15px', height:'15px'
      },
      [themeVar.breakpoints.down('mobile')]:{
        width:'10px', height:'10px'
      }
    }
  }))
