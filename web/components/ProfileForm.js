import React, { useState, useEffect } from "react";
import FormElement from "./FormElement";
import * as Realm from "realm-web";

const ProfileForm = () => {
    const [profile, setProfile] = useState({});

    const getFormValues = async (event) => {
        event.preventDefault();

        let email = event.target.email.value;
        // add your Realm App Id to the .env.local file
        const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const credentials = Realm.Credentials.anonymous();
            
        try {
              const user = await app.logIn(credentials);
              console.log("getting profile for email: ", email);
              const userProfile = await user.functions.getProfile(email);
              console.log(userProfile);
              setProfile(() => userProfile);

            } catch (error) {
              console.error(error);
            }
        }


    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        console.log("form submitted");
    
        // Get data from the form.
        const data = {
          first: event.target.first.value,
          last: event.target.last.value,
          gender: event.target.gender.value,
          skinTone: event.target.skinTone.value,
          heritage: event.target.heritage.value,
          favColor: event.target.favColor.value,
          preferredStyle: event.target.preferredStyle.value,
          age: event.target.age.value,
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
    <div className="w-full max-w-xs">
        <form name="loginForm" onSubmit={getFormValues}>
            <FormElement htmlFor="email" label="Email"/>
            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Login
                </button>
            </div>
        </form>
        <form className="pt-20" name="profileForm" onSubmit={handleSubmit}>
            <FormElement htmlFor="first" label="First Name" value={profile ? profile.first : undefined}/>
            <FormElement htmlFor="last" label="Last Name" value={profile ? profile.last : undefined}/>
            <FormElement htmlFor="gender" label="Gender" value={profile ? profile.gender: undefined}/>
            <FormElement htmlFor="skinTone" label="Skin Tone" value={profile ? profile.skinTone : undefined}/>
            <FormElement htmlFor="heritage" label="Heritage" value={profile ? profile.heritage: undefined}/>
            <FormElement htmlFor="favColor" label="Favorite Color" value={profile ? profile.favColor : undefined}/>
            <FormElement htmlFor="preferredStyle" label="Preferred Style" value={profile ? profile.preferredStyle : undefined}/>
            <FormElement htmlFor="age" label="Age" value={profile ? profile.age : undefined}/>

            <div className="flex items-center justify-between">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                Submit
                </button>
            </div>
        </form>
    </div>
)
};

export default ProfileForm;

