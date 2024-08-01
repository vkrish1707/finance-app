const mongoose = require('mongoose');
const _ = require('lodash');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/yourDatabaseName', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Define schema and model
const ipDynamicSchema = new mongoose.Schema({}, { strict: false });
const ipDynamicModel = mongoose.model('ipReuse', ipDynamicSchema);

// Function to convert object keys to camel case
const convertKeysToCamelCase = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    const camelCaseKey = _.camelCase(key);
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      newObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
    } else {
      newObj[camelCaseKey] = obj[key];
    }
  });

  return newObj;
};

// Function to process documents in chunks
const processDocumentsInChunks = async () => {
  const chunkSize = 100; // Define the size of each chunk
  let skip = 0;
  let hasMoreDocuments = true;

  while (hasMoreDocuments) {
    const docs = await ipDynamicModel.find().skip(skip).limit(chunkSize);
    if (docs.length === 0) {
      hasMoreDocuments = false;
      break;
    }

    for (const doc of docs) {
      const originalDoc = doc.toObject();
      const transformedDoc = convertKeysToCamelCase(originalDoc);

      try {
        // Insert the transformed document
        await ipDynamicModel.create(transformedDoc);
        // Delete the original document
        await ipDynamicModel.deleteOne({ _id: originalDoc._id });
        // Log the transformed document
        console.log('Processed Document:', transformedDoc);
      } catch (error) {
        console.error('Error processing document:', originalDoc, error);
      }
    }

    skip += chunkSize;
  }
  
  console.log('All documents processed.');
};

// Run the processing function
processDocumentsInChunks().catch((error) => {
  console.error('Error processing documents:', error);
}).finally(() => {
  mongoose.connection.close();
});
