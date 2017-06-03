import * as db from '../helpers/db';

const dbConnection = db.connect('luppa').connection;

require('./bidding').model(dbConnection);
