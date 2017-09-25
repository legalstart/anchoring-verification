/* eslint-disable no-console */
/* eslint-disable arrow-body-style */
import woleet from 'woleet-weblibs'
import { setRandomAPI } from './blockchainlib'
import { sortedConcat } from './concatlib'
import { hashingOf, readingFile } from './lib'


const _receiptHasHash = (receipt, hash) => {
  if (receipt.target.target_hash !== hash) {
    throw new Error("target_hash_mismatch")
  }
}

const checkingReceiptHasHash = async (receipt, hash) => {
  _receiptHasHash(receipt, hash)
}

/**
 * Perform the actual verification:
 * - Coherence checks on the receipt itself (structure & Merkle proof
 *   validation).
 * - Check that the transaction (that the receipt is pointing to) indeed
 *   contains the Merkle root in its OP_RETURN.
 * For details on what `woleet.verify.receipt` is doing, refer to the README and
 * to the actual code.
 *
 * Note: this will hit an HTTP API randomly between:
 * - api.woleet.io
 * - api.blockcypher.com
 * - chain.so
 *
 * @param {Object} receipt
 * @returns {Promise.<Object>} - Resolves iff verification suceeded, with the
 * status object from the underlying Woleet library.
 */
const verifyingReceiptWithRandomAPI = async (receipt) => {
  setRandomAPI()
  const status = await woleet.verify.receipt(receipt)

  if (status.code !== 'verified') {
    const err = new Error(status)
    err.code = status.code
    throw err
  }

  return status
}

const hashingConcatHashesOf = async (fileContents) => {
  const hashes = await Promise.all(fileContents.map(hashingOf))
  const concathash = sortedConcat(hashes)
  const hash = await hashingOf(new Buffer(concathash))
  return hash
}


/**
 * @param {String} receiptPath - Path on disk for the Chainpoint receipt.
 * @param {[String]} filePaths - Path on disk for the actual anchored files.
 * @returns {Promise.<Boolean>} - Boolean representing success.
 */
const verifyingFileWithReceipt = (receiptPath, filePaths) => {
  let eventualFilesHash

  if (filePaths.length === 1) {
    eventualFilesHash = Promise.resolve()
      .then(() => readingFile(filePaths[0]))
      .then(woleet.file.hashFileOrCheckHash)
  } else {
    eventualFilesHash = Promise.all(filePaths.map(readingFile))
      .then(hashingConcatHashesOf)
  }

  const eventualReceipt = Promise.resolve()
      .then(() => readingFile(receiptPath))
      .then(receiptFileContents => Promise.resolve(
        JSON.parse(receiptFileContents)
      ))

  const eventualReceiptHasHash = Promise
    .all([eventualFilesHash, eventualReceipt])
    .then(([fileHash, receipt]) => checkingReceiptHasHash(
      receipt, fileHash
    ))

  return Promise.all([eventualReceipt, eventualReceiptHasHash])
    .then(([receipt]) => verifyingReceiptWithRandomAPI(receipt))
    .then(({ timestamp, confirmations }) => {
      console.log(`[ OK ] Receipt integrity checked:
                  timestamp=${timestamp}
                  confirmations=${confirmations}`)
    })
    .then(() => true)
    .catch((error) => {
      if (error.code) {
        console.error(`[ FAILURE ] Receipt integrity check failure:
                      code=${error.code}`)
      } else {
        console.error(`[ FAILURE ] Receipt integrity check technical failure:
                      error=${error.message}
                      ${error.stack}`)
      }
      return false
    })
}


export default verifyingFileWithReceipt
