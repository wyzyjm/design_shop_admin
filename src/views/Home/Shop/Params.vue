<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提醒 -->
      <el-alert title="注意 : 只允许为第三级分类设置参数" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类 :</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectValue"
            :options="cateList"
            @change="cateHandleChange"
            :props="cateCascaderProps"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab页签 -->
      <el-tabs v-model="activeName" @tab-click="heandleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="cateDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态标签属性 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 标签循环 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row,i)"
                >{{item}}</el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editCatePrams(scope.row.attr_id)"
                >修改</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteCatePrams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="配置管理" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="cateDialogVisible=true"
          >添加属性</el-button>
          <!-- 动态参数 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 标签循环 -->
                <el-tag
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(scope.row,i)"
                >{{item}}</el-tag>
                <!-- 添加按钮 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="editCatePrams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteCatePrams(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加'+ dialogTitle"
      :visible.sync="cateDialogVisible"
      width="50%"
      @closed="addCateDialogClosed"
    >
      <el-form
        ref="addCateDialogRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="80px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="addCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCatePrams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改'+ dialogTitle"
      :visible.sync="editDateDialogVisible"
      width="50%"
      @closed="eidtCateDialogClosed"
    >
      <el-form
        ref="editCateDialogRef"
        :model="editCateForm"
        :rules="editCateFormRules"
        label-width="80px"
      >
        <el-form-item :label="dialogTitle" prop="attr_name">
          <el-input v-model="editCateForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCatePramsOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue" // 面包屑
export default {
  name: "goods_params",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumb: ["商品管理", "商品参数"], // 面包屑数据
      cateList: [], // 所有 商品分类数据
      selectValue: [], // 选中的分类
      // 分类级联选择器 配置
      cateCascaderProps: {
        expandTrigger: "hover", // 展开方式
        value: "cat_id", // 选中获取的值
        label: "cat_name", // 显示哪个值, 名字
        children: "children", // 子集通过哪个属性获取
      },
      // tab高亮name,默认是many
      activeName: "many",
      // 动态获取分类参数
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 添加参数对话框
      cateDialogVisible: false, // 对话框的显示与隐藏
      // 添加数据
      addCateForm: {
        attr_name: "",
      },
      addCateFormRules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      // 修改参数对话框
      editDateDialogVisible: false,
      editCateForm: { attr_name: "" },
      editCateFormRules: {
        attr_name: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories")
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.cateList = res.data
    },
    // 监听 级联选择器变化
    cateHandleChange() {
      this.getParamsCate()
    },
    // 监听tab栏切换
    heandleTabClick() {
      console.log(this.activeName)
      this.getParamsCate()
    },
    // 获取分类参数
    async getParamsCate() {
      if (!!!this.selectId) return this.$msg.error("请选择分类!")
      const { data: res } = await this.$http.get(
        `categories/${this.selectId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : []
        // 添加两个数据来控制 tag标签
        item.inputVisible = false
        item.inputValue = ""
      })
      console.log(res.data)
      if (this.activeName === "many") {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },

    // 删除分类参数
    async deleteCatePrams(attrId) {
      const isOkDelete = await this.$msgBox
        .confirm("此操作将永久删除该参数, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err)
      console.log(isOkDelete)
      if (isOkDelete !== "confirm") return
      const { data: res } = await this.$http.delete(
        `categories/${this.selectId}/attributes/${attrId}`
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.getParamsCate()
      this.$msg.success(res.meta.msg)
    },
    // 添加分类参数
    addCatePrams() {
      this.$refs.addCateDialogRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          `categories/${this.selectId}/attributes`,
          {
            attr_name: this.addCateForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
        console.log(res)
        this.getParamsCate() // 刷新参数列表
        this.cateDialogVisible = false // 关闭对话框
      })
    },
    // 监听对话框关闭事件
    addCateDialogClosed() {
      this.$refs.addCateDialogRef.resetFields() // 表单重置
    },
    // 修改分类参数
    async editCatePrams(attrId) {
      const { data: res } = await this.$http.get(
        `categories/${this.selectId}/attributes/${attrId}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )
      if (res.meta.status !== 200) return this.$msg.msg(res.meta.msg)
      this.editCateForm = res.data

      this.editDateDialogVisible = true
    },
    // 监听修改对话框关闭事件
    eidtCateDialogClosed() {
      this.$refs.editCateDialogRef.resetFields() // 重置修改对话框
    },
    // 确定修改
    editCatePramsOk() {
      this.$refs.editCateDialogRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.selectId}/attributes/${this.editCateForm.attr_id}`,
          {
            attr_name: this.editCateForm.attr_name,
            attr_sel: this.activeName,
          }
        )
        if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
        this.$msg.success(res.meta.msg)
        this.getParamsCate()
        this.editDateDialogVisible = false // 关闭对话框
      })
    },
    // 输入完成后
    async handleInputConfirm(item) {
      // 对输入内容 去空格处理
      if (item.inputValue.trim().length === 0) {
        item.inputValue = ""
        item.inputVisible = false
        return
      }
      // 添加到 数据中
      item.attr_vals.push(item.inputValue.trim()) // 将添加的tag标签 添加到 标签数组中
      item.inputValue = "" // 请空输入框
      item.inputVisible = false // 隐藏输入框
      this.saveCateTags(item)
    },
    // 保存 tag标签修改
    async saveCateTags(item) {
      // 发送请求 保存tag
      const { data: res } = await this.$http.put(
        `categories/${this.selectId}/attributes/${item.attr_id}`,
        {
          attr_name: item.attr_name,
          attr_sel: item.attr_sel,
          attr_vals: item.attr_vals.join(" "),
        }
      )
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
    },
    // 点击按钮,输入框显示
    showInput(item) {
      item.inputVisible = true
      // $nextTick : 页面元素重新渲染后执行的函数
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除 对应标签
    handleClose(item, i) {
      item.attr_vals.splice(i, 1) // 删除某一个标签
      this.saveCateTags(item)
    },
  },
  // 计算属性
  computed: {
    // 监听是否有选择分类
    isDisabled() {
      if (this.selectValue.length !== 0) {
        return false
      }
      return true
    },
    // 选中的分类参数id
    selectId() {
      if (this.selectValue.length > 0) {
        return this.selectValue[this.selectValue.length - 1]
      }
      return null
    },
    // 判断弹窗标题
    dialogTitle() {
      if (this.activeName === "many") {
        return "动态参数"
      } else {
        return "静态属性"
      }
    },
  },
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.el-cascader {
  margin-left: 15px;
}
.el-tag {
  margin: 5px;
}
.input-new-tag {
  width: 120px;
}
</style>