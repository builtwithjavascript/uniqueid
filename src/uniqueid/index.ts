// Check if the code is running in a Node.js environment
// `globalThis.process.versions.node` is unique to Node.js, so we check for its existence
// @ts-ignore
const isNode =
  globalThis &&
  globalThis.process &&
  globalThis.process.versions &&
  typeof globalThis.process.versions.node !== 'undefined'
// Check if the code is running in a modern browser environment
// We specifically check for `window.crypto.getRandomValues`, which is available in browsers with secure randomness support
// `window.crypto` exists only in browser environments, and `getRandomValues` ensures it's a secure context
const isBrowser =
  globalThis &&
  globalThis.window &&
  globalThis.window.crypto &&
  typeof globalThis.window.crypto.getRandomValues !== 'undefined'

// Pre-allocate a single-element Uint32Array to hold random values in the browser
const _uint32Arr: Uint32Array = new Uint32Array(1)

// Generate a unique identifier based on a given timestamp
const _id = (time: number): string => {
  // Convert the timestamp `time` to a string and ensure it has 13 digits (representing milliseconds)
  // If the timestamp has fewer than 13 digits, pad it to the right with zeros
  let ms: string = '' + time
  if (ms.length < 13) {
    ms = ms.padEnd(13, '0')
  }

  let str: string = ''
  // If running in a browser, use `crypto.getRandomValues` for secure randomness
  if (isBrowser) {
    window.crypto.getRandomValues(_uint32Arr)
    // Convert the random Uint32 value to a string:
    str = _uint32Arr[0].toString()
  }
  // If running in Node.js, use the Node `crypto` module to generate random bytes
  else if (isNode) {
    // node:
    // Import `crypto` and generate 5 random bytes, then convert to hexadecimal string
    // @ts-ignore
    str = require('crypto').randomBytes(5).toString('hex')
  }
  // If neither environment is detected, log an error
  else {
    // throw error
    console.error('@builtwithjavascript/uniqueId: Not a browser nor Node environment.')
  }

  // Ensure the random string `str` is at least 10 characters long,
  // padding with leading zeros if necessary
  if (str.length < 10) {
    str = str.padStart(10, '0')
  }

  // Combine the 13-digit millisecond timestamp
  // and the 10-character random string to form the unique ID
  return `${ms}${str}`
}

export const useUniqueId = () => {
  return {
    // Generate a raw unique ID based on the current time or a provided timestamp
    rawUniqueId: (time?: number) => {
      // Use the provided `time` or the current timestamp if none is provided
      return _id(time || new Date().getTime())
    },
    // Generate a compressed unique ID by encoding the raw ID in base-36
    encodeId: (value: string) => {
      // Compress the value by converting it to a base-36 string representation
      return BigInt(value).toString(36)
    },
    // Generate a compressed unique ID by encoding the raw ID in base-36
    encodedId: (time?: number) => {
      const result = _id(time || new Date().getTime())
      // Compress the raw ID by converting it to a base-36 string representation
      return BigInt(result).toString(36)
    },
    // Decode an encoded ID back to its original numeric string (base-10)
    decodeId: (value: string | number) => {
      // Convert the base-36 encoded string back to base-10 using `reduce`
      // Each character is converted from base-36 and accumulated into the final base-10 result
      const arr = `${value}`.split('')
      return arr.reduce((acc, char) => acc * BigInt(36) + BigInt(parseInt(char, 36)), BigInt(0)).toString(10)
    }
  }
}
