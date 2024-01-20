// From: https://reacthustle.com/blog/how-to-create-react-multiple-file-upload-using-nextjs-and-typescript?expand_article=1
// components/ImagePreview.tsx
import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";

/*
type Props =
  images: File[];
};
*/


const ImagePreview = ({ images }) => {
    return (
        <div className="h-500">
            <div className="grid grid-cols-12 gap-2 my-2">
                {images.map((image) => {
                    const src = URL.createObjectURL(image);
                    return (
                        <div className="relative aspect-video col-span-4" key={image.name}>
                            <Image src={src} alt={image.name} className="object-cover" height="120" width="100" />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

ImagePreview.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object)
  }
  

export default ImagePreview;
