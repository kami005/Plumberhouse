import { Box, Paper, Typography, alpha, Button, DialogActions, DialogTitle, DialogContent, Input} from "@mui/material";
import styled from '@emotion/styled'
import {themeVar} from '../src/DataSource/themeVar'

const BGCOLOR='#594F4F'
export const StyledBoxMain = styled(Box)((
  {
    display:'flex',
    flex:'10',
    width:'100%',
    height:'100%',
    [themeVar.breakpoints.down('laptop')]:{
      flexDirection:'column'
    },
} ))

export const StyledSearchTextPaper= styled(Paper)({
  display: 'flex',
  alignItems: 'center',
  width: '98%' ,
 backgroundColor: BGCOLOR,
 margin:'0.5rem',
 '& span':{
fontSize:'0.5rem'
 },
 [themeVar.breakpoints.down('mobile')]:{
   flexDirection:'column',
   margin:'0',
   width: '100%' ,
 }
  
})

export const StyledSearchPaper =styled(Paper)({
  margin:'0.5rem 0',
  display:'flex',
  flexDirection:'column',
  backgroundColor:alpha(BGCOLOR, 0.4),
  borderRadius:'0.5rem',

})

export const SearchOtherField = styled(Box)({
  display:'flex',
  height:'100%',
  justifyContent:'space-between',
  [themeVar.breakpoints.down('mobile')]:{
    width:'100%'
  }
  
})
export const OtherInputStyle = styled(Input)({
marginBottom:'0.35rem',
width:'100%',
[themeVar.breakpoints.down('mobile')]:{
  margin:'0.2rem',
  width:"98%"
}
})

export const IconBtnDivStyle =styled.div({
  [themeVar.breakpoints.down('mobile')]:{
    width:'100%',
    display:'flex',
    justifyContent:'flex-end'
  }

})
export const SearchInputStyle = styled(Input)({
 
  [themeVar.breakpoints.down('mobile')]:{
    margin:'0 0.2rem',
    width:"98%"
  }
})


export const StyledCartPaper = styled(Paper)({
  margin:'1rem 0',
  display:'flex',
  flexDirection:'column',
  height:'50vh',
  overflow:'auto',
  backgroundColor:alpha(BGCOLOR, 0.4),
  [themeVar.breakpoints.down('laptop')]:{
    height:'45vh',
    margin:'0.5rem 0'
  },
})
export const StyleCartPaperHeader = styled(Paper)({
  display:'flex',
  position:'sticky',
  top:0,
  justifyContent:'space-between' ,
  backgroundColor:BGCOLOR,
  [themeVar.breakpoints.down('tablet')]:{
    '& p':{
      fontSize:'0.6rem'
    },
    
  }
})

export const StyledCartPaperTitle = styled(Paper)({
  display:'flex',
  justifyContent:'space-between' ,
  backgroundColor:alpha(BGCOLOR, 0.4),
  [themeVar.breakpoints.down('tablet')]:{
    '& p':{
      fontSize:'0.6rem'
    },
    
  }
})
export const StyledCartBoxTitles = styled(Box)({
  display:'flex',
  justifyContent:'space-between' ,
  margin:'0 0.2rem',
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
export const StyledTypographyItems= styled(Typography)(
  {
        overflow:'hidden',
        textAlign:'left',
        color:'azure',
})
export const StyledTypographyHeader= styled(Typography)(
  {
        overflow:'hidden',
        textAlign:'left',
        color:'azure',
        [themeVar.breakpoints.down('tablet')]:{
          fontSize:'0.5rem',
        },

})



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
    height:'78vh',
    [themeVar.breakpoints.down('laptop')]:{
      height:'100%'
    }
  })

  export const StyledTotalPaper=styled(Paper)({
        justifyContent:'flex-end',
        alignItems:'flex-start',
        display:'flex',
        flexDirection:'column',
        height:'90%',
        borderRadius:'0.5rem',
        margin:'0.5rem ',
        backgroundColor:alpha(BGCOLOR, 0.4),
        [themeVar.breakpoints.down('laptop')]:{
          height:'auto',
          backgroundColor:BGCOLOR
        },
        '.lastTotal':{
          borderRadius:'0 0 0.5rem 0.5rem'
        }
  })

  export const StyledTotalTypography= styled(Typography)({
    color:'azure',
    fontWeight:600,
     width:'100%',
     textTransform:'uppercase',
     fontSize:'1.5rem',
     textAlign:'center',
     letterSpacing:'0.1em',
     [themeVar.breakpoints.up('laptop')]:{
      backgroundColor:BGCOLOR
     },
     [themeVar.breakpoints.down('laptop')]:{
      fontSize:'1.2rem'
     },
     [themeVar.breakpoints.down('tablet')]:{
      fontSize:'1rem'
     }
  })

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

  export const StyledOtherBtnBox = styled(Box)({
    width:'40%',
    gap:5,
    display:'flex',
    justifyContent:'center',

    [themeVar.breakpoints.down('tablet')]:{
      width:'100%',
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
  background:alpha(props.theme.tabBackground, 0.8),
  boxShadow: 24,
  display:'flex',
  flexDirection:'column',
  gap:10,
  pt: 2,
  px: 4,
  pb: 3,
  width: 700 ,
  color:'white',
  '& .modalTextfield':{
    margin:'0.2rem 0.5rem',
    '& input':{
      color:'white',
    },
    background:alpha('#000000', 0.5)
  },
  '& svg, p':{
    color:'white',
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