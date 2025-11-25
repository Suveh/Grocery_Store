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


export default{
    getCategory,
    getSliders,
    getCategoryList,
    getAllProducts,
    getProductsByCategory,
    registerUser,
    SignIn,
    forgotPassword,
}