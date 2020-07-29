<template>
  <section>
    <div
      class="container is-fullhd"
      id="pdf"
      ref="pdf"
      :style="`width:${zoom}%;`"
    >
      <vue-draggable-resizable
        v-for="(item, index) in listSignature"
        :key="index"
        :active="item.isLocked"
        :draggable="item.isLocked"
        :resizable="item.isLocked"
        :lock-aspect-ratio="item.isLocked"
        :parent="true"
        :w="item.width"
        :h="item.height"
        :y="item.top"
        :x="item.left"
        :min-width="zoom"
        :min-height="zoom"
        @dragging="onDrag"
        @resizing="onResize"
        :z="1"
        :class-name="item.isLocked ? 'dotted' : 'no-border'"
      >
        <b-button
          class="fab"
          type="is-text"
          style="position:absolute;top:-10px;left:-50px"
          @click="onActived(item)"
          data-html2canvas-ignore="true"
        >
          <b-icon
            pack="mdi"
            :icon="item.isLocked ? 'lock-open-variant' : 'lock'"
          >
          </b-icon>
        </b-button>
        <b-button
          v-if="!item.isLocked"
          class="fab"
          type="is-text"
          style="position:absolute;top:-10px;right:-50px"
          @click="deleteItem(item, index)"
          data-html2canvas-ignore="true"
        >
          <b-icon pack="mdi" icon="delete"> </b-icon>
        </b-button>
        <img :src="item.img" />
      </vue-draggable-resizable>
      <pdf
        v-for="i in numPages"
        :key="i"
        :id="i"
        ref="pdfFile"
        :src="filePDF"
        :page="i"
        @link-clicked="currentPage = $event"
        @num-pages="i = $event"
        :style="`margin:auto;margin-bottom:100px`"
      >
      </pdf>
    </div>
    <b-navbar class="px-5" shadow fixed-bottom>
      <template slot="start">
        <b-navbar-item>
          <b-field>
            <b-button size="is-small" disabled>Page</b-button>
            <b-input
              v-model="currentPage"
              type="number"
              size="is-small"
              :min="1"
              :max="numPages"
              @input="onGoToPage(currentPage)"
            ></b-input>
            <b-button size="is-small" disabled>of {{ numPages }} </b-button>
          </b-field>
        </b-navbar-item>
      </template>
      <template slot="end">
        <b-navbar-item>
          <b-button class="fab" :disabled="zoom == 100" @click="onZoomIn">
            <b-icon pack="mdi" icon="magnify-plus"> </b-icon>
          </b-button>
        </b-navbar-item>
        <b-navbar-item>
          <b-button class="fab" :disabled="zoom == 60" @click="onZoomOut">
            <b-icon pack="mdi" icon="magnify-minus"> </b-icon>
          </b-button>
        </b-navbar-item>
        <b-navbar-item>
          <b-button class="fab" @click="onAddSignature">
            <b-icon pack="mdi" icon="pencil"> </b-icon>
          </b-button>
        </b-navbar-item>
        <b-navbar-item>
          <b-button class="fab" :disabled="zoom != 100" @click="downloadPDF">
            <b-icon pack="mdi" icon="download"> </b-icon>
          </b-button>
        </b-navbar-item>
      </template>
    </b-navbar>
  </section>
</template>

<script>
import pdf from "vue-pdf";
import signatureImg from "@/static/img/sign.png";
import VueDraggableResizable from "vue-draggable-resizable";

export default {
  components: {
    pdf
  },
  data: () => ({
    zoom: 100,
    signatureImg: signatureImg,
    numPages: undefined,
    currentPage: 1,
    loadedRatio: 0,
    listSignature: [
      // {
      //   width: 0,
      //   height: 0,
      //   top: 0,
      //   left: 0,
      //   isLocked: true
      // }
    ]
  }),
  computed: {
    filePDF() {
      if (!this.$route.params.pdf.src) return null;
      return pdf.createLoadingTask(this.$route.params.pdf.src);
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
    onGoToPage(page) {
      if (page && page < this.numPages) {
        document.getElementById(page).scrollIntoView();
      }
    },
    onAddSignature() {
      this.listSignature.push({
        width: this.zoom,
        height: this.zoom,
        top: window.scrollY == 0 ? 400 : window.scrollY,
        left: 450,
        img: this.signatureImg,
        isLocked: true
      });
    },
    onActived(item) {
      if (item) {
        item.isLocked = item.isLocked == true ? false : true;
      }
    },
    deleteItem(item, index) {
      this.listSignature.splice(item, 1);
    },
    onResize(top, left, width, height) {
      this.listSignature.width = width;
      this.listSignature.height = height;
      this.listSignature.top = top;
      this.listSignature.left = left;
    },
    onDrag(top, left) {
      this.listSignature.top = top;
      this.listSignature.left = left;
    },
    onZoomIn() {
      this.zoom += 20;
      // this.listSignature.width += 20;
      // this.listSignature.height += 20;
      // this.listSignature.top += 20;
      // this.listSignature.left += 20;
    },
    onZoomOut() {
      this.zoom -= 20;
      // this.listSignature.width -= 20;
      // this.listSignature.height -= 20;
      // this.listSignature.top -= 20;
      // this.listSignature.left -= 20;
    },
    downloadPDF() {
      const divWidth = document.getElementById("pdf").offsetWidth;
      const divHeight = document.getElementById("pdf").offsetHeight;
      const divScrollWidth = document.getElementById("pdf").scrollLeft;
      const divScrollHeight = document.getElementById("pdf").scrollTop;
      const jsPDF = require("jspdf");
      const html2canvas = require("html2canvas");
      const pdfName = this.$route.params.pdf.file_name;

      html2canvas(this.$refs.pdf, {
        scale: 0.8,
        allowTaint: true,
        useCORS: true,
        x: divScrollWidth,
        y: divScrollHeight,
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
  border-radius: 50px;
  border: 0px;
}
.no-border {
  border: 0px;
  position: absolute;
}
.dotted {
  border-style: dotted;
  position: absolute;
}
</style>
