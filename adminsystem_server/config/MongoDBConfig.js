const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('mongodb connection established');
  })
  .catch((error) => {
    console.log('mongodb connection not established', error.message);
  });

module.exports = mongoose.connection;
