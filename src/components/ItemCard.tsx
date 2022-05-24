import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Badge } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Icollection, Iitem } from '../interfaces/collections.interfaces';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';

interface Props {
  username?: string,
  collection?: Icollection,
  item: Iitem,
}

const ItemCard = ({ username, item }: Props) => {
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
          <Link to={username ? `/${username}/item/${item._id}` : `/item/${item._id}`}>
            {t('action.readmore')}
          </Link>
        </Col>
      </Card.Body>
    </Card>
  )
}

export default ItemCard