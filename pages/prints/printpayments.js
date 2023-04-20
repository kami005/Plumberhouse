import {  Backdrop, Box, Button, CircularProgress, Divider } from "@mui/material"
import { BodyDiv, BoxMain, HeaderDiv, MainPaper, StyledTypographyItems , StyledCartPaperTitle, BillInfoDiv, BillInfoTypography, 
HeaderTypographyStyle, LogoStyle, TextDiv, TotalTypography, CalcDiv, FooterBox, FooterTypography, StyleTypgraphyHeader} from "../../styles/printSaleStyle"
import ReactToPrint from "react-to-print";
import { useContext, useEffect, useRef, useState } from "react";
import { SHOPINFO } from "../../src/DataSource/RandData";
import { convert } from "../../src/DataSource/RandData";
import { findoneBill } from "../../src/BackendConnect/PurchaseStorage";
import Header from "../../src/Components/HeaderText";
import { useRouter } from "next/router";
import { SessionContext } from "../../src/Context/SessionContext";
import { useToggle } from "../../src/CustomHooks/RandHooks";
import { FindExpensesWithQuery } from "../../src/BackendConnect/ExpenseStorage";

const PrintPayments = ()=>{
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
      if(session[0] && query.type === 'purchase' && query.id)
      {
        response= await FindExpensesWithQuery({_id:query.id, myToken:session[0].token, myId:session[0]._id })
        if(response && response.length && response[0].purchases && response[0].purchases.length)
        {
            for (let i in response[0].purchases)
            {
                const resp = await findoneBill({purchaseID:response[0].purchases[i].purchaseID, myToken:session[0].token, myId:session[0]._id})
                if(resp)
                {
                    response[0].purchases[i].gTotal=resp.gTotal
                    response[0].purchases[i].paid=resp.paid
                    response[0].purchases[i].remaining = resp.gTotal-resp.paid
                    response[0].purchases[i].paymentStatus = resp.paymentStatus
                }
          
            }
            setRes({title:response[0].title, type:'PURCHASE', data:response[0]})
        }
      
      }    
    }


    const SetOtherData =()=>{
    let printTime = new Date()
    printTime=convert(printTime, 0)
     let purchaseDate= convert (new Date(res.data.createdAt))
      let username='NoUser'
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
        document.getElementById('print-button').click();
      }
    },[otherData])

    return (
      <BoxMain flex={10}>
      <Header name='PRINT PAYMENTS'/>
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
            <BillInfoTypography variant="body2" >Type : {(res &&  res.type) ? res.type : null } </BillInfoTypography>
            <BillInfoTypography variant="body2"  >Paid: {res && res.data.amount} </BillInfoTypography>
            </div>

            <div>
            <BillInfoTypography variant="body2" sx={{flex:'50%'}}>Bill Date: {otherData.purchaseDate.date} </BillInfoTypography>
            <BillInfoTypography variant="body2"  >Supplier: {res && res.data.supplier.name} </BillInfoTypography>
            
            </div>

            </BillInfoDiv>
            <Divider flexItem/>
            <BodyDiv>
            <StyledCartPaperTitle elevation={2}>
            <StyleTypgraphyHeader variant="body2" sx={{width:'30%'}}>Bill </StyleTypgraphyHeader>
            <StyleTypgraphyHeader  variant="body2" sx={{width:'40%'}}>Total</StyleTypgraphyHeader>
            <StyleTypgraphyHeader  variant="body2" sx={{width:'40%'}}>Paid</StyleTypgraphyHeader>
            <StyleTypgraphyHeader  variant="body2" sx={{width:'40%'}}>payment </StyleTypgraphyHeader>
            <StyleTypgraphyHeader  variant="body2" sx={{width:'50%'}}>Remaining</StyleTypgraphyHeader>
            <StyleTypgraphyHeader  variant="body2" sx={{width:'50%'}}>Paid By</StyleTypgraphyHeader>
            </StyledCartPaperTitle>
            <Divider flexItem/>
            {res && res.data && res.data.purchases && res.data.purchases.map((order, i)=>
                <StyledCartPaperTitle elevation={0} key={i}>
                <StyledTypographyItems variant="body2" sx={{width:'30%'}}>{order.purchaseID} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'40%'}}>{order.gTotal} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'40%'}}>{order.paid} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'40%'}}>{order.amount} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'50%'}}>{order.remaining} </StyledTypographyItems>
                <StyledTypographyItems variant="body2" sx={{width:'50%'}}>{res.data.addedBy} </StyledTypographyItems>
                </StyledCartPaperTitle>)}
            </BodyDiv>

            <CalcDiv>
            <Box elevation={0}>
            <TotalTypography sx={{fontWeight:600}}  variant="body2">Total Payment: {res && res.data.amount}</TotalTypography>
            <TotalTypography   sx={{fontWeight:600}} variant="body2">Agent Name/Sign:____________</TotalTypography>
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

  

export default PrintPayments


