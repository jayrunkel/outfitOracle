"use client";
import React, { useState, useEffect } from "react";
import FormElement from "./FormElement";
import * as Realm from "realm-web";
import CustomFileSelector from "./CustomFileSelect";
import ImagePreview from "./ImagePreview";
import process from "process";
//import axios from "axios";
//import FormData from "formdata";
//import axios from 'axios';

const ProfileForm = () => {
    const [profile, setProfile] = useState({});
    const [email, setEmail] = useState("");
    const [images, setImages] = useState([]); //File[]
    const [imageBase64, setImageBase64] = useState("");

    const getFormValues = async (event) => {
        event.preventDefault();

        /*
        let email = event.target.email.value;
        setEmail(email);
        */
        // add your Realm App Id to the .env.local file
        const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
        const app = new Realm.App({ id: REALM_APP_ID });
        const credentials = Realm.Credentials.anonymous();
            
        try {
              const user = await app.logIn(credentials);
              console.log("getting profile for email: ", email);
              const userProfile = await user.functions.getProfile(email);
              console.log(userProfile);
              setProfile(() => userProfile ? userProfile : {});
              console.log(`User profile for ${email}: ${JSON.stringify(profile)}`);

        } catch (error) {
              console.error(error);
        }    
    }

    const handleFileSelected = (e) => {
        if (e.target.files) {
          //convert `FileList` to `File[]`
          const _files = Array.from(e.target.files);
          setImages(_files);

          convertFileToBase64(_files[0])
             .then(result => setImageBase64(result))
             .catch(error => console.error(error));
        }
    };

    const handleInputChange = (fieldName, event) => {
/*        
        if (e.target.name === 'image') {
            setProfile({
              ...profile,
              image: event.target.files[0],
            });
        } else {
*/       console.log("Updating field: ", fieldName);
         setProfile({
              ...profile,
              [fieldName]: event.target.value,
            });
//        }
    };
        
    function convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          // Typescript users: use following line
          // reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
    }
    
    const handleSubmit = async (event) => {
        // Stop the form from submitting and refreshing the page.
        event.preventDefault()
        console.log("form submitted");

        console.log(profile);

        /*
        const formDataToSend = new FormData();
        formDataToSend.append('first', profile.name);
        formDataToSend.append('email', profile.email);
       formDataToSend.append('first', event.target.first.value);
        formDataToSend.append('last', event.target.last.value);
        formDataToSend.append('gender', event.target.gender.value);
        formDataToSend.append('skinTone', event.target.skinTone.value);
        formDataToSend.append('heritage', event.target.heritage.value);
        formDataToSend.append('favColor', event.target.favColor.value);
        formDataToSend.append('preferredStyle', event.target.preferredStyle.value);
        formDataToSend.append('age', event.target.age.value);
        formDataToSend.append('email', email);
        */
      
        const data = {
          ...profile,
          email,
          imageBase64
        }

        /*
        const formData = new FormData();
        Object.keys(profile).forEach((field) => {
            formData.append(field, profile[field]);
        });
        formData.append("images", images[0]);
        formData.append("image", images[0].name);
        formData.append("email", email);
        */
        // API endpoint where we send form data.
        const endpoint = '/api/saveProfileForm'
    
        // Form the request for sending data to the server.
        const options = {
          // The method is POST because we are sending data.
          mode: 'no-cors',
          method: 'POST',
          // Tell the server we're sending JSON.
          headers: {
            'Content-Type': 'application/json',
          },
          // Body of the request is the JSON data we created above.
          body: JSON.stringify(data)
        }
        console.log("endpoint ", endpoint);
        console.log("post options ", options);
        //console.log("sending data: ", formData);
        try {
            // Make an API call to the route you created in step 2

            const response = await fetch(endpoint, options)
            //const response = await axios.post(endpoint, formData, {mode: 'no-cors'});
            
            console.log(response.data);
            alert(`Profile saved`)
        }
        catch (error) {
            console.error('Error uploading image:', error);
        }
              
    }

useEffect(() => {
    console.log("useEffect: updating form");
    generateForm(profile)
}, [profile, images]);

const generateForm = (lProfile) => {
    console.log("generateForm: ", lProfile);
  
    return (
        <div className="w-full">
            <div className="w-full">
                <form name="loginForm" onSubmit={getFormValues}>
                    <FormElement htmlFor="email" label="Email" onChangeHandler={(event) => setEmail(event.target.value)}/>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                       Login
                        </button>
                    </div>
                </form>
            </div>
            <div className="grid grid-cols-2 gap-10">
                <form className="pt-20" name="profileForm" onSubmit={handleSubmit}>
                    <FormElement htmlFor="first" label="First Name" value={lProfile ? lProfile.first : undefined} onChangeHandler={(event) => handleInputChange("first", event)}/>
                    <FormElement htmlFor="last" label="Last Name" value={lProfile ? lProfile.last : undefined} onChangeHandler={(event) => handleInputChange("last", event)}/>
                    <FormElement htmlFor="gender" label="Gender" value={lProfile ? lProfile.gender: undefined} onChangeHandler={(event) => handleInputChange("gender", event)}/>
                    <FormElement htmlFor="skinTone" label="Skin Tone" value={lProfile ? lProfile.skinTone : undefined} onChangeHandler={(event) => handleInputChange("skinTone", event)}/>
                    <FormElement htmlFor="heritage" label="Heritage" value={lProfile ? lProfile.heritage: undefined} onChangeHandler={(event) => handleInputChange("heritage", event)}/>
                    <FormElement htmlFor="favColor" label="Favorite Color" value={lProfile ? lProfile.favColor : undefined} onChangeHandler={(event) => handleInputChange("favColor", event)}/>
                    <FormElement htmlFor="preferredStyle" label="Preferred Style" value={lProfile ? lProfile.preferredStyle : undefined} onChangeHandler={(event) => handleInputChange("preferredStyle", event)}/>
                    <FormElement htmlFor="age" label="Age" value={lProfile ? lProfile.age : undefined} onChangeHandler={(event) => handleInputChange("age", event)}/>
                    <FormElement htmlFor="pictureFile" label="Picture File" value={lProfile.pictureFile ? lProfile.pictureFile : undefined} onChangeHandler={(event) => handleInputChange("pictureFile", event)}/>
                    <FormElement htmlFor="pantSize" label="Pant Size" value={lProfile.pantSize ? lProfile.pantSize : undefined} onChangeHandler={(event) => handleInputChange("pantSize", event)}/>
                    <FormElement htmlFor="shirtSize" label="Shirt Size" value={lProfile.shirtSize ? lProfile.shirtSize : undefined} onChangeHandler={(event) => handleInputChange("shirtSize", event)}/>
                    <CustomFileSelector accept="image/png, image/jpeg" onChange={handleFileSelected}/>
                    <div className="flex items-center justify-between">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                        Submit
                        </button>
                    </div>
                </form>
                <div className="mb-4 pt-20">
                    <label id="profileImageLabel" className="block text-gray-700 text-sm font-bold mb-2">Profile Images</label>
                    <ImagePreview images={images}/>
                </div>
            </div>
        </div>
    )
        
}

return (
    
            generateForm(profile)
    )

};

export default ProfileForm;

/*
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Profile Picture
                </label>    
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="image" type="file" name="image" onChange={handleInputChange} />
            </div>

*/