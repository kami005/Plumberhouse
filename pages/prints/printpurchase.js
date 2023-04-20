import {  Backdrop, Box, Button, CircularProgress, Divider } from "@mui/material"
import { BodyDiv, BoxMain, HeaderDiv, MainPaper, StyledTypographyItems , StyledCartPaperTitle, BillInfoDiv, BillInfoTypography, 
HeaderTypographyStyle, LogoStyle, TextDiv, TotalTypography, CalcDiv, FooterBox, FooterTypography, StyleTypgraphyHeader} from "../../styles/printSaleStyle"
import ReactToPrint from "react-to-print";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SHOPINFO } from "../../src/DataSource/RandData";
import { convert } from "../../src/DataSource/RandData";
import { findoneBill } from "../../src/BackendConnect/PurchaseStorage";
import Header from "../../src/Components/HeaderText";
import { useRouter } from "next/router";
import { SessionContext } from "../../src/Context/SessionContext";
import { useToggle } from "../../src/CustomHooks/RandHooks";
import { FindPurchaseReport } from "../../src/BackendConnect/ExpenseStorage";

const PrintPurchase = ()=>{
  const route=useRouter()
  const printRef = useRef()
  const [loading, toggleLoading] = useToggle(true)
  const [res, setRes] = useState()

  const context = useContext(SessionContext)
  const session = context.session
  const [otherData, setOtherData] = useState({printTime:{time:'', date:''}, purchaseDate:{time:'', date:''}, username:''})  

    const GetData =async()=>{
      let response
      let query = route.query
      if(session[0] && query.purchaseID)
      {
        response = await findoneBill({purchaseID:query.purchaseID, myToken:session[0].token, myId:session[0]._id})
       let payments =await FindPurchaseReport({purchaseID:query.purchaseID, myToken:session[0].token, myId:session[0]._id})
        for( let i in payments)
        {
          if(payments[i].title === 'BULKPAYMENT')
          {
            let amount = payments[i].purchases.find(purchase=>purchase.purchaseID === response.purchaseID )
            payments[i].amount=amount.amount
          }
          else
            payments[i].title = 'SINGLEBILL'

          payments[i].createdAt = convert (new Date(payments[i].createdAt),0)
        }
        setRes({data:response, payments})
      }    
    }


    const SetOtherData =()=>{
    let printTime = new Date()
    printTime = convert(printTime, 0)
     let purchaseDate = convert (new Date(res.data.createdAt))
      let username = 'NoUser'
      if(session[0] && session[0].username)
      {
          username= session[0].username
      }
      setOtherData({printTime, purchaseDate, username})
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
      if(otherData.purchaseDate.time)
      {
        toggleLoading()
        // document.getElementById('print-button').click();
      }
    },[otherData])

    return (
      <BoxMain flex={10}>
      <Header name='PRINT PURCHASE'/>
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
            <div>
            <BillInfoTypography variant="body2" >Bill No: {(res && res.data) && res.data.purchaseID} </BillInfoTypography>
            <BillInfoTypography variant="body2"  >Supplier: {(res && res.data) && res.data.supplierInfo.name} </BillInfoTypography>
            <BillInfoTypography variant="body2">Supplier Bill: {(res && res.data) && res.data.supplierBill} </BillInfoTypography>
            </div>
            <div>
            <BillInfoTypography variant="body2">Pay Status: {(res && res.data) &&  res.data.paymentStatus} </BillInfoTypography>
            <BillInfoTypography variant="body2" sx={{flex:'50%'}}>Bill Date: {otherData.purchaseDate.date} </BillInfoTypography>
            {(res && res.data)  && res.data.paymentStatus !=='PAID' && <BillInfoTypography variant="body2">
            Remaining: {(res && res.data)  && (res.data.gTotal-res.data.paid)} 
            </BillInfoTypography>}
            
            </div>
            </BillInfoDiv>
            <Divider />
            <BodyDiv>
                <StyledCartPaperTitle elevation={2}>
                <StyleTypgraphyHeader variant="body2" sx={{width:'15%'}}>Sr. </StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'80%'}}>Item </StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Rate</StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Qty</StyleTypgraphyHeader>
                <StyleTypgraphyHeader  variant="body2" sx={{width:'30%'}}>SubTotal</StyleTypgraphyHeader>
                </StyledCartPaperTitle>

                <Divider flexItem />
                {(res && res.data) && res.data.orders && res.data.orders.length && res.data.orders.map((order, i)=>
                <StyledCartPaperTitle elevation={0} key={i}>
                <StyledTypographyItems variant="body2" sx={{width:'15%'}}>{i+1} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'80%'}}>{order.itemName} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.price} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{order.qty} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'30%'}}>{order.price * order.qty} </StyledTypographyItems>
                </StyledCartPaperTitle>)}
            </BodyDiv>

            {(res && res.payments && res.payments.length) ?
              <BodyDiv>
              <StyleTypgraphyHeader  variant="body2" >Payment Details</StyleTypgraphyHeader> 
              <Divider flexItem variant="middle"/>
              <StyledCartPaperTitle elevation={2}>
              <StyleTypgraphyHeader variant="body2" sx={{width:'10%'}}>Sr. </StyleTypgraphyHeader>
              <StyleTypgraphyHeader variant="body2" sx={{width:'50%'}}>Payment Date</StyleTypgraphyHeader>
              <StyleTypgraphyHeader  variant="body2" sx={{width:'40%'}}>Payment </StyleTypgraphyHeader>
              <StyleTypgraphyHeader  variant="body2" sx={{width:'50%'}}>Title</StyleTypgraphyHeader>
              <StyleTypgraphyHeader  variant="body2" sx={{width:'20%'}}>Paid By</StyleTypgraphyHeader>
              </StyledCartPaperTitle>
  
              <Divider flexItem/>
              {res.payments.map((payment, i)=>
              <StyledCartPaperTitle elevation={0} key={i}>
              <StyledTypographyItems variant="body2" sx={{width:'10%'}}>{i+1} </StyledTypographyItems>
              <StyledTypographyItems variant="body2" sx={{width:'50%'}}>{payment.createdAt.date} / {payment.createdAt.time}</StyledTypographyItems>
              <StyledTypographyItems variant="body2" sx={{width:'40%'}}>{payment.amount} </StyledTypographyItems>
              <StyledTypographyItems variant="body2" sx={{width:'50%'}}>{payment.title} </StyledTypographyItems>
              <StyledTypographyItems variant="body2" sx={{width:'20%'}}>{payment.addedBy} </StyledTypographyItems>
              </StyledCartPaperTitle>
              )}
             </BodyDiv> : null
              }

           <CalcDiv>
           <Box elevation={0}>
           {(res && res.data) && res.discount ? <TotalTypography variant="body2">SubTotal: {(res && res.data) && res.subTotal} </TotalTypography>:''}
           <TotalTypography  variant="body2" sx={{fontWeight:700}}>Grand Total: {(res && res.data) && res.data.gTotal}</TotalTypography>
           <TotalTypography  variant="body2" sx={{fontWeight:700}}>Paid: {(res && res.data) && res.data.paid}</TotalTypography>
           <TotalTypography  variant="body2" >Agent Name/Sign:____________</TotalTypography>
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
        open={loading}
      >
      <CircularProgress color='success' />
      </Backdrop>

      </BoxMain>
    )
}

  

export default PrintPurchase


