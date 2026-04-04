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

// Mock canvas getContext for jsdom (no real Canvas support)
HTMLCanvasElement.prototype.getContext = function () {
  return {
    clearRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    fillStyle: '',
    shadowBlur: 0,
    shadowColor: '',
    scale: () => {},
    createLinearGradient: () => ({
      addColorStop: () => {},
    }),
  };
};
