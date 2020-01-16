const mongoose = require('mongoose');
const app = require('./src/app');

mongoose.connect('mongodb://0.0.0.0:27017/test', { useNewUrlParser: true }, () => {
  app.listen(3000, () => {
    console.log('App listening on port 3000');
  });
});
