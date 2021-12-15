<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col
          ><el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        show-index
        index-text="#"
        :expand-type="false"
        :selection-type="false"
        border
        class="treeTable"
      >
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color: green"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteCate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加商品分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addCateDialogVisible"
      width="30%"
      @close="addCateDialogClosed"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            :props="cascaderProps"
            :options="parentCateList"
            @change="handleChange"
            v-model="selectedKeys"
            clearable
            filterable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商品分类对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      width="30%"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="80px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList();
  },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总数据条数
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      // 控制添加商品分类对话框的显示与隐藏
      addCateDialogVisible: false,
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 将要添加的分类父id
        cat_pid: 0,
        // 将要添加的分类层级
        cat_level: 0,
      },
      // 添加商品分类表单验证规则
      addCateFormRules: {
        cat_name: { required: true, message: "请输用户名", trigger: "blur" },
      },
      // 父级分类数据列表
      parentCateList: [],
      // 级联选择器数据源
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      // 选中的父级分类id数组
      selectedKeys: [],
       // 控制编辑商品分类对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单
      editCateForm: {
        cat_name: "",
      },
      // 编辑表单验证规则
      editCateFormRules: {
        cat_name: { required: true, message: "请输用户名", trigger: "blur" },
      },
      // 当前编辑分类id
      currentId: ""
    };
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败!");
      }
      this.catelist = res.data.result;
      this.total = res.data.total;
      // console.log(res.data);
    },
    // 监听pagesize变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听pagenum变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 展示添加商品分类对话框
    showAddCateDialog() {
      // 先获取父级分类
      this.getParentCateList();
      // 再展示对话框
      this.addCateDialogVisible = true;
    },
    // 获取父级分类
    async getParentCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级分类失败");
      }
      this.parentCateList = res.data;
      console.log(res.data);
    },
    // 级联选择器选中项变化触发这个函数
    handleChange() {
      // 如果selectedKeys的长度大于0说明选中了父级分类
      // 反之,就是没有选中父级
      if (this.selectedKeys.length > 0) {
        // 父级分类id
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 为当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
      // console.log(this.selectedKeys)
    },
    // 点击按钮，添加分类
    addCate() {
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post(
          "categories",
          this.addCateForm
        );
        if (res.meta.status !== 201) {
          return this.$messge.error("添加分类失败");
        }
        this.$message.success("添加分类成功");
        this.getCateList();
        this.addCateDialogVisible = false;
        // console.log(res);
      });
    },
    // 监听对话框关闭事件,重置表单数据
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    },
    // 编辑分类
    showEditDialog(cate) {
      // 保存当前编辑分类id
      this.currentId =cate.cat_id
      this.editCateForm.cat_name = cate.cat_name
      this.editDialogVisible = true;
    },
    // 提交分类 
    editCate(){
      this.$refs.editCateFormRef.validate(async valid => {
        if(!valid) return;
        const {data: res} = await this.$http.put(`categories/${this.currentId}`, this.editCateForm)
        if(res.meta.status !== 200) {
          return this.$message.error("更新分类失败")
        }
        this.$message.success("更新分类成功")
        this.getCateList()
        this.editDialogVisible = false
      })
    },
    // 删除分类
    async deleteCate(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该分类, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("用户取消删除");
      }
      const { data: res } = await this.$http.delete("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除分类失败");
      }
      this.getCateList();
    },
  },
};
</script>
<style scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>