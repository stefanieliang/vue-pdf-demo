<!--  -->
<template>
  <div>
    <div id="page_vue" v-cloak>
      <div id="canshu" class="downLoad_btn" @click="begin_fn">
        <span v-text="button_text"></span>
      </div>
      <div class="pageMark"></div>
      <div id="target" v-if="page_all_data && page_all_data.sex">
        <div class="head hidex">
          <img
            crossorigin="anonymous"
            v-if="has_company"
            :src="page_all_data.companyIntroduction.company_img_url"
          />
          <p v-html="page_all_data.plan_name"></p>
        </div>
        <div class="footer hidex">
          <p v-if="has_company">
            此险种由{{page_all_data.companyIntroduction.name}}承保，服务热线：
            <span>{{page_all_data.companyIntroduction.hotline}}</span>
          </p>
          <i class="pageSize">
            第
            <span class="pageSize_current">-</span>页/共
            <span class="pageSize_total">-</span>页
          </i>
        </div>
        <!--  封面 -->
        <div class="page page_cover active">
          <h3 class="company_name" v-if="has_company">{{page_all_data.companyIntroduction.name}}</h3>
          <div class="plan_box" v-html="page_all_data.plan_name"></div>
          <div class="user_msg">
            <div class="user_msg_sex">
              被保人性别：
              <span class="info_value">{{page_all_data.sex}}</span>
            </div>
            <div class="user_msg_year">
              被保人年龄：
              <span class="info_value">{{page_all_data.years}}岁</span>
            </div>
            <div class="user_msg_amount">
              计划书保额：
              <span class="info_value" v-html="page_all_data.insurance_amount"></span>
            </div>
          </div>
        </div>
        <!-- 前言 -->
        <div class="page">
          <h3 class="preSay">尊敬的客户：</h3>
          <div class="send_word" v-if="has_company">
            <p>
              感谢您选择{{page_all_data.companyIntroduction.name}}
              <br />您所选择的保险产品计划书详情如下：
            </p>
          </div>

          <div class="back_color_type">
            <div>
              被保人：
              <span class="back_color_type_span">{{page_all_data.sex}} {{page_all_data.years}}岁</span>
            </div>
          </div>
          <div
            class="table-container"
            v-show="page_all_data.firstTable"
            v-html="page_all_data.firstTable"
          ></div>
          <div class="back_color_type total">
            <div>
              首年总保费
              <span class="back_color_type_span">
                <i>¥</i>
                <span v-html="page_all_data.rateAmount"></span>
              </span>
            </div>
          </div>
        </div>
        <!-- 保障 -->
        <div class="page typeBaozhang" v-if="page_all_data.baozhangHtml.length>0">
          <ul class="safeguard">
            <li v-for="(bzItem,bzIndex) in page_all_data.baozhangHtml" v-html="bzItem"></li>
          </ul>
        </div>
        <!-- 病种 -->
        <div class="page typeIll" v-if="page_all_data.diseases && page_all_data.diseasesKey">
          <ul class="illPage_ul">
            <li v-for="(illItem,illIndex) in page_all_data.diseases[page_all_data.diseasesKey]">
              <div class="title v1-hide">
                <p class="title-main">{{illItem.diseases_name}}</p>
                <div class="bottom-line"></div>
              </div>
              <div v-html="readIll(illItem)"></div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jsPDF";
