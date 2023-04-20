import styled from "@emotion/styled";
import { alpha, Box } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";
export const ModalBox = styled(Box)(props=>({
    position: 'absolute',
    backgroundColor:props.theme.sidebar,
    borderRadius:'0.5rem',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    gap:10,
    pt: 2,
    px: 4,
    pb: 3,
    width: 1000 ,
    height:'50%',
    [themeVar.breakpoints.down('laptop')]:{
      width:800
    },
    [themeVar.breakpoints.down('tablet')]:{
      width:'90%',
      height:'70%',
    },
    [themeVar.breakpoints.down('mobile')]:{
      width:'95%',
     
    },
  }))

  export const ItemBox =styled(Box)(props=>({
    'p':{
      color:props.theme.text
    },
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
  }))

  export const ListItemStyle = styled(Box)(props=>({
    display:'flex',
    justifyContent:'center',
    background:props.theme.sidebar,
    '& p':{
      color:props.theme.text,
      [themeVar.breakpoints.down('tablet')]:{
        fontSize:'0.9rem'
      },
      [themeVar.breakpoints.down('mobile')]:{
        fontSize:'0.6rem'
      }
    }
}))


export const MainBox =styled(Box)({

})
export const DataBox =styled(Box)(props=>({
  display:'flex',
  cursor:'pointer',
  gap:10,
  margin:'0.2rem 0',
  borderRadius:'0.5rem',
  alignItems:'center',
  justifyContent:'center',
  background:(props.type && (props.type==='qty' || props.type ==='Delete')) ? props.theme.down : props.theme.tabBackground,
  '& svg':{
    width:'40px',height:'30px',
    color:(props.type && props.type==='qty') ? props.theme.oppositeText : props.theme.text,
    [themeVar.breakpoints.down('mobile')]:{
      width:'20px',height:'20px',
    }
  },
  '& p':{
    color:(props.type && props.type==='qty') ? props.theme.oppositeText : props.theme.text,
    [themeVar.breakpoints.down('tablet')]:{
      fontSize:'0.9rem'
    },
    [themeVar.breakpoints.down('mobile')]:{
      fontSize:'0.6rem'
    }
  }
}))

export const RecDataBox =styled(Box)(props=>({
  display:'flex',
  cursor:'pointer',
  gap:10,
  margin:'0.2rem 0',
  borderRadius:'0.5rem',
  alignItems:'center',
  justifyContent:'center',
  background:props.theme.tabBackground,
  '& svg':{
    width:'40px',height:'30px',
    color:props.theme.text,
    [themeVar.breakpoints.down('mobile')]:{
      width:'20px',height:'20px',
    }
  },
  '& p':{
    color:props.theme.text,
    [themeVar.breakpoints.down('tablet')]:{
      fontSize:'0.9rem'
    },
    [themeVar.breakpoints.down('mobile')]:{
      fontSize:'0.6rem'
    }
  }
}))
export const LogsButtonBox = styled(Box)(props=>({
  display:'flex',
  alignItems:'center',
  flexWrap:'wrap',
  gap:2,
  margin:'0.4rem',
  background:alpha(props.theme.sidebar, 0.5),
  '& div, & svg':{
    fontSize:'1rem'
  },
  '& input, label, p, svg, span, div':{
    color:props.theme.text,
  },
  '& p':{
    textAlign:'right',
    fontWeight:700,
    background:props.theme.tabBackground,
    borderRadius:'0.2rem',
  },
  [themeVar.breakpoints.down('mobile')]:{
    '& input, label, p, svg, span, div':{
      fontSize:'0.8rem'
    },
  },
  gap:2
}))

export const FooterBox = styled(Box)(props=>({
display:'flex',
justifyContent:'center',
alignItems:'center  '
}))
