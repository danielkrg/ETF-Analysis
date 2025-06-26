import './App.css';
import { useState } from 'react';
import Papa from 'papaparse';
import  { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  LineElement,
  CategoryScale, // x-axis
  LinearScale, // y-axis
  PointElement
} from 'chart.js';
import timeCSV from './CSV/timeData.csv?raw';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
)

function App() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "",
      data: []
    }]
  })

  const [weightData, setWeightData] = useState([])
  const timeData = Papa.parse(timeCSV, { header: true })
  const options = {
    plugins: {
      legend: true
    }
  }

  const processData = (weights) => {
    const labels = []
    const data = []
    timeData.data.forEach((row) => {
      if (row.DATE != "") {
        var value = 0
        weights.forEach((constituent) => {
          if (constituent.weight){
            value += parseFloat(constituent.weight) * parseFloat(row[constituent.name])
          }
        })
        labels.push(row.DATE)
        data.push(value)
      }
    })
    console.log(labels)
    console.log(data)
    setChartData({
      labels: labels,
      datasets: [{
        label: "ETF Price",
        data: data,
        backgroundColor: "aqua"
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
            data = {chartData}
            options = {options}>
          </Line>
        </div>
      ) : null}
    </div>
  )
}

export default App
