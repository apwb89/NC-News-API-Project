const data = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../app');
const db = require('../db/seeds/seed');

beforeEach(() => {
    return db(data);
  });

  afterAll(() => {
    if (db.end) db.end();
  });

  describe('GET /api/topics', () => {
      describe('Functionality', () => {
        test('Returns an array of topic objects with slug and decription properties', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
            expect(res.body.topics.length).toBe(3);
            res.body.topics.forEach(topic => {
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                  });
            })
        })
      })
    })
      describe('Error Handling', () => {
        test('Returns 404 not found if no topics are found', () => {
            return request(app)
            .get('/api/tpoics')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('Not Found');
            })
        })
      })
  })