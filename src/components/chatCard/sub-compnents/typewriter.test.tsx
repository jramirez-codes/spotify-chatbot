import { render, screen } from '@testing-library/react'
import { test, describe, expect } from 'vitest';
import { Typewriter } from './typewriter';

describe("Typewriter - Unit Tests", () => {
  test('Typewriter typing disabled', async () => {
    render(< Typewriter text="test" speed={1} typeEnabled={false} setGenreRenderFlag={()=>{}}/>)
    expect(screen.getAllByText('test')).toBeTruthy()
  })
  test('Typewriter typing disabled', async () => {
    render(< Typewriter text="test" speed={1} typeEnabled={true} setGenreRenderFlag={()=>{}}/>)
    await new Promise(r => setTimeout(r, 250));
    expect(screen.getAllByText('test')).toBeTruthy()
  })
})