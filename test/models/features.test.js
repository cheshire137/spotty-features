import Features from '../../src/models/features'

describe('Features', () => {
  test('defines a color for every field', () => {
    expect(Features.fields).toBeInstanceOf(Array)
    expect(Features.fields.length).toBeGreaterThan(0)

    for (const field of Features.fields) {
      expect(Features.colors[field]).toBeDefined()
      expect(Features.colors[field].length).toBeGreaterThan(0)
    }
  })

  test('defines a label for every field', () => {
    expect(Features.fields).toBeInstanceOf(Array)
    expect(Features.fields.length).toBeGreaterThan(0)

    for (const field of Features.fields) {
      expect(Features.labels[field]).toBeDefined()
      expect(Features.labels[field].length).toBeGreaterThan(0)
    }
  })
})
