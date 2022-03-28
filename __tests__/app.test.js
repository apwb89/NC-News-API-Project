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
        test('Returns an array of topic objects with slug and decription properties', async () => {
        const response = await request(app)
        .get("/api/topics")
        .expect(200)
            expect(response.body.topics.length).toBe(3);
            response.body.topics.forEach(topic => {
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                  });
            })
        
      })
    })
      describe('Error Handling', () => {
        test('Returns 404 not found if no topics are found', async () => {
            const response = await request(app)
            .get('/api/tpoics')
            .expect(404)
            
                expect(response.body.msg).toBe('Not Found');
            })
        })
    })
  

  describe('GET /api/users', () => {
      describe('Functionality', () => {
          test('Returns an array of objects with username property', async () => {
              const response = await request(app)
              .get('/api/users')
              .expect(200);

              expect(response.body.usernames.length).toBe(4);
              response.body.usernames.forEach(username => {
                  expect.objectContaining({
                      username: expect.any(String)
                  })
              })
          })
      })
  })