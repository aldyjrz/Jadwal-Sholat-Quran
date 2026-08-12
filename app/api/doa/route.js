import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const dataDir = join(process.cwd(), 'data');
    const fileContent = readFileSync(join(dataDir, 'doa.json'), 'utf-8');
    const jsonData = JSON.parse(fileContent);
    
    // Return data array jika ada, atau seluruh array
    const doaList = jsonData.data || jsonData;
    
    return Response.json(doaList);
  } catch (error) {
    console.error('Error reading doa.json:', error);
    return Response.json(
      { error: 'Gagal membaca data doa' },
      { status: 500 }
    );
  }
}
