/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/**
 * Here are the utilities needed to define how to access the Bitcoin blockchain.
 */
import woleet from 'woleet-weblibs'


const API_IDS = [
  'blockcypher.com',
  'woleet.io',
  'chain.so',
]


/**
 * Sets randomly the API to be used by `woleet.verify`.
 */
export const setRandomAPI = () => {
  const randomApiId = API_IDS[Math.floor(Math.random() * API_IDS.length)];

  woleet.transaction.setDefaultProvider(randomApiId)
  console.log(`API used: ${randomApiId}`)
}
