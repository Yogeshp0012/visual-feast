import fs from 'fs';
import { writeFile } from 'fs/promises';
import path, { join } from 'path';

const uploadFolder = path.join(process.cwd(), 'uploads');

export async function GET(req) {
  return new Response('hi');
}

export async function POST(req) {
  const data = await req.formData()
  const file = data.get("file");
  const username = data.get("username");
  const path = join("./", "public/images", file.name)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path, buffer);
  console.log(`Open ${path}`);
  return new Response("ok");
}
