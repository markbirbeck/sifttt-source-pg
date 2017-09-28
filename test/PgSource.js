'use strict';
require('chai').should();

const Pipeline = require('sifttt/lib/beam/Pipeline');
const PgSource = require('..');
const Read = require('sifttt/lib/beam/Read');
const ct = require('sifttt/lib/beam/coreTransforms');

describe.only('PgSource', () => {
  /**
   * [TODO] Skipping because don't have a test that can be run from
   *        Wercker, so need to set that up:
   */

  describe('use environment variables', () => {
    it('simple db read', done => {
      let count = 0;

      let p = Pipeline.create({rethrowErrors: true})
      .apply(Read.from(new PgSource(
        'SELECT * FROM generate_series(0, 99) num'
      )))
      .apply(new ct.DoTo(element => {
        element.should.have.property('num');
      }))
      .apply(new ct.DoTo(() => {
        count++;
      }))
      ;

      p.run(() => {
        count.should.eql(100);
        done();
      });
    });

    it('use parameters', done => {
      let count = 0;

      let p = Pipeline.create({rethrowErrors: true})
      .apply(Read.from(new PgSource(
        'SELECT * FROM generate_series(0, $1) num',
        [49]
      )))
      .apply(new ct.DoTo(element => {
        element.should.have.property('num');
      }))
      .apply(new ct.DoTo(() => {
        count++;
      }))
      ;

      p.run(() => {
        count.should.eql(50);
        done();
      });
    });
  });
});
