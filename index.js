const express = require('express')
const app = express()
const port = 3000

app.get('/prueba', (req, res) => {
     res.send('Hola, Mundo :)')


})

app.listen(port, () => {
console.log('La aplicacion se esta ejecuntando por el puerto ' + port)


})