import { useState, createContext, useEffect } from 'react';

export interface Theme {
    variant: string,
    fontColor: string
    elementBackgroundColor: string
}

export type ThemeContextType = {
    theme: Theme;
    changeTheme: (theme: Theme) => void;
};

export const themeOptions = {
    dark: {
        variant: 'dark',
        fontColor: 'light',
        elementBackgroundColor: 'black'
    },
    light: {
        variant: 'light',
        fontColor: 'dark',
        elementBackgroundColor: 'white'
    }
}

const v = localStorage.getItem('theme')
const initValue = (v === null || v === "light") ? themeOptions.light : themeOptions.dark

export const ThemeContext = createContext<ThemeContextType | null>(null);

const ThemeProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
    const [themeMode, setThemeMode] = useState<Theme>(initValue);

    useEffect(() => {
        localStorage.setItem('theme', themeMode.variant)
    }, [themeMode])

    return (
        <ThemeContext.Provider value={{ theme: themeMode, changeTheme: setThemeMode }}>
            {(themeMode.variant.length && themeMode.fontColor.length)
                ? children
                : <h2>loading</h2>
            }
        </ThemeContext.Provider>
    );
};

export default ThemeProvider;