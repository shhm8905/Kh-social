import { createStore } from "vuex";
import posts from "./modules/posts";
import comments from "./modules/comments";
import auth from "./modules/auth";

export default createStore({
  modules: {
    posts,
    comments,
    auth,
  },
});
