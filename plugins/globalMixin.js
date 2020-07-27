import _truncate from "lodash/truncate";
import dayjs from "dayjs";

export default function (_, inject) {
  function disableBodyScroll() {
    if (process.server || !document) return;
    document.documentElement.style.overflowY = "hidden";
  }
  function enableBodyScroll() {
    if (process.server || !document) return;
    document.documentElement.style.overflowY = "auto";
  }
  function toggleBodyScroll(enable) {
    if (process.server || !document) return;
    document.documentElement.style.overflowY = enable ? "auto" : "hidden";
  }

  function formatDate(date, format = "DD/MMMM/YYYY") {
    if ("9999-12-31" === date) return "Present";
    return date ? dayjs(date).format(format) : "";
  }

  function today() {
    return new Date().toISOString().slice(0, 10);
  }

  function year() {
    return dayjs().format("YYYY");
  }

  const fns = {
    enableBodyScroll,
    disableBodyScroll,
    toggleBodyScroll,
    formatDate,
    _truncate,
    today,
    year,
  };

  for (let name in fns) {
    inject(name, fns[name]);
  }
}
