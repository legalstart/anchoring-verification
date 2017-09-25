import woleet from 'woleet-weblibs'
import fs from 'fs'


/**
 * @param {string} filename
 * @returns {Promise.<string>} - Resolves when contents have been read from
 * file.
 */
export const readingFile = filename => new Promise((resolve, reject) => {
  fs.readFile(filename, (err, data) => (err ? reject(err) : resolve(data)))
})

/**
 * @param {string} filename
 * @param {string|Buffer} contents
 * @returns {Promise} - Resolves when contents have been written to file.
 */
export const writingFile = (filename, contents) => new Promise(
  (resolve, reject) => {
    fs.writeFile(
      filename,
      contents,
      err => (err ? reject(err) : resolve())
    )
  }
)


/**
 * Here we are just calling the `woleet.file.hashFileOrCheckHash` with a unique
 * argument. This is useful to avoid strange map behavior.
 * NB: This is not hitting any API. We are using woleet's `hashFileOrCheckHash`
 * which is a convenient wrapper around calling SHA-256 (see the library's
 * code).
 *
 * @param {string|Buffer} contents
 * @returns {string} - SHA-256 hash of the contents.
 */
export const hashingOf = contents => woleet.file.hashFileOrCheckHash(contents)
