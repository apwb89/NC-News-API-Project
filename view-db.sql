\c nc_news_test

SELECT * FROM articles;
SELECT * FROM comments;

SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(articles.article_id)
AS comment_count 
FROM articles 
FULL OUTER JOIN comments 
ON articles.article_id = comments.article_id 
GROUP BY articles.article_id
ORDER BY articles.created_at DESC;

/* SELECT *, COUNT(articles.article_id) AS comment_count GROUP BY article_id
FROM articles 
FULL OUTER JOIN comments 
ON articles.article_id = comments.article_id 
ORDER BY articles.created_at DESC; */

--SELECT *, COUNT(article_id) AS comment_count FROM comments GROUP BY article_id