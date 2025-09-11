import 'dotenv/config';
import connectDB from './src/Config/MongoDBConnection.js';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

connectDB();

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Product Recommender Server started`);
});