import local_mock from "./pdf_mock";
export default {
  components: {},

  data() {
    return {
      local_mock: local_mock,
      page_all_data: {}, //所有需要处理的页面数据
      pic_count_Data: [],
      picData: {},
      pdf_name: "hello.pdf", //默认名字
      button_text: "生成PDF并分享",
      has_company: false, // 有没公司
      link_short: ""
    };
  },

  created() {
    // theme.loading(true);
    this.initPage();
  },

  mounted() {
    let _this = this;
  },

  methods: {
    begin_fn() {
      let _this = this;
      if ($(".downLoad_btn").hasClass("ready")) {
        $(".downLoad_btn").removeClass("ready");

        // theme.loading(true);
        _this.download();
      }
    },
    // 渲染病种多结构
    readIll(item) {
      // 段落模式
      if (item.disease_paragraph) {
        return item.disease_paragraph;
      } else {
        // 列表模式
        var html = "";
        item.diseases.map(function(v, i) {
          html += "<div>" + (i + 1) + ". " + v.parent + "</div>";
        });
        return html;
      }
    },
    // 本地模拟数据
    initPage() {
      var _this = this;
      window.pdf = new jsPDF("", "pt", "a4");
      // $.get(
      //   _this.local_mock,
      //   function(res) {
      //     if (res.code == 200 && res.data) {
      _this.page_all_data = _this.local_mock.data;
      _this.$nextTick(() => {
        _this.first_init();
      });
      //     }
      //   },
      //   "json"
      // );
    },
    // 生成分享
    download() {
      console.log("生成分享...");
      let _this = this;
      // console.log('1111')
      //a4纸的尺寸[595,842]，html页面生成的canvas在pdf中图片的宽高
      if (window.blob) {
        _this.button_text = "分享PDF";
        //已经生成了的直接分享

        // theme.loading(false);
        $(".downLoad_btn").addClass("ready");
        window.open(URL.createObjectURL(blob));
        pdf.save(_this.pdf_name);

        return false;
      }

      var element = $("#target"); // 这个dom元素是要导出pdf的div容器
      console.log("element..", element);
      var w = element.width(); // 获得该容器的宽
      var h = element.height(); // 获得该容器的高
      var canvas = document.createElement("canvas");

      canvas.width = w * 2; // 将画布宽&&高放大两倍
      canvas.height = h * 2;
      var context = canvas.getContext("2d");
      context.scale(2, 2);

      // 【重要】关闭抗锯齿
      context.mozImageSmoothingEnabled = true;
      context.webkitImageSmoothingEnabled = true;
      context.msImageSmoothingEnabled = true;
      context.imageSmoothingEnabled = true;

      $(".pageSize_total").text($(".page").size() - 1); //页码
      var opts = {
        useCORS: true //开启跨域配置
        // allowTaint: true,
        // async: false,
      };
      for (let i = 0; i < $(".page").length; i++) {
        // console.log('here' + i)
        if (i >= 1) {
          $(".head,.footer").removeClass("hidex");
        }
        $(".page")
          .eq(i)
          .addClass("active")
          .siblings()
          .removeClass("active");
        $(".pageSize_current").text(i);
        html2canvas(element[0], opts).then(function(canvas) {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;
          var position = 0;
          var picName = "pic_" + i;

          //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
          window.imgWidth = 595;
          window.imgHeight = (592 / contentWidth) * contentHeight;
          // console.log(canvas);
          var pageData = canvas.toDataURL("image/jpeg", 0.7); //后面数值 0到1之间，  数值越小，所绘制出的图像越模糊

          _this.pic_count_Data.push(pageData);
          _this.picData[picName] = pageData;
        });
      }

      var timer = setInterval(function() {
        if (_this.pic_count_Data.length >= $(".page").length) {
          // console.log('保存')
          clearInterval(timer);
          for (var j = 0; j < _this.pic_count_Data.length; j++) {
            var picName = "pic_" + j;
            if (j > 0) {
              pdf.addPage();
            }
            pdf.addImage(
              _this.picData[picName],
              "JPEG",
              0,
              0,
              imgWidth,
              imgHeight
            );
            $("body").append(
              '<img class="result_pic" src="' + _this.picData[picName] + '">'
            );
          }

          $("#target").hide();
          $(".pageMark").hide();
          // pdf.save('test.pdf');
          window.blob = pdf.output("blob");
          console.log(pdf);

          _this.button_text = "分享PDF";

          // if (与客户的交互时的转换格式) {
          //     // window.base = _this.blobToDataURL(blob);
          //     // window.shareLocal = base.result;
          // } else {
          $(".downLoad_btn").addClass("ready");
          // theme.loading(false);
          window.open(URL.createObjectURL(blob));
          pdf.save(_this.pdf_name);
          // }
        }
      }, 100);
    },
    // 文件格式
    blobToDataURL(blob, callback) {
      var a = new FileReader();
      // a.onload = function (e) { callback(e.target.result); }
      a.readAsDataURL(blob);
      return a;
    },
    // 页面过长时的处理  是各位所需要的
    renderOverpage($el) {
      // console.log(maxheight)
      let _this = this;
      let thisHeight = $el.height();
      let totalPage = 0;
      if (thisHeight > maxheight) {
        totalPage = Math.ceil(thisHeight / maxheight);
        // console.log(thisHeight);
        // console.log('页面该分为' + Math.ceil(thisHeight / maxheight) + '页');
        $el.attr(
          "style",
          "height:" +
            window.maxheight +
            "px;width:" +
            window.pWidth * totalPage +
            "px;column-count: " +
            totalPage +
            ""
        );
        $el.find("ul").attr("style", "height:" + window.maxheight + "px");
        let $bEle = $el.eq(0);

        if (totalPage > 1) {
          for (let w = 0; w < totalPage; w++) {
            if (w > 0) {
              $bEle.after(
                $bEle
                  .clone()
                  .css("left", "-" + window.pWidth * (totalPage - w) + "px")
              );
            }
          }
        }
      }
    },
    // 渲染计算页面
    first_init() {
      let _this = this;

      window.pWidth = $(".page")
        .eq(0)
        .width();
      window.pHeight = $(".page")
        .eq(0)
        .height(); //一页pdf显示html页面生成的canvas高度;
      window.maxheight = pHeight - 90 - 70; //每个页面最大的高度

      _this.pdf_name =
        _this.page_all_data.plan_name +
        "-" +
        _this.page_all_data.sex +
        "-" +
        _this.page_all_data.years +
        "岁-保险计划书.pdf";
      if (
        _this.page_all_data.companyIntroduction &&
        _this.page_all_data.companyIntroduction.name
      ) {
        _this.has_company = true;
      }

      _this.renderOverpage($(".typeBaozhang"));
      _this.renderOverpage($(".typeIll"));

      setTimeout(function() {
        // theme.loading(false);
        $(".downLoad_btn").addClass("ready");
      }, 1000);
    }
  }
};
</script>
<style lang="less" scoped>
// [v-cloak] {
//   display: none;
// }
// body {
//   background: #fff;
//   // background: red;
// }
// @packPageWidth: 1190px;
// @packPageHigth: 1682px;
// @countMargin: 1522px; /*算了ma上下减70  所以 1682- 90 -70 》 1522*/
// @footerTop: 1622px; /* 1682 - 60footer的高度*/
// .pageMark {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: #f99;
//   z-index: 3;
//   color: #fff;
//   font-size: 40px;
//   text-align: center;
//   background: url(../assets/cover_mark.jpg) #fff no-repeat center top;
//   background-size: cover;
// }
// .result_pic {
//   border-bottom: 20px solid #ddd;
//   &:last-child {
//     margin-bottom: 258px;
//   }
// }
// // 内页
// #target {
//   width: @packPageWidth;
//   height: @packPageHigth;
//   overflow: scroll;
//   // text-align: center;
//   background-color: #fff;
// }
// .page {
//   font-style: normal !important;
//   width: @packPageWidth;
//   height: @countMargin; /*算了ma上下减70  所以 842- 90 - 70 》 */
//   overflow: hidden;
//   // width:800px; min-height:1130px;
//   // width:800px; min-height:1300px;
//   // width:992px; min-height:1418px;
//   padding: 0px 50px;
//   margin: 90px auto 70px;
//   page-break-inside: avoid;
//   position: fixed;
//   top: 0;
//   left: 0;
//   display: none;
//   z-index: 1;
//   background-color: #fff;
//   // opacity: 0;
//   &.yanshiTable.forCount {
//     opacity: 0;
//     display: block;
//   }
//   &.tablePart {
//     .table-container {
//       border-bottom: none;
//       margin-top: 30px;
//       padding-bottom: 0px;
//     }
//     h4 {
//       margin: 40px 0 10px;
//     }
//   }
//   &.typeBaozhang,
//   &.typeIll {
//     height: inherit;
//     min-height: @countMargin;
//     padding: 0;
//     text-align: justify;
//     column-gap: 0px;
//     column-fill: auto;
//   }
//   &.active {
//     display: block;
//     z-index: 2;
//     // opacity: 1;
//   }
//   &.v_card_page {
//     .plan-vcard-new {
//       border-top: none;
//     }
//   }
//   // padding:45px;
//   h3.preSay {
//     font-size: 28px;
//     color: #444444;
//     margin: 30px auto 12px;
//   }
//   .send_word {
//     background-color: #f2f2f2;
//     // background-color: #ff00ff;
//     padding: 15px 15px;
//     border-radius: 4px;
//     position: relative;
//     margin: 0px auto 25px;
//     font-size: 22px;
//     line-height: 40px;
//     height: 110px;
//     display: block;
//     &:after {
//       position: absolute;
//       width: 0;
//       height: 0;
//       content: "";
//       border-top: 10px solid transparent;
//       border-left: 10px solid transparent;
//       border-right: 10px solid transparent;
//       border-bottom: 10px solid #f2f2f2;
//       left: 10px;
//       top: -18px;
//     }
//   }
//   .back_color_type {
//     position: relative;
//     color: #444444;
//     font-size: 26px;
//     display: inline-block;
//     margin-bottom: 25px;
//     padding: 0 4px;
//     div {
//       position: relative;
//       z-index: 1;
//     }
//     .back_color_type_span {
//       color: #ea1111;
//       font-size: 26px;
//       i {
//         font-style: normal;
//         font-size: 16px;
//       }
//     }
//     &:after {
//       content: "";
//       position: absolute;
//       width: 100%;
//       height: 20px;
//       bottom: 0;
//       left: 0;
//       z-index: 0;
//       background-color: #ffe0cc;
//     }
//     &.total {
//       float: right;
//       margin-bottom: 0px;
//       margin-top: 25px;
//       text-align: right;
//     }
//   }
//   .table-container {
//     overflow: hidden;
//     -webkit-transition: height 0.4s;
//     width: 100%;
//     position: relative;
//     // font-size: 20px;
//     padding-bottom: 50px;
//     border-bottom: 1px solid #efefef;
//     // margin-bottom: 25px;
//     table,
//     tr {
//       width: 100%;
//     }
//     th,
//     td {
//       background: #fff;
//       padding-left: 0;
//       text-align: center;
//       border: 1px solid #e7e7e7;
//       text-align: center;
//       padding: 10px 4px;
//       vertical-align: middle;
//       font-size: 20px;
//       color: #444;
//       span {
//         font-size: 20px;
//         display: inline-block;
//       }
//     }
//     th {
//       background: #f2f2f2;
//     }
//     thead th:nth-of-type(1) {
//       // width: 20%;
//     }
//     td:first-child {
//       // text-align: justify;
//     }

