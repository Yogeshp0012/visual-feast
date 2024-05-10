'use server';
import { getStore } from '@netlify/blobs';

function store() {
    return getStore({ name: 'images', consistency: 'strong', siteID: '7d5abf11-dfe0-483b-a12d-77271355226f', token: 'nfp_T9uxQ2Vde2nsFrxRjrAmnGXqYdDUCt6m40dd' });
}

export async function addImage({ imageID, imageMetadata }) {
    await store().setJSON(imageID, { image: imageMetadata });
}

export async function listImage({ imageID }) {
    const data = await store().get(imageID, { type: 'json' });
    return data;
}

export async function deleteImage({ imageID }) {
    const data = await store().get(imageID);
    return data;
}
