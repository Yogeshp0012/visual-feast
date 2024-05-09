'use server';
import { getStore } from '@netlify/blobs';

function store() {
    return getStore({ name: 'homepage-images', consistency: 'strong' });
}

export async function uploadImageData({ parameters }) {
    const key = parameters.imageID;
    await store().setJSON(key, parameters);
    console.log('Stored shape with parameters:', parameters, 'to key:', key);
}

export async function listShapesAction() {
    const data = await store().list();
    const keys = data.blobs.map(({ key }) => key);
    return keys;
}

export async function getShapeAction({ keyName }) {
    const data = await store().get(keyName, { type: 'json' });
    return data;
}
