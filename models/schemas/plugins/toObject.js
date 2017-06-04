'use strict';
/**
 * @module models/schema/plugins/base
 * @description Mongoose plugin to add audit properties, hooks and methods to schemas
 * @see [module:mongoose]{@link https://www.npmjs.com/package/mongoose}
 * @see [module:mongoose-paginate]{@link https://www.npmjs.com/package/mongoose-paginate}
 * @see module:helpers/lodash
 */

import _ from '../../../helpers/lodash';

export default (schema) => {
  if (!schema.options.toObject) schema.options.toObject = {};
  const stringArrayParse = (stringOrArray, splitChar) => {
    if (typeof stringOrArray === 'string') {
      return stringOrArray.split(splitChar);
    } else if (Array.isArray(stringOrArray)) {
      return stringOrArray;
    } else {
      throw new Error('Not string or array');
    }
  }

  schema.options.toObject.defaults = {
    omit: [
      '__cached_attachments',
      '_locals',
      'cache',
      '_id',
      '__v',
      'deletedAt',
      'updatedAt'
    ]
  };
  schema.options.toObject.versionKey = false;
  schema.options.toObject.virtuals = true;
  schema.options.toObject.transform = async(doc, ret, options) => {
    if (options.noTransform) {
      return ret;
    }
    let transformed = _.clone(ret);

    let omit = [...schema.options.toObject.defaults.omit];
    if (options.omit) {
      omit = [...omit, ...options.omit];
    }

    transformed = _.omit(transformed, omit);

    return transformed;
  }
};
