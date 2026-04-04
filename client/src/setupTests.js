// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock framer-motion to render plain elements in tests
jest.mock('framer-motion', () => {
  const React = require('react');
  const motion = new Proxy(
    {},
    {
      get: (_target, prop) => {
        return React.forwardRef((props, ref) => {
          const { initial, animate, whileInView, whileHover, viewport, transition, ...rest } = props;
          return React.createElement(prop, { ...rest, ref });
        });
      },
    }
  );
  return {
    __esModule: true,
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

// Mock Three.js Canvas — jsdom has no WebGL
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => null,
  useFrame: () => {},
  useThree: () => ({}),
}));

jest.mock('@react-three/drei', () => ({
  Float: ({ children }) => children,
  Environment: () => null,
}));
