import { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { getCollection } from '../common/api/collectionApi'
import { getItem } from '../common/api/itemApi'
import CollectionsCard from '../components/CollectionsCard'
import ItemCard from '../components/ItemCard'
import { Icollection, Iitem } from '../interfaces/collections.interfaces'
import { useTranslation } from 'react-i18next'
import TagCloud from '../components/TagCloud'

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

    const [pending, setPending] = useState(false)
    const [requestError, setRequsetError] = useState({ display: false, message: "" })

    const getData = async () => {
        setPending(true)
        try {
            const latestItems = await getItem('latestItems')
            const topCollections = await getCollection('largestCollection')
            if (latestItems.data.length && topCollections.data.length)
                setBoxes({ latest: latestItems.data, largest: topCollections.data })
        } catch (error) {
            setRequsetError({ display: true, message: "Something failed during loading a content, try again later" })
        }
        setPending(false)
    }

    useEffect(() => {
        getData()
    }, [])

    return pending
        ? <h2>{t('action.loading')}</h2>
        : (requestError.display
            ? <Col className="w-100 h-100 justify-content-center align-items-center"><h2>{requestError.message}</h2></Col>
            : (<Container className="py-3">
                <Col>
                    <Row className='d-flex flex-nowrap gap-1 w-100 overflow-auto'>
                        <TagCloud />
                    </Row>
                    <h2>{t('homepage.latestitems')}</h2>
                    <Row lg={4} className="d-flex align-items-center gap-5">
                        {boxes.latest.map((item: Iitem) => <ItemCard key={item._id} item={item} collection={undefined} />)}
                    </Row>
                    <h2>{t('homepage.largestcollection')}</h2>
                    <Row lg={4} className="gap-5">
                        {boxes.largest.map((collection: Icollection) => <CollectionsCard key={collection._id} collection={collection} />)}
                    </Row>
                </Col>
            </Container>)
        )
}

export default Index