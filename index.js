import express from 'express'
import Routes from './routes'
import './models'

const port = process.env.PORT_NODE
const app = express()

app.use('/', Routes)

app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})