import './App.css'
import { useState } from 'react'
import Papa from 'papaparse'
import timeCSV from './CSV/timeData.csv?raw';

function App() {
  const [weightData, setWeightData] = useState([])
  const timeData = Papa.parse(timeCSV, { header: true })
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setWeightData(results.data);
      }
    });
  }

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      {weightData.length ? (
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
      ) : null}

    </div>
  )
}

export default App
