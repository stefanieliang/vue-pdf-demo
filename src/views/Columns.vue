<!--  -->
<template>
  <div>
    <h1 @click="download">columns下载</h1>
    <div id="canvas">
      <p>
        <strong>注意:</strong> columns属性不支持 Internet Explorer 9以及更早版本的浏览器.
      </p>

      <div class="newspaper">
        Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.
        Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam; est usus legentis in iis qui facit eorum claritatem. Investigationes demonstraverunt lectores legere me lius quod ii legunt saepius.
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jsPDF";
export default {
  components: {},

  data() {
    return {};
  },

  computed: {},

  methods: {
    download() {
      html2canvas(document.getElementById("canvas")).then(function(canvas) {
        let dataurl = canvas.toDataURL();

        let doc = new jsPDF();
        doc.addImage(dataurl, "png", 10, 10);
        doc.save("columns.pdf");
      });
    }
  }
};
</script>
<style scoped>
.newspaper {
  columns: 596px 3;
}
</style>