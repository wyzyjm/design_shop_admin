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
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
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
// 面包屑
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
// 卡片
Vue.use(Card)
// 栅格系统
Vue.use(Row)
Vue.use(Col)
// 表格
Vue.use(Table)
Vue.use(TableColumn)
// 开关
Vue.use(Switch)
// 提示
Vue.use(Tooltip)
// 分页
Vue.use(Pagination)
// 对话框
Vue.use(Dialog)
// 标签
Vue.use(Tag)
// 树形结构
Vue.use(Tree)
// 下拉选择
Vue.use(Select)
Vue.use(Option)
// 级联选择器
Vue.use(Cascader)
// 弹窗
Vue.use(Alert)
// tab切换
Vue.use(Tabs)
Vue.use(TabPane)



Vue.prototype.$msg = Message
Vue.prototype.$msgBox = MessageBox
