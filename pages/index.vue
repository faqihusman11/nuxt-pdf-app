<template>
  <div>
    <AppToolbar :is-dashboard="true" />
    <v-container fluid class="my-4">
      <p class="title grey--text">
        <v-icon class="mr-2">mdi-file-pdf-box</v-icon>
        <span class="font-weight-bold">List PDF File</span>
      </p>
      <v-data-table
        :headers="headers"
        :items="listPDF"
        :items-per-page="10"
        :sort-desc="listPDF"
        item-key="id"
      >
        <template v-slot:item.src="{ item }">
          <v-icon @click="onGoToPDF(item)">mdi-file-pdf</v-icon>
        </template>
      </v-data-table>
    </v-container>
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
      // this.pdfModal = this.pdfModal == false ? true : false;
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
