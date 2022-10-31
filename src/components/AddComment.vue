<template>
  <div class="addcomment">
    <div class="post-comment">
      <figure class="comments-avatar">
        <img :src="user.avatar" />
      </figure>
      <form class="comment-controller" @submit.prevent="handleSubmit()">
        <input type="text" placeholder="Add a comment..." v-model="text" />
        <button class="add-comment-btn" type="submit">Put up</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "AddComment",
  data() {
    return {
      text: "",
    };
  },
  props: ["post"],
  methods: {
    ...mapActions(["addComment", "incCommentsCount", "getPosts"]),
    handleSubmit() {
      const creator = {
          userName: this.user.userName,
          email: this.user.email,
          avatar: this.user.avatar,
        },
        d = new Date(),
        yyyy = d.getFullYear(),
        mm = d.getMonth() + 1,
        dd = d.getDate(),
        createdAt = `${yyyy}-${mm}-${dd}`,
        newComment = {
          id: Math.floor(Math.random() * 10000000),
          user_id: this.user.id,
          post_id: this.post.id,
          creator: JSON.stringify(creator),
          text: this.text,
          createdAt,
          isComment: 0,
        };
      this.addComment(newComment);
      this.incCommentsCount(this.post.id);
      this.text = "";
      setTimeout(() => {
        this.getPosts();
      }, 2000);
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
