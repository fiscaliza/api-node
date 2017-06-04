'use strict';
/**
 * @module models/schema/plugins/base
 * @description Mongoose plugin to add audit properties, hooks and methods to schemas
 * @see [module:mongoose]{@link https://www.npmjs.com/package/mongoose}
 * @see [module:mongoose-paginate]{@link https://www.npmjs.com/package/mongoose-paginate}
 * @see module:helpers/lodash
 */

import toObject from './toObject';

export default (schema) => {
  // Schema
  schema.add({createdAt: {type: Date, default: Date.now}});
  schema.add({updatedAt: {type: Date, default: Date.now}});
  schema.add({deletedAt: {type: Date, default: null}});

  // Hooks
  schema.pre('find', function (next) {
    if (JSON.stringify(this.where()._conditions).indexOf('deletedAt') === -1) {
      this.where('deletedAt', null);
    }

    next();
  });
  schema.pre('count', function (next) {
    if (JSON.stringify(this.where()._conditions).indexOf('deletedAt') === -1) {
      this.where('deletedAt', null);
    }

    next();
  });
  schema.pre('findOne', function (next) {
    if (JSON.stringify(this.where()._conditions).indexOf('deletedAt') === -1) {
      this.where('deletedAt', null);
    }

    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    this.update({}, {$set: {updatedAt: Date.now()}});
    next();
  });
  schema.pre('update', function (next) {
    this.update({}, {$set: {updatedAt: Date.now()}});
    next();
  });
  schema.pre('save', function (next) {
    this.wasNew = this.isNew;
    this.set('updatedAt', Date.now());
    next();
  });

  // Plugin
  schema.plugin(toObject);
};
