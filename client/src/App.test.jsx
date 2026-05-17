import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

test('renders landing page', () => {
  render(<App />);
  expect(screen.getAllByText('transcribly').length).toBeGreaterThan(0);
});
