import { IuserSchema, IuserPost } from "../../interfaces/users.interfaces";
import { instance, url } from "./defaultApi";
interface AuthProps {
    data: IuserPost,
    param: "signin" | "signup"
}
interface FullDataUserProps {
    data?: Partial<IuserSchema>,
    param: string
}

export const checkAuth = () => instance.get(`${url}/user/checksession`)
export const getUser = (param: string = "") => instance.get(`${url}/user/${param}`)
export const postUser = ({ data, param }: AuthProps) => instance.post(`${url}/user/${param}`, { data })
export const updateUser = ({ data, param }: FullDataUserProps) => instance.put(`${url}/user/${param}`, { data })
export const deleteUser = ({ param }: FullDataUserProps) => instance.delete(`${url}/user/${param}`)