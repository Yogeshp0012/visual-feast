'use server';
import { getStore } from '@netlify/blobs';

function store() {
    return getStore({ name: 'presets', consistency: 'strong', siteID: '7d5abf11-dfe0-483b-a12d-77271355226f', token: 'nfp_T9uxQ2Vde2nsFrxRjrAmnGXqYdDUCt6m40dd' });
}

export async function addPreset({presetData}) {
    await store().setJSON("presets", { data: presetData });
}

export async function listPresets() {
    const data = await store().get("presets", { type: 'json' });
    return data;
}

