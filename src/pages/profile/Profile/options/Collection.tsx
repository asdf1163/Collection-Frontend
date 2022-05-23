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
    const [collections, setCollections] = useState<Icollection[]>()
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

    return collections ? (
        <div className='d-flex flex-column gap-2 my-3'>
            <Stack direction='horizontal'>
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
                displayError.display
                    ? <h2>{displayError.message}</h2>
                    : (collections.length ? collections.map((collection: Icollection) => <CollectionsCard key={collection._id} collection={collection} setCollections={setCollections as IsetCollections} />) : <h2>{t('item.textmessage.notfound')}</h2>)
            }
        </div>
    ) : <></>
}
export default Collections