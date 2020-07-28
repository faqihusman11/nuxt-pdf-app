<template>
  <div>
    <p class="subtitle mt-2 mb-6">
      <b-icon class="mr-2" pack="mdi" icon="file-pdf-box"> </b-icon>
      <span class="font-weight-bold">List PDF File</span>
    </p>
    <div class="container is-fullhd">
      <div class="columns">
        <div v-for="item in listPDF" :key="item.id" class="column">
          <div class="columns">
            <div class="column is-4" @click="onGoToPDF(item)">
              <b-icon
                pack="mdi"
                icon="file-pdf"
                size="is-large"
                style="cursor:pointer;"
              >
              </b-icon>
              <p>
                {{ item.file_name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({}),
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
        name: "pdf-detail",
        params: {
          pdf: item
        }
      });
    }
  }
};
</script>
