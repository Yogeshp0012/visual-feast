"use client";

import { listImage } from "app/blobs/images-actions";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Edit() {
    const params = useParams();
    const [imageData, setImageData] = useState(null)

    useEffect(() => {
        const {id} = params;
        listImage({ imageID: id}).then((data) => setImageData(data))
    }, [params])

    return (
        <>
        {imageData.image.quality}
        </>
    );

}
