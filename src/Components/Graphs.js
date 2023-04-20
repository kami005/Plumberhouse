import React, { useContext } from 'react'
import { colors, CardContent, CardHeader, Divider, alpha } from '@mui/material';
import { CardGraphStyle, GraphBoxStyle, PieBoxStyle} from '../../styles/graphsStyle';
import { Bar, Line, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,


} from 'chart.js';
import { SessionContext } from '../Context/SessionContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
);

const Graphs = (props) => {
  const graphType = props.graphType, title= props.title
  const context = useContext(SessionContext)
  const {theme}= context
  const graph = props.graph
  let sizeOfObject =0
  let objArray =[]
  if (graph)
  {
    sizeOfObject= Object.keys(graph).length
    objArray = Object.getOwnPropertyNames(graph)
  }
  
const graphStyle = ()=>{
  if(graphType==='Bar')
        return (
          <GraphBoxStyle  theme={theme.themes[theme.active]}>
          <Bar  
          data={graphData}
          options={GraphOptions} />
          </GraphBoxStyle>
        )
  else if(graphType==='Line' )
        return (
        <GraphBoxStyle  theme={theme.themes[theme.active]}>
        <Line  data={graphData}
        options={GraphOptions} /> 
        </GraphBoxStyle>
           )
   else if(graphType==='Pie' )
        return (
        <PieBoxStyle  theme={theme.themes[theme.active]}>
        <Pie data={doughnutData} options={PieOptions} /> 
        </PieBoxStyle>
         )
         else if(graphType==='Doughnut' )
         return (
         <PieBoxStyle  theme={theme.themes[theme.active]}>
         <Doughnut data={doughnutData} options={PieOptions} /> 
         </PieBoxStyle>
          )

          
   
}
 
  const graphData = {
    datasets: [
      {
        backgroundColor: theme.themes[theme.active].up,
        borderColor: theme.themes[theme.active].up,
        barPercentage: 0.5,
        barThickness: 6,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data:  (sizeOfObject>1 && graph && graph[Object.keys(graph)[0]] && graph[Object.keys(graph)[0]].data) ? graph[Object.keys(graph)[0]].data:[],
        label: (sizeOfObject>1 && graph && graph[Object.keys(graph)[0]] && graph[Object.keys(graph)[0]].name) ? graph[Object.keys(graph)[0]].name:'',
        maxBarThickness: 10
      },
      {
        backgroundColor: colors.deepOrange[800],
        borderColor: colors.deepOrange[400],
        barPercentage: 0.5,
        barThickness: 6,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: (sizeOfObject>1 && graph  && graph[Object.keys(graph)[1]] && graph[Object.keys(graph)[1]].data) ? graph[Object.keys(graph)[1]].data:[],
        label: (sizeOfObject>1 && graph && graph[Object.keys(graph)[1]] && graph[Object.keys(graph)[1]].name) ? graph[Object.keys(graph)[1]].name:'',
        maxBarThickness: 10
      },
      
      {
        backgroundColor: theme.themes[theme.active].down,
        borderColor: theme.themes[theme.active].down,
        barPercentage: 0.5,
        barThickness: 6,
        borderRadius: 4,
        categoryPercentage: 0.5,
        data: (sizeOfObject>1 && title !=='Pie'&& graph  && graph[Object.keys(graph)[2]] && graph[Object.keys(graph)[2]].data) ? graph[Object.keys(graph)[2]].data:[],
        label: (sizeOfObject>1 && graph  !=='Pie' && graph[Object.keys(graph)[2]] && graph[Object.keys(graph)[2]].name) ? graph[Object.keys(graph)[2]].name:'',
        maxBarThickness: 10,
      },
    ],
    labels: (sizeOfObject>1 && graph  && graph[Object.keys(graph)[sizeOfObject-1]]) ? graph[Object.keys(graph)[sizeOfObject-1]] :[]
  };
  
  const doughnutData = {
    type:'doughnut',
    datasets: [
      {
        hoverOffset: 4,
        label: 'Most selling Items',
        
        data: (sizeOfObject>1 && graph  && graph[Object.keys(graph)[sizeOfObject-1]] && graph[Object.keys(graph)[sizeOfObject-1]].data)  ? graph[Object.keys(graph)[sizeOfObject-1]].data:[],
        backgroundColor: [
          '#88d8b0', '#f37736','#fdf498','#7bc043','#0392cf', '#fe4a49', '#2ab7ca',  '#fed766', '#e6e6ea' ,
          '#0e9aa7' ,'#3da4ab', '#f6cd61','#fe8a71', '#96ceb4 ', '#ffeead', '#ff6f69',  '#ffcc5c', '#88d8b0',
           '#051e3e', '#251e3e', '#451e3e', '#651e3e', '#851e3e', '#f4f4f8' ,'#eee3e7', '#ead5dc',
           '#eec9d2', '#f4b6c2', '#f6abb6'
        ],
        borderColor:[ '#88d8b0', '#f37736','#fdf498','#7bc043','#0392cf', '#fe4a49', '#2ab7ca',  '#fed766', '#e6e6ea' ,
        '#0e9aa7' ,'#3da4ab', '#f6cd61','#fe8a71', '#96ceb4 ', '#ffeead', '#ff6f69',  '#ffcc5c', '#88d8b0',
         '#051e3e', '#251e3e', '#451e3e', '#651e3e', '#851e3e', '#f4f4f8' ,'#eee3e7', '#ead5dc',
         '#eec9d2', '#f4b6c2', '#f6abb6'],
      },
    ],
    labels: (sizeOfObject>1 && graph && graph[Object.keys(graph)[0]] && graph[Object.keys(graph)[0]].data) ? graph[Object.keys(graph)[0]].data:[],
  }

 const PieOptions={
    color:colors.common.black,
    responsive: true,
    maintainAspectRatio:false,
  
    plugins: {
      legend: {
        display: false
      }
    }
  }


  const GraphOptions = {
    animation: true,
    cornerRadius: 20,
    color:theme.themes[theme.active].tabText,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: {
        ticks: {
          color: theme.themes[theme.active].tabText,
        },
        grid: {
          display: false,
          drawBorder: false
        }
      },
      yAxes: {
        ticks: {
          color: theme.themes[theme.active].tabText,
          beginAtZero: true,
          min: 0,
        },
        grid: {
          color: theme.themes[theme.active].tabText,
          borderDash: [2],
          borderDashOffset: [2],
          color: theme.themes[theme.active].tabText,
          drawBorder: false,
          zeroLineBorderDash: [2],
          zeroLineBorderDashOffset: [2],
          zeroLineColor: theme.themes[theme.active].tabText
        }
      },
    },
    tooltips: {
      backgroundColor: 'white',
      bodyFontColor: 'white',
      borderColor: 'white',
      borderWidth: 1,
      enabled: true,
      footerFontColor: 'white',
      intersect: false,
      mode: 'index',
      titleFontColor: 'white'
    }
    
  };

  return (
    <CardGraphStyle elevation={10} theme={theme.themes[theme.active]}>
    <CardHeader title={title}/>
    <Divider />
    <CardContent >
      {graphStyle()}
    </CardContent>
    </CardGraphStyle>
  )
}

export default Graphs