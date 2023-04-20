import { Box, Paper, Typography, alpha, Button, DialogActions, DialogTitle, DialogContent, Input, Divider} from "@mui/material";
import styled from '@emotion/styled'
import {themeVar} from '../src/DataSource/themeVar'

const BGCOLOR='#355C7D'

export const StyledBoxMain = styled(Box)(
  {
    display:'flex',
    flex:'10',
    width:'100%',
    height:'100%',
    [themeVar.breakpoints.down('laptop')]:{
      flexDirection:'column'
    
    },
} )

export const StyledSearchTextPaper= styled(Paper)(props=>({
   display: 'flex',
   alignItems: 'center',
   width: '98%' ,
  backgroundColor:props.theme.sidebar,
  margin:'0.5rem',
  '& span':{
  fontSize:'0.5rem'
  },
  [themeVar.breakpoints.down('mobile')]:{
    flexDirection:'column',
    margin:'0',
    width: '100%' ,
  }
  
}))

export const StyledSearchPaper =styled(Paper)(props=>({
  margin:'0.5rem 0',
  display:'flex',
  flexDirection:'column',
  backgroundColor:alpha(props.theme.tabBackground, 0.4),
  borderRadius:'0.5rem',
}))

export const SearchOtherField = styled(Box)({
  display:'flex',
  height:'100%',
  justifyContent:'space-between',
  [themeVar.breakpoints.down('mobile')]:{
    width:'100%'
  }
  
})
export const OtherInputStyle = styled(Input)(props=>({
marginBottom:'0.25rem',
width:'100%',
color:props.theme.text,
[themeVar.breakpoints.down('mobile')]:{
  margin:'0.2rem',
  width:"98%"
}
}))

export const IconBtnDivStyle =styled.div(props=>({
  '& svg':{
    color:props.theme.text
  },
  [themeVar.breakpoints.down('mobile')]:{
    width:'100%',
    display:'flex',
    justifyContent:'flex-end'
  }
}))
export const SearchInputStyle = styled(Input)(props=>({
 color:props.theme.text,
  [themeVar.breakpoints.down('mobile')]:{
    margin:'0 0.2rem',
    width:"98%"
  }
}))


export const StyledCartPaper = styled(Paper)(props=>({
    margin:'1rem 0',
    display:'flex',
    flexDirection:'column',
    height:'50vh',
    overflow:'auto',
    backgroundColor:alpha(props.theme.tabBackground, 0.4),
    [themeVar.breakpoints.down('laptop')]:{
      height:'45vh',
      margin:'0.5rem 0'
    }
}))

export const StyleCartPaperHeader = styled(Paper)(props=>({
  display:'flex',
  position:'sticky',
  top:0,
  justifyContent:'space-between' ,
  backgroundColor:props.theme.sidebar,
  [themeVar.breakpoints.down('tablet')]:{
    '& p':{
      fontSize:'0.6rem'
    },
    
  }
}))

export const StyledCartPaperTitle = styled(Paper)(props=>({
  display:'flex',
  justifyContent:'space-between' ,
  backgroundColor:props.theme.tabBackground,
  [themeVar.breakpoints.down('tablet')]:{
    '& p':{
      fontSize:'0.6rem'
    },
    
  }
}))
export const StyledCartBoxTitles = styled(Box)({
  display:'flex',
  justifyContent:'space-between' ,
  width:'90%',
  [themeVar.breakpoints.down('tablet')]:{
    width:'80%',
    '& p':{
      fontSize:'0.7rem'
    },
  },
  [themeVar.breakpoints.down('mobile')]:{
    width:'75%',
    '& p':{
      fontSize:'0.5rem'
    },
  },
})

export const StyledIconButtonBox = styled(Box)({
  display:'flex',
   width:'10%',
   '& svg':{
    fontSize:'1rem'
   },
   [themeVar.breakpoints.down('desktop')]:{
    width:'15%',
   },
   [themeVar.breakpoints.down('tablet')]:{
    width:'20%',
    '& svg':{
      fontSize:'0.7rem'
     },
   },
   [themeVar.breakpoints.down('mobile')]:{
    width:'25%',
    '& svg':{
      fontSize:'0.7rem'
     },
   },
})
export const StyledTypographyItems= styled(Typography)(props=>(
  {
        overflow:'hidden',
        textAlign:'left',
        color:props.theme.text
}))
export const StyledTypographyHeader= styled(Typography)(props=>(
  {
        overflow:'hidden',
        textAlign:'left',
        color:props.theme.text,
        fontWeight:600,
        [themeVar.breakpoints.down('tablet')]:{
          fontSize:'0.5rem',
        },
}))


