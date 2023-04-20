import {  Backdrop, Button, Checkbox, CircularProgress, Divider, FormControlLabel, Typography } from "@mui/material"
import { BodyDiv, BoxMain, HeaderDiv, MainPaper , StyledCartPaperTitle, BillInfoDiv, BillInfoTypography, 
HeaderTypographyStyle, LogoStyle, TextDiv, TotalTypography, CalcDiv, FooterBox, FooterTypography, StyleTypgraphyHeader, HeaderBody} from "../../styles/financialreportprintstyle"
import ReactToPrint from "react-to-print";
import { useContext, useEffect, useRef, useState } from "react";
import { SHOPINFO } from "../../src/DataSource/RandData";
import { convert } from "../../src/DataSource/RandData";
import Header from "../../src/Components/HeaderText";
import { useRouter } from "next/router";
import { SessionContext } from "../../src/Context/SessionContext";
import { useToggle } from "../../src/CustomHooks/RandHooks";
import { ExpenseFinancialReport } from "../../src/BackendConnect/ExpenseStorage";
import { IncomeFinancialReport } from "../../src/BackendConnect/IncomeStorage";
import { addMonths } from "date-fns";

const FinancialReport = ()=>{
  const route=useRouter()
  const printRef = useRef()
  const [loading, toggleLoading] = useToggle(true)

  const [res, setRes] = useState()
  const [dates, setDates] = useState([null, null])
  const context = useContext(SessionContext)
  const session = context.session
  const [otherData, setOtherData] = useState({printTime:{time:'', date:''}, purchaseDate:{time:'', date:''}, username:''})  

    const GetData =async()=>{

        try
        {
            let incomeData, expenseData

            let query = route.query
            if(session[0] && query.startdate && query.enddate)
            {
              const onlyRevenue =  (query.onlyrevenue && query.onlyrevenue !=='false' ) ? true : false
              let start =  new Date(query.startdate), end = new Date(query.enddate)
              start = new Date (start.getFullYear(), start.getMonth(),1)
              end = new Date (end.getFullYear(), end.getMonth(),1)
              end = addMonths(end, 1)
              setDates([start, end])
      
              incomeData = await IncomeFinancialReport({myId:session[0]._id, myToken:session[0].token, start, end})
              expenseData = await ExpenseFinancialReport({myId:session[0]._id, myToken:session[0].token, start, end})
              let income =  {sales:0, other:0}, expense = {purchases:0, other:0}

              if(incomeData)
                    income = {sales:incomeData.salesIncome, other:incomeData.otherIncome}
                
              if(expenseData)
                    expense = {purchases:expenseData.purchaseExpense, other:expenseData.otherExpense}

                    setRes({income:{...income}, expense:{...expense}, onlyRevenue})
            }

        }catch(er)
        {
            console.log(er)
        }
    
    }


    const SetOtherData =()=>{
    let printTime = new Date()
    printTime=convert(printTime, 0)
      let username='NoUser'
      if(session[0] && session[0].username)
      {
          username= session[0].username
      }
      setOtherData({printTime, username})
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
      if(otherData.username)
      {
        toggleLoading()
        // document.getElementById('print-button').click();
      }
    },[otherData])

    return (
      <BoxMain flex={10}>
      <Header name='FINANCE'/>
        <MainPaper ref = {el => (printRef = el)} elevation={0}>
            <HeaderDiv>
            <TextDiv>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.name}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.addressLine1}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.addresLine2}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">Ph: {SHOPINFO && SHOPINFO.phone}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">Email: {SHOPINFO && SHOPINFO.email}</HeaderTypographyStyle>
            <HeaderTypographyStyle variant="body1">{SHOPINFO && SHOPINFO.website}</HeaderTypographyStyle>
            </TextDiv>
            <LogoStyle src={SHOPINFO && SHOPINFO.logo.src} alt={SHOPINFO && SHOPINFO.logo.alt} />
            </HeaderDiv>

            <BillInfoDiv>
            <div>
            <BillInfoTypography variant="body2" sx={{flex:'50%'}}>Period From: {dates[0] && `${dates[0]}`} </BillInfoTypography>
            <BillInfoTypography variant="body2" sx={{flex:'50%'}}>Period To: {dates[0] && `${dates[1]}`} </BillInfoTypography>
            </div>

            <div>
            <BillInfoTypography variant="body2" >TradeMark Number : xx25bllk </BillInfoTypography>
            <BillInfoTypography variant="body2" >Currency : PKR </BillInfoTypography>
            </div>

            </BillInfoDiv>
            <Divider flexItem/>
            <BodyDiv>
            <StyledCartPaperTitle elevation={2}>
            <StyleTypgraphyHeader variant="h6" sx={{width:'30%'}}>Income </StyleTypgraphyHeader>
            <Divider flexItem/>
            <HeaderBody>
            <Typography variant="h6">Sales Revenue</Typography>
            <Typography variant="h6">{(res && res.income) ? res.income.sales: 0}</Typography>
            </HeaderBody>
            <HeaderBody>
            <Typography variant="h6">Other Revenue</Typography>
            <Typography variant="h6">{(res && res.income) ? res.income.other: 0}</Typography>
            </HeaderBody>
            <Divider flexItem/>
            <HeaderBody>
            <Typography variant="h6">Total Revenue</Typography>
            <Typography variant="h6">{(res && res.income) ? res.income.other+res.income.sales: 0}</Typography>
            </HeaderBody>
            <Divider flexItem/>
            </StyledCartPaperTitle>
            </BodyDiv>



            <BodyDiv>
            <StyledCartPaperTitle elevation={2}>
            <HeaderBody>
            <StyleTypgraphyHeader variant="h6" sx={{width:'30%'}}>Expense </StyleTypgraphyHeader>
           
            </HeaderBody>
            <Divider flexItem/>
           {(res && !res.onlyRevenue)?
            <HeaderBody>
            <Typography variant="h6">Procurement</Typography>
            <Typography variant="h6">{(res && res.expense)? res.expense.purchases:0}</Typography>
            </HeaderBody> : ''
            }

            <HeaderBody>
            <Typography variant="h6">{(res && !res.onlyRevenue) ? 'Other Expenses' : 'Expenses'}</Typography>
            <Typography variant="h6">{(res && res.expense) ? res.expense.other:0}</Typography>
            </HeaderBody>
            
            <Divider flexItem/>
            {(res && !res.onlyRevenue)?
            <HeaderBody>
            <Typography variant="h6">Total Expenses</Typography>
            <Typography variant="h6">{(res && res.expense) ? res.expense.purchases+res.expense.other:0}</Typography>
            </HeaderBody> : ""}
            <Divider flexItem/>
            </StyledCartPaperTitle>
            </BodyDiv>

            <CalcDiv>
  
            <TotalTypography sx={{fontWeight:600}}  variant="h6">Gross Income: {(res && res.income) ? res.income.other+res.income.sales: 0}</TotalTypography>
            {
            (res && !res.onlyRevenue) ?
            <TotalTypography   sx={{fontWeight:600}} variant="h6">Expenses:{(res && res.expense)? res.expense.purchases+res.expense.other:0}</TotalTypography> :
            <TotalTypography   sx={{fontWeight:600}} variant="h6">Expenses:{(res && res.expense)? res.expense.other:0}</TotalTypography>
            }

            {
            (res && !res.onlyRevenue)?
            <TotalTypography   sx={{fontWeight:600}} variant="h6">Net Income:{(res && res.expense && res.income)? (res.income.sales+res.income.other)-(res.expense.purchases+res.expense.other):0}</TotalTypography>
                : 
            <TotalTypography   sx={{fontWeight:600}} variant="h6">Net Income:{(res && res.expense && res.income)? (res.income.sales+res.income.other)-res.expense.other:0}</TotalTypography>
            }
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

  

export default FinancialReport


