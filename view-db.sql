\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;
SELECT * FROM users;

SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id=3; 
