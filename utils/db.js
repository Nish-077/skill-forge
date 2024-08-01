import mongoose from 'mongoose';
const MONGODB_URI= "mongodb+srv://user:jeZ20q3WBO6skaYE@skillforge.wze4mxf.mongodb.net/"




const connect = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
    };
export  default connect;