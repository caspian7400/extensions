const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.post('/add', (req, res) => {
    const items = req.body;
    console.log(req.body);
    res.json({ output: (parseInt(items.item1) + parseInt(items.item2)) });
})

app.listen(3000, () => console.log('listening on port 3000'));
