const backend_domain = 'http://localhost:3000';

const SummaryApi = {
  signUP: {
    url: `${backend_domain}/api/auth/signup`,
    method: 'post',
  },
  Login: {
    url: `${backend_domain}/api/auth/login`,
    method: 'post',
  },
  current_user: {
    url: `${backend_domain}/api/profile`,
    method: 'get',
  },
  update_userProfile: {
    url: `${backend_domain}/api/profile`,
    method: 'PUT',
  },
  logout: {
    url: `${backend_domain}/api/auth/logout`,
    method: 'get',
  },
  allUser: {
    url: `${backend_domain}/api/admin-users`,
    method: 'get',
  },
  updateUser: {
    url: `${backend_domain}/api/update-profile`,
    method: 'post',
  },
  uploadProduct: {
    url: `${backend_domain}/api/upload-product`,
    method: 'post',
  },
  getAllProduct: {
    url: `${backend_domain}/api/all-products`,
    method: 'get',
  },
  updateProduct: {
    url: `${backend_domain}/api/update-product`,
    method: 'put',
  },
  deleteProduct: {
    url: `${backend_domain}/api/delete-product`,
    method: 'delete',
  },
  getProductCategoryList: {
    url: `${backend_domain}/api/get-category-list`,
    method: 'get',
  },

  getCategoryProduct: {
    url: `${backend_domain}/api/get-category-product`,
    method: 'get',
  },

  getIndividualProduct: {
    url: `${backend_domain}/api/get-individual-product`,
    method: 'get',
  },
  forgotPassword: {
    url: `${backend_domain}/api/auth/forgot-password`,
    method: 'post',
  },
  addToCartProduct: {
    url: `${backend_domain}/api/cart/add-product`,
    method: 'post',
  },
  CountAddToCartProduct: {
    url: `${backend_domain}/api/cart/count-products`,
    method: 'get',
  },
  displayAddToCartProduct: {
    url: `${backend_domain}/api/cart/display-products`,
    method: 'get',
  },
  updateAddToCartProduct: {
    url: `${backend_domain}/api/cart/update-product`,
    method: 'put',
  },
  deleteAddToCartProduct: {
    url: `${backend_domain}/api/cart/delete-product`,
    method: 'delete',
  },
  searchProducts: {
    url: `${backend_domain}/api/search`,
    method: 'get',
  },
  filterProduct: {
    url: `${backend_domain}/api/filter-product`,
    method: 'post',
  },
  payment: {
    url: `${backend_domain}/api/payment/create`,
    method: 'post',
  },
  verifyPayment: {
    url: `${backend_domain}/api/payment/verify`,
    method: 'post',
  },
  adminAnalyticsDashboard: {
    url: `${backend_domain}/api/analytics/admin-dashboard`,
    method: 'get',
  },
  adminOrders: {
    url: `${backend_domain}/api/orders/admin`,
    method: 'get',
  },
  userOrders: {
    url: `${backend_domain}/api/orders/user`,
    method: 'get',
  },
  adminOrdersUpdate: {
    url: `${backend_domain}/api/orders/update`,
    method: 'PATCH',
  },
};

export default SummaryApi;
