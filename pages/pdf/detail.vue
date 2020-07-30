<template>
  <section>
    <div class="container is-fullhd" id="pdf" ref="pdf">
      <vue-draggable-resizable
        id="signature"
        v-for="(item, index) in listSignature"
        :key="item.id"
        :active="item.isLocked"
        :draggable="item.isLocked"
        :resizable="item.isLocked"
        :lock-aspect-ratio="item.isLocked"
        :parent="true"
        :w="item.w"
        :h="item.h"
        :y="item.y"
        :x="item.x"
        :min-width="min"
        :min-height="min"
        :max-width="max"
        :max-height="max"
        @dragging="onDrag"
        @resizing="onResize"
        :z="1"
        :class-name="item.isLocked ? 'dotted' : 'no-border'"
      >
        <b-button
          class="fab"
          type="is-text"
          style="position:absolute;top:-10px;left:-50px"
          @click="onActivated(item, index)"
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
        <img id="img" :src="item.img" />
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
          <b-button
            class="fab"
            :disabled="zoom != 100 || listSignature.length < 1"
            @click="downloadPDF"
          >
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
    min: 75,
    max: 150,
    isZoomed: false,
    signatureImg: signatureImg,
    numPages: undefined,
    currentPage: 1,
    listSignature: [],
    listCoordinate: []
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
        id: Math.floor(10000 + Math.random() * 90000),
        x: 425,
        y: window.scrollY == 0 ? 475 : window.scrollY,
        w: 100,
        h: 100,
        img: this.signatureImg,
        isLocked: true
      });
    },
    onActivated(item, index) {
      if (item.isLocked == true) {
        item.isLocked = false;
        const div = document.getElementById("signature");
        const rect = div.getBoundingClientRect();
        const x = rect.left;
        const y = rect.top;
        const w = rect.width;
        const h = rect.height;

        this.listCoordinate.push({
          id: item.id,
          x: x,
          y: y,
          w: w,
          h: h
        });
      } else {
        item.isLocked = true;
        this.listCoordinate.splice(index, 1);
      }
    },
    deleteItem(item, index) {
      this.listSignature.splice(index, 1);
      if (item.isLocked == false) {
        this.onActivated(item, index);
      }
    },
    onResize(x, y, w, h) {
      // console.log("x resize", x);
      // console.log("y resize", y);
      // console.log("w resize", w);
      // console.log("h resize", h);
    },
    onDrag(x, y) {
      // console.log("x drag", x);
      // console.log("y drag", y);
    },
    onZoomIn() {
      const div = document.getElementById("pdf");
      const clientWidth = div.clientWidth;
      div.style.width = clientWidth + 150 + "px";

      this.zoom += 20;
      this.min += 15;
      this.max += 30;

      if (this.listSignature.length > 0) {
        const signature = document.getElementById("signature");
        const img = document.getElementById("img");
        const clientLeft = signature.clientLeft;
        const clientTop = signature.clientTop;
        const clientWidth = img.clientWidth;
        const clientHeight = img.clientHeight;

        if (this.zoom == 100) {
          signature.style.left = clientLeft + 50 + "px";
          signature.style.top = clientTop + 50 + "px";
        } else if (this.zoom == 80) {
          signature.style.left = clientLeft - 40 + "px";
          signature.style.top = clientTop - 40 + "px";
        }
        img.style.width = clientWidth + 20 + "px";
        img.style.height = clientHeight + 20 + "px";
      }
    },
    onZoomOut() {
      const div = document.getElementById("pdf");
      const clientWidth = div.clientWidth;
      div.style.width = clientWidth - 150 + "px";

      this.zoom -= 20;
      this.min -= 15;
      this.max -= 30;

      if (this.listSignature.length > 0) {
        const signature = document.getElementById("signature");
        const img = document.getElementById("img");
        const clientLeft = signature.clientLeft;
        const clientTop = signature.clientTop;
        const clientWidth = img.clientWidth;
        const clientHeight = img.clientHeight;

        if (this.zoom == 80) {
          signature.style.left = clientLeft - 50 + "px";
          signature.style.top = clientTop - 50 + "px";
        } else if (this.zoom == 60) {
          signature.style.left = clientLeft - 125 + "px";
          signature.style.top = clientTop - 125 + "px";
        }
        img.style.width = clientWidth - 20 + "px";
        img.style.height = clientHeight - 20 + "px";
      }
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
      console.log("List Coordinate", this.listCoordinate);
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
