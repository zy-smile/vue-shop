import Vue from 'vue'
//  导入app根组件
import App from './App.vue'
//  导入路由
import router from './router'
//  导入全局样式
import './assets/css/global.css'
import './plugins/element.js'
import 'element-ui/lib/theme-chalk/index.css'
//  引入字体图标样式文件
import './assets/fonts/iconfont.css'
//  引入treeTable依赖
import treeTable from 'vue-table-with-tree-grid'
//  导入axios依赖
import axios from 'axios'
//  导入富文本编辑器组件
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)
    //  配置axios根路径
    //  挂载axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    //  发送请求时token验证
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.component('tree-table', treeTable)
    //  创建格式时间过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
        // const hh = (dt.getHours() + '').padStart(2, '0')
        // const mm = (dt.getMinutes() + '').padStart(2, '0')
        // const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')