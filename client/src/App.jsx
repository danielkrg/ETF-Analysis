import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';
import  { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale, 
  LinearScale, 
  PointElement,

} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import timeCSV from './CSV/timeData.csv?raw';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  zoomPlugin
)

function App() {
  const [lineChartData, setLineChartData] = useState(null)
  const [barChartData, setBarChartData] = useState(null)
  const lineChartOptions = {
    plugins: {
      zoom: {
        pan: {
          enabled: true,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
        }
      }
    }
  }
  const barChartOptions = {

  }
  const [weightData, setWeightData] = useState([])
  const timeData = Papa.parse(timeCSV, { header: true })

  const processData = (weights) => {
    const lineLabels = []
    const lineData = []
    const barLabels = []
    const barData = []
    timeData.data.forEach((row) => {
      if (row.DATE != "") {
        var value = 0
        weights.forEach((constituent) => {
          if (constituent.weight){
            value += parseFloat(constituent.weight) * parseFloat(row[constituent.name])
          }
        })
        lineLabels.push(row.DATE)
        lineData.push(value)
      }
    })
    weights.forEach((constituent) => {
      var value = parseFloat(constituent.weight) * parseFloat(timeData.data.at(-2)[constituent.name])
      if (barData.length != 5) {
        barData.push(value)
        barLabels.push(constituent.name)
      }
      else {
        var minVal = Math.min(...barData)
        var minIdx = barData.indexOf(minVal)
        if (value > minVal) {
          barData.splice(minIdx, 1)
          barLabels.splice(minIdx, 1)
          barData.push(value)
          barLabels.push(constituent.name)
        }
      }
    })
    setLineChartData({
      labels: lineLabels,
      datasets: [{
        label: "ETF Price",
        data: lineData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      }]
    })
    setBarChartData({
      labels: barLabels,
      datasets: [{
        label: "Top 5 ETF Holdings",
        data: barData,
        backgroundColor: 'rgb(75, 192, 192)',
      }]
    })
  }
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setWeightData(results.data);
        processData(results.data)
      }
    });
  }

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {weightData.length ? (
        <div>
          <table>
            <thead>
              <tr>
                <th>Constituent</th>
                <th>Weight</th>
                <th>Last Price</th>
              </tr>
            </thead>
            <tbody>
              {weightData.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.weight}</td>
                  <td>{timeData.data.at(-2)[row.name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Line
            data = {lineChartData}
            options = {lineChartOptions}>
          </Line>
          <Bar
            data = {barChartData}
            options = {barChartOptions}>
          </Bar>
        </div>
      ) : null}
    </div>
  )
}

export default App
