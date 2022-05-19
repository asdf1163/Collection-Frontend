import { instance, url } from "./defaultApi";
export const getCollection = (param: string) => instance.get(`${url}/collection/${param}`)
export const postCollection = (data: any, param = "") => instance.post(`${url}/collection/${param}`, { data })
export const deleteCollection = (data: any, param = "") => instance.delete(`${url}/collection/${param}`, { data })
export const updateCollection = (data: any, param = "") => instance.put(`${url}/collection/${param}`, { data })