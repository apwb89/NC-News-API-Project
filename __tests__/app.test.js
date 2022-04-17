const data = require('../db/data/test-data/index');
const request = require('supertest');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');

beforeEach(() => seed(data));

afterAll(() => db.end());

describe('GET /api', () => {
  test('Returns JSON object providing info on all endpoints', () => {
    return request(app)
      .get('/api')
      .expect(200)
      .then((response) => {
        expect(response.body.endpoints).toMatchObject({
          'GET /api': expect.any(Object),
          //need better test ?
        });
      });
  });
});

describe('GET /api/topics', () => {
  test('Returns an array of topic objects with slug and decription properties', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then((response) => {
        expect(response.body.topics.length).toBe(3);
        response.body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});
test('Returns 404 not found if no topics are found', () => {
  return request(app)
    .get('/api/tpoics')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Not Found');
    });
});

describe('GET /api/users', () => {
  describe('Functionality', () => {
    test('Returns an array of objects with username property', () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
          expect(response.body.usernames.length).toBe(4);
          response.body.usernames.forEach((username) => {
            expect(username).toMatchObject({
              username: expect.any(String),
            });
          });
        });
    });
  });
});

describe('GET /api/users/:username', () => {
  test('Returns a user object with username, avatar_url and name properties', () => {
    return request(app)
    .get('/api/users/butter_bridge')
    .expect(200)
    .then((response) => {
      expect(response.body.user).toEqual(({
        username: 'butter_bridge',
        avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        name: 'jonny'
      }))
    })
  })
  test('Returns 404 not found if username does not exist', () => {
    return request(app)
    .get('/api/users/bad')
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Not Found');
    })
  })
})

describe('GET /api/articles', () => {
  test('Returns and array of article objects, with author(username), title, article_id, topic, created_at, votes and comment_count properties, sorted by date desc', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(12);
        response.body.articles.forEach((article) => {
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
            body: expect.any(String),
          });
        });
        expect(response.body.articles).toBeSortedBy('created_at', {
          descending: true,
        });
      });
  });
});

