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

    const buildImageDivs = (pictures) => {
        console.log({pictures: pictures});
        if (typeof pictures === 'undefined' || pictures === null || pictures.length === 0) 
           return null;
        else return (
            pictures.map((image) => {
                console.log({image: image});
                if (typeof image !== "undefined" && image !== null) {
                    const src = URL.createObjectURL(image);
                    return (
                        <div className="relative aspect-video col-span-4" key={image.name}>
                            <Image src={src} alt={image.name} className="object-cover" height="120" width="100" />
                        </div>
                    );
                }
            })
        )
        }

    return (
        <div className="h-500">
            <div className="grid grid-cols-12 gap-2 my-2">
             {
                 buildImageDivs(images)   
            }
            </div>
        </div>
    );
};

ImagePreview.propTypes = {
    images: PropTypes.arrayOf(PropTypes.object)
  }
  

export default ImagePreview;
