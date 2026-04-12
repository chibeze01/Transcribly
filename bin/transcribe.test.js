'use strict';

const fs = require('fs');
const { resolveApiKey, run, _deps } = require('./cli');

// ── fluent-ffmpeg mock (module-level, shared — chain methods re-cleared in beforeEach) ──

const mockFfmpegChain = {
  setStartTime: jest.fn().mockReturnThis(),
  setDuration: jest.fn().mockReturnThis(),
  output: jest.fn().mockReturnThis(),
  audioCodec: jest.fn().mockReturnThis(),
  on: jest.fn().mockImplementation(function (event, cb) {
    if (event === 'end') setImmediate(cb);
    return this;
  }),
  run: jest.fn(),
};
const mockFfmpeg = jest.fn(() => mockFfmpegChain);
mockFfmpeg.ffprobe = jest.fn();
jest.mock('fluent-ffmpeg', () => mockFfmpeg);

// Save originals so afterEach can fully restore _deps
const originalGetYtDlp = _deps.getYtDlp;
const originalGetOpenAI = _deps.getOpenAI;

// ── Shared helpers ────────────────────────────────────────────────────────────

function makeOpenAIMock(transcript) {
  const mockCreate = jest.fn().mockResolvedValue(transcript);
  const MockOpenAI = jest.fn().mockImplementation(() => ({
    audio: { transcriptions: { create: mockCreate } },
  }));
  return { mockCreate, MockOpenAI };
}

function setupFsMocks(sizeBytes = 1 * 1024 * 1024) {
  jest.spyOn(fs, 'statSync').mockReturnValue({ size: sizeBytes });
  jest.spyOn(fs, 'mkdtempSync').mockReturnValue('/tmp/transcribly-test');
  jest.spyOn(fs, 'rmSync').mockImplementation(() => {});
  jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream');
}

// ── resolveApiKey unit tests ──────────────────────────────────────────────────

describe('resolveApiKey', () => {
  const savedEnv = process.env.OPENAI_API_KEY;
  let stderrSpy;

  beforeEach(() => {
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code) => {
      throw new Error(`process.exit(${code})`);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    if (savedEnv === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = savedEnv;
  });

  test('returns key from --api-key option', () => {
    const key = resolveApiKey({ apiKey: 'sk-test-flag' });
    expect(key).toBe('sk-test-flag');
  });

  test('returns key from OPENAI_API_KEY env var', () => {
    process.env.OPENAI_API_KEY = 'sk-test-env';
    const key = resolveApiKey({});
    expect(key).toBe('sk-test-env');
  });

  test('prefers --api-key over env var', () => {
    process.env.OPENAI_API_KEY = 'sk-env';
    const key = resolveApiKey({ apiKey: 'sk-flag' });
    expect(key).toBe('sk-flag');
  });

  test('writes OPENAI_API_KEY error message to stderr when key missing', () => {
    delete process.env.OPENAI_API_KEY;
    try { resolveApiKey({}); } catch (_) {}
    expect(stderrSpy).toHaveBeenCalledWith(expect.stringContaining('OPENAI_API_KEY'));
  });

  test('exits with code 1 when API key is missing', () => {
    delete process.env.OPENAI_API_KEY;
    expect(() => resolveApiKey({})).toThrow('process.exit(1)');
  });
});

// ── run() — small file transcription ─────────────────────────────────────────

describe('run() — small file transcription', () => {
  let stderrSpy, stdoutSpy, mockYtDlp, mockCreate;

  beforeEach(() => {
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`exit:${code}`); });

    setupFsMocks(1 * 1024 * 1024); // 1 MB — below 24 MB threshold, no chunking

    mockYtDlp = jest.fn()
      .mockResolvedValueOnce({ id: 'abc123', title: 'Test Video', duration: 120 })
      .mockResolvedValueOnce(undefined);
    _deps.getYtDlp = jest.fn().mockResolvedValue(mockYtDlp);

    const openai = makeOpenAIMock('Hello world transcript');
    mockCreate = openai.mockCreate;
    _deps.getOpenAI = jest.fn().mockResolvedValue(openai.MockOpenAI);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    _deps.getYtDlp = originalGetYtDlp;
    _deps.getOpenAI = originalGetOpenAI;
  });

  test('calls yt-dlp twice — info fetch then audio download', async () => {
    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test' });
    expect(mockYtDlp).toHaveBeenCalledTimes(2);
  });

  test('calls OpenAI transcription once for small file', async () => {
    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test' });
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  test('writes transcript to stdout', async () => {
    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test' });
    expect(stdoutSpy).toHaveBeenCalledWith(expect.stringContaining('Hello world transcript'));
  });

  test('writes title, duration, and word count metadata to stderr', async () => {
    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test' });
    const stderrOutput = stderrSpy.mock.calls.map((c) => c[0]).join('');
    expect(stderrOutput).toContain('Test Video');
    expect(stderrOutput).toContain('120');
    expect(stderrOutput).toContain('Words:');
  });

  test('cleans up temp dir after success', async () => {
    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test' });
    expect(fs.rmSync).toHaveBeenCalledWith(
      '/tmp/transcribly-test',
      expect.objectContaining({ recursive: true })
    );
  });

  test('verbose mode writes download and transcription progress to stderr', async () => {
    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test', verbose: true });
    const stderrOutput = stderrSpy.mock.calls.map((c) => c[0]).join('');
    expect(stderrOutput).toContain('Downloading audio from YouTube');
    expect(stderrOutput).toContain('Audio downloaded');
    expect(stderrOutput).toContain('Transcribing');
  });

  test('uses fallback values when video info fields are missing', async () => {
    const partialYtDlp = jest.fn()
      .mockResolvedValueOnce({}) // no id, title, or duration
      .mockResolvedValueOnce(undefined);
    _deps.getYtDlp = jest.fn().mockResolvedValue(partialYtDlp);

    await run('https://www.youtube.com/watch?v=abc123', { apiKey: 'sk-test', json: true });
    const json = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(json.videoId).toBe('unknown');
    expect(json.title).toBe('untitled');
    expect(json.duration).toBe(0);
  });
});