//     // 表格底部说明
//     .table-note {
//       text-align: center;
//       color: #fff;
//     }
//   }

//   h4 {
//     position: relative;
//     display: inline-block;
//     font-size: 28px;
//     margin-bottom: 40px;
//     padding: 0 4px;
//     span {
//       position: relative;
//       z-index: 1;
//     }
//     &:after {
//       content: "";
//       position: absolute;
//       width: 100%;
//       height: 18px;
//       bottom: 0;
//       left: 0;
//       z-index: 0;
//       background-color: #ffe0cc;
//     }
//   }

//   // 保障
//   .safeguard,
//   .illPage_ul {
//     height: 100%;

//     .title {
//       position: relative;
//       display: inline-block;
//       font-size: 28px;
//       margin-bottom: 40px;
//       padding: 0 4px;
//       &.sub {
//         display: block;
//         font-size: 24px;
//         margin-bottom: 20px;
//         color: #666;
//         &:after {
//           display: none;
//         }
//       }
//       .title-main {
//         position: relative;
//         z-index: 1;
//       }
//       .pingan-diseases-mark {
//         display: none;
//       }
//       &:after {
//         content: "";
//         position: absolute;
//         width: 100%;
//         height: 18px;
//         bottom: 0;
//         left: 0;
//         z-index: 0;
//         background-color: #ffe0cc;
//       }
//     }
//     .bottom_show_more {
//       display: none;
//     }
//     & > li {
//       margin-bottom: 50px;
//       padding: 50px 50px 0px;
//       width: @packPageWidth;
//       position: relative;
//       box-sizing: border-box;
//       // background: #efefef;
//       &:after {
//         width: 1090px; /**1090**/
//         content: "";
//         height: 0;
//         position: absolute;
//         top: 0;
//         left: 50px;
//         border-bottom: 1px solid #efefef;
//         // border-bottom: 1px solid red;
//       }
//       &:first-child {
//         &:after {
//           border-bottom: none;
//         }
//       }
//       &:last-child {
//         margin-bottom: 0;
//       }
//       .list {
//         font-size: 20px;
//         line-height: 40px;
//         margin: 10px auto 20px;
//         .item {
//           margin-bottom: 20px;
//           &:last-child {
//             margin-bottom: 0px;
//           }
//         }
//         .inner-hyperTitle {
//           font-weight: bold;
//         }
//         .inner-title {
//           padding-left: 28px;
//           color: #222;
//           span {
//             font-size: 28px;
//             color: #ea1111;
//           }
//         }
//         .inner-list {
//           padding-left: 28px;
//           p {
//             color: #999;
//           }
//         }
//       }
//       // .flex_text{
//       //     &_row{
//       //         display: flex;
//       //         margin-bottom: 50px;
//       //         line-height: 40px;
//       //         &:last-child{
//       //             margin-bottom:0;
//       //         }
//       //         label{
//       //             width: 340px;
//       //             font-size: 24px;
//       //         }
//       //         &_content{
//       //             font-size: 20px;
//       //             flex: 1;
//       //             text-align: justify;
//       //             span{
//       //                 font-size: 28px;
//       //                 color: #ea1111;
//       //             }
//       //         }
//       //     }
//       // }
//       // 安行宝简单模板
//       .simpTable {
//         & > li {
//           position: relative;
//           padding-right: 200px;
//           margin-bottom: 30px;
//           font-size: 22px;
//           span:last-child {
//             position: absolute;
//             right: 0;
//             top: 0;
//             color: #ff6430;
//             font-size: 28px;
//             font-weight: bold;
//           }
//           & > ul {
//             color: #666;
//             font-size: 20px;
//           }
//         }
//       }
//       .postfix {
//         font-size: 16px;
//         color: #999;
//       }
//       //安行宝 简单模板结束

