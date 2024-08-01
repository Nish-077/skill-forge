import mongoose, { Schema, Document, Model } from 'mongoose';

interface ICsvData extends Document {
    fileName: string;
    content: string;
}

const CsvDataSchema: Schema = new Schema({
    fileName: { type: String, required: true, unique: true },
    content: { type: String, required: true },
});

const CsvData: Model<ICsvData> = mongoose.models.CsvData || mongoose.model<ICsvData>('CsvData', CsvDataSchema, 'outputCsv');

export default CsvData;
