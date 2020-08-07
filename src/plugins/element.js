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


Vue.prototype.$msg = Message
