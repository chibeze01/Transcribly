import '@testing-library/jest-dom';

vi.mock('framer-motion', async () => {
  const { default: React } = await import('react');
  const motion = new Proxy({}, {
    get: (_, prop) => React.forwardRef((props, ref) => {
      const { initial, animate, whileInView, whileHover, viewport, transition, ...rest } = props;
      return React.createElement(prop, { ...rest, ref });
    }),
  });
  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

class IntersectionObserver {
  constructor(cb) { this._cb = cb; }
  observe() { this._cb([{ isIntersecting: true }]); }
  unobserve() {}
  disconnect() {}
}
window.IntersectionObserver = IntersectionObserver;

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
    createLinearGradient: () => ({ addColorStop: () => {} }),
  };
};
