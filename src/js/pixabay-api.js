import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export function responseData(requestWords, additionalParams = {}) {
  const requestParams = {
    key: '49206664-0ec6b9af3cdb6ffe721ed5088',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    ...additionalParams,
  };

  return axios
    .get('', {
      params: requestParams,
    })
    .then(response => {
      return response.data;
    })
    .catch(error => {
      throw error;
    });
}