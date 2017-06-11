'use strict';
/**
 * @module models/schema/plugins/base
 * @description Mongoose plugin to add audit properties, hooks and methods to schemas
 * @see [module:mongoose]{@link https://www.npmjs.com/package/mongoose}
 * @see [module:mongoose-paginate]{@link https://www.npmjs.com/package/mongoose-paginate}
 * @see module:helpers/lodash
 */

import mongoosePaginate from 'mongoose-paginate';
import Bluebird from 'bluebird';
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
  schema.plugin(mongoosePaginate);

  const originalPaginate = schema.statics.paginate;
  const originalAggregatePaginate = function (aggregate = [], options = {}, callback) {
    options = Object.assign({}, options);

    let sort = options.sort;

    let limit = options.hasOwnProperty('limit') ? options.limit : 10;
    let offset = 0;
    let skip = 0;
    let page = 1;

    if (options.hasOwnProperty('offset')) {
      offset = options.offset;
      skip = offset;
    } else if (options.hasOwnProperty('page')) {
      page = options.page;
      skip = (page - 1) * limit;
    }

    let promises = {
      docs: Promise.resolve([]),
      count: this.aggregate(aggregate).group({
        _id: null,
        count: { $sum: 1 }
      }).exec().then((result) => {
        return result.length === 0 ? 0 : result[0].count;
      })
    };

    if (limit) {
      let query = this.aggregate(aggregate)
        .sort(sort)
        .skip(skip)
        .limit(limit);

      promises.docs = query.exec()
        .then((documents) =>
          documents.map((document) => new this(document))
        );
    }

    return Bluebird.props(promises)
      .then(function (data) {
        var result = {
          docs: data.docs,
          total: data.count,
          limit: limit
        };

        if (offset !== undefined) {
          result.offset = offset;
        }

        if (page !== undefined) {
          result.page = page;
          result.pages = Math.ceil(data.count / limit) || 1;
        }

        return result;
      })
      .asCallback(callback);
  };

  schema.statics.paginate = async function (query,
                                            options,
                                            docsProperty = 'docs',
                                            mapDocs = async(item) => await item.toObject()) {
    let result = await originalPaginate.call(this, query, options);

    let documents = await Promise.all(
      result.docs.map(mapDocs)
    );

    return {
      [docsProperty]: documents,
      pages: result.pages,
      nextPage: (result.page + 1) <= result.pages ? result.page + 1 : null
    };
  };

  schema.statics.aggregatePaginate = async function (query,
                                                     options,
                                                     docsProperty = 'docs',
                                                     mapDocs = async(item) =>
                                                       await item.toObject()) {
    let result = await originalAggregatePaginate.call(this, query, options);

    let documents = await Promise.all(
      result.docs.map(mapDocs)
    );

    return {
      [docsProperty]: documents,
      pages: result.pages,
      nextPage: (result.page + 1) <= result.pages ? result.page + 1 : null
    };
  };
};
