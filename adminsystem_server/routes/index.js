/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const md5 = require('md5');

const UserModel = require('../models/UserModel');
const CategoryModel = require('../models/CategoryModel');
const ProductModel = require('../models/ProductModel');
const RoleModel = require('../models/RoleModel');

const router = express.Router();

// request url: /login
// login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username, password: md5(password) })
    .then((user) => {
      if (user) {
        // create a cookie (userid: user._id)
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 });
        if (user.role_id) {
          RoleModel.findOne({ _id: user.role_id })
            .then((role) => {
              user._doc.role = role;
              console.log('role user', user);
              res.send({ status: 0, data: user });
            });
        } else {
          user._doc.role = { menus: [] };
          res.send({ status: 0, data: user });
        }
      } else {
        res.send({ status: 1, msg: 'wrong username or password!' });
      }
    })
    .catch((error) => {
      console.error('login error', error);
      res.send({ status: 1, msg: 'login error, please try again later' });
    });
});

// request url: /manage/user/get
// get a user, based on the cookie (userid)
router.get('/manage/user/get', (req, res) => {
  // get (userid) from the cookie
  const { userid } = req.cookies;

  if (!userid) {
    res.send({ status: 1, msg: 'please login first' });
  }

  UserModel.findOne({ _id: userid })
    .then((user) => {
      if (user) {
        res.send({ status: 0, data: user });
      } else {
        // delete (userid) from the cookie
        res.clearCookie('userid');
        res.send({ status: 1, msg: 'please login first' });
      }
    })
    .catch((error) => {
      console.error('get the user error', error);
      res.send({ status: 1, msg: 'get the user error, please try again later' });
    });
});

// request url: /manage/user/add
// add a user
router.post('/manage/user/add', (req, res) => {
  const { username, password } = req.body;

  UserModel.findOne({ username })
    .then((user) => {
      if (user) {
        res.send({ status: 1, msg: 'This user already exists' });
      } else {
        UserModel.create({
          ...req.body,
          password: md5(password),
        })
          .then((newUser) => {
            res.send({ status: 0, data: newUser });
          });
      }
    })
    .catch((error) => {
      console.error('register error', error);
      res.send({ status: 1, msg: 'register the user error, please try again later' });
    });
});

// request url: /manage/user/update
// update a user
router.post('/manage/user/update', (req, res) => {
  const user = req.body;

  UserModel.findOneAndUpdate({ _id: user._id }, user, { new: true })
    .then((newUser) => {
      res.send({ status: 0, data: newUser });
    })
    .catch((error) => {
      console.error('update the user error', error);
      res.send({ status: 1, msg: 'update the user error, please try again later' });
    });
});

// request url: /manage/user/delete
// delete a user
router.post('/manage/user/delete', (req, res) => {
  const { userId } = req.body;

  UserModel.deleteOne({ _id: userId })
    .then((result) => {
      res.send({ status: 0, data: result });
    })
    .catch((error) => {
      console.error('delete the user error', error);
      res.send({ status: 1, msg: 'delete the user error, please try again later' });
    });
});

// request url: /manage/user/list
// get list of users except admin
router.get('/manage/user/list', (req, res) => {
  UserModel.find({ username: { $ne: 'admin' } })
    .then((users) => {
      RoleModel.find({})
        .then((roles) => {
          res.send({ status: 0, data: { users, roles } });
        });
    })
    .catch((error) => {
      console.error('get users list error', error);
      res.send({ status: 1, msg: 'get users list error, please try again later' });
    });
});

// request url: /manage/category/get
// get a category by categoryId
router.get('/manage/category/get', (req, res) => {
  const { categoryId } = req.query;

  CategoryModel.findOne({ _id: categoryId })
    .then((category) => {
      res.send({ status: 0, data: category });
    })
    .catch((error) => {
      console.error('get the category error', error);
      res.send({ status: 1, msg: 'get the category error, please try again later' });
    });
});

// request url: /manage/category/add
// add a category
router.post('/manage/category/add', (req, res) => {
  const { categoryName, parentId } = req.body;

  CategoryModel.create({ name: categoryName, parentId: parentId || '0' })
    .then((category) => {
      res.send({ status: 0, data: category });
    })
    .catch((error) => {
      console.error('add the category error', error);
      res.send({ status: 1, msg: 'add the category error, please try again later' });
    });
});

// request url: /manage/category/update
// update a category
router.post('/manage/category/update', (req, res) => {
  const { categoryId, categoryName } = req.body;

  CategoryModel.findOneAndUpdate({ _id: categoryId }, { name: categoryName }, { new: true })
    .then((newCategory) => {
      res.send({ status: 0, data: newCategory });
    })
    .catch((error) => {
      console.error('update the category error', error);
      res.send({ status: 1, msg: 'update the category error, please try again later' });
    });
});

