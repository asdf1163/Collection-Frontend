import { useEffect, useState } from 'react'
import { Badge, Col, Container, Row } from 'react-bootstrap'
import { getCollection } from '../common/api/collectionApi'
import { getItem } from '../common/api/itemApi'
import CollectionsCard from '../components/CollectionsCard'
import ItemCard from '../components/ItemCard'
import { Icollection, Iitem } from '../interfaces/collections.interfaces'
import { useTranslation } from 'react-i18next'

interface Iboxes {
    latest: Iitem[],
    largest: Icollection[]
}

const Index = () => {

    const { t } = useTranslation()
    const [boxes, setBoxes] = useState<Iboxes>({
        latest: [],
        largest: []
    })

    const getData = async () => {
        const latestItems = await getItem('latestItems')
        const topCollections = await getCollection('largestCollection')
        if (latestItems.data.length && topCollections.data.length)
            setBoxes({ latest: latestItems.data, largest: topCollections.data })
    }

    useEffect(() => {
        getData()
    }, [])

    return (
        <Container className="py-3">
            <Col>
                <Row lg={'auto'} className='gap-1'>
                    {['tag1', 'tag2', 'tag3'].map(elem => <Badge className='p-3 m-2' key={elem}>{elem}</Badge>)}
                </Row>
                <h2>{t('homepage.latestitems')}</h2>
                <Row lg={4} className="d-flex align-items-center gap-5">
                    {boxes.latest.map((item: Iitem) => <ItemCard data={item} key={item._id} />)}
                </Row>
                <h2>{t('homepage.largestcollection')}</h2>
                <Row lg={4} className="gap-5">
                    {boxes.largest.map((collection: Icollection) => <CollectionsCard key={collection._id} collection={collection} />)}
                </Row>
            </Col>
        </Container>
    )
}

export default Index