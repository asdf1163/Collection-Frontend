import { useContext, useEffect } from 'react'
import { Button } from 'react-bootstrap';
import { ThemeContext, ThemeContextType, themeOptions } from '../../context/ThemeContext';

const ThemeWrapper = () => {
    const { theme, changeTheme } = useContext(ThemeContext) as ThemeContextType;
    
    const handleThemeChange = () => {
        if (theme.variant === 'dark') changeTheme(themeOptions.light);
        else changeTheme(themeOptions.dark)
    };

    return (
        <Button name="toggleTheme" variant={theme.variant} onClick={handleThemeChange}>
            Theme
        </Button>
    );
};

export default ThemeWrapper