'use server';
import { getStore } from '@netlify/blobs';

function store() {
    return getStore({ name: 'homepage-images', consistency: 'strong', siteID: '7d5abf11-dfe0-483b-a12d-77271355226f', token: 'nfp_T9uxQ2Vde2nsFrxRjrAmnGXqYdDUCt6m40dd' });
}

export async function uploadImageData({ username, images }) {
    await store().setJSON(username, { images: [...images] });
}

// export async function listImagesData() {
//     const data = await store().list();
//     const keys = data.blobs.map(({ key }) => key);
//     return keys;
// }

export async function listImageData({ username }) {
    const data = await store().get(username ,{type: 'json'});
    return data["images"];
}
