import React, { useState, createContext, useEffect, useRef, useCallback } from 'react';
import { checkAuth } from '../common/api/userApi';
import { IuserSchema } from '../interfaces/users.interfaces';

export type AuthContextType = {
    auth: IuserSchema;
    setAuth: (auth: IuserSchema) => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {

    const pending = useRef(false)
    const [auth, setAuth] = useState<IuserSchema>(
        {
            _id: '',
            username: '',
            email: '',
            status: "unlocked",
            privilage: 'guest',
            likes: []
        }
    )

    const checkAuthUser = useCallback(async () => {
        pending.current = true
        const { data }: { data: { user: IuserSchema } } = await checkAuth()
        setAuth(data.user)
        pending.current = false
        return data.user
    }, [])

    useEffect(() => {
        checkAuthUser()
    }, [checkAuthUser])

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {pending.current
                ? <h2>Loading</h2>
                : children
            }
        </AuthContext.Provider>
    );
};

export default AuthProvider;