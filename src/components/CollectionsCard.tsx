import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row, Badge } from 'react-bootstrap'
import TemplateCollection from './TemplateCollection'
import { AuthContext, AuthContextType } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Icollection } from '../interfaces/collections.interfaces'
import { ThemeContext, ThemeContextType } from '../context/ThemeContext'


interface Props {
    collection: Icollection
    collectionAuthorId?: string
    setCollections?: React.Dispatch<React.SetStateAction<Icollection[]>>
}


const CollectionsCard = ({ collection, collectionAuthorId, setCollections }: Props) => {

    const { auth } = useContext(AuthContext) as AuthContextType
    const { theme } = useContext(ThemeContext) as ThemeContextType;

    const { t } = useTranslation()

    return (
        <Card className={`bg-${theme.elementBackgroundColor}`}>
            {(auth._id === collection.idUser || auth.privilage === "admin" || auth.privilage === "owner") &&
                <Col className="d-flex justify-content-end gap-2">
                    <TemplateCollection type={'edit'} dataCollection={collection} setCollections={setCollections as React.Dispatch<React.SetStateAction<Icollection[]>>} {...{ collectionAuthorId }} />
                </Col>
            }
            <Card.Body className='d-flex flex-column flex-md-row align-items-center'>
                <Col>
                    <img src={collection.linkImg} alt="collectionImage" width={200} />
                </Col>
                <Col className='p-5'>
                    <Card.Title>{collection.name}</Card.Title>
                    <Card.Text>{collection.description}</Card.Text>
                    <Col className="d-flex gap-3">
                        {collection.tags.map((tag: string) =>
                            <Badge className='p-2' key={collection.name + tag}>{tag}</Badge>
                        )}
                    </Col>
                    <Row className='position-absolute bottom-0 end-0 p-3'>
                        <Link to={collection._id}>
                            <p>{t('card.options.readmore')}</p>
                        </Link>
                    </Row>
                </Col>
            </Card.Body>
        </Card>
    )
}

export default CollectionsCard