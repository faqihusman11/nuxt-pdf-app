import Vue from "vue";
import { isMobile } from "mobile-device-detect";

export default function(_, inject) {
  Vue.prototype.$isMobile = isMobile;
}
