import { useCallback, useEffect, useState } from 'react'
import { Badge, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getItem } from '../common/api/itemApi'

const TagCloud = () => {

    const [tags, setTags] = useState<string[]>([])
    const getTags = useCallback(async () => {
        const { data } = await getItem('tags')
        setTags(data)
    }, [])

    useEffect(() => {
        getTags()
    }, [getTags])

    return (<Col className="d-flex w-100 gap-2 my-3 scrollbar-pink">{tags.map(tagName => <Badge className='px-5 py-3' key={tagName} as={Link} to={`/search/${tagName}`}>{tagName}</Badge>)}</Col>)

}

export default TagCloud
