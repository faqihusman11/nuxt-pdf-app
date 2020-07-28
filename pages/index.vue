<template>
  <div>
    <AppToolbar :is-dashboard="true" />
    <div class="container is-fullhd"></div>
  </div>
</template>

<script>
export default {
  components: {
    AppToolbar: () => import("@/components/App/AppToolbar")
  },
  data: () => ({
    headers: [
      {
        text: "PDF File",
        value: "src"
      },
      {
        text: "File Name",
        value: "file_name"
      }
    ],
    pdfModal: false
  }),
  computed: {
    listPDF() {
      return [
        {
          id: "01",
          src: "https://cdn.filestackcontent.com/5qOCEpKzQldoRsVatUPS",
          file_name: "File PDF 01"
        },
        {
          id: "02",
          src:
            "https://www.learningcontainer.com/wp-content/uploads/2019/09/sample-pdf-with-images.pdf",
          file_name: "File PDF 02"
        }
      ];
    }
  },
  methods: {
    onGoToPDF(item) {
      this.$router.push({
        name: "pdf",
        params: {
          pdf: item
        }
      });
    }
  }
};
</script>
