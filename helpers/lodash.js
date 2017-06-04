'use strict';
/**
 * @module helpers/lodash
 * @description Adds mixins for lodash
 * @see [module:lodash]{@link https://www.npmjs.com/package/lodash}
 */

import _ from 'lodash';
import omitDeep from 'omit-deep';

// Mixin Definitions
_.mixin({
  omitDeep
});

/**
 * Export back the extended lodash module
 */
export default _;
