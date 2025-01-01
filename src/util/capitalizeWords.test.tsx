import { test, describe, expect } from 'vitest';
import { capitalizeWords } from './capitalizeWords';

describe("Capitalized Words - Unit Tests", () => {
  test('Word Capitalized', async () => {
    expect(capitalizeWords('rap')).toBe('Rap')
  })
})