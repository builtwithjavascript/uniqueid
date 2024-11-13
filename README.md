# @builtwithjavascript/uniqueid

[![npm version](https://badge.fury.io/js/@builtwithjavascript%2Funiqueid.svg)](https://badge.fury.io/js/@builtwithjavascript%2Funiqueid)

This is a powerful, flexible library for generating strong, unique identifiers. It provides IDs in two formats:

  - **Raw format** (via rawUniqueId()): A 23-character string that includes a timestamp and random components for uniqueness.
  - **Compressed format** (via uniqueId()): A shorter, base-36 encoded string containing the same information as the raw ID, ideal for compact storage.

Both formats are reversible. You can use decodeBase36() to convert a compressed ID back to its original raw format.

***Note**: This library is not intended to replace stronger or standardized solutions like GUIDs or UUIDs in scenarios requiring cryptographic security or guaranteed global uniqueness. Instead, `@builtwithjavascript/uniqueid` offers a lightweight and versatile alternative for cases where a unique identifier is needed but can be more compact and tailored to the environment.*

## Code base

TypeScript

## Installation

```shell
npm install @builtwithjavascript/uniqueid
```

## Usage

```typescript
import { useUniqueId } from '@builtwithjavascript/uniqueid'

const { rawUniqueId, uniqueId, decodeBase36 } = useUniqueId()

// Generate a raw unique ID
const rawId = rawUniqueId()
console.log(`Raw ID: ${rawId}`) // Example: 16856923123450012345678

// Generate a compressed (encoded) ID
const compressedId = uniqueId()
console.log(`Encoded ID: ${compressedId}`) // Example: '5yz1z9xn4dq'

// Decode the compressed ID back to the raw format
const decodedRawId = decodeBase36(compressedId)
console.log(`Decoded Raw ID: ${decodedRawId}`) // Should match the original raw ID
```


## How It Works
### Raw Unique ID Structure
The raw unique ID produced by rawUniqueId() is a 23-character string composed of:

  1. 13-character timestamp: Represents the time in milliseconds since the Unix epoch (January 1, 1970). This ensures IDs generated at different times are unique.
  2. 10-character random component: A cryptographically secure random number generated by crypto.getRandomValues (in the browser) or crypto.randomBytes (in Node.js). This adds entropy, preventing ID collisions even when generated simultaneously.

#### Example Raw ID: 16856923123450012345678

  - The first 13 characters (1685692312345) are the timestamp.
  - The next 10 characters (0012345678) are the secure random component.


### Compressed (Encoded) Unique ID Structure
When using uniqueId(), the library compresses the raw ID into a base-36 string to save space. This typically produces a string around 15 characters long, though the length may vary slightly depending on the input values.

  - **Encoding**: uniqueId() converts the 23-character raw ID into a shorter, more compact format using base-36 encoding. This is especially useful for storage and transmission where space is limited.
  - **Decoding**: decodeBase36() reverses the encoding process, converting the base-36 encoded ID back to its full 23-character raw format.

#### Example Encoded ID: 5yz1z9xn4dq


## API
### rawUniqueId(time?: number): string
Generates a 23-character raw unique ID. Optionally, you can pass a time parameter (in milliseconds since the epoch) to customize the timestamp component of the ID. If no time is provided, the current time is used.

### uniqueId(time?: number): string
Generates a compressed, base-36 encoded version of the raw unique ID. This produces a shorter string, ideal for storage where space is limited. Like rawUniqueId, you can optionally pass a time parameter to customize the timestamp.

### decodeBase36(value: string | number): string
Decodes a base-36 encoded ID back to the original 23-character raw unique ID.

## Examples
```typescript
const uniqueIdGenerator = useUniqueId()

// Generate IDs
const rawId = uniqueIdGenerator.rawUniqueId()
const shortId = uniqueIdGenerator.uniqueId()

// Decode an encoded ID
const originalRawId = uniqueIdGenerator.decodeBase36(shortId)
console.log(originalRawId === rawId) // true
```

## Why Use This Library?
  - **Compact yet reversible**: The uniqueId format offers a shorter ID while retaining the ability to retrieve the original raw value.
  - **Secure and collision-resistant**: With a combination of a high-resolution timestamp and secure random values, this library generates unique IDs with minimal collision risk, suitable for distributed systems or databases.
  - **Cross-platform compatibility**: Works in both Node.js and modern browsers, adapting to each environment's secure random number generator.

## License
MIT License
