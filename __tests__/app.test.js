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
                      expect.objectContaining({
                          username: expect.any(String)
                      })
                  })
              })
          })
      })
  })

  describe('GET /api/article/:article_id', () => {
    describe('Functionality', () => {
      test('returns an article object, with author(username), title, article_id, body, topic, created_at, votes', () => {
          return request(app)
          .get('/api/article/1')
          .expect(200)
          .then((response) => {
              expect(response.body.article).toEqual({
                author: 'butter_bridge',
                  title: 'Living in the shadow of a great man',
                  article_id: 1,
                  body: 'I find this existence challenging',
                  topic: 'mitch', 
                  created_at: '2020-07-09T20:11:00.000Z',
                  votes: 100,
              })
          
        })
      })
    })
  
    describe('Error Handling', () => {
        test('Returns 404 not found if no topics are found with that id', () => {
            return request(app)
            .get('/api/article/222')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found');
            })
        })
        test('Returns 400 bad request if a non integer is given as article_id', () => {
            return request(app)
            .get('/api/article/bad')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request');
            })
        })
    })
})