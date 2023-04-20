import {  Box, Button, Divider } from "@mui/material"
import { BodyDiv, BoxMain, HeaderDiv, MainPaper, StyledTypographyItems , StyledCartPaperTitle, BillInfoDiv, BillInfoTypography,
HeaderTypographyStyle, LogoStyle, TextDiv, TotalTypography, CalcDiv, FooterBox, FooterTypography, StyleTypgraphyHeader} from "../../styles/printSaleStyle"
import ReactToPrint from "react-to-print";
import {  useEffect, useRef, useState } from "react";
import { SHOPINFO, SUSPENDSALEKEY } from "../../src/DataSource/RandData";
import { convert } from "../../src/DataSource/RandData";
import Header from "../../src/Components/HeaderText";
import { useRouter } from "next/router";


const PrintSuspended = (props)=>{
    const route=useRouter()
    const printRef = useRef()
    const [res, setRes] = useState()
   
    let printTime = new Date()
    printTime=convert(new Date (printTime), 0)
    
    const GetData =async()=>{
      const id = route.query.id
            if(id)
            {
                const sale = JSON.parse(localStorage.getItem(SUSPENDSALEKEY));
                let suspendedSaleData = sale.find(data=>data.id===id) 
                if(suspendedSaleData)
                {
                   setRes(suspendedSaleData)
                }
            }
 
    }
    useEffect(()=>{
      GetData()
    },[route])

    useEffect(()=>{
      if(res)
      document.getElementById('print-button').click();
    },[res])
    return (

      <BoxMain flex={10}>
    
    <Header name='Qoutation'/>
        <MainPaper ref = {el => (printRef = el)} elevation={0}>

            <HeaderDiv>
            <TextDiv>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.name}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.addressLine1}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.addresLine2}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">Ph. {SHOPINFO && SHOPINFO.phone}</HeaderTypographyStyle>
            </TextDiv>
            <LogoStyle src={SHOPINFO && SHOPINFO.logo.src} alt={SHOPINFO && SHOPINFO.logo.alt} />
            </HeaderDiv>

            <BillInfoDiv>
            <Box>
            <BillInfoTypography variant="body2">Qoutation No: {res &&  res.id} </BillInfoTypography>
            </Box>
            </BillInfoDiv>
            <Divider />
            <BodyDiv>
                <StyledCartPaperTitle elevation={2}>
                <StyleTypgraphyHeader variant="body2" sx={{width:'20%'}}>Sr. </StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'80%'}}>Item </StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Rate</StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Qty</StyleTypgraphyHeader>
                {res && res.type==='SALE' &&<StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Disc</StyleTypgraphyHeader>}
                <StyleTypgraphyHeader  variant="body2" sx={{width:'30%'}}>SubTotal</StyleTypgraphyHeader>
                </StyledCartPaperTitle>

                <Divider />

                {res && res.items && res.items.length &&res.items.map((order, i)=>

                <StyledCartPaperTitle elevation={0} key={i}>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{i+1} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'80%'}}>{order.itemName} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.sPrice} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.qty} </StyledTypographyItems>
                {res && res.type==='SALE' && <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.discount} </StyledTypographyItems>}
                {res && res.type==='SALE' ? <StyledTypographyItems variant="body2" sx={{width:'30%'}}>{order.sPrice * order.qty - order.discount*parseInt(order.qty)} </StyledTypographyItems>:
                <StyledTypographyItems variant="body2" sx={{width:'30%'}}>{order.sPrice * order.qty} </StyledTypographyItems>} 
                </StyledCartPaperTitle>
                )}
            </BodyDiv>

            <CalcDiv>
            <Box elevation={0}>
            {res && res.unitDisc ? <TotalTypography variant="body2">SubTotal: {res && res.subTotal} </TotalTypography>:''}
            {res && res.unitDisc? <TotalTypography  variant="body2">Total Discount: {res && res.unitDisc} </TotalTypography>:''}
            <TotalTypography  variant="body2">Grand Total: {res && res.gTotal}</TotalTypography>
            </Box>
            </CalcDiv>
            <FooterBox>
            <FooterTypography variant="body2">Print Generated on {printTime.date}, at {printTime.time} hours</FooterTypography>
            <FooterTypography variant="body1">Design and Developed By kamran Hussain, Contact: 03335393636</FooterTypography>
            </FooterBox>
             
        </MainPaper>

        <ReactToPrint
        trigger={()=>{return  <Button variant="outlined" color='success' id="print-button" style={{width:'80px', height:'50px'}}>Print</Button>}}
        content={()=>printRef}
        documentTitle='new Doc'
        pageStyle='print'
        />
      </BoxMain>
    )
}



export default PrintSuspended


