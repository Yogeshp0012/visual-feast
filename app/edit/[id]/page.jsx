"use client";

import { addImage, listImage } from "app/blobs/images-actions";
import { listImageData, uploadImageData } from "app/blobs/homepage-actions";
import { listPresets } from "app/blobs/preset-actions";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import ImageEffect from 'react-image-effects'
import ImageFilter from 'react-image-filter';
import { fetchHistory } from "app/blobs/history-actions";

export default function Edit() {
    const params = useParams();
    const [imageData, setImageData] = useState(null)
    const [username, setUsername] = useState("");
    const [preset, setPreset] = useState("");
    const [imageQuality, setImageQuality] = useState(0);
    const [width, setWidth] = useState(32);
    const [height, setHeight] = useState(38);
    const [fit, setFit] = useState("");
    const [format, setFormat] = useState("png");
    const [filter, setFilter] = useState("default");
    const [fileName, setFileName] = useState("")
    const [presets, setPresets] = useState([])
    const [imageName, setImageName] = useState("Test");
    const imageRef = useRef(null);
    const canvasRef = useRef(null);
    const [rotationAngle, setRotationAngle] = useState(0);
    const [loading, setLoading] = useState(true)
    const [displayImages, setDisplayImages] = useState([])


    const handleRotate = async (angle) => {
        setRotationAngle((prevAngle) => prevAngle + angle);
    };


    function generateRandomFilename(prefix = '', suffix = '', length = 10) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return prefix + result + suffix;
    }



    const handleSaveImage = async () => {
        if (rotationAngle > 0 || filter != "default") {
            let imageName = generateRandomFilename('myfile_');
            const formData = new FormData();
            formData.append('username', username);
            formData.append('extension', format);
            formData.append('imageName', imageName);
            formData.append('rotation', rotationAngle);
            formData.append('grayscale', filter);
            formData.append('url', `/.netlify/images?url=${imageData.image.url}&fm=${format.toLowerCase()}&q=100`);
            const response = await fetch('/api/saveFile', {
                method: 'POST',
                body: formData,
            });
            console.log(imageName);
            if (response.ok) {
                await handleSave(true, imageName);
                setRotationAngle(0);
            }
        }
        else {
            await handleSave(false);
        }
    };


    const tested = () => {
        // Access the div element
        const imageDiv = document.getElementById('image');

        // Access the image element within the div
        const imageElement = imageDiv.querySelector('img');

        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match the image
        canvas.width = imageElement.width;
        canvas.height = imageElement.height;

        // Draw the image onto the canvas
        ctx.drawImage(imageElement, 0, 0);

        // Apply the grayscale filter
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = avg; // Red
            data[i + 1] = avg; // Green
            data[i + 2] = avg; // Blue
        }

        ctx.putImageData(imageData, 0, 0);

        // Convert the canvas content to a data URL
        const dataURL = canvas.toDataURL('image/png');

        // Create a link element to trigger download
        const downloadLink = document.createElement('a');
        downloadLink.href = dataURL;
        downloadLink.download = 'saved_image.png';

        // Trigger a click event on the link to prompt download
        downloadLink.click();
    }


    const [rotationDegree, setRotationDegree] = useState(0);

    const handleClick = () => {
        setRotationDegree((prevDegree) => (prevDegree + 90) % 360);
    };

    const handlePreset = () => {
        listPresets().then((data) => {
            if (data && data.data) {
                data.data.forEach((data) => {
                    if (data.presetData.name == preset) {
                        setHeight(data.presetData.height);
                        setWidth(data.presetData.width);
                    }
                })
            }
        });
    };

    const handleRevert = async () => {
        try {
            fetchHistory({ imageID: params.id }).then((data) => {
                addImage({
                    imageID: params.id, imageMetadata: {
                        name: imageData.image.name,
                        width: width,
                        height: height,
                        quality: imageQuality,
                        fit: fit.toLowerCase(),
                        format: format.toLowerCase(),
                        url: data.image
                    }
                })
                setImageData({
                    image: {
                        name:imageData.image.name,
                        width: width,
                        height: height,
                        quality: imageQuality,
                        fit: fit.toLowerCase(),
                        format: format.toLowerCase(),
                        url: data.image
                    }
                })
                setDisplayImages((prevImages) =>
                    prevImages.map((image) =>
                        image.imageID === params.id ? { ...image, url: data.image } : image
                    )
                );
            })



        }
        catch (e) {
            console.log(e);

        }
    }

    const handleSave = async (filtered = false, imageName = "") => {
        if (imageQuality < 1) {
            setImageQuality(1)
        }
        if (imageQuality > 100) {
            setImageQuality(100)
        }
        try {
            addImage({
                imageID: params.id, imageMetadata: {
                    name: filtered ? imageName : imageData.image.name,
                    width: width,
                    height: height,
                    quality: imageQuality,
                    fit: fit.toLowerCase(),
                    format: format.toLowerCase(),
                    url: filtered ? `/images/${username}/${imageName}.${format}` : imageData.image.url
                }
            })
            setImageData({
                image: {
                    name: filtered ? imageName : imageData.image.name,
                    width: width,
                    height: height,
                    quality: imageQuality,
                    fit: fit.toLowerCase(),
                    format: format.toLowerCase(),
                    url: filtered ? `/images/${username}/${imageName}.${format}` : imageData.image.url
                }
            })
            setDisplayImages((prevImages) =>
                prevImages.map((image) =>
                    image.imageID === params.id ? { ...image, url: filtered ? `/images/${username}/${imageName}.${format}` : imageData.image.url } : image
                )
            );


        }
        catch (e) {
            console.log(e);

        }

        return () => clearTimeout(timer);
    }

    useEffect(() => {
        if (imageRef.current) {
            applyFilter(format);
        }
    }, [format]);

    const applyFilter = (filter) => {
        if (imageRef.current) {
            pixelsJS.filterImg(imageRef.current, filter);
        }
    };

    useEffect(() => {
        if (username) {
            uploadImageData({
                username: username,
                images: [...displayImages]
            }).then(() => setLoading(false));
        }
    }, [displayImages]);

    const handleTest = (formatValue) => {
        setFormat(formatValue)
    }

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setUsername(user);
        }
        const { id } = params;
        listImage({ imageID: id }).then((data) => setImageData(data))

    }, [params])

    useEffect(() => {
        listImageData({ username }).then((data) => {
            if (data && data.images) { setDisplayImages(data.images) }
            else { setDisplayImages([]) }
        });
        listPresets().then((data) => {
            if (data && data.data) {
                setPresets(data.data);
            }
        });

    }, [username]);

    const handleDownload = () => {
        const downloadLink = document.createElement('a');
        downloadLink.href = `/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`;
        downloadLink.download = imageData.image.name + '.' + format;
        downloadLink.click();
      };

    useEffect(() => {
        handlePreset();
    }, [preset])

    useEffect(() => {
        console.log(imageData);
        if (imageData && imageData.image) {
            setImageQuality(imageData.image.quality)
            setWidth(imageData.image.width)
            setHeight(imageData.image.height)
            setFit(imageData.image.fit)
            setFormat(imageData.image.format)
        }
        setLoading(false)
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
                                    <button onClick={() =>  navigator.clipboard.writeText(`http://localhost:8888/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`)} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" >
                                        Copy
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center ms-3">
                                <div>
                                    <button onClick={handleDownload} type="button" className="inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Download
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
                                <select id="formate" value={filter} onChange={(e) => setFilter(e.target.value)} name="formate" autoComplete="formate" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option value="default">Default</option>
                                    <option value="grayscale">Grayscale</option>
                                    <option value="invert">invert</option>
                                    <option value="sepia">sepia</option>
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
                                    <option value="gif">GIF</option>
                                    <option value="blurhash">BLURHASH</option>
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <div className="flex items-center justify-end gap-x-6 w-">
                                <button onClick={handleRevert} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Revert to Original</button>
                            </div>
                        </li>
                        <li className="p-2">
                            <div className="flex items-center justify-end gap-x-6 w-">
                                <button onClick={() => handleRotate(90)} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Rotate Image</button>
                            </div>
                        </li>
                        <li className="p-2">
                            <div className="flex items-center justify-end gap-x-6 w-">
                                <button onClick={handleSaveImage} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
            {loading && <><div className="p-4 sm:ml-64"><div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                <div className="w-full h-[50vh] items-center justify-center flex">
                    <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute">
                    </div>
                </div></div></div> </>}
            {!loading && imageData && imageData.image && <div className="p-4 sm:ml-64">
                <div id="image" className="border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14 min-h-[90vh] flex items-center justify-center">
                    <div style={{ transform: `rotate(${rotationAngle}deg)` }}>
                        {filter == "grayscale" &&  <ImageFilter
                            image={`/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`}
                            filter={"grayscale"}
                        />}
                        {filter == "invert" &&  <ImageFilter
                            image={`/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`}
                            filter={"invert"}
                        />}
                        {filter == "sepia" &&  <ImageFilter
                            image={`/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`}
                            filter={"sepia"}
                        />}
                        {filter == "default" &&  <ImageFilter
                            image={`/.netlify/images?url=${imageData.image.url}&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`}
                        />}
                    </div>
                </div>
            </div>}
        </>
    );

}
