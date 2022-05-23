import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Iitem } from '../interfaces/collections.interfaces';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext';

interface Props {
  data: Iitem
}

const ItemCard = ({ data }: Props) => {
  const { t } = useTranslation()
  const { theme } = useContext(ThemeContext) as ThemeContextType;

  return (
    <Card className={`my-3 bg-${theme.elementBackgroundColor}`} style={{ width: "280px" }}>
      <Card.Img variant="top" src={data.linkImg} />
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>
        </Card.Text>
        <Link to={`/item/${data._id}`}>
          {t("card.options.readmore")}
        </Link>
      </Card.Body>
    </Card>
  );
}

export default ItemCard