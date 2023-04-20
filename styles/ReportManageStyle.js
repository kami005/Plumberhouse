import styled from "@emotion/styled";
import { Box } from "@mui/material";

export const MainBoxStyle= styled(Box)({
    display:'flex',
    flexDirection:'column',
    width:'100%',
})

export const TabBoxStyle = styled(Box)(props=>({
    borderBottom: 1,
    borderColor: 'divider',
    '& button':{
        color:props.theme.text
    }
}))