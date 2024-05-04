import axios from 'axios';

// Your API key: 43717619-dd56b7f6e3d741678eb84a8f8

const urlApi = `https://pixabay.com/api/`;
const apiKey = '43717619-dd56b7f6e3d741678eb84a8f8';

export function init(api_key) {
  axios.defaults.headers.common['x-api-key'] = api_key;
}
export async function searchImage(query, page) {
  const url = `${urlApi}?key=${apiKey}&q=${encodeURIComponent(
    query
  )}&page=${page}&per_page=20&image_type=photo&orientation=horizontal&safesearch=true`;
  const response = await axios.get(url);
  return response.data;
}
