const data = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

beforeEach(() => seed(data));

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
        test('Returns 404 not found if no topics are found', () => {
            return request(app)
            .get('/api/tpoics')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found');
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


  describe('GET /api/articles/:article_id', () => {
    describe('Functionality', () => {
      test('returns an article object, with author(username), title, article_id, body, topic, created_at, votes', () => {
          return request(app)
          .get('/api/articles/1')
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
    test('Returns 404 not found if no topics are found with that id', () => {
            return request(app)
            .get('/api/articles/222')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found');
            })
        })
        test('Returns 400 bad request if a non integer is given as article_id', () => {
            return request(app)
            .get('/api/articles/bad')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request');
            })
        })
    })

    describe('GET /api/articles/:article_id/comments', () => {
        test('Returns an array of comment objects for the given article_id, containing comment_id, votes, created_at, author (username from users table, body', () => {
            return request(app)
            .get('/api/articles/3/comments')
            .expect(200)
            .then((response) => {
                expect(response.body.comments.length).toBe(2);
                response.body.comments.forEach(comment => {
                    expect(comment).toMatchObject({
                        comment_id: expect.any(Number),
                        votes: expect.any(Number),
                        created_at: expect.any(String),
                        author: expect.any(String),
                        body: expect.any(String),
                    })
                })
            })
        })
        test('Returns 404 not found when given an article id that does not exist', () => {
            return request(app)
            .get('/api/articles/222/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('Not Found');
            })
        })
        test('Returns 200 and empty body when selecting an article with no comments', ()=> {
            return request(app)
            .get('/api/articles/2/comments')
            .expect(200)
            .then((response) => {
                expect(response.body.comments).toEqual([]);
            })
        })
        test('Returns 400 bad request if a non integer is given as article_id', () => {
            return request(app)
            .get('/api/articles/a/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('Bad Request');
            })
        })
    })

    
