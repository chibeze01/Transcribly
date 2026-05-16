import { render, screen } from '@testing-library/react';
import FeaturesSection from '../FeaturesSection';
import { PackageManagerProvider } from '../../../context/PackageManagerContext';

const renderFeatures = () =>
  render(
    <PackageManagerProvider>
      <FeaturesSection />
    </PackageManagerProvider>
  );

it('renders the section heading', () => {
  renderFeatures();
  expect(screen.getByText(/Built for developers/)).toBeInTheDocument();
});

it('renders Zero setup card', () => {
  renderFeatures();
  expect(screen.getByText('Zero setup')).toBeInTheDocument();
});

it('renders Any length video card', () => {
  renderFeatures();
  expect(screen.getByText('Any length video')).toBeInTheDocument();
});

it('renders Pipe-ready output card', () => {
  renderFeatures();
  expect(screen.getByText('Pipe-ready output')).toBeInTheDocument();
});

it('renders three feature cards', () => {
  renderFeatures();
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

it('renders WHY TRANSCRIBLY label', () => {
  renderFeatures();
  expect(screen.getByText('WHY TRANSCRIBLY')).toBeInTheDocument();
});
