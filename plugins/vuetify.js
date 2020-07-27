export default function({ $vuetify }, inject) {
  if (process.browser || process.client) {
    $vuetify.theme.dark = false;
  }
}
