/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import { hashingOf, readingFile, writingFile } from './lib'
import { sortedConcat } from './concatlib'


/**
 * @param {[Buffer]} filesContents
 * @returns {string} - The concat'd string of hashes of the files.
 */
const concatingHashesOf = async filesContents => (
  sortedConcat(await Promise.all(
    filesContents.map(hashingOf)
  ))
)

/**
 * @param {string} outputFilePath
 * @param {[string]} filePaths - file paths containing contents that are going
 * to be concathashed.
 * @returns {Promise.<boolean>} - Boolean representing success.
 */
const concatingHashesOfFiles = (outputFilePath, filePaths) => {
  return Promise.all(filePaths.map(readingFile))
    .then(concatingHashesOf)
    .then(concatHash => writingFile(outputFilePath, concatHash))
    .then(() => {
      console.log(`[ OK ] Concat-hash file created at:
                  filepath=${outputFilePath}`)
      return true
    })
    .catch((error) => {
      console.error(`[ FAILURE ] Concat-hash file creation technical error:
                    error=${error.message}
                    ${error.stack}`)
      return false
    })
}


export default concatingHashesOfFiles
