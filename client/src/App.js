import Landing from './pages/Landing';
import { PackageManagerProvider } from './context/PackageManagerContext';

function App() {
  return (
    <PackageManagerProvider>
      <Landing />
    </PackageManagerProvider>
  );
}

export default App;
