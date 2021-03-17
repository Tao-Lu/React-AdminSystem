/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-danger */
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card, List,
} from 'antd';
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { BASE_IMG_URL } from '../../../../utils/constants';
import { reqCategory } from '../../../../api';

export default function ProductDetail(props) {
  const {
    name,
    desc,
    price,
    detail,
    imgs,
    pCategoryId,
    categoryId,
  } = props.location.state.clickedProduct;

  // parent category name
  const [pCategoryName, setpCategoryName] = useState('');
  // category name
  const [categoryName, setcategoryName] = useState('');

  useEffect(async () => {
    if (pCategoryId === 0) {
      const result = await reqCategory(categoryId);
      const cName = result.data.name;
      setpCategoryName(cName);
    } else {
      // const result1 = await reqCategory(pCategoryId);
      // const result2 = await reqCategory(categoryId);
      // const cName1 = result1.data.name;
      // const cName2 = result2.data.name;
      // setpCategoryName(cName1);
      // setcategoryName(cName2);

      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      setpCategoryName(cName1);
      setcategoryName(cName2);
    }
  }, []);

  const title = (
    <span>
      <Button type="link" onClick={() => { props.history.goBack(); }}><ArrowLeftOutlined style={{ color: 'green', marginRight: 15, fontSize: 20 }} /></Button>
      <span>product detail</span>
    </span>
  );

  return (
    <Card title={title} className="product-detail">
      <List>
        <List.Item>
          <span className="left">product name:</span>
          <span>{name}</span>
        </List.Item>
        <List.Item>
          <span className="left">product description:</span>
          <span>{desc}</span>
        </List.Item>
        <List.Item>
          <span className="left">product price:</span>
          <span>AU$ {price}</span>
        </List.Item>
        <List.Item>
          <span className="left">product category:</span>
          <span>{pCategoryName} {categoryName ? `--> ${categoryName}` : null}</span>
        </List.Item>
        <List.Item>
          <span className="left">product images:</span>
          <span>
            {
              imgs.map(
                (img) => <img key={img} className="product-img" src={BASE_IMG_URL + img} alt="img" />,
              )
            }
          </span>
        </List.Item>
        <List.Item>
          <span className="left">product details:</span>
          <span dangerouslySetInnerHTML={{ __html: detail }} />
        </List.Item>
      </List>
    </Card>
  );
}
