/* eslint-disable import/prefer-default-export */


export const targetHashOfReceipt = (receipt) => {
  if (receipt.type === "ChainpointSHA256v2") {
    return receipt.targetHash
  } else if (receipt.header && receipt.header.chainpoint_version === "1.0") {
    return receipt.target.target_hash
  }
  throw new Error(
    "receipt_type_unknown (HINT: you should update chainpointlib.js"
  )
}
