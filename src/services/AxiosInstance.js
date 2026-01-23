import axios from "axios";

export const AxiosInstance = axios.create({
  baseURL: "https://api.freeapi.app/api/v1/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  },
});

//request intercepts to add access token
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      AxiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }
    return config
  },
  (error) => Promise.reject(error),
);
//response intervepters to handle token refresh 
AxiosInstance.interceptors.response.use(
    (response)=> response, 
    (error)=>{
        const originalRequest = error.config
        // if 401 error and not arleady retired
        if (error.response && error.response.status === 401 && !originalRequest._retry){
            originalRequest._retry = true 
            //attempt to refresh token 
            try{
                //request new token 
                const refreshToken = localStorage.getItem('refreshToken')
                const res= await axios.post(
                    'https://api/freeapi/app/api/v1/users/refresh-token', {refreshToken}
                )
                const {accessToken} = res.data.data
                localStorage.setItem('accessToken',accessToken)
               originalRequest.headers['Authorization']= `Bearer ${accessToken}`
               return AxiosInstance(originalRequest)

            }
            catch(error){
              window.location.href='/login'
              //clear tokens on faillure
              localStorage.removeItem('accessTokens')
              localStorage.removeItem('refreshTokens')
              return Promise.reject(error)
            }

        }
        return Promise.reject
    }
)