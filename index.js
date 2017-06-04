import express from 'express'
import Routes from './routes'
import cors from 'cors'
import bodyParser from 'body-parser'
import './models'

const port = process.env.PORT_NODE
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use('/', Routes)

app.listen(port, () => {
  console.log(`Server running in port ${port}`)
})