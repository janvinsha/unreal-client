import React, { useState, useEffect } from 'react';
const useApi = apiFunc => {
  const [data, setData] = useState([]);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const request = async (...args) => {
    setLoading(true);
    let response;
    try {
      response = await apiFunc(...args);
      setData(response?.data || response);
      setLoading(false);
      setSuccess(true);
    } catch (error) {
      setError(error || response);
      console.log('USE API ERROR ', error, response);
      setLoading(false);
    }
    console.log('USE API RESPONSE ', response);
    return response;
  };

  return { data, error, loading, request, success };
};

// const request = async (...args) => {
//   setLoading(true);
//   try {
//     const response = await apiFunc(...args);
//     setLoading(false);
//     setData(response.data);
//   } catch (error) {
//     setLoading(false);
//     setError(error);
//   }
//   return;
// };

// return { data, error, loading, request };
// };
export default useApi;
