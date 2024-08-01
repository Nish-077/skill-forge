import { NextRequest, NextResponse } from 'next/server';
import connect from '../../../utils/db';
import CsvData from '../../models/CsvData';

export async function POST(req: NextRequest) {
  try {
    const { fileName, csvData } = await req.json();

    if (!fileName || !csvData) {
      return NextResponse.json({ error: 'fileName and csvData are required' }, { status: 400 });
    }
    await connect();
    await CsvData.findOneAndUpdate(
      { fileName: fileName },
      { content: csvData },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: 'CSV output saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}