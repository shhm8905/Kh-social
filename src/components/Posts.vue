<template>
  <div class="posts">
    <div class="post" v-for="(post, index) in allposts" :key="index">
      <button
        title="Edit This Post"
        class="edit-btn"
        @click="handleUpdate(post)"
        v-if="post.user_id === user.id || user.email === 'shhm8905@gmail.com'"
      >
        ...
      </button>
      <button
        title="Delete This Post"
        class="delete-btn"
        @click="deletePost(post.id)"
        v-if="post.user_id === user.id || user.email === 'shhm8905@gmail.com'"
      >
        <b>X</b>
      </button>

      <p class="post-date" v-text="post.createdAt"></p>
      <div class="avatar">
        <figure class="avatar-container">
          <img class="avatar-img" :src="post.creator.avatar" />
        </figure>
        <p class="avatar-name" @click="handleUser(post.user_id)">
          {{ post.creator.userName }}
        </p>
      </div>
      <p class="post-desc" v-text="post.description"></p>

      <figure class="post-img-container">
        <img class="post-img" :src="post.selectedImg" v-if="post.selectedImg" />
        <video
          class="post-video"
          width="550"
          height="550"
          :src="post.selectedVideo"
          controls
          v-else
        />
      </figure>

      <div class="post-views">
        <div class="like-view">
          <p v-if="post.likes.length > 0">
            {{ post.likes.length }}
            {{ post.likes.length > 1 ? "Likes" : "Like" }}
          </p>
        </div>
        <div class="comment-view">
          <p v-if="post.commentsCount > 0">
            {{ post.commentsCount }}
            {{ post.commentsCount > 1 ? "Comments" : "Comment" }}
          </p>
        </div>
      </div>

      <div class="post-controller">
        <li
          @click="handleLike(post.id)"
          :style="{
            color: post.likes.find((like) => like === user.id) && '#0276ff',
          }"
        >
          <i class="like-icon fa fa-thumbs-up"></i>
          &nbsp; Like
        </li>
        <li @click="toggleComment(post.id)">
          <i class="comment-icon fa fa-commenting"></i> &nbsp; Comment
        </li>
      </div>

      <AddComment :post="post" v-if="post.isComment" />

      <Comments :post="post" v-if="post.isComment" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import AddComment from "./AddComment.vue";
import Comments from "./Comments.vue";

export default {
  name: "postsComponent",
  components: { AddComment, Comments },

  methods: {
    ...mapActions([
      "getPosts",
      "deletePost",
      "likePost",
      "getUserPosts",
      "getUser",
    ]),
    ...mapMutations(["handleShow", "getPost", "toggleComment"]),

    handleUpdate(post) {
      this.handleShow();
      this.getPost(post);
    },

    handleUser(id) {
      this.getUser(id);
      this.getUserPosts(id);
      setTimeout(() => {
        this.$router.push("/user");
      }, 500);
    },

    handleLike(id) {
      this.likePost(id);
      setTimeout(() => {
        if (this.$route.path === "/user") {
          this.getUserPosts(this.userData.id);
        } else if (this.$route.path === "/") {
          this.getPosts();
        }
      }, 100);
    },
  },

  computed: {
    ...mapGetters(["user", "comments", "allposts", "userData"]),
  },
};
</script>
