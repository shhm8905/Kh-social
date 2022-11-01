<template>
  <div class="user">
    <Spinner v-if="!userData" />
    <button title="Go Back" class="back-btn" @click="handleBack()">
      <i class="fa fa-chevron-circle-left" aria-hidden="true"></i>
    </button>
    <div class="user-container">
      <div class="user-content">
        <div class="user-imgs">
          <figure class="bg-img">
            <label for="bg-img" title="Change background image" v-if="isEdit">
              <i class="fa fa-camera"></i>
            </label>
            <input
              type="file"
              id="bg-img"
              v-on:change="handleChange"
              accept="image/*"
            />
            <img :src="userData?.bg_img" />
          </figure>
          <figure class="user-avatar">
            <label for="user-avatar" title="Change your image" v-if="isEdit">
              <i class="img fa fa-camera"></i>
            </label>
            <input
              type="file"
              id="user-avatar"
              v-on:change="handleChange"
              accept="image/*"
            />
            <img :src="userData?.avatar" />
          </figure>
        </div>
        <div class="user-info">
          <input
            v-if="isEdit"
            type="text"
            class="inp-userName"
            placeholder="UserName"
            v-model="updatedUser.userName"
          />
          <h1 v-else>{{ userData?.userName }}</h1>
          <p>
            <i class="fa fa-home"></i>Living in
            <input
              v-model="updatedUser.city"
              type="text"
              v-if="isEdit"
              placeholder="Gothenburg"
            />
            <span v-else> {{ userData?.city }}</span>
          </p>
          <p>
            <i class="fa fa-map-marker"></i>From
            <input
              type="text"
              v-model="updatedUser.country"
              v-if="isEdit"
              placeholder="Sweden"
            />
            <span v-else> {{ userData?.country }} </span>
          </p>
          <p>
            <i class="fa fa-heart"></i>
            <select v-if="isEdit" v-model="updatedUser.relation">
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Engaged">Engaged</option>
            </select>
            <span v-else> {{ userData?.relation }}</span>
          </p>
          <p>
            <i class="fa fa-users"></i>
            {{
              userData?.followers?.length > 0 ? userData?.followers?.length : 0
            }}
            {{ userData?.followers?.length > 1 ? "people" : "person" }} follow
            him
          </p>
          <div class="user-btns">
            <button
              @click="follow(userData.id)"
              class="follow-btn"
              v-if="userData?.id !== user.id"
            >
              {{
                userData?.followers?.find((id) => id === user.id)
                  ? "Unfollow"
                  : "Follow +"
              }}
            </button>
            <button
              v-if="
                userData?.id === user.id || user.email === 'shhm8905@gmail.com'
              "
              class="edit-btn"
              title="Edit"
              @click="toggleEdit()"
            >
              {{ isEdit ? "Cancel" : "Edit" }} &nbsp;
              <i v-if="!isEdit" class="fa fa-pencil" aria-hidden="true"></i>
            </button>
            <button class="save-btn" v-if="isEdit" @click="handleSubmit">
              Save
            </button>
            <button
              class="delete-btn"
              v-if="
                userData?.id === user.id || user.email === 'shhm8905@gmail.com'
              "
              @click="handleDelete(userData.id)"
            >
              Delete Your Account &nbsp;
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
    <AddPost v-if="isShow" />
    <div class="user-posts">
      <div class="user-header">
        <Header :user="userData" v-if="userData?.id === user.id" />
      </div>
      <Posts />
      <Navbar />
    </div>
    <Spinner v-if="allposts.length < 1 && !userData" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import Header from "@/components/Header.vue";
import AddPost from "@/components/AddPost.vue";
import Posts from "@/components/Posts.vue";
import Spinner from "@/components/Spinner.vue";
import { calculateSize } from "@/models/calculate";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "UserSide",
  components: { Header, AddPost, Posts, Spinner, Navbar },
  data: () => {
    return {
      updatedUser: {
        avatar: "",
        bg_img: "",
        userName: "",
        city: "",
        country: "",
        relation: "",
      },
    };
  },
  mounted() {
    this.updatedUser = this.userData;

    setTimeout(() => {
      this.getUserPosts(this.userData?.id);
    }, 100);
  },
  methods: {
    ...mapActions(["getUserPosts", "updateUser", "follow", "deleteUser"]),
    ...mapMutations(["toggleEdit", "resetUserData"]),
    handleBack() {
      this.resetUserData();
      this.$router.push("/");
    },
    handleChange(e) {
      const file = e.target.files[0];
      if (e.target.id === "user-avatar") {
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
              const canvas = document.createElement("canvas"),
                MAX_WIDTH = 200,
                MAX_HIEGHT = 200,
                [newWidth, newHeight] = calculateSize(
                  img,
                  MAX_WIDTH,
                  MAX_HIEGHT
                );
              canvas.width = newWidth;
              canvas.hieght = newHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const urlEncoded = ctx.canvas.toDataURL(img);
              this.updatedUser.avatar = urlEncoded;
            };
          };
          reader.onerror = (err) => console.log(err);
        }
      } else if (e.target.id === "bg-img") {
        if (file) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const img = new Image();
            img.src = reader.result;
            img.onload = () => {
              const canvas = document.createElement("canvas"),
                MAX_WIDTH = 750,
                MAX_HEIGHT = 350,
                [newWidth, newHeight] = calculateSize(
                  img,
                  MAX_WIDTH,
                  MAX_HEIGHT
                );
              canvas.width = newWidth;
              canvas.height = newHeight;
              const ctx = canvas.getContext("2d");
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const urlEncoded = ctx.canvas.toDataURL(img);
              this.updatedUser.bg_img = urlEncoded;
            };
          };
          reader.onerror = (err) => console.log(err);
        }
      }
    },
    handleSubmit() {
      const updatedUserData = {
        ...this.updatedUser,
        followers: JSON.stringify(this.updatedUser.followers),
      };
      this.updateUser(updatedUserData);
      this.toggleEdit();
    },
    handleDelete(id) {
      this.deleteUser(id);
      this.$router.push("/auth");
      window.location.reload();
    },
  },
  computed: {
    ...mapGetters(["userData", "isShow", "user", "allposts", "isEdit"]),
  },
};
</script>
