import { useState, useEffect, useCallback, useContext } from 'react'
import { Col, Container, Stack, Row } from 'react-bootstrap'
import { Params, useNavigate, useParams } from 'react-router-dom'
import { AuthContext, AuthContextType } from '../../../context/AuthContext'
import TemplateItem from '../../../components/Templates/TemplateItem'
import { useTranslation } from 'react-i18next'
import { getCollection } from '../../../common/api/collectionApi'
import { Icollection, Iitem } from '../../../interfaces/collections.interfaces'
import Fusion from '../../../components/Filter/Fusion'
import ItemCard from '../../../components/ItemCard'

interface Iparams {
    username?: string | Readonly<Params<string>>
    collectionId?: string | Readonly<Params<string>>
}

const ItemList = () => {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const { username, collectionId }: Iparams = useParams()
    const { auth } = useContext(AuthContext) as AuthContextType
    const [pending, setPending] = useState(false)
    const [collection, setCollection] = useState<Icollection>({
        _id: "",
        idUser: "",
        name: "",
        description: "",
        topic: "",
        tags: [""],
        additional: [{
            name: "",
            value: 'text'
        }],
        linkImg: "",
        creationDate: new Date(),
        items: []
    })
    const [items, setItems] = useState<Iitem[]>([])
    const [displayError, setDisplayError] = useState({ display: false, message: "" })
    const getItemsFromCollection = useCallback(async () => {
        setPending(true)
        try {
            const { data } = await getCollection(`findItemsInCollection/${collectionId}`)
            if (!username || (username !== data.users.username)) {
                return navigate(`/${data.users.username}/collection/${collectionId}`, { replace: true })
            }
            setCollection(data.collectionData)
            setItems(data.items)
        }
        catch (error: any) {
            if (error.response.status === 404) {
                setDisplayError({ display: true, message: "Not found" })
            } else {
                setDisplayError({ display: true, message: "Server error" })
            }
        }
        setPending(false)
    }, [collectionId, navigate, username])

    useEffect(() => {
        getItemsFromCollection()
    }, [getItemsFromCollection])

    return pending
        ? <h2>Searching...</h2>
        : (displayError.display
            ? <h2>{displayError.message}</h2>
            : <Col>
                <h3>Collection Items</h3>
                <Container className="d-flex flex-row flex-wrap gap-5 justify-content-center">
                    <Stack direction='horizontal' className='d-flex w-100 justify-content-between'>
                        {items
                            ? <Row>
                                <Fusion data={items} options={['name']} changeData={setItems} />
                            </Row>
                            : ""}
                        {((auth._id === collection?.users?._id || auth.privilage === "admin" || auth.privilage === "owner"))
                            ? <TemplateItem type={'create'} dataCollection={collection} setCollection={setCollection} setItems={setItems as React.Dispatch<React.SetStateAction<Iitem[]>>} />
                            : ""}
                    </Stack>
                    {items?.length
                        ? Object.values(items).map((item: Iitem) =>
                            <div key={item._id} style={{ width: '250px' }}>
                                <ItemCard username={username} item={item} />
                                {(auth._id === collection?.users?._id || auth.privilage === "admin" || auth.privilage === "owner")
                                    ? <TemplateItem type={'edit'} dataItem={item} dataCollection={collection} setCollection={setCollection} setItems={setItems as React.Dispatch<React.SetStateAction<Iitem[]>>} />
                                    : ""
                                }
                            </div>
                        )
                        : <div>{t('action.notfound')}</div>
                    }
                    {displayError.display && displayError.message}
                </Container>
            </Col >
        )
}

export default ItemList