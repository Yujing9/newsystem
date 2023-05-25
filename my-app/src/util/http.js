import axios from 'axios'

axios.defaults.baseURL="http://localhost:3001"

// axios.defaults.headers

// axios.interceptors.request.use
// axios.interceptors.response.use

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // 显示loading
    
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data

   
    
    //隐藏loading
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
   
    
     //隐藏loading
    return Promise.reject(error);
  });
