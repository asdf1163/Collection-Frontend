import { useState, useEffect, useCallback, useContext } from 'react'
import { Col, Card, Container, Stack, Row, Badge } from 'react-bootstrap'
import { Link, Params, useOutletContext, useParams } from 'react-router-dom'
import { AuthContext, AuthContextType } from '../../../context/AuthContext'
import TemplateItem from '../../../components/Templates/TemplateItem'
import { useTranslation } from 'react-i18next'
import { getCollection } from '../../../common/api/collectionApi'
import { Icollection, Iitem } from '../../../interfaces/collections.interfaces'
import { ThemeContext, ThemeContextType } from '../../../context/ThemeContext'
import Fusion from '../../../components/Filter/Fusion'

interface Iparams {
    collectionId?: string | Readonly<Params<string>>
}

const ItemList = () => {

    const { t } = useTranslation()
    const { collectionId }: Iparams = useParams()
    const { auth } = useContext(AuthContext) as AuthContextType
    const { username, _id }: { username: string, _id: string } = useOutletContext()
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
    const [items, setItems] = useState<Iitem[]>()
    const [displayError, setDisplayError] = useState({ display: false, message: "" })
    const getItemsFromCollection = useCallback(async () => {
        setPending(true)
        try {
            const { data } = await getCollection(`findItemsInCollection/${collectionId}`)
            setCollection(data.collectionData)
            setItems(data.items)
        }
        catch (error: any) {
            setDisplayError({ display: true, message: error.response.data })
        }
        setPending(false)
    }, [collectionId])

    useEffect(() => {
        getItemsFromCollection()
    }, [getItemsFromCollection])

    return pending
        ? <h2>Searching...</h2>
        : (
            <Col>
                <h3>Collection Items</h3>
                <Container className="d-flex flex-row flex-wrap gap-5 justify-content-center">
                    <Stack direction='horizontal' className='d-flex w-100 justify-content-between'>
                        {items
                            ? <Row>
                                <Fusion data={items} options={['name']} changeData={setItems} />
                            </Row>
                            : ""}
                        {((auth._id === _id || auth.privilage === "admin" || auth.privilage === "owner"))
                            ? <TemplateItem type={'create'} dataCollection={collection} setCollection={setCollection} setItems={setItems as React.Dispatch<React.SetStateAction<Iitem[]>>} />
                            : ""}
                    </Stack>
                    {items?.length
                        ? Object.values(items).map((item: Iitem) =>
                            <CardItem key={item._id} username={username} item={item} collection={collection} setCollection={setCollection} setItems={setItems as React.Dispatch<React.SetStateAction<Iitem[]>>} />)
                        : <div>{t('item.textmessage.notfound')}</div>
                    }
                    {displayError.display && displayError.message}
                </Container>
            </Col >
        )
}

interface ICardItemProps {
    username: string,
    item: Iitem,
    collection: Icollection,
    setCollection: React.Dispatch<React.SetStateAction<Icollection>>
    setItems: React.Dispatch<React.SetStateAction<Iitem[]>>
}

const CardItem = ({ username, item, collection, setCollection, setItems }: ICardItemProps): JSX.Element => {
    const { t } = useTranslation()
    const { theme } = useContext(ThemeContext) as ThemeContextType

    return (
        <Card className={`bg-${theme.elementBackgroundColor}`} key={item._id} style={{ width: '250px' }}>
            <Card.Body>
                <img src={item.linkImg} alt='itemImage' width={'200px'} />
            </Card.Body>
            <Card.Body className="d-flex justify-content-between">
                <Col>
                    <h3>{item.name}</h3>
                    <Row>
                        <Col className="d-flex gap-3">
                            {(item.tags as string[]).map((tag: string, index) =>
                                <Badge className='p-2' key={tag + index}>{tag}</Badge>
                            )}
                        </Col>
                    </Row>
                    <Link to={`/${username}/item/${item._id}`}>
                        {t('card.options.readmore')}
                    </Link>
                </Col>
            </Card.Body>
            <Stack direction='horizontal' gap={2} className="p-3 justify-content-center">
                <TemplateItem type={'edit'} dataItem={item} dataCollection={collection} setCollection={setCollection} setItems={setItems} />
            </Stack>
        </Card>
    )
}


export default ItemList