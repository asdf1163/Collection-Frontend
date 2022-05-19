import { instance, url } from "./defaultApi";
export const getItem = (param = "") => instance.get(`${url}/item/${param}`)
export const postItem = (data: any, param = "") => instance.post(`${url}/item/${param}`, { data: data })
export const deleteItem = (data: any, param = "") => instance.delete(`${url}/item/${param}`, { data })
export const updateItem = (data: any, param = "") => instance.put(`${url}/item/${param}`, { data })