// From: https://reacthustle.com/blog/how-to-create-react-multiple-file-upload-using-nextjs-and-typescript?expand_article=1
// components/CustomFileSelector.tsx
import * as classNames from "classnames";
import React from "react";


const CustomFileSelector = (props) => {
  return (
    <input
      {...props}
      type="file"
      multiple
      className={classNames({
        // Modify the Button shape, spacing, and colors using the `file`: directive
        // button colors
        "file:bg-violet-50 file:text-violet-500 hover:file:bg-violet-100": true,
        "file:rounded-lg file:rounded-tr-none file:rounded-br-none": true,
        "file:px-4 file:py-2 file:mr-4 file:border-none": true,
        // overall input styling
        "hover:cursor-pointer border rounded-lg text-gray-400": true,
      })}
    />
  );
};

export default CustomFileSelector;
