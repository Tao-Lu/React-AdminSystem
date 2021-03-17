/* eslint-disable react/prop-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/* eslint-disable arrow-body-style */
/* eslint-disable no-trailing-spaces */
import React, { useState, useEffect } from 'react';
import {
  Card, Select, Input, Button, Table, Space, message,
} from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../../../api';
import { PAGE_SIZE } from '../../../../utils/constants';

export default function ProductHome(props) {
  const [products, setproducts] = useState([]);
  const [totalProducts, settotalproducts] = useState(0);
  const [loading, setloading] = useState(false);
  const [searchName, setsearchName] = useState('');
  const [searchType, setsearchType] = useState('productName');
  const [pageNumber, setpageNumber] = useState();

  const getProducts = async (pageNum) => {
    setpageNumber(pageNum);

    setloading(true);
    let result;

    if (searchName) {
      result = await reqSearchProducts(pageNum, PAGE_SIZE, searchName, searchType);
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    
    setloading(false);

    if (result.status === 0) {
      const { total, list } = result.data;
      settotalproducts(total);
      setproducts(list);
    }
  };

  const updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      message.success('update product status successfully');
      getProducts(pageNumber);
    }
  };

  useEffect(() => {
    getProducts(1);
  }, []);

  const onSearch = () => {

  };

  // Card title
  const title = (
    <span>
      <Select value={searchType} style={{ width: 150 }} onChange={(value) => setsearchType(value)}>
        <Select.Option value="productName">By Name</Select.Option>
        <Select.Option value="productDesc">By Description</Select.Option>
      </Select>
      <Input placeholder="key word" style={{ width: 150, margin: '0 15px' }} value={searchName} onChange={(event) => setsearchName(event.target.value)} />
      <Button type="primary" onClick={() => getProducts(1)}>search</Button>
    </span>
  );

  // Card extra
  const extra = (
    <Button type="primary" icon={<PlusOutlined />} onClick={() => props.history.push('/product/addupdate')}>Add Product</Button>
  );

  // Table columns
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'desc',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price) => `AU$ ${price}`,
    },
    {
      witdh: 100,
      title: 'Status',
      render: (product) => {
        const { status, _id } = product;
        const newStatus = status === 1 ? 2 : 1;
        return ( 
          <span>
            <Button
              type="primary"
              onClick={() => updateStatus(_id, newStatus)}
            >
              {status === 1 ? 'Not Selling' : 'Selling'}
            </Button>
            <br />
            <span>{status === 1 ? 'Selling' : 'Not Selling'}</span>
          </span>
        );
      },
    },
    {
      title: 'Actions',
      render: (clickedProduct) => (
        <Space size="middle">
          <Button type="link" onClick={() => { props.history.push('/product/detail', { clickedProduct }); }}>Detail</Button>
          <Button type="link" onClick={() => { props.history.push('/product/addupdate', { clickedProduct }); }}>Modify</Button>
        </Space>
      ),
      width: 100,
    },
  ];

  return (
    <Card
      title={title}
      extra={extra}
    >
      <Table
        bordered
        loading={loading}
        rowKey="_id"
        dataSource={products}
        columns={columns}
        pagination={{ 
          current: pageNumber,
          total: totalProducts,
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          onChange: getProducts,
        }}
      />
    </Card>

  );
}
