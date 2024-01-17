import React, { useState, useEffect} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import * as Realm from "realm-web";
import Link from "next/link";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";

const Hero = () => {
  const router = useRouter();
  const [selectedImageId, setSelectedImageId] = useState("");
  const [selectedImageSearchId, setSelectedImageSearchId] = useState("");
  const [selectedImageLink, setSelectedImageLink] = useState("");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);

  async function getImagesFromDB() {
    // add your Realm App Id to the .env.local file
    const REALM_APP_ID = process.env.NEXT_PUBLIC_REALM_APP_ID;
    const app = new Realm.App({ id: REALM_APP_ID });
    const credentials = Realm.Credentials.anonymous();
    try {
      const user = await app.logIn(credentials);
      const allImages = await user.functions.getAllImages();
      setImages(() => allImages);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getImagesFromDB()
  }, []);

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
    console.log("form submitted");


    const data = {
      prompt: event.target.prompt.value,
      image: selectedImageId,
      email: "jay.runkel@mongodb.com"
    }
                
    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = 'http://127.0.0.1:5000/prompt'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata
    }
    
    console.log("sending data: ", JSONdata);
    try {
        // Make an API call to the route you created in step 2

        const response = await fetch(endpoint, options)
        /*
        const response = await axios({
            method: "post",
            url: "/api/saveProfileForm",
            data: formDataToSend,
            headers: { "Content-Type": "multipart/form-data" },
          });
        */

        console.log(response.data);
        
        //alert(`Presenting search ID data: ${response.data}`)
        alert(`[hack] Presenting search ID data: ${selectedImageSearchId}`)
      

    router.push({
      //pathname: `/products/aiEngine/${response.data}`
      pathname: `/products/aiEngine/${selectedImageSearchId}`
      //pathname: `/products/aiEngine/20240117145550948214`
      });
    }
    catch (error) {
        console.error('Error sending request to Outfit Oracle Engine:', error);
    }
  }

  const handleImageChange = (e) => {
    console.log(JSON.stringify(e.target.value));
    const [image, link, searchId] = e.target.value.split("|");
    console.log(image);
    console.log(link);
    console.log(searchId);
    setSelectedImageId(image);
    setSelectedImageLink(link);
    setSelectedImageSearchId(searchId);
  };

  return ( // overflow-hidden bg-cover bg-center relative
    <div>
      <div className="grid grid-cols-2 gap-4">  
        <Image
          src="https://outfitoracle-mtfxc.mongodbstitch.com/images/owl.png"
          alt="Owl Image"
          width="300"
          height="500"
          //layout="fill"
          //objectFit="cover"
          //className="absolute z-0"
        />
        <div className="grid grid-cols-2 gap-4">
          <form name="promptForm" onSubmit={handleSubmit}>
            <div className="w-300 h-300">
            
             <label className="block text-gray-700 text-sm font-bold mb-0" htmlFor="prompt">
               Describe Your Dream Outfit
             </label>    
             <textarea id="prompt" rows="4" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Describe your dream outfit..."></textarea>
             <label className="block text-gray-700 text-sm font-bold mt-4 mb-0" htmlFor="image">
               Provide Sample Outfit Picture
             </label>
             <select id="imageSelect" 
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={selectedImageId + '|' + selectedImageLink + '|' + selectedImageSearchId}
                onChange={handleImageChange}>
                <option value="">Select your preferred look...</option>
                {
                  images.map((image) => 
                    <option key={image._id} value={image._id + "|" + image.image_link + "|" + image.searchID}>{image.image_name}</option>
                  )
                }
              </select>                
            
          <div className="">
        <div className="px-10 max-w-xl">
          
            <button className="flex items-center mt-4 px-3 py-2 bg-green-600 text-white text-sm uppercase font-medium rounded hover:bg-green-500 focus:outline-none focus:bg-green-500"
                    type="submit">
              <span>Outfit Oracle</span>
              <ArrowNarrowRightIcon className="w-5 h-5" />
            </button>
        
        </div>
        
      </div>
        </div>
        </form>          
        <Image
          src={selectedImageLink}
          alt="Outfit Image"
          width="300"
          height="500"
          //layout="fill"
          //objectFit="cover"
          //className="absolute z-0"
        />
      </div>
      </div>
      
    </div>
  );
};

export default Hero;
