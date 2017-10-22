'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-rcps:feature', () => {
  beforeAll(() => {
    return helpers.run(path.join(__dirname, '../generators/feature'))
      .withPrompts({someAnswer: true});
  });

  it('creates files', () => {
    assert.file([
      'dummyfile.txt'
    ]);
  });
});
