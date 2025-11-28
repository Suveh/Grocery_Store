const {default: axios} = require("axios");

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api/"
  },
)

const getCategory=()=>axiosClient.get('/categories?populate=*');
const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=> {return resp.data.data})
const getCategoryList=()=>axiosClient.get('/categories?populate=*').then(resp=> {return resp.data.data})
const getAllProducts=()=>axiosClient.get('/products?populate=*').then(resp=> {return resp.data.data})
const getProductsByCategory=(category)=>axiosClient.get('/products?filters[categories][name][$in]='+category+"&populate=*").then(resp=> {return resp.data.data})

const registerUser= (username, email, password) => axiosClient.post('/auth/local/register',{
  username: username,
  email: email,
  password: password,
}).then(resp=> {return resp.data})

const SignIn= (email, password) => axiosClient.post('/auth/local',{
  identifier: email,
  password: password,
}).then(resp=> {return resp.data})

const forgotPassword = (email) => {
  return axiosClient.post('/auth/forgot-password', {
    email: email,
  }).then(resp => resp.data);
}

const addToCart = (data, jwt) =>
  axiosClient.post("/user-carts", data ,
  {
    headers: { Authorization: "Bearer " + jwt }
  });


const getCartItems = (userid, jwt) => {
  return axiosClient.get(`/user-carts?filters[userid][$eq]=${userid}&populate[product][populate]=image`, {
    headers: {
      Authorization: 'Bearer ' + jwt
    },
  }).then(resp => {
    const data = resp.data.data;
    
    const cartItemsList = data?.map(item => ({
      id: item.id,
      quantity: item.quantity,
      amount:item.amount,
      userid:item.userid,
      product: {
        id:item.product?.id,
        name: item.product?.name,
        image:item.product?.image,
        actualPrice:item.product?.mrp
      }
    }))
    
    return cartItemsList;
  })
};

const deleteCartItem = (id, jwt) =>
  axiosClient.delete("/user-carts/" + id, {
    headers: {
      Authorization: "Bearer " + jwt
    },
  }).then(resp => {
    console.log("=== DELETE RESPONSE ===");
    console.log("Status:", resp.status);
    console.log("Status Text:", resp.statusText);
    console.log("Response Data:", resp.data);
    console.log("=== END DELETE RESPONSE ===");
    return resp.data;
  }).catch(error => {
    console.error("Delete error:", error.response?.data || error.message);
    throw error;
  });


export default{
    getCategory,
    getSliders,
    getCategoryList,
    getAllProducts,
    getProductsByCategory,
    registerUser,
    SignIn,
    forgotPassword,
    addToCart,
    getCartItems,
    deleteCartItem,
}