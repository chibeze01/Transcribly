import { render, screen, act, fireEvent } from '@testing-library/react';
import MockTerminal, { TYPING_SPEED } from '../MockTerminal';
import { PackageManagerProvider } from '../../../context/PackageManagerContext';

const FULL_CMD = 'npx transcribly https://youtube.com/watch?v=dQw4w9WgXcQ';
const AFTER_TYPING = 600 + FULL_CMD.length * TYPING_SPEED + 50;

const renderTerminal = () =>
  render(
    <PackageManagerProvider>
      <MockTerminal />
    </PackageManagerProvider>
  );

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  act(() => vi.runAllTimers());
  vi.useRealTimers();
});

it('renders the terminal chrome with bash title', () => {
  renderTerminal();
  expect(screen.getByText('bash — 80×24')).toBeInTheDocument();
});

it('renders the QUICK TRY section label', () => {
  renderTerminal();
  expect(screen.getByText('QUICK TRY')).toBeInTheDocument();
});

it('starts typing the command after initial delay', () => {
  renderTerminal();
  act(() => vi.advanceTimersByTime(600 + TYPING_SPEED * 5));
  expect(screen.getByText(/npx/)).toBeInTheDocument();
});

it('shows fetching status after typing completes', () => {
  renderTerminal();
  act(() => vi.advanceTimersByTime(AFTER_TYPING + 300));
  expect(screen.getByText(/Fetching audio from YouTube/)).toBeInTheDocument();
});

it('shows chunking status after fetching', () => {
  renderTerminal();
  act(() => vi.advanceTimersByTime(AFTER_TYPING + 300 + 1400 + 100));
  expect(screen.getByText(/Chunking audio into segments/)).toBeInTheDocument();
});

it('shows Done after transcription completes', () => {
  const doneTime = AFTER_TYPING + 200 + 1400 + 1200 + 100 * 60 + 400;
  renderTerminal();
  act(() => vi.advanceTimersByTime(doneTime));
  expect(screen.getByText('Done')).toBeInTheDocument();
  expect(screen.getByText(/4\.2s/)).toBeInTheDocument();
});

it('shows Rick Roll result block after done', () => {
  const resultTime = AFTER_TYPING + 200 + 1400 + 1200 + 100 * 60 + 900;
  renderTerminal();
  act(() => vi.advanceTimersByTime(resultTime));
  expect(screen.getByText(/Never Gonna Give You Up/)).toBeInTheDocument();
});

it('shows pipe hint after result', () => {
  const pipeTime = AFTER_TYPING + 200 + 1400 + 1200 + 100 * 60 + 900 + 1400 + 100;
  renderTerminal();
  act(() => vi.advanceTimersByTime(pipeTime));
  expect(screen.getByText(/pipe it anywhere/)).toBeInTheDocument();
});

it('renders the replay button', () => {
  renderTerminal();
  expect(screen.getByText(/replay/)).toBeInTheDocument();
});

it('resets animation when replay is clicked', () => {
  renderTerminal();
  act(() => vi.advanceTimersByTime(30000));
  fireEvent.click(screen.getByText(/replay/));
  expect(screen.queryByText(/Never Gonna Give You Up/)).not.toBeInTheDocument();
});
