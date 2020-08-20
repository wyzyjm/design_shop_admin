<template>
  <div>
    <!-- 面包屑 -->
    <Breadcrumb :breadcrumb="breadcrumb"></Breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table
        :data="cateList"
        :columns="columns"
        border
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
      >
        <!-- 是否有效 -->
        <template slot="idOk" slot-scope="scope">
          <i class="el-icon-success" style="color:lightgreen" v-if="scope.row.cat_deleted ===false"></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-setting">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[ 3 ,5, 10,15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类弹窗 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addDialogClose"
    >
      <el-form
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
        label-width="90px"
      >
        <el-form-item label="分类名称 : " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类 : ">
          <el-cascader
            v-model="selectCate"
            :options="parentCate"
            :props="cascaderProps"
            @change="cateCandleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue" // 面包屑
export default {
  name: "cate",
  components: {
    Breadcrumb,
  },
  data() {
    return {
      breadcrumb: ["商品管理", "商品分类"], // 面包屑数据
      cateList: [], // 分类列表数据
      // 商品分类查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0, // 商品分类总数
      // 表格有多少列
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template", // 模板插槽
          template: "idOk", // 插槽名称
        },
        {
          label: "排序",
          type: "template", // 模板插槽
          template: "order", // 插槽名称
        },
        {
          label: "操作",
          type: "template", // 模板插槽
          template: "opt", // 插槽名称
        },
      ],
      // 添加分类
      // 添加分类表单数据项
      addCateForm: {
        cat_pid: 0, // 父分类id
        cat_name: "", // 分类名称
        cat_level: 0, // 分类等级
      },
      // 表单验证规则
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      addCateDialogVisible: false, // 对话框是否显示
      // 父级分类级联配置
      cascaderProps: {
        expandTrigger: "hover", // 展开方式
        value: "cat_id", // 选中获取的值
        label: "cat_name", // 显示哪个值, 名字
        children: "children", // 子集通过哪个属性获取
        checkStrictly: true, // 是否可以单独选中某一项
      },
      parentCate: [], // 父级分类
      selectCate: [], // 级联选择器选中的值
    }
  },
  created() {
    this.getCateList() // 获取分类数据
  },
  methods: {
    // 获取分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      })
      // console.log(res)
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg)
      this.total = res.data.total // 商品分类总数
      this.cateList = res.data.result // 商品分类数据
    },
    // 监听页面size 变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听当前页变化
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getCateList()
    },
    // 添加分类对话框显示
    showAddCateDialog() {
      this.getCateParent() // 先获取父级分类
      this.addCateDialogVisible = true // 显示对话框
    },
    // 获取父级分类
    async getCateParent() {
      const { data: res } = await this.$http.get("categories", {
        params: {
          type: 2,
        },
      })
      if (res.meta.status !== 200) return this.$msg.error(res.meta.msg)
      this.parentCate = res.data
      // console.log(this.parentCate)
    },

    // 级联选择器变化
    cateCandleChange() {
      if (this.selectCate.length > 0) {
        this.addCateForm.cat_pid = this.selectCate[this.selectCate.length - 1] // 给cat_pid赋值
        this.addCateForm.cat_level = this.selectCate.length //设置分类等级
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 确定 添加分类
    async addCate() {
      const { data: res } = await this.$http.post(
        "categories",
        this.addCateForm
      )
      if (res.meta.status !== 201) return this.$msg.error(res.meta.msg)
      this.$msg.success(res.meta.msg) // 弹窗提示
      this.getCateList() // 刷新数据列表
      this.addCateDialogVisible = false // 对话框关闭
    },
    // 监听添加分类对话框关闭事件
    addDialogClose() {
      this.$refs.addCateFormRef.resetFields() // 重置表单
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectCate = []
    },
  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>