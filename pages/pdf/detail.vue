<template>
  <section>
    <div class="is-pulled-right">
      <b-button
        type="is-info"
        class="fab"
        style="top:250px"
        :disabled="zoom == 100"
        @click="onZoomIn"
      >
        <b-icon pack="mdi" icon="magnify-plus"> </b-icon>
      </b-button>
      <b-button
        type="is-info"
        class="fab"
        style="top:300px"
        :disabled="zoom == 60"
        @click="onZoomOut"
      >
        <b-icon pack="mdi" icon="magnify-minus"> </b-icon>
      </b-button>
      <b-button
        type="is-info"
        class="fab"
        style="top:150px"
        @click="
          onActiveSignature();
          isActive = false;
        "
      >
        <b-icon pack="mdi" icon="pencil"> </b-icon>
      </b-button>
      <b-button
        type="is-info"
        class="fab"
        style="top:200px"
        @click="downloadPDF"
      >
        <b-icon pack="mdi" icon="download"> </b-icon>
      </b-button>
    </div>
    <div
      class="container is-fullhd px-6"
      id="pdf"
      ref="pdf"
      :style="`width:${zoom}%`"
    >
      <pdf
        v-for="i in numPages"
        :key="i"
        :src="filePDF"
        :page="i"
        class="my-6"
        :style="`width:${zoom}%`"
      ></pdf>
    </div>
    <div :style="signatureStyle">
      <VueDragResize
        v-if="isActiveSignature"
        :isActive="isActiveSignature"
        :isDraggable="isActiveSignature"
        :isResizable="isActiveSignature"
        :w="initialWidth"
        :h="initialHeight"
        :y="initialTop"
        :x="initialLeft"
        :aspectRatio="isActiveSignature"
        v-on:resizing="resize"
        v-on:dragging="resize"
        style="position:absolute;"
      >
        <img :src="signatureImg" />
      </VueDragResize>
    </div>
  </section>
</template>

<script>
import pdf from "vue-pdf";
import VueDragResize from "vue-drag-resize";
import signatureImg from "@/static/img/sign.png";

export default {
  components: {
    pdf,
    VueDragResize
  },
  data: () => ({
    zoom: 100,
    signatureImg: signatureImg,
    numPages: undefined,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    isActiveSignature: false,
    isActive: false,
    isButtonActive: false,
    isLocked: false
  }),
  computed: {
    filePDF() {
      if (!this.$route.params.pdf.src) return null;
      return pdf.createLoadingTask(this.$route.params.pdf.src);
    },
    initialWidth() {
      return this.width == 0 ? 100 : this.width;
    },
    initialHeight() {
      return this.height == 0 ? 50 : this.height;
    },
    initialTop() {
      return this.top == 0 ? 450 : this.top;
    },
    initialLeft() {
      return this.left == 0 ? 650 : this.left;
    },
    signatureStyle() {
      return `position:absolute;width:${this.initialWidth}px;height:${this.initialHeight}px;top:${this.initialTop}px;left:${this.initialLeft}px;`;
    }
  },
  mounted() {
    if (this.$route.params.pdf) {
      this.filePDF.promise.then(pdf => {
        this.numPages = pdf.numPages;
      });
    }
  },
  created() {
    if (!this.$route.params.pdf) {
      this.$router.push({
        path: "/pdf"
      });
    }
  },
  methods: {
    onActiveSignature() {
      this.isActiveSignature = this.isActiveSignature == true ? false : true;
    },
    onActived() {
      this.isActive = this.isActive == true ? false : true;
    },
    resize(newRect) {
      this.width = newRect.width;
      this.height = newRect.height;
      this.top = newRect.top;
      this.left = newRect.left;
    },
    onUndo() {
      this.$refs.signaturePad.undoSignature();
    },
    onClear() {
      this.$refs.signaturePad.clearSignature();
    },
    onSave() {
      const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
      console.log(isEmpty);
      console.log(data);
    },
    onZoomIn() {
      this.zoom += 20;
    },
    onZoomOut() {
      this.zoom -= 20;
    },
    downloadPDF() {
      const divWidth = document.getElementById("pdf").offsetWidth;
      const divHeight = document.getElementById("pdf").offsetHeight;
      const jsPDF = require("jspdf");
      const html2canvas = require("html2canvas");
      const pdfName = this.$route.params.pdf.file_name;

      html2canvas(this.$refs.pdf, {
        scale: 0.8,
        allowTaint: true,
        useCORS: true,
        x: window.scrollX,
        y: window.scrollY,
        width: divWidth,
        height: divHeight,
        logging: true
      }).then(function(canvas) {
        var doc = new jsPDF("p", "mm", "a4");
        var imgData = canvas.toDataURL("image/png", 1.0);
        var imgWidth = doc.internal.pageSize.getWidth();
        var pageHeight = doc.internal.pageSize.getHeight();
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        var position = 0;
        doc.addImage(imgData, "PNG", 0, position, imgWidth - 20, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth - 20, imgHeight);
          heightLeft -= pageHeight;
        }
        doc.save(`${pdfName}.pdf`);
      });
    }
  }
};
</script>

<style>
.fab {
  position: fixed;
  border-radius: 50px;
}
</style>
