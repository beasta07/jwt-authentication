import { QueryClient, useMutation } from "@tanstack/react-query";
import axios, { Axios } from "axios";
import { AxiosInstance } from "./AxiosInstance";

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await AxiosInstance.post("/users/register", data);
      return response.data;
    },
  });
};
export const useLogin = ()=>{
    return useMutation({
        mutationFn: async (data) => {
            const response = await AxiosInstance.post('/users/login',data)
            return response
        }
    })
}
