import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { fileName, csvData } = await req.json();

    if (!fileName || !csvData) {
      return NextResponse.json({ error: 'fileName and csvData are required' }, { status: 400 });
    }

    if (fileName.includes('..')) {
      return NextResponse.json({ error: 'Invalid fileName' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', fileName);

    fs.writeFileSync(filePath, csvData);

    return NextResponse.json({ message: 'File saved successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}