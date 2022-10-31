<template>
  <div class="rightsidebar">
    <div class="right-container">
      <div class="right-content">
        <h2>Follow new people</h2>
        <div class="user-item" v-for="item in users" :key="item.id">
          <div class="user-container" v-if="user?.userName !== item?.userName">
            <div class="user-content">
              <figure class="user-avatar">
                <img class="user-img" :src="item?.avatar" />
              </figure>
              <p @click="handleUser(item.id)" class="user-name">
                {{ item?.userName }}
              </p>
            </div>
            <button @click="handleFollow(item.id)">
              {{
                item?.followers?.find((id) => user.id === id)
                  ? "Unfollow"
                  : "Follow +"
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "RightSidebar",
  methods: {
    ...mapActions(["getUsers", "getUser", "getUserPosts", "follow"]),
    handleUser(id) {
      this.getUser(id);
      this.getUserPosts(id);
      this.$router.push("/user");
    },
    handleFollow(id) {
      this.follow(id);
      setTimeout(() => {
        this.getUsers();
      }, 150);
    },
  },
  computed: {
    ...mapGetters(["users", "user"]),
  },
  created() {
    this.getUsers();
  },
};
</script>
