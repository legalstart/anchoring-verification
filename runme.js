/* eslint-disable no-console */
import verifyingFileWithReceipt from './src/verify'
import concatHashingFiles from './src/concat'


const USAGE = `
Concat-hashing and Chainpoint verification tool.

To concat-hash several files, run this script like:

    <script> concathash outputfilepath file1 file2 file3

This can take any number of input files.

To verify one file against a Chainpoint v2 receipt:

    <script> verify receipt.json file

To verify several files's concat-hash against a receipt:

    <script> verify receipt.json file1 file2 ...

NOTA BENE: the ordering in which files are given to the concat-hash algorithm
matters. So you have to be coherent between your usage of the \`concathash\` and
the \`verify\` commands.
`;


(async () => {
  // [TODO] - Improve argument parsing with help from nice library.
  const [cmd, ...args] = process.argv.slice(2)

  switch (cmd) {
    case 'verify': {
      const [receiptPath, ...filePaths] = args
      if (await verifyingFileWithReceipt(receiptPath, filePaths)) {
        process.exit(0)
      } else {
        process.exit(1)
      }
      break
    }
    case 'concathash': {
      const [outputPath, ...filePaths] = args
      if (await concatHashingFiles(outputPath, filePaths)) {
        process.exit(0)
      } else {
        process.exit(1)
      }
      break
    }
    default: {
      console.log(USAGE)
      process.exit(0)
    }
  }
})()
