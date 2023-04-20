import styled from "@emotion/styled"
import { Box } from "@mui/material"

export const StyledBoxMain = styled(Box)(
    {
      width:'100%',
      display:'flex',
      flexDirection:'column',
  } )

  
export const TabBoxStyle = styled(Box)(props=>({
    borderBottom: 1,
    borderColor: 'divider',
    '& button':{
      color:props.theme.text
    }
}))