// ── run() — output formatting ─────────────────────────────────────────────────

describe('run() — output formatting', () => {
  let stdoutSpy;

  beforeEach(() => {
    jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`exit:${code}`); });

    setupFsMocks(1 * 1024 * 1024);

    const mockYtDlp = jest.fn()
      .mockResolvedValueOnce({ id: 'vid001', title: 'Format Test', duration: 60 })
      .mockResolvedValueOnce(undefined);
    _deps.getYtDlp = jest.fn().mockResolvedValue(mockYtDlp);

    const { MockOpenAI } = makeOpenAIMock('one two three four five');
    _deps.getOpenAI = jest.fn().mockResolvedValue(MockOpenAI);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    _deps.getYtDlp = originalGetYtDlp;
    _deps.getOpenAI = originalGetOpenAI;
  });

  test('plain text mode: stdout gets raw transcript + newline', async () => {
    await run('https://www.youtube.com/watch?v=vid001', { apiKey: 'sk-test' });
    expect(stdoutSpy).toHaveBeenCalledWith('one two three four five\n');
  });

  test('--json mode: stdout gets valid JSON', async () => {
    await run('https://www.youtube.com/watch?v=vid001', { apiKey: 'sk-test', json: true });
    const written = stdoutSpy.mock.calls[0][0];
    expect(() => JSON.parse(written)).not.toThrow();
  });

  test('--json mode: JSON contains all required fields', async () => {
    await run('https://www.youtube.com/watch?v=vid001', { apiKey: 'sk-test', json: true });
    const json = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(json).toMatchObject({
      videoId: 'vid001',
      title: 'Format Test',
      duration: 60,
      transcript: 'one two three four five',
    });
    expect(typeof json.wordCount).toBe('number');
  });

  test('--json mode: wordCount matches actual word count of transcript', async () => {
    await run('https://www.youtube.com/watch?v=vid001', { apiKey: 'sk-test', json: true });
    const json = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(json.wordCount).toBe(5);
  });
});

// ── run() — audio chunking (large file > 24 MB) ───────────────────────────────

