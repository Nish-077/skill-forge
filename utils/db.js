import mongoose from 'mongoose';
const MONGODB_URI = process.env.MONGODB_URI;


const connect = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "test"
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
export default connect;