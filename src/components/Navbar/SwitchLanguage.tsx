import React from 'react'
import { Dropdown } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { GoGlobe } from 'react-icons/go'


const SwitchLanguage = () => {

    const { i18n } = useTranslation()
    const changeLanguage = (option: 'en' | 'pl') => {
        return i18n.changeLanguage(option)
    }

    return (
        <Dropdown>
            <Dropdown.Toggle>
                <GoGlobe />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item onClick={() => changeLanguage('en')}>English</Dropdown.Item>
                <Dropdown.Item onClick={() => changeLanguage('pl')}>Polski</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default SwitchLanguage