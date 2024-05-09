'use server';
import { getStore } from '@netlify/blobs';

function store() {
    return getStore({ name: 'homepage-images', consistency: 'strong', siteID: '7d5abf11-dfe0-483b-a12d-77271355226f', token: 'nfp_T9uxQ2Vde2nsFrxRjrAmnGXqYdDUCt6m40dd' });
}

export async function uploadImageData({ parameters }) {
    console.log(parameters);
    const key = parameters.username;
    await store().setJSON(key, { imageID: "test", visible: "tres" });
}

// export async function listImagesData() {
//     const data = await store().list();
//     const keys = data.blobs.map(({ key }) => key);
//     return keys;
// }

export async function listImageData({ keyName }) {
    const data = await store().getWithMetadata(keyName, { type: 'json' });
    return data;
}