//       // 旧模版
//       .normal-top {
//         display: inline-block;
//         position: relative;
//         .title {
//           z-index: 1;
//           &:after {
//             display: none;
//           }
//         }
//         .bg:last-child {
//           position: absolute;
//           width: 100%;
//           height: 18px;
//           top: 22px;
//           left: 0;
//           z-index: 0;
//           background-color: #ffe0cc;
//         }
//       }
//       .item-title-main {
//         font-size: 22px;
//       }
//       .item-container {
//         font-size: 20px;
//         color: #666;
//         line-height: 30px;
//         margin-bottom: 30px;
//       }
//       .item-title-detail {
//         display: none;
//       }
//       span.color.bold {
//         color: #ff6430;
//       }
//       // 旧模版结束
//     }
//   }

//   // 病种
//   .illPage_ul {
//     .title {
//       position: relative;
//       display: inline-block;
//       font-size: 28px;
//       margin-bottom: 40px;
//       padding: 0 4px;
//       &.sub {
//         display: block;
//         font-size: 24px;
//         margin-bottom: 20px;
//         color: #666;
//         &:after {
//           display: none;
//         }
//       }
//       .title-main {
//         position: relative;
//         z-index: 1;
//       }
//       .pingan-diseases-mark {
//         display: none;
//       }
//       &:after {
//         content: "";
//         position: absolute;
//         width: 100%;
//         height: 18px;
//         bottom: 0;
//         left: 0;
//         z-index: 0;
//         background-color: #ffe0cc;
//       }
//     }
//     & > li {
//       margin-bottom: 50px;
//       padding: 50px 50px 0px;
//       width: @packPageWidth;
//       position: relative;
//       box-sizing: border-box;
//       // background: #efefef;
//       &:after {
//         width: 1090px; /**1090**/
//         content: "";
//         height: 0;
//         position: absolute;
//         top: 0;
//         left: 50px;
//         border-bottom: 1px solid #efefef;
//         // border-bottom: 1px solid red;
//       }
//       &:first-child {
//         &:after {
//           border-bottom: none;
//         }
//       }
//       &:last-child {
//         margin-bottom: 0;
//       }
//       div {
//         font-size: 24px;
//         line-height: 42px;
//         color: #222;
//       }
//     }
//   }

