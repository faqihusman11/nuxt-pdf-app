<template>
  <div>
    <v-navigation-drawer v-model="drawer" width="225" color="secondary" app>
      <v-card
        color="gradient-primary"
        class="mx-auto pa-2"
        max-width="300"
        to="/"
        dark
        tile
        outlined
      >
        <v-card-text class="d-flex justify-center white--text">
          <v-icon class="mr-2">mdi-vuejs</v-icon>
          <!-- <span class="font-weight-bold mr-3">Contact List</span> -->
        </v-card-text>
      </v-card>
      <v-list dense dark>
        <v-list-item-group color="blue-grey lighten-1">
          <v-list-item
            v-for="(item, i) in listMenu"
            :key="i"
            :to="item.link"
            class="grey--text text--lighten-2"
            link
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" small></v-icon>
            </v-list-item-icon>
            <v-list-item-content class="ml-n4">
              <v-list-item-title
                v-text="item.text"
                class="font-weight-bold"
              ></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <AppBar :drawer="drawer" @clicked="showHideBar" />
  </div>
</template>

<script>
export default {
  components: {
    AppBar: () => import("@/components/App/AppBar")
  },
  data: () => ({
    drawer: true,
    listMenu: [
      {
        icon: "mdi-chart-bar",
        text: "Dashboard",
        link: "/"
      }
    ]
  }),
  methods: {
    showHideBar() {
      this.drawer = this.drawer == true ? false : true;
    }
  }
};
</script>
