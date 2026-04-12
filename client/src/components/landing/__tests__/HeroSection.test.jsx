import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroSection from '../HeroSection';

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: jest.fn().mockResolvedValue(undefined) },
    writable: true,
  });
});

it('renders the main headline', () => {
  render(<HeroSection />);
  expect(screen.getByText(/Transcribe anything\./)).toBeInTheDocument();
});

it('renders the npx command', () => {
  render(<HeroSection />);
  expect(screen.getByText(/npx transcribly/)).toBeInTheDocument();
});

it('renders Get started button linking to #demo', () => {
  render(<HeroSection />);
  const link = screen.getByRole('link', { name: /Get started/ });
  expect(link).toHaveAttribute('href', '#demo');
});

it('renders all three stat labels', () => {
  render(<HeroSection />);
  expect(screen.getByText(/avg transcription/)).toBeInTheDocument();
  expect(screen.getByText(/auto-chunked audio/)).toBeInTheDocument();
  expect(screen.getByText(/stdout output/)).toBeInTheDocument();
});

it('copies command to clipboard on copy click', async () => {
  render(<HeroSection />);
  userEvent.click(screen.getByText('copy'));
  await screen.findByText('copied!');
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith('npx transcribly <youtube-url>');
});

it('shows "copied!" after clicking copy', async () => {
  render(<HeroSection />);
  userEvent.click(screen.getByText('copy'));
  expect(await screen.findByText('copied!')).toBeInTheDocument();
});
