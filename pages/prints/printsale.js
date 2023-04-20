import {  Backdrop, Box, Button, CircularProgress, Divider } from "@mui/material"
import { BodyDiv, BoxMain, HeaderDiv, MainPaper, 
    StyledTypographyItems , StyledCartPaperTitle, BillInfoDiv, BillInfoTypography, HeaderTypographyStyle, LogoStyle, TextDiv, TotalTypography, CalcDiv, FooterBox, FooterTypography, StyleTypgraphyHeader} from "../../styles/printSaleStyle"
import ReactToPrint from "react-to-print";
import { useContext, useEffect, useRef, useState } from "react";
import {findonesale} from '../../src/BackendConnect/SaleStorage'
import {SHOPINFO } from "../../src/DataSource/RandData";
import { convert } from "../../src/DataSource/RandData";
import Header from "../../src/Components/HeaderText";
import { SessionContext } from "../../src/Context/SessionContext";
import { useRouter } from "next/router";
import { useToggle } from "../../src/CustomHooks/RandHooks";

const PrintSale = ()=>{
    const route=useRouter()
    const printRef = useRef()
    const [res, setRes] = useState()
    const [saleLoading, toggleLoading]= useToggle(true)
    const context = useContext(SessionContext)
    const session = context.session
    const [otherData, setOtherData] = useState({printTime:{time:'', date:''}, saleDate:{time:'', date:''}, username:''})
    
    const GetData =async()=>{
      try{
        let response
        let query = route.query
        if(session[0] && query.saleID)
        {
          response = await findonesale({saleID:query.saleID, myToken:session[0].token, myId:session[0]._id})
          setRes(response)
        }  
      }catch(err)
      {
        toggleLoading()
        alert(err)
      }

    }

    const SetOtherData =()=>{
    let printTime= new Date()
    printTime=convert(printTime, 0)
    let saleDate= convert (new Date(res.createdAt))
    let username='NoUser'
    if(session[0] && session[0].username)
    {
      username= session[0].username
    }
    setOtherData({printTime, saleDate, username})
    }

    const CalcGST =(gst, gTotal)=>{
        let gstVal= gst*gTotal/100
        return  Math.round(gstVal)
    }

    useEffect(()=>{
      GetData()
    },[route])

    useEffect(()=>{
      if(res)
      {
        SetOtherData()
      }
    },[res])

  useEffect(()=>{
    if(otherData.saleDate.time)
    {
      toggleLoading()
      document.getElementById('print-button').click();
    }
  },[otherData])
    return (

      <BoxMain flex={10}>
    
    <Header name='PRINT SALE'/>
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
            <BillInfoTypography variant="body2">Bill No: {res &&  res.saleID} </BillInfoTypography>
            <BillInfoTypography variant="body2" >Customer: {res && res.customerInfo.name} </BillInfoTypography>
            {res && res.paymentStatus !=='PAID' && <BillInfoTypography sx={{fontWeight:600}} variant="body2">
            PAID: {res && res.amountReceived} 
            </BillInfoTypography>}
            </Box>
            <Box>
            <BillInfoTypography variant="body2">Pay Status: {res &&  res.paymentStatus} </BillInfoTypography>
            <BillInfoTypography variant="body2" sx={{flex:'50%'}}>Bill Date: {otherData.saleDate.date} </BillInfoTypography>
            {res && res.paymentStatus !=='PAID' && <BillInfoTypography sx={{fontWeight:600}} variant="body2">
            Remaining: {res && res.gTotal-res.amountReceived} 
            </BillInfoTypography>}
            
            </Box>
            </BillInfoDiv>
            <Divider />
            <BodyDiv>
                <StyledCartPaperTitle elevation={2}>
                <StyleTypgraphyHeader variant="body2" sx={{width:'15%'}}>Sr. </StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'90%'}}>Item </StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Rate</StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Qty</StyleTypgraphyHeader>
                {res && res.discount?  <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Disc</StyleTypgraphyHeader> :''}
                <StyleTypgraphyHeader  variant="body2" sx={{width:'30%'}}>Total</StyleTypgraphyHeader>
                </StyledCartPaperTitle>

                <Divider />

                {res && res.orders && res.orders.length &&res.orders.map((order, i)=>
                <StyledCartPaperTitle elevation={0} key={i}>
                <StyledTypographyItems variant="body2" sx={{width:'15%'}}>{i+1} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'90%'}}>{order.itemName} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.price} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.qty} </StyledTypographyItems>
                {res && res.discount?  <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.unitDisc * order.qty} </StyledTypographyItems>:''}
                <StyledTypographyItems variant="body2" sx={{width:'30%'}}>{order.price * order.qty - order.unitDisc*order.qty} </StyledTypographyItems>
                </StyledCartPaperTitle>
                )}


            </BodyDiv>

            <CalcDiv>
            <Box elevation={0}>
            {res && res.discount ? <TotalTypography variant="body2">SubTotal: {res && res.subTotal} </TotalTypography>:''}
            {res && res.discount ? <TotalTypography  variant="body2">Total Discount: {res && res.discount} </TotalTypography>:''}
            {res && res.gst ?  <TotalTypography  variant="body2">GST {res.gst}%: {CalcGST(res.gst, res.gTotal)} </TotalTypography>:''}
            <TotalTypography sx={{fontWeight:600}}  variant="body2">Grand Total: {res && res.gTotal+CalcGST(res.gst, res.gTotal)}</TotalTypography>
            {(res && res.desc && res.desc.length) && <TotalTypography sx={{fontSize:'0.8rem',fontStyle:'italic', fontWeight:600 }}  variant="body2">{res.desc}</TotalTypography>}
            </Box>
            </CalcDiv>
            <FooterBox>
            <FooterTypography variant="body2">Print Generated by {otherData.username} on {otherData.printTime.date}, at {otherData.printTime.time} hours</FooterTypography>
            <FooterTypography variant="body1">Design and Developed By kamran Hussain, Contact: 03335393636</FooterTypography>
            </FooterBox>
     
             
        </MainPaper>

        <ReactToPrint
        trigger={()=>{
            return <Button variant="outlined" color='success' id="print-button" style={{width:'80px', height:'50px'}}>Print</Button>
        }}
        content={()=>printRef}
        documentTitle='new Doc'
        pageStyle='print'
        />

        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={saleLoading}
      >
      <CircularProgress color='success' />
      </Backdrop>
      </BoxMain>
    )
}



export default PrintSale


