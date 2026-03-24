'use strict';

const { score, emoji, stripEmoji } = require('./grading');

let passed = 0, failed = 0;

function test(description, actual, expected) {
  if (actual === expected) {
    console.log(`  ✅ ${description}`);
    passed++;
  } else {
    console.error(`  ❌ ${description}`);
    console.error(`     expected: ${JSON.stringify(expected)}`);
    console.error(`     actual:   ${JSON.stringify(actual)}`);
    failed++;
  }
}

function files(count, exts, changesEach) {
  return Array.from({ length: count }, (_, i) => ({
    filename: `file_${i}.${exts[i % exts.length]}`,
    changes:  changesEach,
  }));
}

// ── score() ──────────────────────────────────────────────────────────────────

console.log('\nscore()');

[
  // [description,                   files,                         expected]
  ['typo fix',                        files(1, ['md'],           2),   6  ],
  ['small bug fix',                   files(3, ['js', 'css'],   13),  16  ],
  ['new feature, full stack',         files(8, ['js','css','html','json'], 19), 40],
  ['large refactor',                  files(20, ['js','ts','json'],    20), 72],
  ['Laravel upgrade',                 files(500, ['php','json','yml','js','md'], 4), 1120],
].forEach(([desc, f, expected]) => test(desc, score(f), expected));

// ── emoji() ──────────────────────────────────────────────────────────────────

console.log('\nemoji()');

[
  [0,    '😊'],
  [15,   '😊'],
  [16,   '🙂'],
  [50,   '🙂'],
  [51,   '😐'],
  [120,  '😐'],
  [121,  '😠'],
  [250,  '😠'],
  [251,  '😡'],
  [500,  '😡'],
  [501,  '💀'],
  [9999, '💀'],
].forEach(([s, expected]) => test(`score ${s} → ${expected}`, emoji(s), expected));

// ── stripEmoji() ─────────────────────────────────────────────────────────────

console.log('\nstripEmoji()');

[
  ['😊 Fix a typo',          'Fix a typo'  ],
  ['🙂 Add login page',      'Add login page'],
  ['😐 Refactor auth',       'Refactor auth'],
  ['😠 Overhaul billing',    'Overhaul billing'],
  ['😡 Rewrite everything',  'Rewrite everything'],
  ['💀 The big one',         'The big one'  ],
  ['No emoji at all',        'No emoji at all'],
  ['😊😊 Double prefix',     '😊 Double prefix'],
].forEach(([input, expected]) => test(`"${input}"`, stripEmoji(input), expected));

// ── Summary ───────────────────────────────────────────────────────────────────

console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed.\n`);
if (failed > 0) process.exit(1);