describe('GET /api/articles?queries', () => {
  test('Returns all articles sorted by specified query', () => {
    return request(app)
      .get('/api/articles?sort_by=title')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(12);
        expect(response.body.articles).toBeSortedBy('title', {
          descending: true,
        });
      });
  });
  test('sorts in ascending order when passes ASC query', () => {
    return request(app)
      .get('/api/articles?order=ASC')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(12);
        expect(response.body.articles).toBeSortedBy('created_at', {
          descending: false,
        });
      });
  });
  test('filters by topic given ?topic=... query', () => {
    return request(app)
      .get('/api/articles?topic=cats')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(1);
        expect(response.body.articles[0]).toMatchObject({
          article_id: 5,
          title: 'UNCOVERED: catspiracy to bring down democracy',
          topic: 'cats',
          author: 'rogersop',
        });
      });
  });
  test('filters topicsand sorts in ascending order at the same time', () => {
    return request(app)
      .get('/api/articles?topic=mitch&order=ASC&sort_by=title')
      .expect(200)
      .then((response) => {
        expect(response.body.articles.length).toBe(11);
        expect(response.body.articles[0]).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: 'mitch',
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
        expect(response.body.articles).toBeSortedBy('title', {
          descending: false,
        });
      });
  });
  test('Returns 400 bad request when topic isnt from existing topic lists', () => {
    return request(app)
      .get('/api/articles?topic=hats')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('Returns 400 bad request when order is not ASC, DESC, ASCENDING OR DESCENDING', () => {
    return request(app)
      .get('/api/articles?topic=mitch&order=ESC')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('Returns 400 bad request when sort_by is not from existing column names', () => {
    return request(app)
      .get('/api/articles?sort_by=auhtor')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

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
            comment_count: '11',
          });
        });
    });
  });
  test('Returns 404 not found if no topics are found with that id', () => {
    return request(app)
      .get('/api/articles/222')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('Returns 400 bad request if a non integer is given as article_id', () => {
    return request(app)
      .get('/api/articles/bad')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test('Returns an array of comment objects for the given article_id, containing comment_id, votes, created_at, author (username from users table, body', () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then((response) => {
        expect(response.body.comments.length).toBe(2);
        response.body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test('Returns 404 not found when given an article id that does not exist', () => {
    return request(app)
      .get('/api/articles/222/comments')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('Returns 200 and empty body when selecting an article with no comments', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
  test('Returns 400 bad request if a non integer is given as article_id', () => {
    return request(app)
      .get('/api/articles/a/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('POST /api/topics', () => {
  test('Takes an object with slug and description properties and creates a new topic', () => {
    return request(app)
      .post('/api/topics')
      .send({ slug: 'tests', description: 'example text' })
      .expect(201)
      .then((response) => {
        expect(response.body.topic).toMatchObject({
          slug: 'tests',
          description: 'example text',
        });
      });
  });
  test('returns 400 bad request if keys are wrong', () => {
    return request(app)
      .post('/api/topics')
      .send({ sulg: 'topic', description: 'test' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
    })
    test('returns 400 bad request if body slug or description is empty', () => {
      return request(app)
        .post('/api/topics')
        .send({ slug: '', description: 'test' })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
        });
    });
    test('returns 400 bad request if values are the wrong data type', () => {
      return request(app)
        .post('/api/topics')
        .send({ slug: 'slug', description: 5 })
        .expect(400)
        .then((response) => {
          expect(response.body.msg).toBe('Bad Request');
        });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('Takes an object with name and body properties and posts a comment to the article of id chosen', () => {
    return request(app)
      .post('/api/articles/4/comments')
      .send({ name: 'butter_bridge', body: 'test' })
      .expect(200)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          comment_id: 19,
          body: 'test',
          article_id: 4,
          author: 'butter_bridge',
          votes: 0,
          created_at: expect.any(String),
        });
      });
  });
  test('returns 404 not found when name does not exist in users table', () => {
    return request(app)
      .post('/api/articles/5/comments')
      .send({ name: 'noName', body: 'test' })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('returns 400 bad request if keys are wrong', () => {
    return request(app)
      .post('/api/articles/5/comments')
      .send({ nmae: 'butter_bridge', body: 'test' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('returns 400 bad request if name key is empty', () => {
    return request(app)
      .post('/api/articles/5/comments')
      .send({ name: '', body: 'test' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('returns 400 bad request if body key is empty', () => {
    return request(app)
      .post('/api/articles/5/comments')
      .send({ name: 'butter_bridge', body: '' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('returns 400 bad request if values are the wrong data type', () => {
    return request(app)
      .post('/api/articles/5/comments')
      .send({ name: 'butter_bridge', body: 5 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('PATCH /api/comments/:comment_id', () => {
  test('Increments votes property on comment of given id and returns comment object', () => {
    return request(app)
    .patch('/api/comments/1')
    .send({ inc_votes: 1 })
    .expect(200)
    .then((response) => {
      expect(response.body.comment).toMatchObject({
        comment_id: 1,
        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        votes: 17
      })
    })
  })
  test('correctly updates votes when inc_votes is negative', () => {
   return request(app)
   .patch('/api/comments/2')
   .send({inc_votes: -1})
   .expect(200)
   .then((response) => {
     expect(response.body.comment).toMatchObject({
       comment_id: 2,
       body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
       votes: 13
     })
   })
  });
  test('returns 404 not found if comment does not exist', () => {
    return request(app)
    .patch('/api/comments/100')
    .send({inc_votes: 1})
    .expect(404)
    .then((response) => {
      expect(response.body.msg).toBe('Not Found');
    })
  });
  test('returns 400 bad request if inc_votes key is missing', () => {
    return request(app)
    .patch('/api/comments/1')
    .send({})
    .expect(400)
    .then((response) => {
      expect(response.body.msg).toBe('Bad Request')
    })
  });
})

describe('DELETE /api/comments/:comment_id', () => {
  test('Deletes a comment of the given id', () => {
    return request(app)
      .del('/api/comments/10')
      .expect(204)
      .then((response) => {
        return db.query(`SELECT * FROM comments;`).then((testRes) => {
          expect(testRes.rows.length).toBe(17);
          expect(testRes.rows).not.toContain({
            comment_id: 10,
            body: 'git push origin master',
            article_id: 3,
            author: 'icellusedkars',
            votes: 0,
            created_at: '2020-06-20 08:24:00',
          });
        });
      });
  });
  test('Returns 404 not found if comment doesnt exist', () => {
    return request(app)
      .del('/api/comments/100')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('Returns 400 bad request if a non integer is given as comment_id', () => {
    return request(app)
      .del('/api/comments/bad')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('PATCH /api/articles/:article_id  -- Votes', () => {
  test('accepts an object with inc_votes property and returns the article incremented by the correct value of votes', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 1 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test('correctly updates votes when inc_votes is negative', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: -101 })
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: expect.any(String),
          votes: -1,
        });
      });
  });
  test('returns 404 not found if article does not exist', () => {
    return request(app)
      .patch('/api/articles/100')
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('returns 400 bad request if inc_votes key is missing', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({})
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  test('returns 400 bad request if inc_votes value is not a number', () => {
    return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes: 'bad' })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
});

describe('DELETE /api/articles/:article_id', () => {
  test('Deletes the article of given ID', () => {
    return request(app)
      .del('/api/articles/1')
      .expect(204)
      .then((response) => {
        return db.query(`SELECT * FROM articles;`).then((testRes) => {
          expect(testRes.rows.length).toBe(11);
          expect(testRes.rows).not.toContain({
            comment_id: 1,
            title: 'Living in the shadow of a great man  ',
            topic: "mitch",
            author: 'butter_bridge',
            body: "I find this existence challenging",      
            votes: 100,
            created_at: '2020-07-09 21:11:00',
          });
        });
      });
  });
  test('Returns 404 not found if article doesnt exist', () => {
    return request(app)
      .del('/api/articles/100')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe('Not Found');
      });
  });
  test('Returns 400 bad request if a non integer is given as article_id', () => {
    return request(app)
      .del('/api/articles/bad')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe('Bad Request');
      });
  });
  })

