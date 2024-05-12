import fs from 'fs';
import { writeFile } from 'fs/promises';
import path, { join } from 'path';
import Jimp from 'jimp';
import axios from 'axios';


export async function GET(req) {
    return new Response('hi');
}

export async function POST(req) {
    const data = await req.formData()
    const username = data.get("username");
    const imageName = data.get("imageName");
    const rotation = data.get("rotation");
    const grayscale = data.get("grayscale");
    const url = data.get("url");
    const extension = data.get("extension").toLowerCase();
    const response = await fetch("https://repix.netlify.app" + url);
    const imageBuffer = await response.arrayBuffer();
    let path = join("./", `public/images/${username}`)
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true, mode: 0o755 });
    }
    let rotatedImageData = Buffer.from(imageBuffer);
    const image = await Jimp.read(imageBuffer);
    image.rotate(360 - parseInt(rotation));
    if (grayscale == "grayscale") {
        image.greyscale();
    }
    if (grayscale == "invert") {
        image.invert();
    }
    if (grayscale == "sepia") {
        image.sepia();
    }
    rotatedImageData = await image.getBufferAsync(Jimp.AUTO);
    const imageFile = new File([rotatedImageData], `image.${extension}`, { type: `image/${extension}` });
    const formData = new FormData();
    formData.append('key', '8a41ca98e3aace2b66b1717708ac964f');
    formData.append('image', imageFile);
    const r = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
    });
    const d = await r.json();
    return new Response(JSON.stringify(d));
}
