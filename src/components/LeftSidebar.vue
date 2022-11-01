<template>
  <div class="leftsidebar">
    <div class="left-container">
      <div class="left-content">
        <div class="user-imgs">
          <img class="bg-img" :src="user?.bg_img" />
          <figure class="user-avatar">
            <img :src="user?.avatar" />
          </figure>
        </div>
        <div class="user-info">
          <h3 @click="handleUser(user.id)">{{ user?.userName }}</h3>
          <p>
            <i class="fa fa-home"></i> Living in <span>{{ user.city }}</span>
          </p>
          <p>
            <i class="fa fa-map-marker"></i> From
            <span>{{ user.country }} </span>
          </p>
          <p><i class="fa fa-heart"></i> {{ user.relation }}</p>
          <p>
            <i class="fa fa-users"></i>
            {{ user?.followers?.length > 0 ? user?.followers?.length : 0 }}
            {{ user?.followers?.length > 1 ? "people" : "person" }} follow him
          </p>
        </div>
        <button class="logout-btn" @click="handleLogout()">Logout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "LeftSidebar",
  methods: {
    ...mapMutations(["logout"]),
    ...mapActions(["getUser", "getUserPosts"]),
    handleUser(id) {
      this.getUser(id);
      this.getUserPosts(id);
      setTimeout(() => {
        this.$router.push("/user");
      }, 500);
    },
    handleLogout() {
      this.logout();
      this.$router.push("/auth");
    },
  },
  computed: {
    ...mapGetters(["user"]),
  },
};
</script>
