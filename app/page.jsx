"use client"

import { useEffect, useState } from "react";
import { listImageData, uploadImageData } from "./blobs/homepage-actions";
import Link from "next/link";
import { addImage, deleteSelectedImage, listImage } from "./blobs/images-actions";
import { addPreset, listPresets } from "./blobs/preset-actions";
import JSZip from 'jszip';

export default function Home() {

    const generateRandomKey = (length = 10) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    function generateRandomFilename(prefix = '', suffix = '', length = 10) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return prefix + result + suffix;
    }

    const handleAddPreset = () => {
        if (presetWidth < 0) {
            setPresetWidth(100);
        }
        if (presetHeight < 0) {
            setPresetHeight(100);
        }
        try {
            addPreset({ presetData: [...presets, { presetData: { width: presetWidth, height: presetHeight, name: presetName } }] })
            setMessage("Preset added Successfully.")
            setSuccessSnack(true);
            const timer = setTimeout(() => {
                setSuccessSnack(false);
            }, 2000);
        }
        catch (e) {
            setMessage("Preset adding Failed.")
            setErrorSnack(true);
            const timer = setTimeout(() => {
                setErrorSnack(false);
            }, 2000);
        }
        finally {
            document.getElementById('my_modal_1').close()
        }
    }

    const handleDownload = async () => {
        if (imagesLength < 1) {
            setMessage("Please upload an image first.")
            setErrorSnack(true);
            const timer = setTimeout(() => {
                setErrorSnack(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
        const zipFilename = 'images.zip';
        const zip = new JSZip();
        for (const image of displayImages) {
            console.log(image);
            const data = await listImage({ imageID: image.imageID });
            const response = await fetch(`/.netlify/images?url=${data.image.url}&w=${data.image.width}&h=${data.image.height}&fit=${data.image.fit.toLowerCase()}&fm=${data.image.format.toLowerCase()}&q=${data.image.imageQuality}`);
            const d = await response.arrayBuffer();
            zip.file(data.image.name + "." + data.image.format, d, { binary: true });
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(zipBlob);
        downloadLink.download = zipFilename;
        downloadLink.click();
    }

    const applyAllImages = async () => {
        if (imagesLength < 1) {
            setMessage("Please upload an image first.")
            setErrorSnack(true);
            const timer = setTimeout(() => {
                setErrorSnack(false);
            }, 2000);
            return
        }
        if (imageQuality < 1) {
            setImageQuality(1)
        }
        if (imageQuality > 100) {
            setImageQuality(100)
        }
        try {
            for (const image of displayImages) {
                const data = await listImage({ imageID: image.imageID });
                console.log(data);
                addImage({
                    imageID: image.imageID, imageMetadata: {
                        name: data.image.name,
                        width: width,
                        height: height,
                        quality: imageQuality,
                        fit: fit.toLowerCase(),
                        format: format.toLowerCase(),
                        url: data.image.url
                    }
                })
            }
            setMessage("The filters are applied successfully. Please view the image to see the changes.")
            setSuccessSnack(true);
            const timer = setTimeout(() => {
                setSuccessSnack(false);
            }, 5000);
        }
        catch (e) {
            console.log(e);
            setMessage("Failed to apply filters.")
            setErrorSnack(true);
            const timer = setTimeout(() => {
                setErrorSnack(false);
            }, 2000);
        }

        return () => clearTimeout(timer);
    }

    const addNewImage = async (image) => {
        if (file) {
            await handleFileUpload();
        }
        else {
            const url = image.split("?")[0];
            const newImage = { imageID: generateRandomKey(), image: `https://images.unsplash.com/${url}`, url: `https://images.unsplash.com/${url}` };
            addImage({
                imageID: newImage.imageID, imageMetadata: {
                    name: imageName,
                    width: 360,
                    height: 360,
                    quality: 50,
                    fit: "contain",
                    format: "webp",
                    url: `https://images.unsplash.com/${url}`
                }
            })
            setDisplayImages((prevImages) => [...prevImages, newImage]);
            setOpenModal(false);
            setMessage("Image Added Successfully")
            setSuccessSnack(true);
            const timer = setTimeout(() => {
                setSuccessSnack(false);
            }, 2000);

            return () => clearTimeout(timer);
        }

    }

    const deleteImage = (imageId) => {
        deleteSelectedImage({ imageID: imageId });
        setDisplayImages((prevImages) => prevImages.filter((image) => image.imageID !== imageId));
        setMessage("Image Deleted Successfully")
        setSuccessSnack(true);
        const timer = setTimeout(() => {
            setSuccessSnack(false);
        }, 2000);

        return () => clearTimeout(timer);
    };

    const readFile = async () => {
        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0];
        if (file && !file.type.startsWith('image/')) {
            setFileName("");
            return;
        }
        setFileName(file.name);
        setFile(file);
    }

    const handleFileUpload = async () => {
        const fileExtension = file.name.split('.').pop();
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('username', username);
            formData.append('name', imageName);
            formData.append('extension', fileExtension);
            const response = await fetch('/api/fileUpload', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                const newImage = { imageID: generateRandomKey(), image: `/images/${username}/${imageName}.${fileExtension}&w=300&h=300`, url: `/images/${username}/${imageName}.${fileExtension}` };
                addImage({
                    imageID: newImage.imageID, imageMetadata: {
                        name: imageName,
                        width: 360,
                        height: 360,
                        quality: 50,
                        fit: "contain",
                        format: "webp",
                        url: `/images/${username}/${imageName}.${fileExtension}`
                    }
                })

                setDisplayImages((prevImages) => [...prevImages, newImage]);
                setOpenModal(false);
                setMessage("Image Added Successfully")
                setSuccessSnack(true);
                const timer = setTimeout(() => {
                    setSuccessSnack(false);
                }, 2000);

                return () => clearTimeout(timer);
            } else {
                console.error('Error uploading file');
                setMessage("Error Uploading File")
                setErrorSnack(true);
                const timer = setTimeout(() => {
                    setErrorSnack(false);
                }, 2000);

                return () => clearTimeout(timer);
            }
        } catch (error) {
            console.error('An error occurred during file upload:', error);
        }
    };


    const [file, setFile] = useState(null);
    const [username, setUsername] = useState("");
    const [preset, setPreset] = useState("Custom");
    const [imageQuality, setImageQuality] = useState(50);
    const [width, setWidth] = useState(32);
    const [height, setHeight] = useState(38);
    const [fit, setFit] = useState("Contain");
    const [format, setFormat] = useState("WEBP");
    const [fileName, setFileName] = useState("")
    const [imageName, setImageName] = useState(generateRandomFilename('myfile_'))
    const [imageUrl, setImageUrl] = useState("photo-1715128083452-065d5045bac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8")
    const [openModal, setOpenModal] = useState(false)
    const [displayImages, setDisplayImages] = useState([])
    const [imagesLength, setImagesLength] = useState(0)
    const [presets, setPresets] = useState([])
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")
    const [errorSnack, setErrorSnack] = useState(false)
    const [successSnack, setSuccessSnack] = useState(false)
    const [presetWidth, setPresetWidth] = useState(0)
    const [presetHeight, setPresetHeight] = useState(0)
    const [presetName, setPresetName] = useState(generateRandomFilename('mypreset_'))

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setUsername(user);
        } else {
            fetch("https://randomuser.me/api/")
                .then((res) => res.json())
                .then((data) => {
                    const randomUsername = data.results[0]["name"]["first"];
                    setUsername(randomUsername);
                    localStorage.setItem("username", randomUsername);
                });
        }
        // addPreset({ presetData: [{ presetData: { width: 1080, height: 1080, name: "Instagram" } }, { presetData: { width: 1080, height: 1350, name: "Facebook Portrait" } }, { presetData: { width: 1200, height: 630, name: "Facebook Landscape" } }] })
    }, []);

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

    useEffect(() => {
        if (displayImages !== undefined) {
            setImagesLength(displayImages.length);
        }
        if (username) {
            uploadImageData({
                username: username,
                images: [...displayImages]
            }).then(() => setLoading(false));
        }
    }, [username, displayImages]);

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center justify-start rtl:justify-end">
                            <button onClick={()=>document.getElementById('logo-sidebar').classList.toggle("-translate-x-full")} data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
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
                                    <button onClick={handleDownload} type="button" className="inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
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
                                    const selectedPreset = JSON.parse(e.target.value);
                                    if (selectedPreset.name == "Custom") {
                                        setPreset(selectedPreset.name);
                                        return;
                                    }
                                    setHeight(selectedPreset.height);
                                    setWidth(selectedPreset.width);
                                    setPreset(selectedPreset.name);
                                }} name="select-preset" autoComplete="select-preset" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option value={JSON.stringify({ name: "Custom" })}>Custom</option>
                                    {presets && presets.map((ele) => (
                                        <option key={ele.presetData.name} value={JSON.stringify(ele.presetData)}>{ele.presetData.name}</option>
                                    ))}
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="image-quality" className="block text-sm font-medium leading-6 text-white">Images Quality</label>
                            <div className="mt-2">
                                <input min="1" max="100" value={imageQuality} onChange={(e) => {
                                    setImageQuality(e.target.value)
                                }} type="number" name="image-quality" id="image-quality" autoComplete="image-quality" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
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
                                    <option>Contain</option>
                                    <option>Cover</option>
                                </select>
                            </div>
                        </li>

                        <li className="p-2">
                            <label htmlFor="formate" className="block text-sm font-medium leading-6 text-white">Format</label>
                            <div className="mt-2">
                                <select id="formate" value={format} onChange={(e) => setFormat(e.target.value)} name="formate" autoComplete="formate" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option>AVIF</option>
                                    <option>JPG</option>
                                    <option>PNG</option>
                                    <option>WEBP</option>
                                    <option>GIF</option>
                                    <option>BLURHASH</option>
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <div className="flex items-center justify-end gap-x-6 w-">
                                <button onClick={applyAllImages} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Apply</button>
                            </div>
                        </li>
                        <li className="p-2">
                            <div className="flex items-center justify-end gap-x-6 w-">
                                <button onClick={() => { setPresetName(generateRandomFilename('mypreset_')); document.getElementById('my_modal_1').showModal() }} type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Add New Preset</button>
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
            {
                !loading && <div className="p-4 sm:ml-64">
                    <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                            {displayImages && displayImages.map((imageObj) => (
                                <div key={`${imageObj.imageID}-${imageObj.image}`} className="flex flex-col items-center justify-center h-96 rounded bg-gray-50 dark:bg-gray-800">          <div className="flex flex-col justify-center items-center w-full h-full">
                                    <img
                                        srcSet={`/.netlify/images?url=${imageObj.url}&q=50&w=300&h=300`}
                                        alt="Image"
                                    />
                                </div>
                                    <div className="flex flex-row justify-center items-center w-full h-24">
                                        <Link href={`/edit/${imageObj.imageID}`}><button type="button" className="inline-flex mr-10 w-32 justify-center disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                            View / Edit
                                        </button></Link>
                                        <button onClick={() => deleteImage(imageObj.imageID)} type="button" className="inline-flex w-32 justify-center disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                            Delete
                                        </button>
                                    </div> </div>
                            ))}


                            {(imagesLength < 6) && <><div className="flex flex-col items-center justify-center h-96 rounded bg-gray-50 dark:bg-gray-800">
                                {!openModal && <button onClick={() => {setFile(null);setFileName("");setImageName(generateRandomFilename('myfile_')); setOpenModal(true); document.getElementById("add_image").showModal() }} type="button" className="w-48 rounded-md bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    <div className="text-white">Add Image</div>
                                </button>}
                                {openModal && <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute" />}
                            </div></>
                            }
                        </div>
                    </div>
                </div>
            }
            <>
                <dialog id="add_image" className="modal">
                    <div className="modal-box bg-gray-800">
                        <h3 className="font-bold text-lg text-white">Add New Image</h3>
                        <div className="mt-8">
                            <label htmlFor="image-name" className="block text-sm font-medium leading-6 text-white">Image
                                Name</label>
                            <div className="mt-2">
                                <input type="text" value={imageName} onChange={(e) => setImageName(e.target.value)} name="image-name" id="image-name" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </div>
                        <div className="mt-8">
                            <label htmlFor="image-url" className="block text-sm font-medium leading-6 text-white">Image
                                URL</label>
                            <div className="flex mt-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">images.unsplash.com/</span>
                                <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="text" name="image-url" id="image-url" autoComplete="image-url" className="flex-1 outline-none border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6 p-2" />
                            </div>
                        </div>
                        <div className="mt-8">

                            <div className="mt-2">
                                <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-white">Or Upload a Photo</label>
                                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                                        </svg>
                                        <div className="mt-4 flex text-sm leading-6 text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md text-indigo-400 font-semibol focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500">
                                                <span>Upload a file</span>
                                                <input onChange={readFile} id="file-upload" accept="image/*" name="file-upload" type="file" className="sr-only" />
                                            </label>

                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                    </div>

                                </div>
                            </div>
                            {fileName && <span className="mt-4 inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30">{fileName}</span>}
                            <div className="mt-8">
                            <div className="bg-gray-800 sm:flex sm:flex-row-reverse ">
                                <button onClick={() => {addNewImage(imageUrl);document.getElementById("add_image").close(); setOpenModal(false)}} type="button" className="ml-3 inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 justify-center  rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-20">
                                    Add
                                </button>
                                <button onClick={() => {document.getElementById("add_image").close(); setOpenModal(false)}} type="button" className="mt-3 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 w-20">Cancel</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </dialog>
            </>
            <>

                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box bg-gray-800">
                        <h3 className="font-bold text-lg text-white">Add new Preset</h3>
                        <div className="mt-8">
                            <label htmlFor="preset-name" className="block text-sm font-medium leading-6 text-white">
                                Name</label>
                            <div className="mt-2">
                                <input type="name" value={presetName} onChange={(e) => setPresetName(e.target.value)} name="preset-name" id="preset-name" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <label htmlFor="preset-width" className="block text-sm font-medium leading-6 text-white">
                                Width</label>
                            <div className="mt-2">
                                <input type="number" value={presetWidth} onChange={(e) => setPresetWidth(e.target.value)} name="preset-width" id="preset-width" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <label htmlFor="preset-height" className="block text-sm font-medium leading-6 text-white">
                                Height</label>
                            <div className="mt-2">
                                <input type="number" value={presetHeight} onChange={(e) => setPresetHeight(e.target.value)} name="preset-height" id="preset-height" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="bg-gray-800 sm:flex sm:flex-row-reverse ">
                                <button onClick={handleAddPreset} type="button" className="ml-3 inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 justify-center  rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-20">
                                    Add
                                </button>
                                <button onClick={() => document.getElementById("my_modal_1").close()} type="button" className="mt-3 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 w-20">Cancel</button>
                            </div>
                        </div>
                    </div>
                </dialog>
            </>
            {successSnack && <div role="alert" className="alert w-[50vw] md:w-[20vw] justify-center alert-success fixed bottom-4 right-4 flex items-center bg-green-100 text-green-900 rounded-lg p-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{message}</span>
            </div>}
            {errorSnack && <div role="alert" className="alert w-[50vw] md:w-[20vw] justify-center alert-success fixed bottom-4 right-4 flex items-center alert-error rounded-lg p-4 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{message}</span>
            </div>}
        </>

    );
}