export const StyledBox = styled(Box)({
    display:'flex',
    flexDirection:'column',
    height:'80%',
    margin:'0 0.5rem',
    [themeVar.breakpoints.down('tablet')]:{
        height:'40%'
    },
  })

  export const StyledBoxTotal = styled(Box)({
    display:'flex',
    flexDirection:'column',
    height:'77.5vh',
    [themeVar.breakpoints.down('laptop')]:{
      height:'100%'
    }
  })

  export const StyledTotalPaper=styled(Paper)(props=>({
        justifyContent:'flex-end',
        alignItems:'flex-start',
        display:'flex',
        flexDirection:'column',
        height:'90%',
        borderRadius:'0.5rem',
        margin:'0.5rem ',
        backgroundColor:alpha(props.theme.tabBackground, 0.4),
        [themeVar.breakpoints.down('laptop')]:{
          height:'auto',
          backgroundColor:props.theme.sidebar
        },
        '.lastTotal':{
          borderRadius:'0 0 0.5rem 0.5rem'
        }
  }))

  export const StyledTotalTypography= styled(Typography)(props=>({
    color:props.theme.text,
    fontWeight:700,
     width:'100%',
     textTransform:'uppercase',
     fontSize:'1.5rem',
     textAlign:'center',
     letterSpacing:'0.1em',
     [themeVar.breakpoints.up('laptop')]:{
      backgroundColor:props.theme.sidebar
     },
     [themeVar.breakpoints.down('laptop')]:{
      fontSize:'1.2rem',
     },
     [themeVar.breakpoints.down('tablet')]:{
      fontSize:'1rem'
     }
  }))

  export const StyledOtherBtnsPaper = styled(Box)({
    display:'flex',
    justifyContent:'flex-end',
    gap:10,
    width:'98%',
    padding:'0.5rem',
    [themeVar.breakpoints.down('mobile')]:{
      alignItems:'center',
      width:'100%',
      padding:'0.5rem 0.1rem',
      gap:5,
    },
  })

  export const StyledOtherBtn = styled(Button)({
      width:'8rem',
      height:'2.2rem',
      borderRadius:'0.5rem',
      [themeVar.breakpoints.down('bigTab')]:{
       width:"90%",
       fontSize:'0.8rem',
      },
      [themeVar.breakpoints.down('mobile')]:{
        width:"100%",
        height:'1.7rem',
        fontSize:'0.5rem',
        '& svg':{
          width:'1rem',
          height:'1rem'
        }
       },
  })

  export const DialogActionStyle = styled(DialogActions)({
    backgroundColor:alpha(BGCOLOR, 0.4),
})

export const DialogTitleStyle = styled(DialogTitle)({
    backgroundColor:alpha(BGCOLOR, 0.4),
})

export const DialogContentStyle = styled(DialogContent)({
  backgroundColor:alpha(BGCOLOR, 0.4),
})

export const ModalBox = styled(Box)(props=>({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius:'0.5rem',
  background:props.theme.tabBackground,
  boxShadow: 24,
  display:'flex',
  flexDirection:'column',
  gap:10,
  pt: 2,
  px: 4,
  pb: 3,
  width: 700 ,
  color:props.theme.text,
  '& .modalTextfield':{
    margin:'0.2rem 0.5rem',
    '& input':{
      color:props.theme.text,
    },
    background:alpha(props.theme.tabBackground, 0.5)
  },
  '& svg, p':{
    color:props.theme.text,
  },
  [themeVar.breakpoints.down('tablet')]:{
    width:'80%'
  }
}))


export const SpanOptions = styled.span({
  fontWeight:600,
  [themeVar.breakpoints.down('desktop')]:{
    fontSize:'0.9rem'
  },
  [themeVar.breakpoints.down('laptop')]:{
    fontSize:'1rem'
  },
  [themeVar.breakpoints.down('tablet')]:{
    fontSize:'0.8rem'
  },
  [themeVar.breakpoints.down('mobile')]:{
    fontSize:'0.7rem'
  }
})

export const DividerStyle = styled(Divider)(props=>({
  background:alpha(props.theme.text,0.5),
}))