// request url: /manage/category/delete
// delete a category
router.post('/manage/category/delete', (req, res) => {
  const { categoryId } = req.body;

  CategoryModel.deleteOne({ _id: categoryId })
    .then((result) => {
      res.send({ status: 0, data: result });
    })
    .catch((error) => {
      console.error('delete the category error', error);
      res.send({ status: 1, msg: 'delete the category error, please try again later' });
    });
});

// request url: /manage/category/list
// get list of categories
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0';

  CategoryModel.find({ parentId })
    .then((categories) => {
      res.send({ status: 0, data: categories });
    })
    .catch((error) => {
      console.error('get list of categories error', error);
      res.send({ status: 1, msg: 'get list of categories error, please try again later' });
    });
});

// request url: /manage/product/add
// add a product
router.post('/manage/product/add', (req, res) => {
  const product = req.body;

  ProductModel.create(product)
    .then((newProduct) => {
      res.send({ status: 0, data: newProduct });
    })
    .catch((error) => {
      console.error('add the product error', error);
      res.send({ status: 1, msg: 'add the product error, please try again later' });
    });
});

// pagination
// page filter function
function pageFilter(arr, pageNum, pageSize) {
  pageNum *= 1;
  pageSize *= 1;
  const total = arr.length;
  const pages = Math.floor((total + pageSize - 1) / pageSize);
  const start = pageSize * (pageNum - 1);
  const end = start + pageSize <= total ? start + pageSize : total;
  const list = [];
  // eslint-disable-next-line no-plusplus
  for (let i = start; i < end; i++) {
    list.push(arr[i]);
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list,
  };
}

// request url: /manage/product/list
// get list of products
router.get('/manage/product/list', (req, res) => {
  const { pageNum, pageSize } = req.query;
  ProductModel.find({})
    .then((products) => {
      res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) });
    })
    .catch((error) => {
      console.error('get list of products error', error);
      res.send({ status: 1, msg: 'get list of products error, please try again later' });
    });
});

// request url: /manage/product/search
// search a product by product name or product descripiton
router.get('/manage/product/search', (req, res) => {
  const {
    pageNum, pageSize, productName, productDesc,
  } = req.query;

  let contition = {};

  if (productName) {
    contition = { name: new RegExp(`^.*${productName}.*$`) };
  } else if (productDesc) {
    contition = { desc: new RegExp(`^.*${productDesc}.*$`) };
  }

  ProductModel.find(contition)
    .then((products) => {
      res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) });
    })
    .catch((error) => {
      console.error('search the product error', error);
      res.send({ status: 1, msg: 'search the product error, please try again later' });
    });
});

// request url: /manage/product/update
// update a product
router.post('/manage/product/update', (req, res) => {
  const product = req.body;

  ProductModel.findOneAndUpdate({ _id: product._id }, product, { new: true })
    .then((newProduct) => {
      res.send({ status: 0, data: newProduct });
    })
    .catch((error) => {
      console.error('update the product error', error);
      res.send({ status: 1, msg: 'update the product error, please try again later' });
    });
});

// request url: /manage/product/updateStatus
// update a product status: 1: sell, 2: not sell
router.post('/manage/product/updateStatus', (req, res) => {
  const { productId, status } = req.body;
  ProductModel.findOneAndUpdate({ _id: productId }, { status }, { new: true })
    .then((newProduct) => {
      res.send({ status: 0, data: newProduct });
    })
    .catch((error) => {
      console.error('update the product status error', error);
      res.send({ status: 1, msg: 'update the product status error, please try again later' });
    });
});

// request url: /manage/role/add
// add a role
router.post('/manage/role/add', (req, res) => {
  const { roleName } = req.body;
  RoleModel.create({ name: roleName })
    .then((role) => {
      res.send({ status: 0, data: role });
    })
    .catch((error) => {
      console.error('add the role error', error);
      res.send({ status: 1, msg: 'add the role error, please try again later' });
    });
});

// request url: /manage/role/list
// get list of roles
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then((roles) => {
      res.send({ status: 0, data: roles });
    })
    .catch((error) => {
      console.error('get list of roles error', error);
      res.send({ status: 1, msg: 'get list of roles error, please try again later ' });
    });
});

// request url: /manage/role/update
// update a role
router.post('/manage/role/update', (req, res) => {
  const role = req.body;
  role.auth_time = Date.now();
  RoleModel.findOneAndUpdate({ _id: role._id }, role)
    .then((oldRole) => {
      res.send({ status: 0, data: { ...oldRole._doc, ...role } });
    })
    .catch((error) => {
      console.error('更新角色异常', error);
      res.send({ status: 1, msg: '更新角色异常, 请重新尝试' });
    });
});

// image uploader
require('./file-upload')(router);

module.exports = router;
