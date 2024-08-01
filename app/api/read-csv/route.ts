// app/api/read-csv/route.js
import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({error: 'Filename required'}, {status: 400});
  }

  const filePath = path.resolve('.', `public/${filename}`);
  const file = fs.readFileSync(filePath, 'utf8');

  let data;
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      data = results.data;
    },
    error: (error: Error) => {
      return NextResponse.json({ error: error.message }, { status: 500 });
    },
  });

  return NextResponse.json(data);
}