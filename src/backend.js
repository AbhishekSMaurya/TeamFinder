const express = require('express')
const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.sendFile("D:\Abhishek Maurya\React Project App\third\public\index.html",{root:__dirname})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})