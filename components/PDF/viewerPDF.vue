<template>
  <v-dialog
    v-model="modal"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card color="grey lighten-3">
      <v-toolbar dark color="primary" data-html2canvas-ignore="true">
        <v-btn class="no-hover" icon dark @click="onHideForm">
          <v-icon>mdi-arrow-left-bold</v-icon>
        </v-btn>
        <v-toolbar-title class="font-weight-bold">
          {{ pdfItem.file_name }}
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          class="no-hover"
          icon
          dark
          @click="
            onActiveSignature();
            isActive = false;
          "
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn class="no-hover" icon dark @click="downloadPDF">
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container id="pdf" ref="pdf">
        <div style="position: absolute;">
          <pdf
            v-for="i in numPages"
            :key="i"
            :src="filePDF"
            :page="i"
            class="my-12"
          ></pdf>
        </div>
        <div style="position: absolute;">
          <VueDragResize
            v-if="isActiveSignature"
            :isActive="isActiveSignature"
            :isDraggable="isActiveSignature"
            :isResizable="isActiveSignature"
            :w="initialWidth"
            :h="initialHeight"
            :y="initialTop"
            :x="initialLeft"
            v-on:resizing="resize"
            v-on:dragging="resize"
            contentClass="elevation-4"
            style="position:absolute;"
          >
            <v-btn
              color="primary"
              fab
              dark
              small
              absolute
              top
              left
              style="top:5px;left:-50px"
              @click="
                onActived();
                isActiveSignature = false;
              "
            >
              <v-icon>mdi-lock</v-icon>
            </v-btn>
          </VueDragResize>
          <div v-if="isActive" :style="signatureStyle">
            <VueSignaturePad
              ref="signaturePad"
              :class="isLocked ? 'elevation-0' : 'elevation-2'"
            />
            {{ signatureValue }}
            <v-speed-dial
              v-model="isButtonActive"
              absolute
              top
              right
              direction="bottom"
              :open-on-hover="true"
              transition="scale-transition"
              style="top:5px;right:-50px"
            >
              <template v-slot:activator>
                <v-btn v-model="isButtonActive" color="primary" dark small fab>
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
              </template>
              <v-btn fab dark x-small color="green" @click.prevent="onUndo">
                <v-icon>mdi-undo</v-icon>
              </v-btn>
              <v-btn fab dark x-small color="indigo" @click.prevent="onClear">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-btn fab dark x-small color="red" @click.prevent="onLock">
                <v-icon>{{
                  isLocked ? "mdi-lock" : "mdi-lock-open-variant"
                }}</v-icon>
              </v-btn>
              <v-btn fab dark x-small color="indigo" @click.prevent="onSave">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </v-speed-dial>
          </div>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import pdf from "vue-pdf";
import VueDragResize from "vue-drag-resize";

export default {
  components: {
    pdf,
    VueDragResize
  },
  props: {
    pdfItem: {
      type: Object
    },
    modal: {
      type: Boolean
    }
  },
  data: () => ({
    numPages: undefined,
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    isActiveSignature: false,
    isActive: false,
    isButtonActive: false,
    isLocked: false,
    signatureValue: null
  }),
  computed: {
    filePDF() {
      if (!this.pdfItem) return null;
      return pdf.createLoadingTask(this.pdfItem.src);
    },
    initialWidth() {
      return this.width == 0 ? 150 : this.width;
    },
    initialHeight() {
      return this.height == 0 ? 100 : this.height;
    },
    initialTop() {
      return this.top == 0 ? 75 : this.top;
    },
    initialLeft() {
      return this.left == 0 ? 75 : this.left;
    },
    signatureStyle() {
      return `position:absolute;width:${this.initialWidth}px;height:${this.initialHeight}px;top:${this.initialTop}px;left:${this.initialLeft}px;`;
    }
  },
  mounted() {
    if (this.pdfItem) {
      this.filePDF.promise.then(pdf => {
        this.numPages = pdf.numPages;
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
    onLock() {
      this.isLocked = this.isLocked == true ? false : true;
      if (this.isLocked == true) {
        this.$refs.signaturePad.lockSignaturePad();
      } else {
        this.$refs.signaturePad.openSignaturePad();
      }
    },
    onSave() {
      this.$refs.signaturePad.lockSignaturePad();
      this.isLocked = true;
    },
    downloadPDF() {
      const divWidth = document.getElementById("pdf").offsetWidth;
      const divHeight = document.getElementById("pdf").offsetHeight;
      const jsPDF = require("jspdf");
      const html2canvas = require("html2canvas");
      const pdfName = this.pdfItem.file_name;

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
    },
    onHideForm() {
      this.$emit("show", this.modal);
    }
  }
};
</script>
