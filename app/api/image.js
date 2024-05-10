import fs from 'fs';
import path from 'path';

const uploadFolder = path.join(process.cwd(), 'uploads');

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const file = req.body.file;
    const filePath = path.join(uploadFolder, file.originalname);

    try {
      await fs.promises.writeFile(filePath, file.buffer);
      res.status(201).send(`File uploaded successfully at ${filePath}`);
    } catch (error) {
      res.status(500).send('Error uploading file');
    }
  } else {
    res.status(405).send('Method not allowed');
  }
}
