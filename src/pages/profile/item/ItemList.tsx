import { useState, useEffect, useCallback, useContext } from 'react'
import { Col, Card, Container, Stack, Row, Badge } from 'react-bootstrap'
import { Link, Params, useOutletContext, useParams } from 'react-router-dom'
import { AuthContext, AuthContextType } from '../../../context/AuthContext'
import TemplateItem from '../../../components/TemplateItem'
import { useTranslation } from 'react-i18next'
import { postCollection } from '../../../common/api/collectionApi'
import { Icollection, Iitem } from '../../../interfaces/collections.interfaces'
import { ThemeContext, ThemeContextType } from '../../../context/ThemeContext'


interface Iparams {
    collectionId?: string | Readonly<Params<string>>
}

const ItemList = () => {

    const { collectionId }: Iparams = useParams()
    const { auth } = useContext(AuthContext) as AuthContextType
    const { username, _id }: { username: string, _id: string } = useOutletContext()
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
    const [displayError, setDisplayError] = useState({ display: false, message: "" })
    const getItemsFromCollection = useCallback(async () => {
        try {
            const result = await postCollection({ collectionId }, 'findItemsInCollection')
            setCollection(result.data[0])
        }
        catch (error: any) {
            setDisplayError({ display: true, message: error.response.data })
        }
    }, [collectionId])

    useEffect(() => {
        getItemsFromCollection()
    }, [getItemsFromCollection])

    return (
        <Col>
            <h3>Collection Items</h3>
            <Container className="d-flex flex-row flex-wrap gap-5 justify-content-center">
                <Row className="w-100">
                    <Stack direction='horizontal'>
                        {collection ? <span>[filter] [add search]</span> : ""}
                        {((auth._id === _id || auth.privilage === "admin" || auth.privilage === "owner"))
                            ? <TemplateItem type={'create'} dataCollection={collection} setCollection={setCollection} />
                            : ""
                        }
                    </Stack>
                </Row>
                {collection?.items?.length
                    ? Object.values(collection?.items).map((item: Iitem) =>
                        <CardItem key={item._id} username={username} item={item} collection={collection} setCollection={setCollection} />)
                    : <div>Not found</div>
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
}

const CardItem = ({ username, item, collection, setCollection }: ICardItemProps): JSX.Element => {
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
                            {(item.tags as string[]).map((tag: string) =>
                                <Badge className='p-2' key={item.name + tag}>{tag}</Badge>
                            )}
                        </Col>
                    </Row>
                    <Link to={`/${username}/item/${item._id}`}>
                        {t('card.options.readmore')}
                    </Link>
                </Col>
            </Card.Body>
            <Stack direction='horizontal' gap={2} className="p-3 justify-content-center">
                <TemplateItem type={'edit'} dataItem={item} dataCollection={collection} setCollection={setCollection} />
            </Stack>
        </Card>
    )
}


export default ItemList