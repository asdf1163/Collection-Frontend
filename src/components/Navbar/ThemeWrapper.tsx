import { useContext } from 'react'
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ThemeContext, ThemeContextType, themeOptions } from '../../context/ThemeContext';

const ThemeWrapper = () => {
    const { t } = useTranslation()
    const { theme, changeTheme } = useContext(ThemeContext) as ThemeContextType;

    const handleThemeChange = () => {
        if (theme.variant === 'dark') changeTheme(themeOptions.light);
        else changeTheme(themeOptions.dark)
    };

    return (
        <Button name="toggleTheme" variant={theme.variant} onClick={handleThemeChange}>
            {t('navbar.theme')}
        </Button>
    );
};

export default ThemeWrapper