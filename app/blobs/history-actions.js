'use server';
import { getStore } from '@netlify/blobs';

function store() {
    return getStore({ name: 'history', consistency: 'strong', siteID: '7d5abf11-dfe0-483b-a12d-77271355226f', token: 'nfp_T9uxQ2Vde2nsFrxRjrAmnGXqYdDUCt6m40dd' });
}

export async function addHistory({ imageID, imageURL }) {
    console.log(imageID);
    await store().setJSON(imageID, { image: imageURL });
}

export async function fetchHistory({ imageID }) {
    const data = await store().get(imageID, { type: 'json' });
    return data;
}

export async function eraseHistory({ imageID }) {
    const data = await store().delete(imageID);
    return data;
}
