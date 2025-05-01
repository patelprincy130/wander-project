import mongoose from 'mongoose';
import axios from 'axios';
import Listing from './models/listing.js'; 
import dotenv from 'dotenv';
dotenv.config();

async function updateListings() {
  try {
    await mongoose.connect(process.env.MONGO_URL); 
    console.log('MongoDB connected');

    const listings = await Listing.find({});
    const mapboxToken = process.env.MAP_TOKEN; // Changed to MAP_TOKEN to match your .env

    for (let listing of listings) {
      try {
        // Check if location exists
        if (listing.location) {
          const geoData = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(listing.location)}.json`, {
            params: {
              access_token: mapboxToken
            }
          });

          if (geoData.data && geoData.data.features && geoData.data.features.length > 0) {
            listing.geometry = geoData.data.features[0].geometry;
            await listing.save();
            console.log(`Updated listing ${listing._id} successfully.`);
          } else {
            console.log(`No geodata found for listing ${listing._id}, location: ${listing.location}`);
          }
        } else {
          console.log(`No location provided for listing ${listing._id}`);
        }

      } catch (err) {
        console.error(`Failed to update listing ${listing._id}:`, err.message);
      }
    }

    console.log('All listings processed.');
    mongoose.connection.close();
  } catch (err) {
    console.error('Error connecting to MongoDB or updating listings:', err.message);
    mongoose.connection.close();
  }
}

updateListings();
