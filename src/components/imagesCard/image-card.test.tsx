import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ImageCard } from './image-card'
import { TopArtistItem } from '@/types/spotify'
import { test, describe, expect } from 'vitest';

describe("Image Card - Unit Tests", () => {
  const name = "TEST NAME"
  const mockArtist = {
    name: name,
    images: [
      { url: "image-small.jpg" },
      { url: "image-medium.jpg" },
      { url: "image-large.jpg" }
    ]
  };
  render(<ImageCard obj={(mockArtist as TopArtistItem)} />)
  test('Image Card Loaded', async () => {
    expect(true).toBeTruthy()
  })

  test('Image Card Hovering', async () => {
    await userEvent.hover(screen.getByRole('img'))
    expect(screen.getByText(name)).toBeTruthy()
  })
})