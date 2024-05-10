import fs from 'fs';
import path from 'path';

const uploadFolder = path.join(process.cwd(), 'uploads');

export async function GET(req) {
  return new Response('hi');
}

export async function POST(req) {
  const data = await req.formData()
  const file = data.get("file");
  const username = data.get("username");
  try {
    const buffer = await file.arrayBuffer();
    await fs.promises.writeFile(`../../../public/images/${username}/${file.name}`, Buffer.from(buffer));
    return new Response(`File uploaded successfully`);
  } catch (error) {
    return new Response('Error uploading file');
  }
}
