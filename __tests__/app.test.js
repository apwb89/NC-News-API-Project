const data = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

beforeEach(() => {
    return seed(data);
  });

  afterAll(() => db.end());

  describe('GET /api/topics', () => {
      describe('Functionality', () => {
        test('Returns an array of topic objects with slug and decription properties', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach(topic => {
                expect(topic).toMatchObject({
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
            .then((response) => {
                expect(response.body.msg).toBe('Not Found');
            })
            })
        })
    })
  

  describe('GET /api/users', () => {
      describe('Functionality', () => {
          test('Returns an array of objects with username property', () => {
              return request(app)
              .get('/api/users')
              .expect(200)
              .then((response) => {
                  expect(response.body.usernames.length).toBe(4);
                  response.body.usernames.forEach(username => {
                      expect(username).toMatchObject({
                          username: expect.any(String)
                      })
                  })
              })
          })
      })
  })

describe('GET /api/articles', () => {
    describe('Functionality', () => {
        test('Returns and array of article objects, with author(username), title, article_id, topic, created_at, votes and comment_count properties, sorted by date desc', () => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                expect(response.body.articles.length).toBe(12);
                response.body.articles.forEach(article => {
                    expect(article).toMatchObject({
                        article_id: expect.any(Number),
                        title: expect.any(String), 
                        topic: expect.any(String),
                        author: expect.any(String),
                        created_at: expect.any(String),
                        votes: expect.any(Number),
                        comment_count: expect.any(String)
                    })
                })
                expect(response.body.articles).toBeSortedBy('created_at', {
                    descending: true});
            })
        })
    })
})

