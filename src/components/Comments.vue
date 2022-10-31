<template>
  <div class="comment-container">
    <div v-for="comment in comments" :key="comment.id">
      <div class="comment-item" v-if="post.id === comment.post_id">
        <figure class="comments-avatar">
          <img :src="comment.creator.avatar" />
        </figure>
        <div class="comment-content">
          <button
            class="edit-com-btn"
            @click="editFunc(comment)"
            v-if="comment.creator.email === user.email && !comment.isComment"
            title="Edit"
          >
            <i class="fa fa-pencil-square"></i>
          </button>
          <p class="comment-date">{{ comment.createdAt }}</p>
          <p class="comment-username">{{ comment.creator.userName }}</p>
          <form
            class="comment-controller"
            @submit.prevent="handleSubmit()"
            v-if="comment.isComment"
          >
            <input type="text" v-model="formData.text" />
            <div class="btns">
              <button type="button" @click="toggleUpdate(comment)">X</button>
              <button type="submit">
                <i class="fa fa-check"></i>
              </button>
            </div>
          </form>
          <p class="comment-text" v-else>{{ comment.text }}</p>

          <button
            class="delete-com-btn"
            @click="handleDelete(comment.id)"
            v-if="comment.creator.email === user.email && !comment.isComment"
            title="Delete"
          >
            <i class="fa fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "CommentsComp",
  props: ["post"],
  data() {
    return {
      formData: { text: "" },
      count: 0,
    };
  },
  methods: {
    ...mapActions([
      "deleteComment",
      "getComments",
      "updateComment",
      "decCommentsCount",
      "getPosts",
    ]),
    ...mapMutations(["toggleUpdate", "getComment"]),
    editFunc(comment) {
      this.toggleUpdate(comment);
      this.getComment(comment);
      if (this.oldComment) {
        this.formData = this.oldComment;
      }
    },
    handleSubmit() {
      const updatedComment = {
        ...this.formData,
        creator: JSON.stringify(this.formData.creator),
        isComment: 0,
      };
      this.updateComment(updatedComment);
      this.toggleUpdate(updatedComment);
    },
    handleDelete(id) {
      this.deleteComment(id);
      this.decCommentsCount(this.post.id);
      setTimeout(() => {
        this.getPosts();
      }, 2000);
    },
  },
  computed: {
    ...mapGetters(["comments", "user", "oldComment"]),
  },
  created() {
    this.getComments();
  },
};
</script>
