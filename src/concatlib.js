/* eslint-disable import/prefer-default-export */
/**
 * Here we list the algorithms that we are introducing on top of woleet-weblibs.
 */

const concat = contents => contents.join('')

/**
 * This function returns a new Array (unlike `Array.prototype.sort()`).
 * Sorting for lowercase ascii chars is: [0-9] then [a-z].
 */
const sort = array => array.concat().sort()

/**
 * @param {[string]} sortedConcat
 * @returns string - Concatenation of the sorted input array.
 */
export const sortedConcat = contents => concat(sort(contents))
