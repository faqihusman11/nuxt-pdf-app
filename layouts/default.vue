<template>
  <v-app light style="background-color: #F5F5F5;">
    <AppSidebar />
    <AppContent>
      <nuxt />
    </AppContent>
    <AppFooter />
  </v-app>
</template>

<script>
export default {
  components: {
    AppSidebar: () => import("@/components/App/AppSidebar"),
    AppContent: () => import("@/components/App/AppContent"),
    AppFooter: () => import("@/components/App/AppFooter")
  }
};
</script>
