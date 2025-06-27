### Description:

This is an ETF price monitor application that displays key infortmation of a given ETF. \
It has a simple UI that initially prompts the user to upload a CSV file, and then displays the following: 
- Table with each constituents name, weight, and final closing price
- Zoomable line chart displaying the reconstructed ETF price over time (with a button to reset the chart)
- Bar graph displaying the top 5 holdings and their worth 

Hovering over data in either graph will also display the exact price value. 

### Assumptions Made:

I assumed that this would be an internally used application, where CSV file formatting is consistent with the examples provided.
Thus, no bounds checks were performed on the uploaded csv files to ensure that there are only two columns of data (name, weight). 
Furthermore, I assumed that the prices.csv file would be located in the server/data folder and that it is not necessary for the user to upload it.
I placed the other csv files into the same folder to make testing easier, though they can be located anywhere on the users device. 
Finally, since this is a locally run project I assumed that the server will be at localhost port 5001 when making fetch requests.

### Technologies Used:

The backend was created with Node.js and express, and has CORS enabled to allow the client to make requests to the server
which is located on a different port. 

The frontend was built with React using Vite for a simpler setup. CSV parsing was done with papaparse, and chart generation was done with Chart.js.

### To run:

1. Install Dependencies:
```bash
cd client
npm install
cd ../server
npm install
```
2. In first terminal:
```bash
cd client
npm run dev
```
3. In second terminal:
```bash
cd server
npm run dev
```
