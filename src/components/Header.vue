<template>
  <div class="header">
    <div class="header-container">
      <div class="header-info">
        <figure class="avatar-img-container">
          <img :src="user?.avatar" />
        </figure>
        <button @click="handleShow()" class="add-post">Write your post</button>
      </div>
      <div class="header-icons">
        <li @click="handleShow()">
          <i class="img fa fa-image"></i> &nbsp; Image
        </li>
        <li @click="handleShow()">
          <i class="vid fa fa-video"></i> &nbsp;Video
        </li>
        <li @click="handleShow()">
          <i class="file fa fa-file-pdf"></i> &nbsp;File
        </li>
        <li @click="handleShow()">
          <i class="file-img fa fa-file-image"></i> &nbsp;File-img
        </li>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  name: "HeaderComp",
  props: ["user"],
  methods: {
    ...mapMutations(["handleShow"]),
  },
};
</script>
