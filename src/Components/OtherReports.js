import { Search } from '@mui/icons-material';
import { Checkbox, FormControlLabel } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import React, { useContext, useReducer, useState } from 'react'
import { DateTextFieldStyle, HeaderText, MainBox, SearchBox, SearchBoxField, SearchButtonStyle, SearchFirstBoxStyle } from '../../styles/OtherReportStyle'
import { SessionContext } from '../Context/SessionContext'
import { alertReducer, useToggle } from '../CustomHooks/RandHooks'

const OtherReports = () => {
    const [alertSnack, dispatchSnack] = useReducer(alertReducer, {message:'SAVED Successfuly', isOpen:false, msgColor:'success'})
    const context = useContext(SessionContext)
    const [onlyRevenue, toggleRevenue] = useToggle()
    const {theme} = context
    const [dates, setDates] = useState([null, null])

    const handleFirstDate =(date)=>{
        let state = [...dates]
        
        if((dates[1] && date <= dates[1]) || !dates[1])
        state[0] = date
        else
        state[0]=null
          setDates(state)
      }

      const handleSecondDate = (date)=>{
        let state = [...dates]
      
        if((dates[0] && date >= dates[0]) || !dates[0])
        state[1] = date
        else
          state[1]=null
          setDates(state)
      }
      const GenerateReport =(e)=>{
        if(e)
            e.preventDefault()
            let url
            if(dates[0] && dates[1])
            {
                url=`/prints/financialreport?startdate=${dates[0]}&enddate=${dates[1]}&onlyrevenue=${onlyRevenue}`
            }
           else if (dates[0])
           {
                url=`/prints/financialreport?startdate=${dates[0]}&enddate=${dates[0]}&onlyrevenue=${onlyRevenue}`
           }
           else if (dates[1])
           {
                url=`/prints/financialreport?startdate=${dates[1]}&enddate=${dates[1]}&onlyrevenue=${onlyRevenue}`
           }
           if(dates[0] || dates[1])
            window.open(url, 'popup', 'toolbar=0,location=0,menubar=0,width=800,height=800');
      }

  return (
    <MainBox theme={theme.themes[theme.active]}>
    <HeaderText variant='h6'>Income Report</HeaderText>
   
        <form onSubmit={e=>GenerateReport(e)}>
        <SearchBox>
        <SearchBoxField theme={theme.themes[theme.active]}> 
        <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Date From"
          inputFormat="1/MM/yyyy"
          value={dates[0]}
          views={['year', 'month']}
          minDate={new Date('2019-01-01')}
          maxDate={new Date()}
          onChange={date=>handleFirstDate(date)} 
          renderInput={(params) => <DateTextFieldStyle theme={theme.themes[theme.active]} size='small' {...params} />}
        />
        <DatePicker
          label="Date To"
          inputFormat="1/MM/yyyy"
          value={dates[1]}
          views={['year', 'month']}
          minDate={new Date('2019-01-01')}
          maxDate={new Date()}
          onChange={date=>handleSecondDate(date)} 
          renderInput={(params) => <DateTextFieldStyle theme={theme.themes[theme.active]} size='small' {...params}/>}/>
        </LocalizationProvider>
        </SearchBoxField>
        <SearchFirstBoxStyle theme={theme.themes[theme.active]}>
        <FormControlLabel label='Only Revenue' control={<Checkbox  checked={onlyRevenue}  onChange={toggleRevenue}/>}/>
        <SearchButtonStyle theme={theme.themes[theme.active]} type='submit' variant='contained' endIcon={<Search />}>Generate</SearchButtonStyle>
        </SearchFirstBoxStyle>

        </SearchBox>
        </form>
   
    </MainBox>
  )
}


export default OtherReports