import mongoose from 'mongoose';

export async function connectDB() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URL || process.env.DATABASE_URL;

  if (!mongoUri) {
    throw new Error('MONGO_URI is required to connect to MongoDB');
  }

  mongoose.set('strictQuery', true);

  const connection = await mongoose.connect(mongoUri);
  console.log(`MongoDB connected: ${connection.connection.host}`);
}

export default mongoose;
