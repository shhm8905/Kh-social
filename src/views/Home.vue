<template>
  <div class="home" v-if="user">
    <div class="home-content">
      <Navbar />
      <AddPost v-if="isShow" />
      <Header :user="user" />
      <LeftSidebar />
      <RightSidebar />
      <Posts />
      <Spinner v-if="allposts.length < 1" />
    </div>
  </div>
  <Spinner v-else />
</template>

<script>
import Posts from "@/components/Posts.vue";
import Header from "@/components/Header.vue";
import Spinner from "@/components/Spinner.vue";
import AddPost from "@/components/AddPost.vue";
import LeftSidebar from "@/components/LeftSidebar.vue";
import RightSidebar from "@/components/RightSidebar.vue";
import Navbar from "@/components/Navbar.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  name: "HomeView",
  components: {
    Posts,
    Header,
    Spinner,
    AddPost,
    LeftSidebar,
    RightSidebar,
    Navbar,
  },
  computed: {
    ...mapGetters(["isShow", "allposts", "user"]),
  },
  mounted() {
    if (this.user) {
      this.getPosts();
    } else {
      this.$router.push("/auth");
    }
  },
  methods: {
    ...mapActions(["getPosts"]),
  },
};
</script>
