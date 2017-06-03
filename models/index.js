import * as db from '../helpers/db'
import dotenv from 'dotenv'

dotenv.config()

const dbConnection = db.connect('luppa').connection

require('./bidding').model(dbConnection);
