const { replaceVars } = require('../src/replace');

describe('replaceVars', () => {
  test('replaces simple placeholders', () => {
    const content = 'Hello __NAME__, welcome to __PLACE__!';
    const vars = { NAME: 'World', PLACE: 'Berlin' };
    expect(replaceVars(content, vars)).toBe('Hello World, welcome to Berlin!');
  });

  test('handles pipe character in value', () => {
    const content = 'TOKEN: "__API_TOKEN__"';
    const vars = { API_TOKEN: 'part1|part2' };
    expect(replaceVars(content, vars)).toBe('TOKEN: "part1|part2"');
  });

  test('handles ampersand in value', () => {
    const content = 'URL: "__CALLBACK_URL__"';
    const vars = { CALLBACK_URL: 'https://example.com?foo=1&bar=2' };
    expect(replaceVars(content, vars)).toBe('URL: "https://example.com?foo=1&bar=2"');
  });

  test('handles forward slashes in value', () => {
    const content = 'PATH: __FILE_PATH__';
    const vars = { FILE_PATH: '/usr/local/bin/app' };
    expect(replaceVars(content, vars)).toBe('PATH: /usr/local/bin/app');
  });

  test('handles backslashes in value', () => {
    const content = 'REGEX: "__PATTERN__"';
    const vars = { PATTERN: 'foo\\bar\\baz' };
    expect(replaceVars(content, vars)).toBe('REGEX: "foo\\bar\\baz"');
  });

  test('handles dollar signs in value', () => {
    const content = 'PRICE: __AMOUNT__';
    const vars = { AMOUNT: '$99.99' };
    expect(replaceVars(content, vars)).toBe('PRICE: $99.99');
  });

  test('handles multiple occurrences of same placeholder', () => {
    const content = '__APP__-config-__APP__';
    const vars = { APP: 'myapp' };
    expect(replaceVars(content, vars)).toBe('myapp-config-myapp');
  });

  test('leaves unmatched placeholders untouched', () => {
    const content = '__KNOWN__ and __UNKNOWN__';
    const vars = { KNOWN: 'found' };
    expect(replaceVars(content, vars)).toBe('found and __UNKNOWN__');
  });

  test('handles empty value', () => {
    const content = 'VAL: "__EMPTY__"';
    const vars = { EMPTY: '' };
    expect(replaceVars(content, vars)).toBe('VAL: ""');
  });

  test('handles value with newlines', () => {
    const content = 'KEY: __MULTILINE__';
    const vars = { MULTILINE: 'line1\nline2' };
    expect(replaceVars(content, vars)).toBe('KEY: line1\nline2');
  });

  test('handles combined FATHOM_API_TOKEN pattern with pipe', () => {
    const content = 'FATHOM_API_TOKEN: "__FATHOM_API_TOKEN_PART1__|__FATHOM_API_TOKEN_PART2__"';
    const vars = { FATHOM_API_TOKEN_PART1: 'abc123', FATHOM_API_TOKEN_PART2: 'def456' };
    expect(replaceVars(content, vars)).toBe('FATHOM_API_TOKEN: "abc123|def456"');
  });

  test('handles value containing placeholder-like strings', () => {
    const content = 'VAL: __KEY__';
    const vars = { KEY: '__OTHER__' };
    expect(replaceVars(content, vars)).toBe('VAL: __OTHER__');
  });

  test('skips invalid env var names', () => {
    const content = 'Hello __VALID__';
    const vars = { VALID: 'yes', '123INVALID': 'no', 'has space': 'no' };
    expect(replaceVars(content, vars)).toBe('Hello yes');
  });

  test('handles special regex characters in value', () => {
    const content = 'REGEX: __PATTERN__';
    const vars = { PATTERN: '.*+?^${}()|[]\\' };
    expect(replaceVars(content, vars)).toBe('REGEX: .*+?^${}()|[]\\');
  });

  test('handles real-world k8s deployment template', () => {
    const content = [
      'apiVersion: v1',
      'kind: ConfigMap',
      'metadata:',
      '  name: __PROJECT__-config-__APP_ENV__',
      '  namespace: __PROJECT__',
      'data:',
      '  DB_PASSWORD: __DB_PASSWORD__',
      '  FATHOM_API_TOKEN: "__FATHOM_PART1__|__FATHOM_PART2__"',
      '  APP_URL: "https://__DOMAIN__"',
    ].join('\n');

    const vars = {
      PROJECT: 'nudgio',
      APP_ENV: 'stage',
      DB_PASSWORD: 'p@ss|w0rd&special/chars',
      FATHOM_PART1: 'token|part1',
      FATHOM_PART2: 'token|part2',
      DOMAIN: 'app.nudgio.dev',
    };

    const expected = [
      'apiVersion: v1',
      'kind: ConfigMap',
      'metadata:',
      '  name: nudgio-config-stage',
      '  namespace: nudgio',
      'data:',
      '  DB_PASSWORD: p@ss|w0rd&special/chars',
      '  FATHOM_API_TOKEN: "token|part1|token|part2"',
      '  APP_URL: "https://app.nudgio.dev"',
    ].join('\n');

    expect(replaceVars(content, vars)).toBe(expected);
  });
});
