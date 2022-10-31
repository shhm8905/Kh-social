import axios from "axios";

const API = axios.create({ baseURL: `${process.env.URL_API}/users` });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("user")) {
    req.headers.authorization = `Bearer ${
      JSON.parse(localStorage.getItem("user")).token
    }`;
  }
  return req;
});

const user = JSON.parse(localStorage.getItem("user")),
  userData = JSON.parse(localStorage.getItem("userData"));

const state = {
  users: [],
  user: user ? user : null,
  userData: userData ? userData : null,
  isEdit: false,
};

const getters = {
  user: (state) => state.user,
  users: (state) => state.users,
  userData: (state) => state.userData,
  isEdit: (state) => state.isEdit,
};

const actions = {
  async signUp({ commit }, user) {
    const data = await API.post("/signup", user)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    localStorage.setItem("user", JSON.stringify(data));
    commit("signUp", data);
  },
  async signIn({ commit }, userData) {
    const data = await API.post("/signin", userData)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const user = { ...data, followers: JSON.parse(data.followers) };
    localStorage.setItem("user", JSON.stringify(user));
    commit("signIn", data);
  },
  async getUsers({ commit }) {
    const data = await API.get("/")
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const users = data.map((user) => {
      return { ...user, followers: JSON.parse(user.followers) };
    });
    commit("getUsers", users);
  },
  async getUser({ commit }, id) {
    const data = await API.get(`/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const user = { ...data, followers: JSON.parse(data.followers) };
    localStorage.setItem("userData", JSON.stringify(user));
    commit("getUser", user);
  },
  async updateUser({ commit }, user) {
    const { id } = user;
    const data = await API.patch(`/${id}`, user)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedUser = { ...data, followers: JSON.parse(data.followers) };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    localStorage.setItem("user", JSON.stringify(updatedUser));
    commit("updateUser", updatedUser);
  },
  async follow({ commit }, id) {
    const data = await API.patch(`/follow/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    const updatedUser = { ...data, followers: JSON.parse(data.followers) };
    localStorage.setItem("userData", JSON.stringify(updatedUser));
    commit("followUser", updatedUser);
  },
  async deleteUser({ commit }, id) {
    const data = await API.delete(`/${id}`)
      .then((res) => res.data)
      .catch((err) => console.log(err));
    if (data) {
      commit("deleteUser");
    }
  },
};

const mutations = {
  signUp: (state, data) => {
    state.user = data;
  },
  signIn: (state, data) => {
    const user = { ...data, followers: JSON.parse(data.followers) };
    state.user = user;
  },
  getUsers: (state, data) => {
    state.users = [...data];
  },
  getUser: (state, data) => {
    state.userData = data;
  },
  logout: (state) => {
    localStorage.removeItem("user");
    state.user = null;
    state.users = [];
    state.userData = {};
  },
  updateUser: (state, data) => {
    state.users = state.users.filter((user) => {
      return user.id === data.id ? data : user;
    });
    state.user = data;
    state.userData = data;
  },
  followUser: (state, data) => {
    state.users = state.users.filter((user) => {
      return user.id === data.id ? data : user;
    });
    state.userData = data;
  },
  deleteUser: () => {
    localStorage.clear();
  },
  toggleEdit: (state) => {
    state.isEdit = !state.isEdit;
  },
  resetUserData: (state) => {
    localStorage.removeItem("userData");
    state.userData = userData ? userData : null;
  },
};

export default { state, getters, actions, mutations };
