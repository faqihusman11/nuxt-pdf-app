import colors from "vuetify/es5/util/colors";

export default {
  breakpoint: {
    thresholds: {
      xs: 375,
      sm: 630,
      md: 996,
      lg: 1200
    }
  },
  icons: {
    iconFont: "mdi"
  },
  theme: {
    light: true,
    dark: false,
    themes: {
      light: {
        primary: colors.red.darken3,
        secondary: colors.blueGrey.darken3,
        accent: colors.indigo.darken4,
        error: colors.red.darken1,
        info: colors.blue.darken1,
        success: colors.green.darken2,
        warning: colors.orange.darken3
      }
    }
  }
};
