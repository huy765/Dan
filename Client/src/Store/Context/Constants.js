export const apiUrl =
    process.env.NODE_ENV !== "production"
        ? "http://localhost:8080/api"
        : "somedeployUrl";

export const LOCAL_STORAGE_TOKEN_NAME = "token_doan";

export const USER_LOADED_SUCCESS = "USER_LOADED_SUCCESS";
export const USER_LOADED_FAIL = "USER_LOADED_FAIL";
export const ADD_USER = "ADD_USER";
export const DELETE_USER = "DELETE_USER";
export const UPDATE_USER = "UPDATE_USER";
export const FIND_USER = "FIND_USER";

/////////////////////////////////////////////////////////
// Product///////////////////////////////////////////////
/////////////////////////////////////////////////////////
export const PRODUCT_LOADED_SUCCESS = "PRODUCT_LOADED_SUCCESS";
export const PRODUCT_LOADED_FAIL = "PRODUCT_LOADED_FAIL";
export const ADD_PRODUCT = "ADD_PRODUCT";
export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const FIND_PRODUCT = "FIND_PRODUCT";
