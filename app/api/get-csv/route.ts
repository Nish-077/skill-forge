import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import connect from '../../../utils/db';
import CsvData from '../../models/CsvData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Filename required' }, { status: 400 });
  }
  try {
    await connect();
    const csvData = await CsvData.findOne({ fileName: filename }).lean();
    if (!csvData) {
      return NextResponse.json({ error: 'No CSV data found' }, { status: 404 });
    }
    
    let data;
    Papa.parse(csvData.content, {
       header: true,
       complete: (results) => {
        data = results.data;
      },
      error: (error: Error) => {
        return NextResponse.json({ error: error.message }, { status: 500 });
      },
     });
    return NextResponse.json({ data: data }, { status: 200 });
  }
  catch (error) {
    console.error('Error fetching CSV data:', error);
    return NextResponse.json({ error: 'Failed to fetch CSV data' }, { status: 500 });
  }

}