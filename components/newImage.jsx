import React from 'react'

export function newImage (){
    return (
        <>
            <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                                                <input type="text" name="image-name" id="image-name" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
                                            </div>
                                        </div>
                                        <div className="mt-2 w-[20vw]">
                                            <label htmlFor="image-url" className="block text-sm font-medium leading-6 text-white">Image
                                                URL</label>
                                            <div className="mt-2">
                                                <input type="text" name="image-url" id="image-url" autoComplete="given-name" className="block p-2 w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 outline-none" />
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
                                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                                        </label>
                                                        <p className="pl-1">or drag and drop</p>
                                                    </div>
                                                    <p className="text-xs leading-5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                <button type="button" className="ml-3 inline-flex disabled:cursor-not-allowed items-center gap-x-1.5 w-16 justify-center  rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                                    Add
                                </button>
                                <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto">Cancel</button>
                                <button type="button" className="mt-3 mr-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-gray-100 shadow-sm ring-1 ring-inset ring-gray-300 sm:mt-0 sm:w-auto">Upload Random</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
