/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
import ajax from './ajax';

const BASE = 'http://localhost:3000';

// login
export const reqLogin = (username, password) => ajax(`${BASE}/login`, { username, password }, 'POST');

// category
export const reqCategoryList = (parentId) => ajax(`${BASE}/manage/category/list`, { parentId });

export const reqAddCategory = (categoryName, parentId) => ajax(`${BASE}/manage/category/add`, { categoryName, parentId }, 'POST');

export const reqUpdateCategory = (categoryId, categoryName) => ajax(`${BASE}/manage/category/update`, { categoryId, categoryName }, 'POST');

export const reqCategory = (categoryId) => ajax(`${BASE}/manage/category/get`, { categoryId });

// product
export const reqProducts = (pageNum, pageSize) => ajax(`${BASE}/manage/product/list`, { pageNum, pageSize });

export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) => ajax(`${BASE}/manage/product/search`, { pageNum, pageSize, [searchType]: searchName });

export const reqUpdateStatus = (productId, status) => ajax(`${BASE}/manage/product/updateStatus`, { productId, status }, 'POST');
// add or update a product
export const reqAddUpdateProduct = (product) => ajax(`${BASE}/manage/product/` + (product._id ? 'update' : 'add'), product, 'POST');

// product images
export const reqDeleteImg = (name) => ajax(`${BASE}/manage/img/delete`, { name }, 'POST');

// role
export const reqRoles = () => ajax(`${BASE}/manage/role/list`);

export const reqAddRole = (roleName) => ajax(`${BASE}/manage/role/add`, { roleName }, 'POST');

export const reqUpdateRole = (role) => ajax(`${BASE}/manage/role/update`, role, 'POST');

// users
export const reqUsers = () => ajax(`${BASE}/manage/user/list`);

export const reqDeleteUser = (userId) => ajax(`${BASE}/manage/user/delete`, { userId }, 'POST');

export const reqAddorUpdateUser = (user) => ajax(`${BASE}/manage/user/` + (user._id ? 'update' : 'add'), user, 'POST');
