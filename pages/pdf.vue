<template>
  <div>
    <!-- <v-toolbar dark color="primary">
      <v-btn class="no-hover" icon dark>
        <v-icon>mdi-arrow-left-bold</v-icon>
      </v-btn>
      <v-toolbar-title class="font-weight-bold">
        {{ $route.params.pdf.file_name }}
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
    </v-toolbar> -->
    <div>
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        fab
        dark
        small
        absolute
        top
        right
        style="top:25px"
        @click="
          onActiveSignature();
          isActive = false;
        "
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn
        color="primary"
        fab
        dark
        small
        absolute
        top
        right
        style="top:75px"
        @click="downloadPDF"
      >
        <v-icon>mdi-download</v-icon>
      </v-btn>
    </div>
    <v-container id="pdf" ref="pdf">
      <div>
        <pdf
          v-for="i in numPages"
          :key="i"
          :src="filePDF"
          :page="i"
          class="mt-6 mb-12"
        ></pdf>
      </div>
      <div>
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
            data-html2canvas-ignore="true"
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
          <!-- <v-avatar size="128" style="position: relative; overflow: visible;">
              <v-img :src="avatar ? avatar : defaultAvatar" />
              <v-btn
                fab
                small
                absolute
                color="primary"
                style="bottom: 0; right: 0;"
                title="Change Profile Picture"
                @click="onButtonClick"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <input
                ref="uploader"
                class="d-none"
                type="file"
                accept="image/*"
                @change="onFileChanged"
              />
            </v-avatar> -->
          <v-speed-dial
            v-model="isButtonActive"
            absolute
            top
            right
            direction="bottom"
            :open-on-hover="true"
            transition="scale-transition"
            style="top:5px;right:-50px"
            data-html2canvas-ignore="true"
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
  </div>
</template>

<script>
import pdf from "vue-pdf";
import VueDragResize from "vue-drag-resize";

export default {
  components: {
    pdf,
    VueDragResize
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
    signatureValue: null,
    imageSign: null
  }),
  computed: {
    filePDF() {
      if (!this.$route.params.pdf.src) return null;
      return pdf.createLoadingTask(this.$route.params.pdf.src);
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
    if (this.$route.params.pdf) {
      this.filePDF.promise.then(pdf => {
        this.numPages = pdf.numPages;
      });
    }
  },
  created() {
    if (!this.$route.params.pdf) {
      this.$router.push({
        path: "/"
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
      // console.log(this.imageSign);
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
