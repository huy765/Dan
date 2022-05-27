import { createContext, useReducer, useState } from "react";
import newsReducer, { InitNews } from "../Reduces/NewsReducer";
import {
  apiUrl,
  NEWS_LOADED_FAIL,
  NEWS_LOADED_SUCCESS,
  DELETE_NEWS,
  UPDATE_NEWS,
} from "./Constants";
import axios from "axios";

export const NewsContext = createContext();

const NewsContextProvider = ({ children }) => {
  // State
  const [newsState, dispatch] = useReducer(newsReducer, InitNews);
  // Get all NEWS
  const getNews = async () => {
    try {
      const response = await axios.get(`${apiUrl}/news/allNews`);
      if (response.data.success) {
        dispatch({
          type: NEWS_LOADED_SUCCESS,
          payload: response.data.news,
        });
      }
    } catch (error) {
      dispatch({ type: NEWS_LOADED_FAIL });
    }
  };

  const deleteNews = async (newsId) => {
    try {
      const response = await axios.delete(`${apiUrl}/news/${newsId}`);
      console.log(response);
      if (response.data.success)
        dispatch({ type: DELETE_NEWS, payload: newsId });
    } catch (error) {
      console.log(error);
    }
  };

  const createCategory = async (CategoryNew) => {
    const category = {
      nameCategory: CategoryNew.nameCategory,
      image: "default.png",
      description: CategoryNew.description,
    };
    const response = await axios.post(
      `${apiUrl}/category/addCategory`,
      category
    );
    console.log(response);
    if (response.data.success) {
      return response.data;
    } else {
      return response.data;
    }
  };

  // // Update user
  const updateCategory = async (updatedCategory) => {
    try {
      const response = await axios.put(
        `${apiUrl}/category/updateCategory/${updatedCategory.id}`,
        updatedCategory
      );
      if (response.data.success) {
        dispatch({
          type: UPDATE_NEWS,
          payload: response.data.categorys,
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  // Product context data
  const categoryContextData = {
    newsState,
    getNews,
    deleteNews,
  };

  return (
    <NewsContext.Provider value={categoryContextData}>
      {children}
    </NewsContext.Provider>
  );
};

export default NewsContextProvider;