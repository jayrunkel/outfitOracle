exports = async function(email, image){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/
  
  console.log(JSON.stringify({email: email, image: image}));

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "GucciGang";
  var collName = "customerProfiles";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  let updateResult;
  try {

    // Execute a FindOne in MongoDB 
    updateResult = await collection.updateOne(
      {email: email}, 
      {$set : {image : image}},
      {upsert: true}
    );

  } catch(err) {
    console.log("Error occurred while updating user profile:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  return { result: updateResult };
};