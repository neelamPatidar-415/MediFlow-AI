require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/db/db');

// Connect to the database
connectDB();

app.listen(3007, () => {
  console.log('hospital dashboard Server is running on port 3007');
});