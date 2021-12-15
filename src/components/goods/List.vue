<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <!-- 搜索与添加区域 -->
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表表格 -->
      <el-table :data="goodslist" border style="width: 100%">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="goEditPage(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getGoodList();
  },
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
      },
      // 商品列表数据
      goodslist: [],
      // 总数据条数
      total: 0,
      // 控制添加商品对话框的显示与隐藏
      addDialogVisible: false,
      // 添加商品信息
      addForm: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: "",
        attrs: "",
      },
      // 添加商品验证规则
      addFormRules: {
        goods_name: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "商品价格必须为数字值" },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
          { type: "number", message: "商品数量必须为数字值" },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
          { type: "number", message: "商品重量必须为数字值" },
        ],
      },
      // 控制编辑商品对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑商品信息
      editForm: {},
      // 编辑商品验证规则
      editFormRules: {
        goods_name: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
          { type: "number", message: "商品价格必须为数字值" },
        ],
        goods_number: [
          {
            required: true,
            message: "请输入商品数量",
            trigger: "blur",
          },
          { type: "number", message: "商品数量必须为数字值" },
        ],
        goods_weight: [
          {
            required: true,
            message: "请输入商品重量",
            trigger: "blur",
          },
          { type: "number", message: "商品重量必须为数字值" },
        ],
      },
    };
  },
  methods: {
    // 获取商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      // console.log(this.goodslist);
    },
    // 监听pagesize改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodList();
    },
    // 监听页码值改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodList();
    },
    // 展示添加商品对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    // 监听添加商品对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 监听编辑商品对话框关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 删除商品
    async removeById(id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("用户取消了删除");
      }
      const { data: res } = await this.$http.delete(`goods/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("删除商品失败");
      }
      this.$message.success("删除商品成功");
      this.getGoodList();
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
    goEditPage(id) {
      this.$router.push({path: "/goods/edit", query: {id: id}});
    },
  },
};
</script>
<style scoped>
</style>