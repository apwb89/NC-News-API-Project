# Northcoders News API

# NC-News API -guarded-reaches-90042

Backend project for reading and posting articles and comments. 

## Hosted at 
[https://guarded-reaches-90042.herokuapp.com/api](https://guarded-reaches-90042.herokuapp.com/api)

## Minimums

```bash
node: '17.4.0'
psql: '12.9'
```

## Clone Repo

Fork github repo then in your directory of choice use command:

```bash
git clone <github repo url>
```

## Installation

Use  [npm](https://www.npmjs.com/) to install dependencies.

First initialise with: 

```bash
npm init -y
```

then:

```bash
npm install
```

## Set-up Environment Variables

Create a .env.test and .env.development file in your root directory. Point them to your test and development databases. e.g. PGDATABASE=nc_news_test.

## Testing

Run tests using:

```bash
npm test