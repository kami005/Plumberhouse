import styled from "@emotion/styled"
import { Box, Typography} from "@mui/material"
import {themeVar} from '../src/DataSource/themeVar'


export const BoxMain = styled(Box)
({
    display:'flex',
    justifyContent:'center',
    flexDirection:'column',
    width:'100%'
})

export const MainPaper = styled(Box)({
    minWidth:'148.5mm',
    minHeight:'210 mm',
    background:'white',
    position:'relative',
})

export const HeaderTypographyStyle = styled(Typography)({
  fontSize:'1rem',
  fontWeight:600,

})

export const LogoStyle = styled.img({
  width:'200px',
  height:'200px',
  marginTop:'0.2rem',
  position:'absolute',
  zIndex:1,
  top:'20%',
  opacity:0.3
})
export const HeaderDiv = styled(Box)({
  display:'flex',
  justifyContent:'center',
  alignItems:'flex-start',
  gap:10
})
export const TextDiv = styled(Box)({
  display:'flex',
  flexDirection:"column",
  justifyContent:'center',
  alignItems:'center',
  zIndex:10,
})

export const BillInfoDiv =styled(Box)({
   display:'flex',
   justifyContent:'space-between',
    margin:'0.5rem 0',
    flexWrap: 'wrap',
    zIndex:100,
})

export const BillInfoTypography = styled(Typography)({
border:'1px solid gray',
textOverflow:'ellipsis',
whiteSpace:'nowrap',
overflow:'hidden',
maxHeight:'20px',
maxWidth:'220px',
marginBottom:'0.1rem',
zIndex:100,
})

export const BodyDiv = styled.div({
    zIndex:100,
    display:'flex',
    margin:'0.5rem 0',
    flexDirection:'column',
    justifyContent:'center',
    alignItems:'center'
})


export const StyledCartPaperTitle = styled(Box)({
    display:'flex',
    justifyContent:'space-between' ,
    flexDirection:'column',
    width:'100%',
    zIndex:100,
    textAlign:'center',
    [themeVar.breakpoints.down('tablet')]:{
      '& h6':{
        fontSize:'0.8rem',
        zIndex:100,
      }
    }
  })
export const TotalTypography= styled(Typography)(
    {
          zIndex:100,
          width:'100%',
          overflow:'hidden',
          marginBottom:'0.2rem',
          zIndex:100,
          textTransform:'uppercase'
  })
  export const StyledTypographyItems= styled(Typography)(
    {
          overflow:'hidden',
          textAlign:'left',
          fontSize:'1rem !important',
          zIndex:100,
       
  })
  export const StyleTypgraphyHeader= styled(Typography)(
    {
          overflow:'hidden',
          textAlign:'left',
          fontSize:'1rem !important',
          fontWeight:'600',
          textTransform:'uppercase'
       
  })

export const CalcDiv = styled.div({
  display:'flex',
  justifyContent:'center',
  textAlign:'center',
  margin:'0.5rem 0 0 0',
  borderBottom:'1px solid',
  gap:5
})

export const FooterBox = styled(Box)({
display:'flex',
justifyContent:'space-between'
})
export const FooterTypography = styled(Typography)({
  fontSize:'0.35rem'
})


export const HeaderBody = styled(Box)({
    display:'flex',
    justifyContent:'space-between',
    '& h6':{
      fontWeight:'600'
    },
    [themeVar.breakpoints.down('tablet')]:{
      '& h6':{
        fontSize:'0.8rem',
        zIndex:100,
      }
    }
})
