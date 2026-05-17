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

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

HTMLCanvasElement.prototype.getContext = function () {
  return {
    clearRect: () => {},
    fillRect: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    fillText: () => {},
    setTransform: () => {},
    scale: () => {},
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    font: '',
    shadowBlur: 0,
    shadowColor: '',
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
  };
};
