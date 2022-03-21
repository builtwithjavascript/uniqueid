import { useUniqueId } from '@/uniqueid'

describe('id', () => {
  const unique = useUniqueId()

  it('should return value with expected length', () => {
    const result = unique.id()
    expect(result.length).toEqual(23)
  })

  it('should return expected value', () => {
    // testing 250,000 different ids
    const attempts = 250000
    const results = []
    for (let i = 0; i < attempts; i++) {
      const value = unique.id()
      results.push(value)
    }

    const distinctResults = new Set([...results])
    expect(results.length).toEqual(distinctResults.size)
  })
})
