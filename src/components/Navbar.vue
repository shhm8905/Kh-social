<template>
  <ul class="nav">
    <li>
      <router-link to="/">
        <i class="fa fa-home"></i><br />
        Home
      </router-link>
    </li>
    <li @click="handleUser(user.id)">
      <i class="fa fa-user"></i><br />
      You
    </li>
    <li @click="handleLogout">
      <i class="fa fa-sign-out"></i>
      <br />Sign Out
    </li>
  </ul>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from "vuex";
export default {
  name: "navBar",
  methods: {
    ...mapMutations(["logout"]),
    ...mapActions(["getUser", "getUserPosts"]),
    handleUser(id) {
      this.getUser(id);
      this.getUserPosts(id);
      setTimeout(() => {
        this.$router.push("/user");
      }, 100);
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