//   // 利益
//   .tips {
//     background: #f2f2f2;
//     color: #999;
//     font-size: 20px;
//     line-height: 40px;
//     position: relative;
//     padding: 15px 15px 15px 20px;
//     border-radius: 8px;
//     margin-top: 30px;
//     height: 110px;
//     &:before {
//       content: "";
//       position: absolute;
//       left: 0;
//       top: 0;
//       height: 100%;
//       width: 6px;
//       background: #999999;
//     }
//   }
//   .liyi_p {
//     margin: 10px auto;
//     font-size: 14px;
//     span {
//       font-size: 18px;
//       color: red;
//     }
//   }

//   .plan-vcard-new {
//     position: relative;
//     height: 270px;
//     // padding-top:160px;
//     border-top: 1px solid #efefef;
//     box-sizing: content-box;
//     &-bg {
//       height: 120px;
//       background: #f2f2f2;
//       border-radius: 60px;
//       position: absolute;
//       width: 100%;
//       top: 130px;
//       left: 0;
//     }
//     &:after {
//       content: "";
//       position: absolute;
//       bottom: 0px;
//       left: 0px;
//       width: 100%;
//     }

//     .plan-vcard-pic-new {
//       width: 80px;
//       height: 80px;
//       border-radius: 40px;
//       margin-right: 40px;
//       float: left;
//       img {
//         border-radius: 40px;
//         margin: 20px 0 0 20px;
//       }
//     }
//     .plan-vcard-info-new {
//       font-size: 22px;
//       line-height: 28px;
//       color: #574646;
//       float: left;
//       padding-top: 30px;
//       p:first-child {
//         margin-bottom: 7px;
//       }
//       .phone {
//         color: #ea1111;
//       }
//     }
//     .qrcode {
//       position: absolute;
//       top: 60px;
//       right: 60px;
//       width: 160px;
//       font-size: 13px;
//       line-height: 20px;
//       text-align: center;
//       img {
//         display: block;
//         margin: auto;
//         // width:
//       }
//     }
//   }
// }

