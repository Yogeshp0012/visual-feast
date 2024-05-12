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
    const response = await fetch("https://https://repix.netlify.app"+url);
    const imageBuffer = await response.arrayBuffer();
    let path = join("./", `public/images/${username}`)
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true, mode: 0o755 });
        console.log(`Directory created: ${path}`);
    }
    let rotatedImageData = Buffer.from(imageBuffer);
    const image = await Jimp.read(imageBuffer);
    image.rotate(360-parseInt(rotation));
    if(grayscale == "grayscale"){
        image.greyscale();
    }
    if(grayscale == "invert"){
        image.invert();
    }
    if(grayscale == "sepia"){
        image.sepia();
    }
    rotatedImageData = await image.getBufferAsync(Jimp.AUTO);
    path = join("./", `public/images/${username}`, imageName + "." + extension)
    fs.writeFileSync(path, rotatedImageData);
    console.log(`Open ${path}`);
    return new Response("ok");
}