describe('run() — audio chunking', () => {
  let stdoutSpy, stderrSpy, mockCreate;
  const CHUNK_TRANSCRIPTS = ['chunk one', 'chunk two', 'chunk three'];

  beforeEach(() => {
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`exit:${code}`); });

    // 30 MB — above 24 MB threshold, triggers chunking
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 30 * 1024 * 1024 });
    // First mkdtempSync call = main tmpDir, second = chunk dir inside splitAudio
    jest.spyOn(fs, 'mkdtempSync')
      .mockReturnValueOnce('/tmp/main-dir')
      .mockReturnValueOnce('/tmp/chunk-dir');
    jest.spyOn(fs, 'rmSync').mockImplementation(() => {});
    jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream');

    // ffprobe returns 400s duration; ffmpeg chain fires 'end' asynchronously
    mockFfmpeg.ffprobe.mockReset().mockImplementation((filePath, cb) =>
      cb(null, { format: { duration: 400 } })
    );
    mockFfmpegChain.setStartTime.mockClear();
    mockFfmpegChain.setDuration.mockClear();
    mockFfmpegChain.output.mockClear();
    mockFfmpegChain.audioCodec.mockClear();
    mockFfmpegChain.on.mockClear().mockImplementation(function (event, cb) {
      if (event === 'end') setImmediate(cb);
      return this;
    });
    mockFfmpegChain.run.mockClear();

    const mockYtDlp = jest.fn()
      .mockResolvedValueOnce({ id: 'bigvid', title: 'Big Video', duration: 400 })
      .mockResolvedValueOnce(undefined);
    _deps.getYtDlp = jest.fn().mockResolvedValue(mockYtDlp);

    let callIdx = 0;
    mockCreate = jest.fn().mockImplementation(() =>
      Promise.resolve(CHUNK_TRANSCRIPTS[callIdx++])
    );
    const MockOpenAI = jest.fn().mockImplementation(() => ({
      audio: { transcriptions: { create: mockCreate } },
    }));
    _deps.getOpenAI = jest.fn().mockResolvedValue(MockOpenAI);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    _deps.getYtDlp = originalGetYtDlp;
    _deps.getOpenAI = originalGetOpenAI;
  });

  test('calls OpenAI transcription 3 times for 400s audio (180s chunks)', async () => {
    await run('https://www.youtube.com/watch?v=bigvid', { apiKey: 'sk-test' });
    expect(mockCreate).toHaveBeenCalledTimes(3);
  });

  test('assembles all chunk transcripts joined by space', async () => {
    await run('https://www.youtube.com/watch?v=bigvid', { apiKey: 'sk-test' });
    expect(stdoutSpy).toHaveBeenCalledWith('chunk one chunk two chunk three\n');
  });

  test('passes correct start times to ffmpeg: 0, 180, 360', async () => {
    await run('https://www.youtube.com/watch?v=bigvid', { apiKey: 'sk-test' });
    const startTimes = mockFfmpegChain.setStartTime.mock.calls.map((c) => c[0]);
    expect(startTimes).toEqual([0, 180, 360]);
  });

  test('passes correct durations to ffmpeg: 180, 180, 40', async () => {
    await run('https://www.youtube.com/watch?v=bigvid', { apiKey: 'sk-test' });
    const durations = mockFfmpegChain.setDuration.mock.calls.map((c) => c[0]);
    expect(durations).toEqual([180, 180, 40]);
  });

  test('verbose mode logs split and chunk progress to stderr', async () => {
    // Need fresh mkdtempSync mocks for this test
    jest.spyOn(fs, 'mkdtempSync')
      .mockReturnValueOnce('/tmp/main-dir-v')
      .mockReturnValueOnce('/tmp/chunk-dir-v');

    await run('https://www.youtube.com/watch?v=bigvid', { apiKey: 'sk-test', verbose: true });
    const stderrOutput = stderrSpy.mock.calls.map((c) => c[0]).join('');
    expect(stderrOutput).toContain('Splitting audio into chunks');
    expect(stderrOutput).toContain('Split into 3 chunks');
    expect(stderrOutput).toContain('Transcribing chunk');
  });
});

// ── run() — error handling ────────────────────────────────────────────────────

