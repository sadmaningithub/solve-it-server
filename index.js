const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req,res)=>{
    res.send('SolveIt server is running.')
} )

app.listen(port, ()=>{
    console.log(`SolveIt server is currently listening to port ${port}`)
})