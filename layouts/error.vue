<template>
  <v-app dark>
    <v-container>
      <v-row align="center" justify="center" no-gutters style="height: 75vh;">
        <v-col cols="4">
          <v-card class="pa-2 text-center" elevation="0" color="transparent">
            <v-img
              :src="require(`~/static/img/user.png`)"
              height="275"
              contain
            />
          </v-card>
        </v-col>
        <v-col cols="8">
          <v-card class="pa-2" elevation="0" color="transparent">
            <v-card-title
              :class="
                `primary--text font-weight-bold ${
                  $vuetify.breakpoint.mdAndUp ? 'display-2' : 'display-1'
                }`
              "
            >
              {{ error.statusCode === 404 ? pageNotFound : otherError }}
            </v-card-title>
            <v-card-text
              v-html="
                error.statusCode === 404 ? pageNotFoundText : otherErrorText
              "
              :class="
                `my-2 ${$vuetify.breakpoint.mdAndUp ? 'title' : 'subtitle-1'}`
              "
            >
            </v-card-text>
            <v-card-actions class="pl-3">
              <v-btn color="primary" to="/" nuxt>Go To Homepage</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  layout: "empty",
  components: {
    // AppLogo: () => import('@/components/Brand/AppLogo')
  },
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError;
    return {
      title
    };
  },
  data() {
    return {
      pageNotFound: "Page Not Found",
      pageNotFoundText:
        "We can't find the page you're looking for.<br/>You can either return to previous page, visit our homepage, or contact our support team.",
      otherError: "An Error Occurred",
      otherErrorText:
        "Try to refresh this page, visit our homepage, or contact our support team for this problem."
    };
  }
};
</script>
