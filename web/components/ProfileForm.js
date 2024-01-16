import React, { useState } from "react";
import FormElement from "./FormElement";

const ProfileForm = () => {

    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
    
        // Get data from the form.
        const data = {
          first: event.target.first.value,
          last: event.target.last.value,
        }
    
        // Send the data to the server in JSON format.
        const JSONdata = JSON.stringify(data)
    
        // API endpoint where we send form data.
        const endpoint = '/api/profileForm'
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSONdata,
        }
    
        // Send the form data to our forms API on Vercel and get a response.
        const response = await fetch(endpoint, options)
    
        // Get the response data from server as JSON.
        // If server returns the name submitted, that means the form works.
        const result = await response.json()
        alert(`Is this your full name: ${result.data}`)
    }

return (
    <div class="w-full max-w-xs">
        <form onSubmit={handleSubmit}>
            <FormElement htmlFor="first" label="First Name" />
            <FormElement htmlFor="last" label="Last Name" />
            <FormElement htmlFor="email" label="Email" />
            <FormElement htmlFor="gender" label="Gender" />
            
            <FormElement htmlFor="skinTone" label="Skin Tone" />
            <FormElement htmlFor="heritage" label="Heritage" />
            <FormElement htmlFor="favColor" label="Favorite Color" />
            <FormElement htmlFor="preferredStyle" label="Preferred Style" />
            <FormElement htmlFor="age" label="Age" />

            <div class="flex items-center justify-between">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                Submit
                </button>
            </div>
        </form>
    </div>
)
};

export default ProfileForm;

