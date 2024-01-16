import React, { useState } from "react";

const FormElement = ({label, htmlFor, value}) => {

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={htmlFor}>
                {
                label
                }
            </label>    
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id={htmlFor} type="text" value={value ? value : undefined} placeholder={label} required/>
        </div>
    )
};

export default FormElement;