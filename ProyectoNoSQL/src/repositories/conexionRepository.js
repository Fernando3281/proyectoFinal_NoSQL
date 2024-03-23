const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://admin:Ar68Oc8bzZPsKuzo@facebookproyecto.9qbiaks.mongodb.net/?retryWrites=true&w=majority&appName=FacebookProyecto';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let database;

async function connectToDatabase() {
  try {
    await client.connect();
    database = client.db('Facebook');
    console.log('Connected to MongoDB');
    return database;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    throw err;
  }
}

function getDatabase() {
  if (database) {
    return database;
  } else {
    throw new Error('Database not connected');
  }
}

module.exports = { connectToDatabase, getDatabase };