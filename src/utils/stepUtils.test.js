// Test file for stepUtils functions
import { parseStepName, formatStepName, getStepGroupId, getStepTitle } from './stepUtils.js';

// Simple test runner
function test(description, testFunction) {
  try {
    testFunction();
    console.log(`✅ ${description}`);
  } catch (error) {
    console.error(`❌ ${description}:`, error.message);
  }
}

function assertEqual(actual, expected, message) {
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`${message} - Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
  }
}

// Test parseStepName function
test('parseStepName - with groupId "ff. blah blah"', () => {
  const result = parseStepName('ff. blah blah');
  assertEqual(result, { groupId: 'ff', title: 'blah blah' }, 'Should parse groupId and title correctly');
});

test('parseStepName - with groupId "abc. test title"', () => {
  const result = parseStepName('abc. test title');
  assertEqual(result, { groupId: 'abc', title: 'test title' }, 'Should parse different groupId');
});

test('parseStepName - with groupId "mix.something"', () => {
  const result = parseStepName('mix.something');
  assertEqual(result, { groupId: 'mix', title: 'something' }, 'Should work without space after dot');
});

test('parseStepName - with groupId "prep.   extra spaces"', () => {
  const result = parseStepName('prep.   extra spaces');
  assertEqual(result, { groupId: 'prep', title: 'extra spaces' }, 'Should handle multiple spaces after dot');
});

test('parseStepName - no groupId "just a title"', () => {
  const result = parseStepName('just a title');
  assertEqual(result, { groupId: null, title: 'just a title' }, 'Should return null groupId for plain title');
});

test('parseStepName - no groupId "TangZhong"', () => {
  const result = parseStepName('TangZhong');
  assertEqual(result, { groupId: null, title: 'TangZhong' }, 'Should handle single word titles');
});

test('parseStepName - edge case "a."', () => {
  const result = parseStepName('a.');
  assertEqual(result, { groupId: null, title: 'a.' }, 'Should not match if no title after dot');
});

test('parseStepName - edge case ".something"', () => {
  const result = parseStepName('.something');
  assertEqual(result, { groupId: null, title: '.something' }, 'Should not match if no groupId before dot');
});

// Test formatStepName function
test('formatStepName - with groupId', () => {
  const result = formatStepName('ff', 'blah blah');
  assertEqual(result, 'ff. blah blah', 'Should format groupId and title correctly');
});

test('formatStepName - no groupId', () => {
  const result = formatStepName(null, 'just title');
  assertEqual(result, 'just title', 'Should return just title when no groupId');
});

test('formatStepName - empty groupId', () => {
  const result = formatStepName('', 'just title');
  assertEqual(result, 'just title', 'Should return just title when empty groupId');
});

test('formatStepName - whitespace groupId', () => {
  const result = formatStepName('  ', 'just title');
  assertEqual(result, 'just title', 'Should return just title when whitespace groupId');
});

test('formatStepName - groupId with spaces', () => {
  const result = formatStepName('  abc  ', 'title');
  assertEqual(result, 'abc. title', 'Should trim groupId spaces');
});

// Test round-trip conversion
test('Round-trip - "ff. blah blah"', () => {
  const original = 'ff. blah blah';
  const parsed = parseStepName(original);
  const formatted = formatStepName(parsed.groupId, parsed.title);
  assertEqual(formatted, original, 'Should round-trip correctly');
});

test('Round-trip - "TangZhong"', () => {
  const original = 'TangZhong';
  const parsed = parseStepName(original);
  const formatted = formatStepName(parsed.groupId, parsed.title);
  assertEqual(formatted, original, 'Should round-trip correctly for plain titles');
});

// Test helper functions
test('getStepGroupId - with groupId', () => {
  const result = getStepGroupId('ff. blah blah');
  assertEqual(result, 'ff', 'Should extract groupId correctly');
});

test('getStepGroupId - no groupId', () => {
  const result = getStepGroupId('TangZhong');
  assertEqual(result, null, 'Should return null for no groupId');
});

test('getStepTitle - with groupId', () => {
  const result = getStepTitle('ff. blah blah');
  assertEqual(result, 'blah blah', 'Should extract title correctly');
});

test('getStepTitle - no groupId', () => {
  const result = getStepTitle('TangZhong');
  assertEqual(result, 'TangZhong', 'Should return full name when no groupId');
});

console.log('\n=== stepUtils Test Results ===');