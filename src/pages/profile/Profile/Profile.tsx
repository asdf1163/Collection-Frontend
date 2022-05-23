import { useState, useEffect, useCallback } from 'react'
import { Container, Row } from 'react-bootstrap'
import { Outlet, useParams } from 'react-router-dom'
import { getUser } from '../../../common/api/userApi'
import ProfileNav from './ProfileNav'

const Profile = () => {

    const { username } = useParams<{ username: string }>()
    const [userData, setUserData] = useState({})
    const [displayError, setDisplayError] = useState({ display: false, message: "" })
    const [pending, setPending] = useState(false)

    const getUserData = useCallback(async () => {
        setPending(true)
        try {
            const { data } = await getUser(`users/${username}`)
            if (data) {
                setUserData(data)
                return setPending(false)
            }
        } catch (error: any) {
            setPending(false)
            if (error.response.status === 404)
                setDisplayError({ display: true, message: error.response.data })
            else
                setDisplayError({ display: true, message: 'Server Error' })

        }
    }, [username])

    useEffect(() => {
        getUserData()
    }, [getUserData])


    return (
        <Container className="py-5">
            <Row>
                <h1>{username}</h1>
            </Row>
            {pending
                ? <span>Loading</span>
                : displayError.display
                    ? <h1>{displayError.message}</h1>
                    : (
                        <>
                            <ProfileNav />
                            <Outlet context={userData} />
                        </>
                    )
            }
        </Container >
    )
}

export default Profile