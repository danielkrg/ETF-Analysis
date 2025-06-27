import express from 'express'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors())
const PORT = 5001
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/static', express.static(path.join(__dirname, 'data')));

app.get('/', (req, res) => {
    res.send('This is the ETF Backend');
});

app.listen(PORT, () => {
    console.log(`Server is running`);
});