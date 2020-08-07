import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
} from 'element-ui'

Vue.use(Button)
// 表单
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 布局容器
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
// 导航
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)


Vue.prototype.$msg = Message
