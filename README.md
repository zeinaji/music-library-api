# Music API Test Suite

This repository contains the integration test suite for Music Library API challenge.

### Install
- Fork this repository
- `git clone git@github.com:<your-github-username>/music-library-api.git`
- `npm install`

### Running the Tests
This setup assumes that you are running `mongodb` on your local machine.

Create a new file in the project root called `.env.test` and add your `DATABASE_CONN`. You can do this with a single command from within the project directory.

```
DATABASE_CONN=mongodb://localhost:27017/music-api-test >> .env.test
```

- `npm test` uses [Jest](https://jestjs.io/) and [Supertest](https://www.npmjs.com/package/supertest) to run e2e tests defined in `__tests__` directory


