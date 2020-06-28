<!-- html2canvas -->
<template>
  <div id="canvas">
    <dl>
      <dt>toggle</dt>
      <dd>
        <ul>
          <li>the way</li>
          <li id="bar">
            <p>the world ends</p>
            <form action="./" method="get">
              <p>
                bang
                <input type="radio" name="foo" value="off" />
              </p>
              <p>
                whimper
                <input type="radio" name="foo2" value="on" />
              </p>
            </form>
          </li>
          <li>i grow old</li>
          <li id="baz">pluot?</li>
        </ul>
        <blockquote>
          <address>bar maids,</address>
        </blockquote>
        <h1>sing to me, erbarme dich</h1>
      </dd>
    </dl>
    <p style="color: black; font-size: 1em; line-height: 1.3em; clear: both">
      This is a nonsensical document, but syntactically valid HTML 4.0. All 100% conformant CSS1 agents should be able to render the document elements above this paragraph
      <b>indistinguishably</b> (to the pixel) from this reference rendering, (except font rasterization and form widgets). All discrepancies should be traceable to CSS1 implementation shortcomings. Once you have finished evaluating this test, you can return to the
      <A href="sec5526c.htm" style="text-decoration:none">parent page</A>.
    </p>
    <hr />
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  components: {},

  data() {
    return {};
  },

  mounted() {
    html2canvas(document.getElementById("canvas")).then(function(canvas) {
      document.getElementById("canvas").appendChild(canvas);
    });
  },

  methods: {}
};
</script>
<style lang='less' scoped>
</style>