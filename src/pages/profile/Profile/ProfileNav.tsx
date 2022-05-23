import React from 'react'
import { Button, ButtonToolbar, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'


const ProfileNav = () => {
    const { t } = useTranslation()
    return (
        <Stack direction="horizontal">
            <ButtonToolbar className='gap-2 my-2'>
                <Link to=""><Button>{t("profile.profilenavbar.main")}</Button></Link>
                <Link to="collection"><Button>{t("profile.profilenavbar.collection")}</Button></Link>
                <Link to="liked"><Button>{t("profile.profilenavbar.liked")}</Button></Link>
            </ButtonToolbar>
        </Stack>
    )
}

export default ProfileNav