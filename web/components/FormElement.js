import React, { useState, useEffect } from "react";

const FormElement = ({label, htmlFor, value, onChangeHandler}) => {

    const [inputValue, setInputValue] = useState("");

    const onInputChange = (e) => {
        onChangeHandler(e);
    }

    useEffect(() => {
        setInputValue(value)
    }, [value]);

    return (
        <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={htmlFor}>
                {
                label
                }
            </label>    
            <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                onChange={onInputChange}
                id={htmlFor} type="text" value={inputValue ? inputValue : undefined} placeholder={label} required/>
        </div>
    )
};

export default FormElement;