describe('run() — error handling', () => {
  let stderrSpy;

  beforeEach(() => {
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`exit:${code}`); });

    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 1 * 1024 * 1024 });
    jest.spyOn(fs, 'mkdtempSync').mockReturnValue('/tmp/err-test');
    jest.spyOn(fs, 'rmSync').mockImplementation(() => {});
    jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream');

    const mockYtDlp = jest.fn()
      .mockResolvedValueOnce({ id: 'errvid', title: 'Error Video', duration: 30 })
      .mockResolvedValueOnce(undefined);
    _deps.getYtDlp = jest.fn().mockResolvedValue(mockYtDlp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    _deps.getYtDlp = originalGetYtDlp;
    _deps.getOpenAI = originalGetOpenAI;
  });

  test('propagates network error from OpenAI', async () => {
    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({
        audio: { transcriptions: { create: jest.fn().mockRejectedValue(new Error('Network error')) } },
      }))
    );
    await expect(run('https://www.youtube.com/watch?v=errvid', { apiKey: 'sk-test' }))
      .rejects.toThrow('Network error');
  });

  test('cleans up temp dir even when transcription fails', async () => {
    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({
        audio: { transcriptions: { create: jest.fn().mockRejectedValue(new Error('fail')) } },
      }))
    );
    await expect(run('https://www.youtube.com/watch?v=errvid', { apiKey: 'sk-test' }))
      .rejects.toThrow();
    expect(fs.rmSync).toHaveBeenCalledWith(
      '/tmp/err-test',
      expect.objectContaining({ recursive: true })
    );
  });

  test('propagates 429 rate-limit error', async () => {
    const err = Object.assign(new Error('Rate limit exceeded'), { status: 429 });
    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({
        audio: { transcriptions: { create: jest.fn().mockRejectedValue(err) } },
      }))
    );
    await expect(run('https://www.youtube.com/watch?v=errvid', { apiKey: 'sk-test' }))
      .rejects.toMatchObject({ status: 429 });
  });

  test('propagates 401 invalid API key error', async () => {
    const err = Object.assign(new Error('Unauthorized'), { status: 401 });
    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({
        audio: { transcriptions: { create: jest.fn().mockRejectedValue(err) } },
      }))
    );
    await expect(run('https://www.youtube.com/watch?v=errvid', { apiKey: 'sk-test' }))
      .rejects.toMatchObject({ status: 401 });
  });

  test('propagates yt-dlp download failure', async () => {
    const failYtDlp = jest.fn()
      .mockResolvedValueOnce({ id: 'errvid', title: 'Error Video', duration: 30 })
      .mockRejectedValueOnce(new Error('Download failed'));
    _deps.getYtDlp = jest.fn().mockResolvedValue(failYtDlp);
    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({
        audio: { transcriptions: { create: jest.fn() } },
      }))
    );
    await expect(run('https://www.youtube.com/watch?v=errvid', { apiKey: 'sk-test' }))
      .rejects.toThrow('Download failed');
  });

  test('exits with code 1 on non-YouTube URL', async () => {
    await expect(run('https://vimeo.com/123', { apiKey: 'sk-test' }))
      .rejects.toThrow('exit:1');
  });

  test('writes "Invalid YouTube URL" to stderr for non-YouTube URL', async () => {
    try { await run('https://vimeo.com/123', { apiKey: 'sk-test' }); } catch (_) {}
    expect(stderrSpy).toHaveBeenCalledWith(
      expect.stringContaining('Invalid YouTube URL')
    );
  });

  test('propagates ffprobe error when probing large audio file', async () => {
    // Override statSync to return large file — triggers getAudioDuration path
    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 30 * 1024 * 1024 });
    jest.spyOn(fs, 'mkdtempSync')
      .mockReturnValueOnce('/tmp/main-err')
      .mockReturnValueOnce('/tmp/chunk-err');

    mockFfmpeg.ffprobe.mockReset().mockImplementation((filePath, cb) =>
      cb(new Error('ffprobe failed'), null)
    );
    mockFfmpegChain.on.mockClear().mockImplementation(function (event, cb) {
      if (event === 'end') setImmediate(cb);
      return this;
    });

    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({ audio: { transcriptions: { create: jest.fn() } } }))
    );

    await expect(run('https://www.youtube.com/watch?v=errvid', { apiKey: 'sk-test' }))
      .rejects.toThrow('Failed to probe audio');
  });
});

// ── splitAudioChunk — ffmpeg error event ──────────────────────────────────────

describe('splitAudioChunk — ffmpeg error path', () => {
  beforeEach(() => {
    jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
    jest.spyOn(process, 'exit').mockImplementation((code) => { throw new Error(`exit:${code}`); });

    jest.spyOn(fs, 'statSync').mockReturnValue({ size: 30 * 1024 * 1024 });
    jest.spyOn(fs, 'mkdtempSync')
      .mockReturnValueOnce('/tmp/main-ffmperr')
      .mockReturnValueOnce('/tmp/chunk-ffmperr');
    jest.spyOn(fs, 'rmSync').mockImplementation(() => {});
    jest.spyOn(fs, 'createReadStream').mockReturnValue('mock-stream');

    mockFfmpeg.ffprobe.mockReset().mockImplementation((filePath, cb) =>
      cb(null, { format: { duration: 180 } })
    );

    // Trigger error event instead of end event
    mockFfmpegChain.setStartTime.mockClear().mockReturnThis();
    mockFfmpegChain.setDuration.mockClear().mockReturnThis();
    mockFfmpegChain.output.mockClear().mockReturnThis();
    mockFfmpegChain.audioCodec.mockClear().mockReturnThis();
    mockFfmpegChain.on.mockClear().mockImplementation(function (event, cb) {
      if (event === 'error') setImmediate(() => cb(new Error('ffmpeg encoding failed')));
      return this;
    });
    mockFfmpegChain.run.mockClear();

    const mockYtDlp = jest.fn()
      .mockResolvedValueOnce({ id: 'ffmperrvid', title: 'FFmpeg Error Video', duration: 180 })
      .mockResolvedValueOnce(undefined);
    _deps.getYtDlp = jest.fn().mockResolvedValue(mockYtDlp);
    _deps.getOpenAI = jest.fn().mockResolvedValue(
      jest.fn().mockImplementation(() => ({
        audio: { transcriptions: { create: jest.fn() } },
      }))
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
    _deps.getYtDlp = originalGetYtDlp;
    _deps.getOpenAI = originalGetOpenAI;
  });

  test('rejects with "Failed to split audio" when ffmpeg fires error event', async () => {
    await expect(run('https://www.youtube.com/watch?v=ffmperrvid', { apiKey: 'sk-test' }))
      .rejects.toThrow('Failed to split audio');
  });
});

