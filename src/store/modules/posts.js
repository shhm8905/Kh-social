import axios from "axios";

const API = axios.create({ baseURL: `${process.env.URL}/posts` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).token
    }`;
  }
  return req;
});

const state = {
  posts: [],
  oldPost: {},
  isShow: false,
  isUpdate: false,
  commentsCount: null,
};

const getters = {
  allposts: (state) => state.posts,
  isShow: (state) => state.isShow,
  oldPost: (state) => state.oldPost,
  isUpdate: (state) => state.isUpdate,
};

const actions = {
  async getPosts({ commit }) {
    const data = await API.get("/")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    commit("getPosts", data);
  },
  async getUserPosts({ commit }, id) {
    const data = await API.get(`/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    commit("getPosts", data);
  },
  async addPost({ commit }, post) {
    const data = await API.post("/", post)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const newPost = {
      ...data,
      creator: JSON.parse(data.creator),
      likes: JSON.parse(data.likes),
    };
    commit("addPost", newPost);
  },
  async updatePost({ commit }, post) {
    const id = post.id;
    const data = await API.patch(`/${id}`, post)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedPost = {
      ...data,
      creator: JSON.parse(data.creator),
      likes: JSON.parse(data.likes),
    };
    commit("updatePost", updatedPost);
  },
  async deletePost({ commit }, id) {
    const data = await API.delete(`/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    commit("deletePost", Number(data));
  },
  async likePost({ commit }, id) {
    const data = await API.patch(`/like/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedPost = {
      ...data,
      creator: JSON.parse(data.creator),
      likes: JSON.parse(data.likes),
    };
    commit("updatePost", updatedPost);
  },
  async incCommentsCount({ commit }, id) {
    const data = await API.patch(`/${id}/inccount`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedPost = {
      ...data,
      creator: JSON.parse(data.creator),
      likes: JSON.parse(data.likes),
    };
    commit("updatePost", updatedPost);
  },
  async decCommentsCount({ commit }, id) {
    const data = await API.patch(`/${id}/deccount`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedPost = {
      ...data,
      creator: JSON.parse(data.creator),
      likes: JSON.parse(data.likes),
    };
    commit("updatePost", updatedPost);
  },
};

const mutations = {
  getPosts: (state, posts) => {
    const data = posts.map((post) => {
      return {
        ...post,
        creator: JSON.parse(post.creator),
        likes: JSON.parse(post.likes),
      };
    });
    state.posts = data;
  },
  addPost: (state, post) => {
    state.isUpdate = false;
    state.posts.push(post);
  },
  deletePost: (state, id) => {
    state.posts = state.posts.filter((post) => {
      return post.id !== id;
    });
  },
  updatePost: (state, updatedPost) => {
    state.posts = state.posts.filter((post) => {
      return post.id === updatedPost.id ? updatedPost : post;
    });
  },
  handleShow: (state) => {
    state.isShow = true;
  },
  handleClose: (state) => {
    state.isShow = false;
    state.isUpdate = false;
    state.oldPost = null;
  },
  getPost: (state, post) => {
    state.isUpdate = true;
    state.oldPost = post;
  },
  toggleComment: (state, id) => {
    state.posts.map((post) => {
      if (post.id === id) {
        return (post.isComment = !post.isComment);
      }
    });
  },
};

export default { state, getters, actions, mutations };
