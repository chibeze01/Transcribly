import { render, screen, act } from '@testing-library/react';
import App from './App';

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  act(() => jest.runAllTimers());
  jest.useRealTimers();
});

test('renders landing page', () => {
  render(<App />);
  expect(screen.getAllByText('transcribly').length).toBeGreaterThan(0);
});
