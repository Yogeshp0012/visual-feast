import fs from 'fs';
import { writeFile } from 'fs/promises';
import path, { join } from 'path';


export async function GET(req) {
  return new Response('hi');
}

export async function POST(req) {
  const data = await req.formData()
  const file = data.get("file");
  const username = data.get("username");
  const imageName = data.get("name");
  const extension = data.get("extension");
  let path = join("./", `public/images/${username}`)
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true, mode: 0o755 });
    console.log(`Directory created: ${path}`);
  }
  path = join("./", `public/images/${username}`, imageName+"."+extension)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(path, buffer);
  console.log(`Open ${path}`);
  return new Response("ok");
}
