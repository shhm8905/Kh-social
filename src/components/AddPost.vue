<template>
  <div class="add">
    <form @submit.prevent="onSubmit">
      <button type="button" class="close-btn" @click="this.handleClose()">
        X
      </button>
      <h1>Creat a New Post</h1>
      <div class="avatar">
        <figure class="avatar-container">
          <img class="avatar-img" :src="user.avatar" />
        </figure>
        <p class="avatar-name">{{ user.userName }}</p>
      </div>
      <textarea
        v-model="formData.description"
        id="body"
        cols="20"
        rows="4"
        placeholder="What do You want talk about?"
        required
      ></textarea>
      <p class="error" v-if="this.error" v-text="this.error"></p>
      <div class="add-content">
        <div class="form-controller">
          <label for="img"><i class="img fa fa-image"></i></label>
          <input
            accept="image/*"
            type="file"
            id="img"
            v-on:change="handleChange"
          />
        </div>
        <div class="form-controller">
          <label for="video"><i class="video fa fa-video"></i></label>
          <input
            type="file"
            id="video"
            accept="video/*"
            v-on:change="handleChange"
          />
        </div>
        <button type="submit" class="add-btn">
          {{ isUpdate ? "Update Post" : "Add New Post" }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
import { calculateSize } from "@/models/calculate";
export default {
  name: "AddForm",

  data() {
    return {
      error: "",
      formData: { description: "", selectedImg: "", selectedVideo: "" },
    };
  },

  mounted() {
    if (this.oldPost) {
      return (this.formData = this.oldPost);
    }
  },

  methods: {
    ...mapActions(["addPost", "updatePost", "getPosts"]),
    ...mapMutations(["handleClose"]),

    handleChange(e) {
      this.error = "";
      const file = e.target.files[0];
      if (e.target.id === "img") {
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
              const cavans = document.createElement("canvas"),
                MAX_WIDTH = 600,
                MAX_HEIGHT = 500,
                [newWidth, newHeight] = calculateSize(
                  img,
                  MAX_WIDTH,
                  MAX_HEIGHT
                );
              cavans.width = newWidth;
              cavans.height = newHeight;
              const ctx = cavans.getContext("2d");
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const urlencoded = ctx.canvas.toDataURL(img);
              this.formData.selectedImg = urlencoded;
            };
          };
          reader.onerror = (err) => console.log(err);
        }
      } else if (e.target.id === "video") {
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => (this.formData.selectedVideo = reader.result);
          reader.onerror = (err) => console.log(err);
        }
      }
    },

    onSubmit() {
      const creator = {
          userName: this.user.userName,
          email: this.user.email,
          avatar: this.user.avatar,
        },
        likes = [],
        d = new Date(),
        yyyy = d.getFullYear(),
        mm = d.getMonth() + 1,
        dd = d.getDate(),
        createdAt = `${yyyy}-${mm}-${dd}`,
        post = {
          id: Math.floor(Math.random() * 10000000),
          user_id: this.user.id,
          creator: JSON.stringify(creator),
          description: this.formData.description,
          selectedImg: this.formData.selectedImg,
          selectedVideo: this.formData.selectedVideo,
          createdAt,
          isComment: 0,
          commentsCount: 0,
          likes: JSON.stringify(likes),
        };
      if (this.isUpdate) {
        const updatedPost = {
          ...this.formData,
          creator: JSON.stringify(this.formData.creator),
          likes: JSON.stringify(this.formData.likes),
          isComment: 0,
        };
        this.updatePost(updatedPost);
        this.getPosts();
        this.handleClose();
      } else {
        if (post.selectedImg && !post.selectedVideo) {
          this.addPost(post);
          setTimeout(() => {
            this.getPosts();
            this.handleClose();
          }, 200);
        } else if (!post.selectedImg && post.selectedVideo) {
          this.addPost(post);
          setTimeout(() => {
            this.getPosts();
            this.handleClose();
          }, 200);
        } else {
          this.error = "Please select image or video!!!";
        }
      }
    },
  },
  computed: {
    ...mapGetters(["oldPost", "isUpdate", "user"]),
  },
};
</script>
