import { createContext, useContext, useState } from 'react';

const PackageManagerContext = createContext(null);

export function PackageManagerProvider({ children }) {
  const [pm, setPm] = useState('npm');
  return (
    <PackageManagerContext.Provider value={{ pm, setPm }}>
      {children}
    </PackageManagerContext.Provider>
  );
}

export function usePackageManager() {
  const ctx = useContext(PackageManagerContext);
  if (!ctx) {
    throw new Error('usePackageManager must be used inside <PackageManagerProvider>');
  }
  return ctx;
}

export function getRunCmd(pm) {
  return pm === 'bun' ? 'bunx' : 'npx';
}

export function getInstallCmd(pm) {
  return pm === 'bun' ? 'bun add -g transcribly' : 'npm install -g transcribly';
}
