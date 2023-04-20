import styled from "@emotion/styled";
import { Box, Paper } from "@mui/material";
import { themeVar } from "../src/DataSource/themeVar";

export const MainBoxStyle= styled(Box)({
    display:'flex',
    flexDirection:'column',
    width:'100%',
})

export const StyledPaper= styled(Paper)({
  
})

export const TabBoxStyle = styled(Box)(props=>({
    borderBottom: 1,
    borderColor: 'divider',
    '& button':{
        color:props.theme.text
    }
}))