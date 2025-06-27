import './App.css';
import { useRef, useState } from 'react';
import Papa from 'papaparse';
import  { Line, Bar } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale, 
  LinearScale, 
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import timeCSV from './CSV/timeData.csv?raw';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  zoomPlugin
)

function App() {
  const [lineChartData, setLineChartData] = useState(null)
  const [barChartData, setBarChartData] = useState(null)
  const lineChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "ETF Price Over Time",
        font: {
          size: 18
        }
      },
      zoom: {
        pan: {
          enabled: true,
        },
        zoom: {
          wheel: {
            enabled: true,
            speed: 0.05,
          }
        },
        limits: {
          y: {min: 0}
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    },
  }
  const barChartOptions = {
    plugins: {
      title: {
        display: true,
        text: "Top 5 ETF Holdings",
        font: {
          size: 18
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Constituent',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
    },
  }
  const [weightData, setWeightData] = useState([])
  const timeData = Papa.parse(timeCSV, { header: true, skipEmptyLines: true})
  const [fileName, setFileName] = useState("");

  const processData = (weights) => {
    const lineLabels = []
    const lineData = []
    const barLabels = []
    const barData = []
    timeData.data.forEach((row) => {
      var value = 0
      weights.forEach((constituent) => {
          value += parseFloat(constituent.weight) * parseFloat(row[constituent.name])
      })
      lineLabels.push(row.DATE)
      lineData.push(value)
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
        borderColor: "rgb(75, 192, 192)",
      }]
    })
    setBarChartData({
      labels: barLabels,
      datasets: [{
        label: "Holding Value",
        data: barData,
        backgroundColor: "rgb(75, 192, 192)",
      }]
    })
  }
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name)
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setWeightData(results.data);
        processData(results.data)
      }
    });
  }

  const lineRef = useRef(null);

  const handleResetZoom = () => {
    if (lineRef && lineRef.current) {
      lineRef.current.resetZoom();
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen justify-center items-center bg-amber-50">
      {weightData.length ? (
        <div className="absolute top-0 right-5">
          <p className="text-black pt-5">Current File: {fileName}</p>
        </div>
      ) : (
        <p className="text-3xl font-bold text-black">Select an ETF File to Continue</p>
      )}
      <div className="relative inline-block pt-5">
        <input
          type="file"
          accept='.csv'
          id="upload"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label
          htmlFor="upload"
          className="px-2 py-2 cursor-pointer text-black hover:text-teal-600 
            border-2 hover:border-teal-600 transition-all duration-200 ease-in-out rounded-full"
        >
          Upload CSV
        </label>
      </div>

      {weightData.length ? (
        <div className="flex w-full pl-5 pr-5 pb-5">
          <table className="table-auto">
            <thead>
              <tr>
                <th className="text-black border border-gray-600 px-2 py-2 text-center">Constituent</th>
                <th className="text-black border border-gray-600 px-2 py-2 text-center">Weight</th>
                <th className="text-black border border-gray-600 px-2 py-2 text-center">Closing Price</th>
              </tr>
            </thead>
            <tbody>
              {weightData.map((row, index) => (
                <tr key={index}>
                  <td className="text-black border border-gray-600 px-2 py-2 text-center">{row.name}</td>
                  <td className="text-black border border-gray-600 px-2 py-2 text-center">{row.weight}</td>
                  <td className="text-black border border-gray-600 px-2 py-2 text-center">{timeData.data.at(-2)[row.name]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col pl-5 w-full items-center"> 
            <Line
              data = {lineChartData}
              options = {lineChartOptions}
              ref={lineRef}>
            </Line>
            <button onClick = {handleResetZoom} 
            className="px-2 py-2 mt-5 mb-5 cursor-pointer text-black hover:text-teal-600 
            border-2 hover:border-teal-600 transition-all duration-200 ease-in-out rounded-full">
              Reset Zoom
            </button>
            <Bar
              data = {barChartData}
              options = {barChartOptions}>
            </Bar>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
