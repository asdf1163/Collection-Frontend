import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row, Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Icollection } from '../interfaces/collections.interfaces'
import { ThemeContext, ThemeContextType } from '../context/ThemeContext'


interface Props {
    collection: Icollection
    setCollections?: React.Dispatch<React.SetStateAction<Icollection[]>>
}

const CollectionsCard = ({ collection, setCollections }: Props) => {

    const { theme } = useContext(ThemeContext) as ThemeContextType;
    const { t } = useTranslation()

    return (
        <Card className={`bg-${theme.elementBackgroundColor}`}>
            <Card.Body className='d-flex flex-column flex-md-row align-items-center'>
                <Col>
                    <img src={collection.linkImg} alt="collectionImage" width={200} />
                </Col>
                <Col className='p-5'>
                    <Card.Title>{collection.name}</Card.Title>
                    <Card.Subtitle className="text-secondary" style={{ fontStyle: 'italic' }}>{collection.topic}</Card.Subtitle>
                    <Card.Text>{collection.description}</Card.Text>
                    <Col className="d-flex gap-3">
                        {collection.tags.map((tag: string) =>
                            <Badge className='p-2' key={collection.name + tag}>{tag}</Badge>
                        )}
                    </Col>
                    <Row className='position-absolute bottom-0 end-0 p-3'>
                        <Link to={`/collection/${collection._id}`}>
                            <p>{t('action.readmore')}</p>
                        </Link>
                    </Row>
                </Col>
            </Card.Body>
        </Card>
    )
}

export default CollectionsCard