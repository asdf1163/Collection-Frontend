import { useState, useCallback, useEffect, useContext } from 'react'
import { Stack } from 'react-bootstrap'
import TemplateCollection from '../../../components/TemplateCollection'
import CollectionsCard from '../../../components/CollectionsCard'
import { getCollection } from '../../../common/api/collectionApi'
import { useOutletContext } from 'react-router-dom'
import { IuserSchema } from '../../../interfaces/users.interfaces'
import { AuthContext, AuthContextType } from '../../../context/AuthContext'
import { Icollection } from '../../../interfaces/collections.interfaces'

const Collections = () => {

    const { _id, username }: IuserSchema = useOutletContext();
    const { auth } = useContext(AuthContext) as AuthContextType
    const [collections, setCollections] = useState<Icollection[]>([])
    const [displayError, setDisplayError] = useState({ display: false, message: "" })

    const getData = useCallback(async () => {
        try {
            const collections = await getCollection(`find/${_id}`)
            setCollections(collections.data)
        } catch (error: any) {
            setDisplayError({ display: true, message: error.response.data })
        }
    }, [_id])

    useEffect(() => {
        if (_id && username) {
            getData()
        }
    }, [_id, getData, username])


    return (
        <div className='d-flex flex-column gap-2 my-3'>
            <Stack direction='horizontal'>
                {collections.length
                    ? <span> [filter][add search]</span>
                    : ""
                }
                {(auth._id === _id || auth.privilage === "admin" || auth.privilage === "owner") &&
                    <TemplateCollection type={'create'} collectionAuthorId={_id} setCollections={setCollections} />
                }
            </Stack>
            {
                displayError.display
                    ? <h2>{displayError.message}</h2>
                    : collections && collections.map((collection: Icollection) => <CollectionsCard key={collection._id} collection={collection} collectionAuthorId={_id} setCollections={setCollections} />)
            }
        </div >
    )
}
export default Collections