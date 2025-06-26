import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors())
const PORT = 5001

app.get('/', (req, res) => {
    res.send('This is the ETF Backend');
});

app.listen(PORT, () => {
    console.log(`Server is running`);
});