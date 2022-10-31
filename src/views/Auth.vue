<template>
  <div class="auth">
    <Spinner v-if="isSubmit" />
    <h1 class="logo">Kh-Social</h1>
    <form @submit.prevent="handleSubmit">
      <h1 v-if="isSignUp"><i class="fa fa-user"></i> SignUp</h1>
      <h1 v-else><i class="fa fa-sign-in"></i> SignIn</h1>

      <div :class="isSignUp && 'auth-controller'">
        <input
          v-if="isSignUp"
          type="text"
          required
          placeholder="User Name"
          v-model="userData.userName"
        />
        <input
          type="email"
          required
          placeholder="Email Address"
          v-model="userData.email"
        />
      </div>

      <div :class="isSignUp && 'auth-controller'">
        <input
          type="password"
          required
          placeholder="Password"
          v-model="userData.pass"
        />
        <input
          v-if="isSignUp"
          type="password"
          required
          placeholder="Confirm Password"
          v-model="userData.pass1"
        />
      </div>

      <div class="auth-controller" v-if="isSignUp">
        <input
          type="text"
          required
          placeholder="City"
          v-model="userData.city"
        />
        <input
          type="text"
          required
          placeholder="Country"
          v-model="userData.country"
        />
      </div>

      <select class="auth-relation" v-model="userData.relation" v-if="isSignUp">
        <option value="Single">Single</option>
        <option value="Engaged">Engaged</option>
        <option value="Married">Married</option>
      </select>

      <div class="auth-imgs" v-if="isSignUp">
        <div class="bg_inp">
          <label for="bg_img">
            <i class="fa fa-image"></i>
            <span>Choose your background image</span>
          </label>
          <input type="file" id="bg_img" v-on:change="handleChange" />
        </div>
        <div class="avatar-inp">
          <label for="avatar">
            <i class="fa fa-user-circle"></i>
            <span>Choose your avatar</span>
          </label>
          <input type="file" id="avatar" v-on:change="handleChange" />
        </div>
      </div>

      <button type="submit" class="btn submit-btn">
        {{ isSignUp ? "SignUp" : "SignIn" }}
      </button>

      <button @click="changeMode" type="button" class="btn">
        {{
          isSignUp
            ? "SignIn If you have an account"
            : "SignUp If you don't have an account"
        }}
      </button>
    </form>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { calculateSize } from "@/models/calculate";
import Spinner from "@/components/Spinner.vue";
export default {
  name: "AuthComp",
  data() {
    return {
      isSubmit: false,
      isSignUp: true,
      userData: {
        userName: "",
        email: "",
        pass: "",
        pass1: "",
        avatar: "",
        bg_img: "",
        city: "",
        country: "",
        relation: "",
      },
    };
  },
  methods: {
    ...mapActions(["signUp", "signIn"]),
    changeMode() {
      this.isSignUp = !this.isSignUp;
    },
    handleChange(e) {
      const file = e.target.files[0];
      if (e.target.id === "avatar") {
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
              this.userData.avatar = urlEncoded;
            };
          };
          reader.onerror = (err) => console.log(err);
        }
      } else if (e.target.id === "bg_img") {
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
              this.userData.bg_img = urlEncoded;
            };
          };
          reader.onerror = (err) => console.log(err);
        }
      }
    },
    handleSubmit() {
      this.isSubmit = true;
      const signUp = {
        id: Math.floor(Math.random() * 10000000),
        userName: this.userData.userName,
        email: this.userData.email,
        password: this.userData.pass,
        avatar: this.userData.avatar,
        bg_img: this.userData.bg_img,
        relation: this.userData.relation,
        city: this.userData.city,
        country: this.userData.country,
      };
      const signIn = {
        email: this.userData.email,
        password: this.userData.pass,
      };
      if (this.isSignUp) {
        if (this.userData.pass === this.userData.pass1) {
          this.signUp(signUp);
          setTimeout(() => {
            this.$router.push("/");
            this.isSubmit = false;
          }, 1800);
        }
      } else {
        this.signIn(signIn);
        setTimeout(() => {
          this.$router.push("/");
          this.isSubmit = false;
        }, 1800);
      }
    },
  },
  components: { Spinner },
};
</script>
