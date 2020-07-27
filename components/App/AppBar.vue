<template>
  <v-app-bar color="grey lighten-5" elevation="1" height="74" app light>
    <v-app-bar-nav-icon @click.stop="onShowHide" />
  </v-app-bar>
</template>

<script>
export default {
  props: {
    drawer: {
      type: Boolean
    }
  },
  methods: {
    onShowHide() {
      this.$emit("clicked", this.drawer);
    }
  }
};
</script>
