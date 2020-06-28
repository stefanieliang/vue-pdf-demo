import Vue from 'vue'
import VueRouter from 'vue-router'
import Html2canvas from '../views/Html2canvas.vue'
import JsPdf from '../views/JsPdf.vue'
import Download from '../views/Download.vue'
import Columns from '../views/Columns.vue'
import Columns2 from '../views/Columns2.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/html2canvas',
    name: 'Html2canvas',
    component: Html2canvas
  },
  {
    path: '/jsPdf',
    name: 'JsPdf',
    component: JsPdf
  },
  {
    path: '/download',
    name: 'Download',
    component: Download
  },
  {
    path: '/columns',
    name: 'Columns',
    component: Columns
  },
  {
    path: '/columns2',
    name: 'Columns2',
    component: Columns2
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router