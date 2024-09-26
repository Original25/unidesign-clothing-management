// services/apiService.js
import axios from 'axios';

let apiToken = null;
let tokenExpiry = null;

export async function authenticate() {
  try {
    const response = await axios.post(
      `${process.env.API_URL}/v3/authenticate`,
      {
        username: process.env.API_USERNAME,
        password: process.env.API_PASSWORD,
      },
      {
        headers: {
          'x-api-key': process.env.API_KEY,
        },
      }
    );

    apiToken = response.data.token;
    // Assuming token is valid for 1 hour
    tokenExpiry = Date.now() + 55 * 60 * 1000; // Refresh 5 minutes before expiry

    return apiToken;
  } catch (error) {
    console.error('API authentication failed:', error);
    throw error;
  }
}

export async function getApiToken() {
  if (!apiToken || Date.now() >= tokenExpiry) {
    await authenticate();
  }
  return apiToken;
}
export async function fetchProduct(catalogReference) {
    const token = await getApiToken();
  
    try {
      const response = await axios.get(`${process.env.API_URL}/v3/products`, {
        headers: {
          'x-api-key': process.env.API_KEY,
          'x-toptex-authorization': token,
        },
        params: {
          catalog_reference: catalogReference,
        },
      });
  
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }
  