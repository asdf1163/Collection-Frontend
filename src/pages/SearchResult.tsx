import { useCallback, useEffect, useState } from 'react'
import { Container, Col, Row } from 'react-bootstrap'
import { useParams } from 'react-router-dom'
import { getItem } from '../common/api/itemApi'
import ItemCard from '../components/ItemCard'
import { Iitem } from '../interfaces/collections.interfaces'

const SearchResult = () => {

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


    return <Container>
        <h2>Search Result</h2>
        {pending
            ? "Loading"
            : <Col>{items.map((item: Iitem) => <Row key={item._id}><ItemCard data={item} /></Row>)}</Col>
        }
    </Container>

}

export default SearchResult