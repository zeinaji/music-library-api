const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('./src/app');

let server = null;

before(() => {
  // use chaiHttp
  chai.use(chaiHttp);

  // add test globals
  global.chai = chai;
  global.expect = chai.expect;

  // start test server on any available port
  server = app.listen();

  // set the server address as a global variable
  global.server = `http://127.0.0.1:${server.address().port}`;
});

after(() => {
  server.close();
});
