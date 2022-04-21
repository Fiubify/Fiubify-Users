const mongoose = require('mongoose');
const app = require('./app');

mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://mongodb:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to mongo'))
  .catch((e) => console.log(e));

const PORT = 3000;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});
