import { useUniqueId } from '@/uniqueid'

/**
 * Test Suite for @builtwithjavascript/uniqueid
 *
 * This suite tests the functionality and reliability of the unique ID generator.
 *
 * 1. **rawUniqueId**:
 *    - Verifies that the generated raw ID has the expected length (23 characters).
 *    - Ensures uniqueness by checking that multiple generated raw IDs do not contain duplicates.
 *
 * 2. **uniqueId**:
 *    - Checks that the encoded ID produced with a fixed timestamp has a consistent length (15 characters).
 *    - Ensures uniqueness by verifying that multiple encoded IDs are unique.
 *
 * 3. **decodeBase36**:
 *    - Validates that decoding a known encoded value returns the expected original format.
 *    - Tests that decoding an encoded ID generated from a large timestamp correctly retains the timestamp's significant digits.
 *    - Confirms that invalid input is handled gracefully by either throwing an error or logging appropriately.
 *
 * These tests cover basic functionality, uniqueness, and edge cases, ensuring that @builtwithjavascript/uniqueid behaves as expected across various use cases.
 */

describe('rawUniqueId', () => {
  const { rawUniqueId } = useUniqueId()
  it('should return value with expected length', () => {
    const result = rawUniqueId()
    expect(result.length).toEqual(23)
  })

  it('should return unique values over multiple calls', () => {
    const attempts = 100000
    const results = []
    for (let i = 0; i < attempts; i++) {
      results.push(rawUniqueId())
    }

    const distinctResults = new Set(results)
    expect(results.length).toEqual(distinctResults.size)
  })
})

describe('uniqueId', () => {
  const { uniqueId } = useUniqueId()

  it('should return value with expected length', () => {
    const result = uniqueId(1731504230254) // using a hard-coded time here so i can always expect the same result length for the test
    expect(result.length).toEqual(15)
  })

  it('should return unique values over multiple calls', () => {
    const attempts = 250000
    const results = []
    for (let i = 0; i < attempts; i++) {
      results.push(uniqueId())
    }

    const distinctResults = new Set(results)
    expect(results.length).toEqual(distinctResults.size)
  })
})

describe('decodeBase36', () => {
  const { decodeBase36, uniqueId } = useUniqueId()

  it('should decoded value as expected', () => {
    const result = decodeBase36('2ti7knstydhbwxc')
    expect(result).toEqual('17315042302540352577648')
  })

  it('should handle edge case of very large timestamp', () => {
    const largeTimestamp = Number.MAX_SAFE_INTEGER
    const encodedValue = uniqueId(largeTimestamp)
    const decodedValue = decodeBase36(encodedValue)
    expect(decodedValue.startsWith(largeTimestamp.toString().slice(0, 13))).toBeTruthy()
  })

  it('should throw or handle gracefully for invalid encoded input', () => {
    expect(() => decodeBase36('invalid_characters!')).toThrow()
  })
})