// // 封面
// .page_cover {
//   height: @packPageHigth;
//   padding: 0;
//   margin: 0;
//   background: url(../assets/cover.jpg) no-repeat top center;
//   background-size: 100% 100%;
//   .company_name {
//     font-size: 40px;
//     color: #191a1b;
//     text-align: center;
//     position: absolute;
//     top: 383px;
//     left: 10%;
//     width: 80%;
//     font-weight: bold;
//   }
//   .plan_box {
//     font-size: 56px;
//     color: #191a1b;
//     text-align: center;
//     position: absolute;
//     top: 600px;
//     left: 10%;
//     width: 80%;
//     font-weight: bold;
//     line-height: 88px;
//     font-weight: bold;
//     h2 {
//       font-size: 68px;
//       font-weight: bold;
//     }
//   }
//   .user_msg {
//     position: absolute;
//     bottom: 373px;
//     left: 50%;
//     margin-left: -175px;
//     line-height: 76px;
//     width: 350px;
//     text-align: center;
//     font-size: 28px;
//     color: #191a1b;
//     text-align: justify;
//     // background:red;opacity: 0.2;
//     > div {
//       position: relative;
//     }
//     .info_value {
//       position: absolute;
//       left: 170px;
//       // background-color: blue;
//       font-size: 30px;
//       display: block;
//       top: 0;
//       width: 200px;
//       text-align: center;
//       &:after {
//         content: "";
//         position: absolute;
//         top: 60px;
//         left: 0px;
//         width: 200px;
//         border-bottom: 1px solid #000000;
//       }
//     }
//   }
// }

