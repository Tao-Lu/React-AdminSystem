/* eslint-disable object-shorthand */
/* eslint-disable one-var-declaration-per-line */
/* eslint-disable one-var */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-use-before-define */
/* eslint-disable no-else-return */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
/* eslint-disable react/prop-types */
/* eslint-disable brace-style */
/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect, useRef } from 'react';
import {
  Form,
  Card,
  Input,
  Cascader,
  // Upload,
  Button,
  message,
} from 'antd';
import {
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { reqCategoryList, reqAddUpdateProduct } from '../../../../api';
import PicturesWall from './picturesWall';
import RichTextEditor from './richTextEditor';

export default function ProductAddUpdte(props) {
  const [options, setoptions] = useState([]);
  let isUpdate = useRef(false);
  let productAddUpdate = useRef();
  let imgs = useRef();
  let editor = useRef();

  const initOptions = async (categories) => {
    const newOptions = categories.map((category) => ({
      value: category._id,
      label: category.name,
      isLeaf: false,
    }));

    if (isUpdate.current && productAddUpdate.current.pCategoryId !== '0') {
      const subCategories = await getCategories(productAddUpdate.current.pCategoryId);

      const childOptions = subCategories.map((subCategory) => ({
        value: subCategory._id,
        label: subCategory.name,
        isLeaf: true,
      }));

      const targetOption = newOptions.find((option) => option.value === productAddUpdate.current.pCategoryId);

      targetOption.children = childOptions;
    }

    setoptions(newOptions);
  };

  const getCategories = async (parentId) => {
    const result = await reqCategoryList(parentId);
    if (result.status === 0) {
      const categories = result.data;
      if (parentId === '0') {
        initOptions(categories);
      } else {
        return categories;
      }
    }
  };

  useEffect(async () => {
    getCategories('0');
  }, []);

  // custom Hook
  const useComponentWillMount = () => {
    const willMount = useRef(true);

    if (willMount.current) {
      const product = props.location.state;
      isUpdate.current = !!product;
      productAddUpdate.current = product ? product.clickedProduct : {};
    }

    willMount.current = false;
  };
  useComponentWillMount();

  const title = (
    <span>
      <Button type="link" onClick={() => props.history.goBack()}><ArrowLeftOutlined style={{ fontSize: 20 }} /></Button>
      <span>{isUpdate.current ? 'Update Product' : 'Add Product'}</span>
    </span>
  );

  // form layput
  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8 },
  };

  // price validator
  const priceValidator = (rule, value, callback) => {
    if (value * 1 > 0) {
      callback();
    } else {
      callback('product price must be greater than 0');
    }
  };

  // cascade loadData
  const loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[0];
    targetOption.loading = true;

    const subCategories = await getCategories(targetOption.value);
    targetOption.loading = false;

    // there are sub categories for selected parent category
    if (subCategories && subCategories.length > 0) {
      const childOptions = subCategories.map((subCategory) => ({
        value: subCategory._id,
        label: subCategory.name,
        isLeaf: true,
      }));

      targetOption.children = childOptions;
    }
    // there are no sub categories for selected parent category
    else {
      targetOption.isLeaf = true;
    }

    setoptions([...options]);
  };

  const onFinish = async (values) => {
    const {
      productName, productDescription, productPrice, productCategory,
    } = values;

    let pCategoryId, categoryId;

    if (productCategory.length === 1) {
      pCategoryId = '0';
      categoryId = productCategory[0];
    } else {
      pCategoryId = productCategory[0];
      categoryId = productCategory[1];
    }

    const imgList = imgs.current.getImgs();
    const editorHtml = editor.current.getRawDetail();

    const product = {
      name: productName,
      desc: productDescription,
      price: productPrice,
      pCategoryId: pCategoryId,
      categoryId: categoryId,
      imgs: imgList,
      detail: editorHtml,
    };

    if (isUpdate.current) {
      product._id = productAddUpdate.current._id;
    }

    const result = await reqAddUpdateProduct(product);

    if (result.status === 0) {
      message.success(`${isUpdate.current ? 'Update' : 'Add'} product successfully`);
      props.history.goBack();
    } else {
      message.error(`${isUpdate.current ? 'Update' : 'Add'} product failed`);
    }
  };

  // Cascader, get Categories
  const cascaderProductCategory = () => {
    if (isUpdate.current) {
      if (productAddUpdate.current.pCategoryId === '0') {
        return [productAddUpdate.current.categoryId];
      } else {
        return [productAddUpdate.current.pCategoryId, productAddUpdate.current.categoryId];
      }
    }
  };

  return (
    <Card title={title}>
      <Form
        {...formItemLayout}
        name="addupdateProduct"
        onFinish={onFinish}
        initialValues={{
          productName: productAddUpdate.current.name,
          productDescription: productAddUpdate.current.desc,
          productPrice: productAddUpdate.current.price,
          productCategory: cascaderProductCategory(),
        }}
      >
        <Form.Item
          name="productName"
          label="Product Name"
          rules={[
            {
              required: true,
              message: 'Please input product name',
            },
          ]}
        >
          <Input placeholder="input product name" />
        </Form.Item>
        <Form.Item
          name="productDescription"
          label="Product Description"
          rules={[
            {
              required: true,
              message: 'please input product description',
            },
          ]}
        >
          <Input.TextArea placeholder="input product description" autoSize={{ minRows: 3, maxRows: 10 }} />
        </Form.Item>
        <Form.Item
          name="productPrice"
          label="Product Price"
          rules={[
            {
              required: true,
              message: 'please input product price',
            },
            {
              validator: priceValidator,
            },
          ]}
        >
          <Input type="number" addonBefore="AU$ " placeholder="input product price" />
        </Form.Item>
        <Form.Item
          name="productCategory"
          label="Product Category"
          rules={[
            {
              required: true,
              message: 'please select product categories',
            },
          ]}
        >
          <Cascader
            options={options}
            loadData={loadData}
          />
        </Form.Item>
        <Form.Item
          name="productImages"
          label="Product Images"
          // rules={[
          //   {
          //     required: true,
          //     message: 'please upload product images',
          //   },
          // ]}
        >
          <PicturesWall ref={imgs} imgs={productAddUpdate.current.imgs} />
        </Form.Item>
        <Form.Item
          name="productDetail"
          label="Product Detail"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 18 }}
        >
          <RichTextEditor ref={editor} rawHtml={productAddUpdate.current.detail} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Submit</Button>
        </Form.Item>

      </Form>
    </Card>
  );
}
