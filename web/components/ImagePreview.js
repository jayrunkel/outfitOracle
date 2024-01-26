import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";


const ImagePreview=({ images, onClick }) =>
{
    const MagnifyingGlassIcon=() => (
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 490 490">
            <path fill="none" stroke="#FFF" strokeWidth="36" strokeLinecap="round"
                d="m280,278a153,153 0 1,0-2,2l170,170m-91-117 110,110-26,26-110-110" />
        </svg>
    );

    const buildImageDivs=(pictures) =>
    {
        if (typeof pictures==='undefined'||pictures===null||pictures.length===0)
            return null;
        else return (
            pictures.map((image) =>
            {
                if (typeof image!=="undefined"&&image!==null) {
                    const src=URL.createObjectURL(image);
                    return (
                        <div className="image-container" key={image.name} onClick={() => onClick(src)}>
                            <Image src={src} alt={image.name} className="object-cover" layout="fill" />
                            <div className="magnifying-glass">
                                <MagnifyingGlassIcon />
                            </div>
                        </div>
                    );
                }
            })
        )
    }

    return (

        <div className="grid grid-cols-12 gap-2 my-2">
            {buildImageDivs(images)}
        </div>

    );
};

ImagePreview.propTypes={
    images: PropTypes.arrayOf(PropTypes.object),
    onClick: PropTypes.func // Add onClick to propTypes
}

export default ImagePreview;
