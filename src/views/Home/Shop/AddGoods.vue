<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <el-card>
      <!-- 提示区 -->
      <el-alert title="添加商品信息" :closable="false" type="info" center show-icon></el-alert>
      <!-- 进度条 -->
      <!-- 
         align-center : 居中显示
      -->
      <el-steps :space="200" :active="activeIndex -0 " align-center finish-status="success">
        <el-step :title="item.name" v-for="(item,i) in steps" :key="i"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addForm" ref="addFormRef" :rules="addFormRules" label-position="top">
        <!-- tab栏 区域 -->
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cascader.options"
                :props="cascader.props"
                @change="cascaderChandleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="list.attr_name" v-for="list in manyTabDate" :key="list.attr_id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="list.attr_vals">
                <el-checkbox
                  border
                  :label="checkItem"
                  v-for="(checkItem,i) in list.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabDate" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <!-- action 图片上传地址
              on-preview 预览
              on-remove 移除图片
              list-type 指定呈现方式
            -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" class="addGoods" @click="addGoodsFn">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="previewImgInfo.imgUrl" :alt="previewImgInfo.imgName" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash"
import Breadcrumb from "@/components/Breadcrumb.vue" // 面包屑
export default {
  name: "addGoods",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumb: ["商品管理", "商品列表", "添加商品"], // 面包屑数据
      // 步骤条
      steps: [
        {
          index: "0",
          name: "基本信息",
          status: true,
        },
        {
          index: "1",
          name: "商品参数",
          status: false,
        },
        {
          index: "2",
          name: "商品属性",
          status: false,
        },
        {
          index: "3",
          name: "商品图片",
          status: false,
        },
        {
          index: "4",
          name: "商品内容",
          status: false,
        },
      ],
      // 步骤条高亮
      activeIndex: "0",
      // 添加表单
      // 表单数据项
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [], // 选中的商品分类
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      // 表单验证规则
      addFormRules: {
        // 商品名称
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          { min: 1, max: 8, message: "长度在 1 到 8 个字符", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请输选择商品分类", trigger: "blur" },
        ],
      },
      // 级联选择器
      cascader: {
        options: [], // 数据
        // 配置
        props: {
          expandTrigger: "hover",
          children: "children",
          label: "cat_name",
          value: "cat_id",
        },
      },
      // 动态参数
      manyTabDate: [],
      // 静态属性
      onlyTabDate: [],
      // 上传地址
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("loginToken"),
      },
      // 预览图片信息
      previewImgInfo: {
        imgName: "",
        imgUrl: "",
      },
      // 图片预览 对话框的显示与隐藏
      imgDialogVisible: false,
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.cascader.options = res.data
      // console.log(this.cascader.options)
    },
    // 监听级联选择器变化
    cascaderChandleChange() {
      // console.log(this.addForm)
    },
    // 监听tab离开事件
    beforeTabLeave(activeName, oldActiveName) {
      console.log(activeName, oldActiveName)
      if (oldActiveName === "0" && this.addForm.goods_cat.length === 0) {
        this.$msg.error("请先选择商品分类!")
        return false
      }
    },
    // 监听tab选中事件
    async tabClicked() {
      // 商品参数请求
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many",
            },
          }
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.status)
        console.log(res)
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.trim().length === 0
              ? []
              : item.attr_vals.trim().split(" ")
        })
        this.manyTabDate = res.data
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only",
            },
          }
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.status)
        // res.data.forEach((item) => {
        //   item.attr_vals =
        //     item.attr_vals.trim().length === 0
        //       ? []
        //       : item.attr_vals.trim().split(" ")
        // })
        this.onlyTabDate = res.data
        console.log(this.onlyTabDate)
      }
    },
    // 图片预览
    handlePreview(file) {
      console.log(file)
      this.previewImgInfo.imgName = file.name
      this.previewImgInfo.imgUrl = file.response.data.url
      this.imgDialogVisible = true
    },
    // 移除图片
    handleRemove(file) {
      // 获取要删除的图片
      const removeFile = file.response.data.tmp_path
      // 在数组中查找删除图片的 索引
      const i = this.addForm.pics.findIndex((x) => {
        x.pic === removeFile
      })
      // 数组中移除图片
      this.addForm.pics.splice(i, 1)
      // console.log(this.addForm)
    },
    // 上传成功
    uploadSuccess(response) {
      // console.log(response)
      const picList = { pic: response.data.tmp_path }
      this.addForm.pics.push(picList)
    },
    // 添加商品
    addGoodsFn() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return this.$msg.error("请填写必要的表单项!")
        // 校验通过, 执行添加的业务逻辑
        // 深拷贝 表单数据
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(",")
        this.manyTabDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlyTabDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
        const { data: res } = await this.$http.post("goods", form)
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.$router.push("/goods")
      })
    },
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length !== 0) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
      }
      return null
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 5px 0 !important ;
}
.previewImg {
  width: 100%;
}
.addGoods {
  margin-top: 15px;
}
</style>