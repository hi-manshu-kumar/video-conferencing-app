const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const vidyo = require('./app');
app.use(express.static('public'))

app.get('/token', (req, res) => {
    let thirtyMinutes = 30*30;
    let response = JSON.stringify({
        token: vidyo.generateToken(thirtyMinutes)
    });
    res.send(response);
});

app.listen(port, () => {
    console.log(`Server running on ${port}`);
})