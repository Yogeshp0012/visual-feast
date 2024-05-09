"use client"

import { useEffect, useState } from "react";
import { listImageData, uploadImageData } from "./blobs/homepage-actions";

export default function Home() {

    const generateRandomKey =(length = 10) => {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
      }

    const addNewImage = async (image) => {
        const url = image.split("?")[0];
        const newImage = { imageID: generateRandomKey(), image: `https://images.unsplash.com/${url}?w=420&h=300`, visible: true };
        setDisplayImages((prevImages) => [...prevImages, newImage]);;
        await uploadImageData({parameters: {
            username: localStorage.getItem("username"),
            images:  JSON.stringify(displayImages)
        }});
    }

    const deleteImage = (imageId) => {
        setDisplayImages((prevImages) => prevImages.filter((image) => image.imageID !== imageId));
      };

    const readFile = () => {
        const fileInput = document.getElementById('file-upload');
        const file = fileInput.files[0];
        if (file && !file.type.startsWith('image/')) {
            setFileName("");
            return;
        }
        setFileName(file.name);
        console.log(file);
    }


    const [username, setUsername] = useState("");
    const [albumName, setAlbumName] = useState("Example");
    const [preset, setPreset] = useState(2);
    const [imageQuality, setImageQuality] = useState(49);;
    const [width, setWidth] = useState(32);
    const [height, setHeight] = useState(38);
    const [fit, setFit] = useState("Contain");
    const [format, setFormat] = useState("WEBP");
    const [fileName, setFileName] = useState("")
    const [imageName, setImageName] = useState("Test")
    const [imageUrl, setImageUrl] = useState("photo-1715128083452-065d5045bac1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHx8")
    const [openModal, setOpenModal] = useState(false)
    const [displayImages, setDisplayImages] = useState([])
    const [imagesLength, setImagesLength] = useState(0)

    useEffect(() => {
        const user = localStorage.getItem('username');
        if (user) {
            setUsername(user);
        }
        else {
            fetch("https://randomuser.me/api/").then((res) => res.json()).then((data) => setUsername(data.results[0]["name"]["first"])).then(() => localStorage.setItem("username", username));
        }
       setImagesLength(displayImages.length);
       setOpenModal(false);
       listImageData({keyName: localStorage.getItem(username)}).then((data) => {
        console.log(data);
       });
    }, [username, displayImages]);

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
                            <a href="https://flowbite.com" className="flex ms-2 md:me-24">
                                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white logo">REPIX</span>
                            </a>
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
                            <label htmlFor="album-name" className="block text-sm font-medium leading-6 text-white">Album Name</label>
                            <div className="mt-2">
                                <input value={albumName} onChange={(e) => setAlbumName(e.target.value)} type="text" name="album-name" id="album-name" autoComplete="album-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="select-preset" className="block text-sm font-medium leading-6 text-white">Select Preset</label>
                            <div className="mt-2">
                                <select id="select-preset" value={preset} onChange={(e) => setPreset(e.target.value)} name="select-preset" autoComplete="select-preset" className="block w-full rounded-md border-0 bg-white/5 py-1.5 p-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 [&_*]:text-black">
                                    <option>1</option>
                                    <option>2</option>
                                    <option>3</option>
                                    <option>4</option>
                                    <option>5</option>
                                    <option>6</option>
                                </select>
                            </div>
                        </li>
                        <li className="p-2">
                            <label htmlFor="image-quality" className="block text-sm font-medium leading-6 text-white">Images Quality</label>
                            <div className="mt-2">
                                <input value={imageQuality} onChange={(e) => setImageQuality(e.target.value)} type="number" name="image-quality" id="image-quality" autoComplete="image-quality" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
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
                                <button type="submit" className="rounded-md bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Apply</button>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
            <div className="p-4 sm:ml-64">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        {displayImages && displayImages.map((imageObj) => (
                            <>  {imageObj.visible && <div key={imageObj.imageId} className="flex flex-col items-center justify-center h-32 md:h-96 rounded bg-gray-50 dark:bg-gray-800">          <div className="flex flex-col justify-center items-center w-full h-full">
                                <img
                                    srcSet={`/.netlify/images?url=${imageObj.image}`}
                                    alt="Image"
                                />
                            </div>
                                <div className="flex flex-row justify-center items-center w-full h-24">
                                    <button type="button" className="inline-flex mr-10 w-4 lg:w-32 justify-center disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                        Edit
                                    </button>
                                    <button onClick={() => deleteImage(imageObj.imageID)} type="button" className="inline-flex w-4 lg:w-32 justify-center disabled:cursor-not-allowed items-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                                        Delete
                                    </button>
                                </div> </div>} </>
                        ))}


                        {(imagesLength < 6) && <><div className="flex flex-col items-center justify-center h-32 md:h-96 rounded bg-gray-50 dark:bg-gray-800">
                            {!openModal && <button onClick={() => setOpenModal(true)} type="button" className="w-48 rounded-md bg-indigo-600 p-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                <div className="text-white">Add Image</div>
                            </button>}
                            {openModal && <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute" />}
                        </div></>
                            //   srcSet= {`/.netlify/images?url=images/corgi.jpg&w=${width}&h=${height}&fit=${fit.toLowerCase()}&fm=${format.toLowerCase()}&q=${imageQuality}`}
                        }
                    </div>
                </div>
            </div>
            <>
                {openModal && <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                            <div className="relative transform overflow-hidden rounded-lg bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                <div className="bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                                    <div className="sm:flex sm:items-start">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <h3 className="text-base font-semibold leading-6 text-gray-100" id="modal-title">Add a new image
                                            </h3>
                                            <div className="mt-8 w-[20vw]">
                                                <label htmlFor="image-name" className="block text-sm font-medium leading-6 text-white">Image
                                                    Name</label>
                                                <div className="mt-2">
                                                    <input type="text" value={imageName} onChange={(e) => setImageName(e.target.value)} name="image-name" id="image-name" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                                                </div>
                                            </div>
                                            <div className="mt-2 w-[20vw]">
                                                <label htmlFor="image-url" className="block text-sm font-medium leading-6 text-white">Image
                                                    URL</label>
                                                <div className="flex mt-2 rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                                                    <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">images.unsplash.com/</span>
                                                    <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} type="text" name="image-url" id="image-url" autoComplete="image-url" className="flex-1 outline-none border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm sm:leading-6" />
                                                </div>

                                            </div>
                                            <div className="mt-2 w-[20vw]">
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
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                    <button onClick={() => addNewImage(imageUrl)} type="button" className="ml-3 inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 justify-center  rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 w-20">
                                        Add
                                    </button>
                                    <button onClick={() => setOpenModal(false)} type="button" className="mt-3 inline-flex justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 w-20">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </>
        </>

    );
}