// .head {
//   background: #fff;
//   line-height: 80px;
//   text-align: right;
//   position: relative;
//   border-bottom: 1px solid #efefef;
//   font-size: 20px;
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   z-index: 2;
//   padding: 0 50px;
//   display: block;
//   width: 100%;
//   &.hidex {
//     display: none;
//   }
//   img {
//     display: block;
//     width: 60px;
//     height: 60px;
//     position: absolute;
//     top: 10px;
//     left: 50px;
//   }
//   h2 {
//     font-weight: normal;
//     display: inline-block;
//   }
// }

// .footer {
//   background: #fff;
//   line-height: 60px;
//   text-align: left;
//   border-top: 1px solid #efefef;
//   font-size: 20px;
//   position: absolute;
//   top: @footerTop;
//   width: 100%;
//   z-index: 2;
//   padding: 0 50px;
//   display: block;
//   color: #444444;
//   &.hidex {
//     display: none;
//   }
//   span {
//     color: #ff6430;
//   }
//   .pageSize {
//     position: absolute;
//     text-align: center;
//     top: 14px;
//     right: 50px;
//     display: inline-block;
//     background-color: #efefef;
//     height: 32px;
//     line-height: 32px;
//     padding: 0 16px;
//     border-radius: 16px;
//     font-size: 14px;
//     font-style: normal;
//     width: 130px;
//     span {
//       color: #444444;
//     }
//   }
// }

// .downLoad_btn,
// .to_link {
//   position: fixed;
//   bottom: 15px;
//   text-align: center;
//   color: #fff;
//   z-index: 9;
//   left: 3%;
//   text-align: center;
//   padding: 10px 0;
//   background-color: #ddd;
//   width: 94%;
//   border-radius: 8px;

//   &.ready {
//     background-color: #ff6430;
//     &:active {
//       background-color: #e26136;
//     }
//   }
//   span {
//     font-size: 44px;
//     display: inline-block;
//     margin: 0 auto;
//     height: 108px;
//     line-height: 108px;
//     position: relative;
//     padding-left: 52px;
//     &:after {
//       content: "";
//       position: absolute;
//       left: 0;
//       top: 0;
//       height: 100%;
//       width: 40px;
//       // background: url(../assets/icon_01.png) no-repeat center center;
//       background-size: 48px;
//     }
//   }
// }
// .bottom_tips {
//   text-align: center;
//   font-size: 40px;
//   color: #ff6430;
//   position: fixed;
//   bottom: 150px;
//   left: 0;
//   z-index: 9;
//   display: inline-block;
//   left: 0%;
//   // background-color: #000;
//   line-height: 100px;
//   // padding: 0 2rem;
//   // transform: translateX(-50%);
//   width: 100%;
//   background-color: #fff;
// }
// .dialog_tips {
//   div {
//     font-size: 3rem;
//     font-weight: bold;
//     color: #ff6430;
//     line-height: 6rem;
//   }
//   p {
//     font-size: 2.4rem;
//     color: 999;
//   }
// }
// .theme_tips_white_con {
//   max-width: inherit !important;
// }
// .th_tc {
//   max-height: inherit !important;
// }
// .to_link {
//   bottom: 200px;
// }
// .th_btn {
//   font-size: 3rem !important;
//   height: 8rem !important;
//   line-height: 8rem !important;
// }

// .theme_loading_content {
//   width: 80px !important;
//   height: 80px !important;
//   background-size: 40px !important;
// }
// .theme_loading_circle_run,
// .theme_loading_circle {
//   width: 80px !important;
//   height: 80px !important;
//   background-size: 80px !important;
// }
</style>