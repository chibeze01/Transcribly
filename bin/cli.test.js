const { execFileSync } = require('child_process');
const path = require('path');

const CLI_PATH = path.resolve(__dirname, 'cli.js');

function run(args = [], env = {}) {
  try {
    const stdout = execFileSync(process.execPath, [CLI_PATH, ...args], {
      env: { ...process.env, ...env, OPENAI_API_KEY: env.OPENAI_API_KEY || '' },
      timeout: 10000,
      encoding: 'utf8',
    });
    return { stdout, stderr: '', exitCode: 0 };
  } catch (err) {
    return {
      stdout: (err.stdout || '').toString(),
      stderr: (err.stderr || '').toString(),
      exitCode: err.status,
    };
  }
}

// ── Unit tests for isYouTubeUrl (exported for testing) ──

let isYouTubeUrl;
try {
  ({ isYouTubeUrl } = require('./cli'));
} catch {
  // Module doesn't exist yet — tests will fail (RED phase)
}

describe('isYouTubeUrl', () => {
  test('accepts standard youtube.com watch URL', () => {
    expect(isYouTubeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
  });

  test('accepts youtu.be short URL', () => {
    expect(isYouTubeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
  });

  test('accepts youtube.com without www', () => {
    expect(isYouTubeUrl('https://youtube.com/watch?v=abc123')).toBe(true);
  });

  test('accepts http (not https)', () => {
    expect(isYouTubeUrl('http://www.youtube.com/watch?v=abc')).toBe(true);
  });

  test('rejects empty string', () => {
    expect(isYouTubeUrl('')).toBe(false);
  });

  test('rejects non-YouTube URL', () => {
    expect(isYouTubeUrl('https://vimeo.com/123456')).toBe(false);
  });

  test('rejects plain text', () => {
    expect(isYouTubeUrl('not a url')).toBe(false);
  });
});

// ── Integration tests via CLI subprocess ──

describe('CLI --help', () => {
  test('shows usage info with transcribly <youtube-url>', () => {
    const result = run(['--help']);
    const output = result.stdout + result.stderr;
    expect(output).toMatch(/transcribly/i);
    expect(output).toMatch(/youtube-url/i);
  });

  test('exits with code 0', () => {
    const result = run(['--help']);
    expect(result.exitCode).toBe(0);
  });
});

describe('CLI --version', () => {
  test('prints version number', () => {
    const result = run(['--version']);
    const output = result.stdout + result.stderr;
    expect(output).toMatch(/\d+\.\d+\.\d+/);
  });

  test('exits with code 0', () => {
    const result = run(['--version']);
    expect(result.exitCode).toBe(0);
  });
});

describe('CLI with no args', () => {
  test('shows usage help', () => {
    const result = run([]);
    const output = result.stdout + result.stderr;
    expect(output).toMatch(/usage/i);
  });

  test('exits with non-zero code', () => {
    const result = run([]);
    expect(result.exitCode).not.toBe(0);
  });
});

describe('CLI with invalid URL', () => {
  test('shows error about invalid YouTube URL', () => {
    const result = run(['https://vimeo.com/123'], { OPENAI_API_KEY: 'test-key' });
    expect(result.stderr).toMatch(/invalid.*youtube/i);
  });

  test('exits with code 1', () => {
    const result = run(['https://vimeo.com/123'], { OPENAI_API_KEY: 'test-key' });
    expect(result.exitCode).toBe(1);
  });
});

describe('CLI with missing API key', () => {
  test('shows error about OPENAI_API_KEY', () => {
    const result = run(['https://www.youtube.com/watch?v=dQw4w9WgXcQ'], { OPENAI_API_KEY: '' });
    expect(result.stderr).toMatch(/OPENAI_API_KEY/);
  });

  test('shows setup instructions', () => {
    const result = run(['https://www.youtube.com/watch?v=dQw4w9WgXcQ'], { OPENAI_API_KEY: '' });
    expect(result.stderr).toMatch(/export OPENAI_API_KEY/);
  });

  test('exits with code 1', () => {
    const result = run(['https://www.youtube.com/watch?v=dQw4w9WgXcQ'], { OPENAI_API_KEY: '' });
    expect(result.exitCode).toBe(1);
  });
});

describe('CLI --json flag with missing API key', () => {
  test('still reports API key error (not a JSON parse error)', () => {
    const result = run(['https://www.youtube.com/watch?v=dQw4w9WgXcQ', '--json'], { OPENAI_API_KEY: '' });
    expect(result.stderr).toMatch(/OPENAI_API_KEY/);
    expect(result.exitCode).toBe(1);
  });
});
