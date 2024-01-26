exports = async function(email){
  // This default function will get a value and find a document in MongoDB
  // To see plenty more examples of what you can do with functions see: 
  // https://www.mongodb.com/docs/atlas/app-services/functions/

  // Find the name of the MongoDB service you want to use (see "Linked Data Sources" tab)
  var serviceName = "mongodb-atlas";

  // Update these to reflect your db/collection
  var dbName = "GucciGang";
  var collName = "customerProfiles";

  // Get a collection from the context
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  let profile;
  try {

    // Execute a FindOne in MongoDB 
    profile = await collection.findOne({email: email});
    console.log(JSON.stringify({email: email, customerId: context.user.id, foundProfile: profile}))

  } catch(err) {
    console.log("Error occurred while finding user profile:", err.message);

    return { error: err.message };
  }

  // To call other named functions:
  // var result = context.functions.execute("function_name", arg1, arg2);

  return profile;
};