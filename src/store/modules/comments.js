import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.URL}/comments`,
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).token
    }`;
  }
  return req;
});

const state = {
  comments: [],
  oldComment: null,
};

const getters = {
  comments: (state) => state.comments,
  isUpdateComment: (state) => state.isUpdateComment,
  oldComment: (state) => state.oldComment,
};

const actions = {
  async getComments({ commit }) {
    const data = await API.get("/")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const comments = data.map((comment) => {
      return { ...comment, creator: JSON.parse(comment.creator) };
    });
    commit("getComments", comments);
  },
  async addComment({ commit }, comment) {
    const data = await API.post("/", comment)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const newComment = { ...data, creator: JSON.parse(data.creator) };
    commit("addComment", newComment);
  },
  async updateComment({ commit }, comment) {
    const { id } = comment;
    const data = await API.patch(`/${id}`, comment)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedComment = { ...data, creator: JSON.parse(data.creator) };
    commit("updateComment", updatedComment);
  },
  async deleteComment({ commit }, id) {
    const data = await API.delete(`/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    commit("deleteComment", Number(data));
  },
};

const mutations = {
  getComments: (state, comments) => {
    state.comments = [...comments];
  },
  addComment: (state, data) => {
    state.comments.push(data);
  },
  updateComment: (state, updatedComment) => {
    state.comments = state.comments.filter((comment) => {
      return comment.id === updatedComment.id ? updatedComment : comment;
    });
    state.oldComment = null;
  },
  deleteComment: (state, id) => {
    state.comments = state.comments.filter((comment) => {
      return comment.id !== id;
    });
  },
  toggleUpdate: (state, data) => {
    state.comments.map((comment) => {
      if (comment.id === data.id) {
        return (comment.isComment = !comment.isComment);
      }
    });
  },
  getComment: (state, data) => {
    state.oldComment = data;
  },
};

export default { state, getters, actions, mutations };
