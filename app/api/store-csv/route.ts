import { NextRequest, NextResponse } from 'next/server';
import connect from '../../../utils/db';
import CsvData from '../../models/CsvData';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, csvData } = body;

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing fileName' }, { status: 400 });
    }
    if (!csvData || typeof csvData !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing csvData' }, { status: 400 });
    }

    try {
      await connect();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    try {
      await CsvData.findOneAndUpdate(
        { fileName: fileName },
        { content: csvData },
        { upsert: true, new: true }
      );
    } catch (dbOpError) {
      console.error('Database operation error:', dbOpError);
      return NextResponse.json({ error: 'Failed to save CSV data' }, { status: 500 });
    }

    return NextResponse.json({ message: 'CSV output saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}