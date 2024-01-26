

export default async function handler(req, res)
{

    //const body = JSON.parse(req.body);

    const payload={
        prompt: req.body.prompt,
        customerId: req.body.customerId,
        search_Id: req.body.search_Id,
        number: req.body.number,
    }
    // Send the data to the server in JSON format.
    //const JSONdata = JSON.stringify(data)

    // API endpoint where we send form data.
    const endpoint='http://127.0.0.1:5000/search_progress'

    // Form the request for sending data to the server.
    const options={
        // The method is POST because we are sending data.
        method: 'POST',
        // Tell the server we're sending JSON.
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        // Body of the request is the JSON data we created above.
        body: JSON.stringify(payload)
    }

    console.log("searchProgress: ", payload);
    try {
        // Make an API call to the route you created in step 2

        const response=await fetch(endpoint, options);


        let body=await response.json();
        console.log(body);

        res.status(200).json(body);
        //alert(`Presenting search ID data: ${response.data}`)
        //alert(`[hack] Presenting search ID data: ${selectedImageSearchId}`)
    }
    catch (error) {
        console.error('Error sending request to searchProgress:', error);
        res.status(400).json(error);
    }
}
