"use client";

import { addImage, listImage } from "app/blobs/images-actions";
import { listPresets } from "app/blobs/preset-actions";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Edit() {
    const params = useParams();
    const [imageData, setImageData] = useState(null)
    const [username, setUsername] = useState("");
    const [preset, setPreset] = useState("");
    const [imageQuality, setImageQuality] = useState(49);;
    const [width, setWidth] = useState(32);
    const [height, setHeight] = useState(38);
    const [fit, setFit] = useState("");
    const [format, setFormat] = useState("WEBP");
    const [filter, setFilter] = useState("");
    const [fileName, setFileName] = useState("")
    const [presets, setPresets] = useState([])
    const [imageName, setImageName] = useState("Test")


    const [rotationDegree, setRotationDegree] = useState(0);

    const handleClick = () => {
        setRotationDegree((prevDegree) => (prevDegree + 90) % 360);
    };

    const handlePreset = () => {
        listPresets().then((data) => {
            if (data && data.data) {
                data.data.forEach((data) => {
                    if(data.presetData.name == preset){
                        setHeight(data.presetData.height);
                        setWidth(data.presetData.width);
                    }
                })
            }
        });
    };

    const handleSave = async () => {
        if (imageQuality < 1) {
            setImageQuality(1)
        }
        if (imageQuality > 100) {
            setImageQuality(100)
        }
        try {
            addImage({
                imageID: params.id, imageMetadata: {
                    name: imageData.image.name,
                    width: width,
                    height: height,
                    quality: imageQuality,
                    fit: fit.toLowerCase(),
                    format: format.toLowerCase(),
                    url: imageData.image.url
                }
            })

        }
        catch (e) {
            console.log(e);

        }

        return () => clearTimeout(timer);
    }

    const handleTest = (formatValue) => {
        setFormat(formatValue)
        let img = document.getElementById("edit-image")
        let canvas = document.querySelector("canvas");
        if (canvas && !img) {
            var canvasElement = document.querySelector('canvas');
            var imgElement = document.createElement('img');
            imgElement.id = 'edit-image';
            imgElement.alt = 'Edit Image';
            imgElement.setAttribute("srcSet", `/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`);
            canvasElement.parentNode.replaceChild(imgElement, canvasElement);
        }
        if (formatValue !== "Default") {
            pixelsJS.filterImg(img, formatValue);
        }
    }

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setUsername(user);
        }
        const { id } = params;
        listImage({ imageID: id }).then((data) => setImageData(data))
        listPresets().then((data) => {
            if (data && data.data) {
                setPresets(data.data);
            }
        });
    }, [params])

    useEffect(() => {
        handlePreset();
    }, [preset])

    useEffect(() => {
        if (imageData && imageData.image) {
            setImageQuality(imageData.image.quality)
            setWidth(imageData.image.width)
            setHeight(imageData.image.height)
            setFit(imageData.image.fit)
            setFormat(imageData.image.format)
        }
    }, [imageData])

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <span className="sr-only">Open sidebar</span>
                                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                                    </path>
                                </svg>
                            </button>
                            <Link href="/" className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white logo">REPIX</span>
                            </Link>
                        </div>
                        <div className="flex items-center">
                            <div className="flex items-center ms-3">
                                <div>
                                    <button type="button" className="inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Download as zip
                                    </button>
                                </div>
                            </div>
                            {username && <div className="flex items-center ms-3">
                                <div>
                                    <button type="button" className="inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        {username}
                                    </button>
                                </div>
                            </div>}
                        </div>
                    </div>
                </div>
            </nav>
            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li className="p-2">
                            <label htmlFor="select-preset" className="block text-sm font-medium leading-6 text-white">Select Preset</label>
                            <div className="mt-2">
                                <select id="select-preset" value={preset} onChange={(e) => {
                                    setPreset(e.target.value);
                                }} name="select-preset" autoComplete="select-preset" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option value="custom" defaultValue>Custom</option>
                                    {presets && presets.map((ele) => (
                                        <option key={ele.presetData.name} value={ele.presetData.name}>{ele.presetData.name}</option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="image-quality" className="block text-sm font-medium leading-6 text-white">Image Quality</label>
                            <div className="mt-2">
                                <input value={imageQuality} onChange={(e) => setImageQuality(e.target.value)} type="number" name="image-quality" id="image-quality" autoComplete="image-quality" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="formate" className="block text-sm font-medium leading-6 text-white">Image Filter</label>
                            <div className="mt-2">
                                <select id="formate" value={format} onChange={(e) => handleTest(e.target.value)} name="formate" autoComplete="formate" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option value="Default">Default</option>
                                    <option value="horizontal_lines">Lines</option>
                                    <option value="eclectic">Eclectic</option>
                                    <option value="pane">Pane</option>
                                    <option value="sunset">Sunset</option>
                                    <option value="invert">Invert</option>
                                    <option value="greyscale">Grayscale</option>
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="image-width" className="block text-sm font-medium leading-6 text-white">Width</label>
                            <div className="mt-2">
                                <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} name="image-width" id="image-width" autoComplete="image-width" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="image-height" className="block text-sm font-medium leading-6 text-white">Height</label>
                            <div className="mt-2">
                                <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} name="image-height" id="image-height" autoComplete="image-height" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="image-fit" className="block text-sm font-medium leading-6 text-white">Fit Image</label>
                            <div className="mt-2">
                                <select id="image-fit" name="image-fit" value={fit} onChange={(e) => setFit(e.target.value)} autoComplete="image-fit" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option value="contain">Contain</option>
                                    <option value="cover">Cover</option>
                                </select>
                            </div>
                        </li>

                        <li className="p-2">
                            <label htmlFor="formate" className="block text-sm font-medium leading-6 text-white">Format</label>
                            <div className="mt-2">
                                <select id="formate" value={format} onChange={(e) => setFormat(e.target.value)} name="formate" autoComplete="formate" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option value="avif">AVIF</option>
                                    <option value="jpg">JPG</option>
                                    <option value="png">PNG</option>
                                    <option value="webp">WEBP</option>
                                    <option value="gif">GIF</option>
                                    <option value="blurhash">BLURHASH</option>
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <div className="flex items-center justify-end gap-x-6 w-">
                                <button onClick={handleSave} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
            {imageData && imageData.image && <div className="p-4 sm:ml-64">
                <div className="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 min-h-[90vh] flex items-center justify-center">
                    <img id="edit-image" alt="Edit Image" srcSet={`/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`} onClick={handleClick} className="max-w-full max-h-full transform rotate-90deg" />
                </div>
            </div>}
        </>
    );

}
