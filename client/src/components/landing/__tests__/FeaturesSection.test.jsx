import { render, screen } from '@testing-library/react';
import FeaturesSection from '../FeaturesSection';

it('renders the section heading', () => {
  render(<FeaturesSection />);
  expect(screen.getByText(/Built for developers/)).toBeInTheDocument();
});

it('renders Zero setup card', () => {
  render(<FeaturesSection />);
  expect(screen.getByText('Zero setup')).toBeInTheDocument();
});

it('renders Any length video card', () => {
  render(<FeaturesSection />);
  expect(screen.getByText('Any length video')).toBeInTheDocument();
});

it('renders Pipe-ready output card', () => {
  render(<FeaturesSection />);
  expect(screen.getByText('Pipe-ready output')).toBeInTheDocument();
});

it('renders three feature cards', () => {
  render(<FeaturesSection />);
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

it('renders WHY TRANSCRIBLY label', () => {
  render(<FeaturesSection />);
  expect(screen.getByText('WHY TRANSCRIBLY')).toBeInTheDocument();
});
