import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { emoji, score, stripEmoji } from './grading.js';

function files(count, exts, changesEach) {
  return Array.from({ length: count }, (_, i) => ({
    filename: `file_${i}.${exts[i % exts.length]}`,
    changes: changesEach,
  }));
}

describe('score()', () => {
  const cases = [
    ['typo fix', files(1, ['md'], 2), 6],
    ['small bug fix', files(3, ['js', 'css'], 13), 16],
    ['new feature, full stack', files(8, ['js', 'css', 'html', 'json'], 19), 40],
    ['large refactor', files(20, ['js', 'ts', 'json'], 20), 72],
    ['Laravel upgrade', files(500, ['php', 'json', 'yml', 'js', 'md'], 4), 1120],
  ];

  for (const [desc, f, expected] of cases) {
    test(desc, () => {
      assert.equal(score(f), expected);
    });
  }
});

describe('emoji()', () => {
  const cases = [
    [0, '😊'],
    [15, '😊'],
    [16, '🙂'],
    [50, '🙂'],
    [51, '😐'],
    [120, '😐'],
    [121, '😠'],
    [250, '😠'],
    [251, '😡'],
    [500, '😡'],
    [501, '💀'],
    [9999, '💀'],
  ];

  for (const [s, expected] of cases) {
    test(`score ${s} → ${expected}`, () => {
      assert.equal(emoji(s), expected);
    });
  }
});

describe('stripEmoji()', () => {
  const cases = [
    ['😊 Fix a typo', 'Fix a typo'],
    ['🙂 Add login page', 'Add login page'],
    ['😐 Refactor auth', 'Refactor auth'],
    ['😠 Overhaul billing', 'Overhaul billing'],
    ['😡 Rewrite everything', 'Rewrite everything'],
    ['💀 The big one', 'The big one'],
    ['No emoji at all', 'No emoji at all'],
    ['😊😊 Double prefix', '😊 Double prefix'],
  ];

  for (const [input, expected] of cases) {
    test(`"${input}"`, () => {
      assert.equal(stripEmoji(input), expected);
    });
  }
});
