import mongoose from 'mongoose';

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/creatorsync';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000
    });

    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error('Database Connection Error:', error.message);
    console.error('Make sure MongoDB Community Server is running locally and MongoDB Compass can connect to mongodb://127.0.0.1:27017');
    process.exit(1);
  }
};

export default connectDB;
