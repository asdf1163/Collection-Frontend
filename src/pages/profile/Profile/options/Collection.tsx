import { useState, useCallback, useEffect, useContext } from 'react'
import { Stack, Row } from 'react-bootstrap'
import { getCollection } from '../../../../common/api/collectionApi'
import { useOutletContext } from 'react-router-dom'
import { IuserSchema } from '../../../../interfaces/users.interfaces'
import { AuthContext, AuthContextType } from '../../../../context/AuthContext'
import { Icollection } from '../../../../interfaces/collections.interfaces'
import { useTranslation } from 'react-i18next'
import CollectionsCard from '../../../../components/CollectionsCard'
import TemplateCollection from '../../../../components/Templates/TemplateCollection'
import Fusion from '../../../../components/Filter/Fusion'

type IsetCollections = React.Dispatch<React.SetStateAction<Icollection[]>>

const Collections = () => {

    const { _id, username }: IuserSchema = useOutletContext();
    const { auth } = useContext(AuthContext) as AuthContextType
    const { t } = useTranslation()
    const [pending, setPending] = useState(false)
    const [collections, setCollections] = useState<Icollection[]>([])
    const [displayError, setDisplayError] = useState({ display: false, message: "" })

    const getData = useCallback(async () => {
        setPending(true)
        try {
            const { data, status } = await getCollection(`find/${_id}`)
            if (status === 200)
                setCollections(data)
        } catch (error: any) {
            setDisplayError({ display: true, message: error.response.data })
        }
        setPending(false)
    }, [_id])

    useEffect(() => {
        if (_id && username) {
            getData()
        }
    }, [_id, getData, username])

    return pending
        ? <h2>{t('action.loading')}</h2>
        : displayError.display
            ? <h2>{displayError.message}</h2>
            : (
                <div className='d-flex flex-column gap-2 my-3'>
                    <Stack direction='horizontal' className='justify-content-between'>
                        <Row className="g-0">
                            {(!displayError.display)
                                ?
                                <Fusion
                                    data={collections}
                                    changeData={setCollections}
                                    options={['name', 'topic', 'description']}
                                />
                                : ""}
                        </Row>
                        {(auth._id === _id || auth.privilage === "admin" || auth.privilage === "owner") &&
                            <TemplateCollection type={'create'} setCollections={setCollections as IsetCollections} />
                        }
                    </Stack>
                    {
                        (collections?.length ? collections?.map((collection: Icollection) =>
                            <div key={collection._id}>
                                <CollectionsCard collection={collection} />
                                {(auth._id === collection.idUser || auth.privilage === "admin" || auth.privilage === "owner") ?
                                    <div className="d-flex justify-content-end gap-2">
                                        <TemplateCollection type={'edit'} dataCollection={collection} setCollections={setCollections as IsetCollections} />
                                    </div> : ""}
                            </div>
                        ) : <h2>{t('action.notfound')}</h2>)
                    }
                </div>
            )
}
export default Collections