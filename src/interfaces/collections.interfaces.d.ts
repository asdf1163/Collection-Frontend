import { IuserSchema } from "./users.interfaces"

export interface Icollection {
    _id: any,
    idUser: string,
    name: string,
    description: string,
    topic: string,
    tags: string[],
    additional: {
        name: string,
        value: 'number' | 'text' | 'checkbox' | 'date' | 'textarea'
    }[],
    linkImg: string,
    creationDate: Date,
    items?: Iitem[]
    users?: IuserSchema
}

export interface Iitem {
    _id: any,
    name: string,
    collectionId: string,
    tags: string | string[],
    linkImg?: string,
    additional: {
        name: string,
        value: any
    },
    ownerId: any,
    owner?: { username: string, _id: string },
    creationDate: Date,
    likes: any[],
    comments: {
        userId?: string,
        message: string,
    }
}