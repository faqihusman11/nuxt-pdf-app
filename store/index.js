export const state = () => ({
  appName: "Nuxt PDF",
  showNavigationDrawer: false,
});

export const mutations = {
  toggleNavigationDrawer(state, toggled) {
    state.showNavigationDrawer =
      typeof toggled === "undefined" ? !state.showNavigationDrawer : !!toggled;
  },
};
