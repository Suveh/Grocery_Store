const {default: axios} = require("axios");

const axiosClient = axios.create({
  baseURL: "http://localhost:1337/api/"
  },
)

const getCategory=()=>axiosClient.get('/categories?populate=*');
const getSliders=()=>axiosClient.get('/sliders?populate=*').then(resp=> {return resp.data.data})
const getCategoryList=()=>axiosClient.get('/categories?populate=*').then(resp=> {return resp.data.data})
const getAllProducts=()=>axiosClient.get('/products?populate=*').then(resp=> {return resp.data.data})

const getProductsByCategory = (category) =>
  axiosClient
    .get("/products", {
      params: {
        "filters[categories][name][$in]": category,
        populate: "*",
      },
    })
    .then((resp) => resp.data.data);


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

const addToCart = async (cart, jwt) => {
  try {
    const productId =
      cart.productId ??
      cart.product?.id ??
      cart.product;

    if (!productId) {
      throw new Error("Product id is missing or invalid");
    }
    
    const existingItems = await axiosClient.get(
      `/user-carts?filters[users_permissions_user][id][$eq]=${cart.userid}` +
        `&filters[product][id][$eq]=${productId}&populate=*`,
      {
        headers: { Authorization: "Bearer " + jwt },
      }
    );

    const existingItem = existingItems.data.data[0];

    if (existingItem) {
      const documentId = existingItem.documentId;
      const newQuantity = existingItem.quantity + cart.quantity;
      const newAmount = existingItem.amount + parseFloat(cart.amount);

      return axiosClient.put(
        `/user-carts/${documentId}`,
        { data: { quantity: newQuantity, amount: newAmount } },
        { headers: { Authorization: "Bearer " + jwt } }
      );
    }

    return axiosClient.post(
      "/user-carts",
      {
        data: {
          product: productId,     
          quantity: cart.quantity,
          amount: cart.amount,
          users_permissions_user: cart.userid,
        },
      },
      {
        headers: { Authorization: "Bearer " + jwt },
      }
    );
  } catch (error) {
    throw error;
  }
};


  const cleanOrphanedCartItems = async (jwt) => {
  try {
    
    const allCartItems = await axiosClient.get(
      `/user-carts?populate=users_permissions_user`,
      { headers: { Authorization: 'Bearer ' + jwt } }
    );

    const orphanedItems = allCartItems.data.data.filter(item => 
      !item.users_permissions_user 
    );

    if (orphanedItems.length > 0) {
      const deletePromises = orphanedItems.map(item => 
        axiosClient.delete(`/user-carts/${item.documentId}`, {
          headers: { Authorization: "Bearer " + jwt }
        })
      );
      await Promise.all(deletePromises);
    } 
    else {
    }
  } catch (error) {
  }
};


const getCartItems = (userid, jwt) => {
  return axiosClient.get(
  `/user-carts?filters[users_permissions_user][id][$eq]=${userid}&populate[product][populate]=image`,
  { headers: { Authorization: 'Bearer ' + jwt } }
)
.then(resp => {
    const data = resp.data.data;
    
    const cartItemsList = data?.map(item => ({
      id: item.id,
      documentId: item.documentId,
      quantity: item.quantity,
      amount:item.amount,
      
      product: {
        id:item.product?.id,
        name: item.product?.name,
        image:item.product?.image,
        actualPrice:item.product?.mrp,
      }
    }))
    
    return cartItemsList;
  })
};

const deleteCartItem = (documentId, jwt) =>
  axiosClient.delete("/user-carts/" + documentId, {
    headers: {
      Authorization: "Bearer " + jwt
    },
  }).then(resp => {
    return resp.data;
  }).catch(error => {
    console.error("Delete error:", error.response?.data || error.message);
    throw error;
  });

  const createOrder=(data,jwt)=>axiosClient.post('/orders',data,{
    headers:{
      Authorization:'Bearer ' + jwt
    }
  });

const getMyOrder = (userid, jwt) => {
  return axiosClient
    .get(
      `/orders?filters[userid][$eq]=${userid}` +
        `&populate[orderItemList][populate][product][populate]=image`,
      {
        headers: { Authorization: "Bearer " + jwt },
      }
    )
    .then((resp) => {
      const response = resp.data.data;

      const orderList = response.map((item) => ({
        id: item.id,
        totalOrderAmount: item.totalOrderAmount,
        paymentId: item.paymentId,
        orderItemList: item.orderItemList,
        createdAt: item.createdAt,
        status: item.orderStatus,
      }));

      return orderList;
    })
    .catch((error) => {
      console.error(
        "Get orders error:",
        error.response?.data || error.message
      );
      throw error;
    });
};

const searchProductsByName = (query) =>
  axiosClient
    .get(
      `/products?filters[name][$containsi]=${encodeURIComponent(
        query
      )}&populate=*`
    )
    .then((resp) => resp.data.data);

const uploadFile = (file, jwt) => {
  const formData = new FormData();
  formData.append("files", file);

  return axiosClient
    .post("/upload", formData, {
      headers: { Authorization: "Bearer " + jwt },
    })
    .then((r) => r.data);
};

const updateUserProfile = async (userId, data, jwt) => {
  try {
    const response = await axiosClient.put(`/users/${userId}`, data, {
      headers: { 
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ Profile update successful!", response.data);
    return response.data;
    
  } catch (error) {
    console.error("❌ Update error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    throw error;
  }
};


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
    createOrder,
    getMyOrder,
    cleanOrphanedCartItems,
    searchProductsByName,
    uploadFile,
    updateUserProfile,
}