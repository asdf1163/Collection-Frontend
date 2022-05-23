import { useCallback, useEffect, useState } from 'react'
import { Badge } from 'react-bootstrap'
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

    return (<>{tags.map(tagName => <Badge className='p-3 m-2 w-75' key={tagName} as={Link} to={`/search/${tagName}`}>{tagName}</Badge>)}</>)

}

export default TagCloud
