import { useCallback, useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { getItem } from '../common/api/itemApi'
import ItemCard from '../components/ItemCard'
import { Iitem } from '../interfaces/collections.interfaces'

const SearchResult = () => {

    const { t } = useTranslation()
    const { searchParam }: any = useParams()
    const [pending, setPending] = useState<boolean>(false)
    const [items, setItems] = useState<Iitem[]>([])

    const getResult = useCallback(async () => {
        setPending(true)
        const { data, status } = await getItem(`tags?q=${searchParam}`)
        if (status === 200 && data.length > 0) {
            setItems(data)
        }
        setPending(false)
    }, [searchParam])

    useEffect(() => {
        getResult()
    }, [getResult])


    return <Container className="py-4">
        <h2 className="my-4">Search Result</h2>
        {pending
            ? t('action.loading')
            : <Row className="gap-3">{items.map((item: Iitem) => <Col key={item._id} className="d-flex justify-content-center"><ItemCard item={item} /></Col>)}</Row>
        }
    </Container>

}

export default SearchResult