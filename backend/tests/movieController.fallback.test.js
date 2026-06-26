const test = require('node:test');
const assert = require('node:assert/strict');
const movieController = require('../controllers/movieController');
const { sampleMovies } = require('../data/sampleMovies');

const buildRes = () => {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload) => {
    res.body = payload;
    return res;
  };
  return res;
};

test('getAllMovies returns sample data when MongoDB is unavailable', async () => {
  const req = { query: { page: '1' } };
  const res = buildRes();
  let nextCalled = false;
  const next = () => {
    nextCalled = true;
  };

  await movieController.getAllMovies(req, res, next);

  assert.equal(nextCalled, false);
  assert.equal(res.statusCode, 200);
  assert.ok(res.body.movies.length > 0);
  assert.equal(res.body.movies[0].title, sampleMovies[0].title);
});
