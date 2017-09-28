'use strict';

const h = require('highland');

const { Client } = require('pg');
const QueryStream = require('pg-query-stream');

class PgSource {
  constructor(source, params, options) {
    if (!options) {
      if (typeof(params) === 'object' && !Array.isArray(params)) {
        options = params;
        params = [];
      } else {
        options = {};
      }
    }
    if (!Array.isArray(params)) {
      params = [];
    }
    this._source = source;
    this._params = params;
    this._options = options;
    this._client = new Client(options);
  }

  /**
   * The `pg-query-stream` module returns a stream, but the only way to
   * get it out of the promise that `pg#Client` returns is to use
   * `highland#flatten`.
   */

  getStream() {
    return h(
      this._client.connect()
      .then(() => {
        const query = new QueryStream(this._source, this._params);

        return this._client.query(query)
        .pipe(h())
        ;
      })
    )
    .flatten()
    ;
  }
}

module.exports = PgSource;
