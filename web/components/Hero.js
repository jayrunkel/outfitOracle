import React, { useState, useEffect} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { ArrowNarrowRightIcon } from "@heroicons/react/outline";

const Hero = () => {
  const router = useRouter();
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");

  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault()
    console.log("form submitted");


    const data = {
      prompt: event.target.prompt.value,
      image: event.target.image.value,
    }
                
    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint = '/api/callAIEngine'

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: 'POST',
      // Tell the server we're sending JSON.
      headers: {
        'Content-Type': 'application/json',
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata
    }
    
    console.log("sending data: ", JSONdata);
    try {
        // Make an API call to the route you created in step 2
        /*
        const response = fetch(endpoint, options)
        /*
        const response = await axios({
            method: "post",
            url: "/api/saveProfileForm",
            data: formDataToSend,
            headers: { "Content-Type": "multipart/form-data" },
          });
        */
        /*
        console.log(response.data);
        
        alert(`Presenting search ID data: ${response.data}`)
        */

    router.push({
      pathname: `/products/aiEngine/20240116232701553344`,
      });
    }
    catch (error) {
        console.error('Error sending request to Outfit Oracle Engine:', error);
    }
  }

  const handleImageChange = (e) => {
    setImage(e.target.value);
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
            
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="prompt">
               Describe Your Dream Outfit
             </label>    
             <textarea id="prompt" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Describe your dream outfit..."></textarea>
             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
               Provide Sample Outfit Picture
             </label>
             <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                id="image" type="text" placeholder="Enter Image File" onChange={handleImageChange}/> 
            
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
          src={"https://outfitoracle-mtfxc.mongodbstitch.com/images/" + image}
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
