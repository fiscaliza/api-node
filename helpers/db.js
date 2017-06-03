'use strict';
/**
 * @module helpers/db
 * @description Expose methods to handle database connections
 * @summary db Helper
 * @see [module:mongoose]{@link https://www.npmjs.com/package/mongoose}
 * @see [module:config]{@link https://www.npmjs.com/package/config}
 * @see [module:bluebird]{@link https://www.npmjs.com/package/bluebird}
 */

import mongoose from 'mongoose';
import bluebird from 'bluebird';

mongoose.Promise = bluebird;

const connections = {};

/**
 * @function connect
 * @public
 * @static
 * @description Connects to database and return in the promise the connection
 * object using the options passed
 * @sumary Connects to database
 * @param {Object} options - Mongoose connection
 * {@link http://mongoosejs.com/docs/connections.html#options|options}
 * @returns {Promise} when resolved return the connection object
 */
export const connect = (connectionName = Date.now().toString(), connectionUrl = process.env.MONGODB_URL, options = { server: { poolSize: 10 } }) => {
  if (!connections.hasOwnProperty(connectionName)) {
    console.log('Connecting to MongoDB');

    const connection = mongoose.createConnection(connectionUrl, options);

    connections[connectionName] = connection;

    if (process.env.DEBUG) {
      mongoose.set('debug', true);
    }

    connection.once('open', () => {
      debug('Connection open with', connectionUrl);
    });

    connection.once('connected', () => {
      debug('Connected to', connectionUrl);
    });

    connection.once('disconnected', () => {
      debug('Disconnected from', connectionUrl);
    });

    connection.once('error', (error) => {
      debug('Connection error', error);
    });

    process.on('SIGINT', () => {
      connection.close(() => {
        debug('Connection closed by ctrl+C command');
        process.exit(0);
      });
    });
  }

  return {
    name: connectionName,
    connection: connections[connectionName]
  };
};

/**
 * @function disconnect
 * @public
 * @description Disconnects from mongoose
 */
export const disconnect = async(connectionName) => {
  if (connections.hasOwnProperty(connectionName) === false) {
    throw new Error(`Connection name ${connectionName} does not exists`);
  }

  await connections[connectionName].close();
};