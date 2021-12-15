<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddRoleDialog"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border style="width: 100%" stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEidtRightDialog(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeRoleById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色信息"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="roleForm"
          :rules="addRoleRules"
          ref="addRoleRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色信息"
        :visible.sync="showEditDialogVisible"
        width="30%"
        @close="editDialogClosed"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="roleInfo"
          :rules="editRoleRules"
          ref="editRoleRef"
          label-width="80px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="roleInfo.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="roleInfo.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="showEditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="30%"
        @close="setRightDialogClosed"
      >
        <!-- 树形控件 -->
        <el-tree
          :data="rightslist"
          :props="treeProps"
          node-key="id"
          :default-checked-keys="defKeys"
          show-checkbox
          default-expand-all
          ref="rightRef"
        ></el-tree>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      roleForm: {
        roleName: "",
        roleDesc: "",
      },
      addDialogVisible: false,
      // 添加角色表单验证
      addRoleRules: {
        roleName: [
          { required: true, message: "请输角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,

            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            min: 0,
            max: 15,
            message: "长度在 0 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      roleInfo: {},
      // 控制编辑角色对话框显示与隐藏
      showEditDialogVisible: false,
      // 编辑角色表单验证
      editRoleRules: {
        roleName: [
          { required: true, message: "请输角色名称", trigger: "blur" },
          {
            min: 3,
            max: 10,

            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          {
            min: 0,
            max: 15,
            message: "长度在 0 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 展示分配权限对话框
      setRightDialogVisible: false,
      // 权限列表
      rightslist: [],
      // 树形控件属性绑定对象
      treeProps: {
        children: "children",
        label: "authName",
      },
      // 默认选中权限的id值
      defKeys: [],
      // 当前角色信息
      roleInfo: "",
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败");
      }
      this.rolelist = res.data;
      // console.log(this.rolelist);
    },
    // 编辑角色对话框
    showEidtRightDialog(roleInfo) {
      this.roleInfo = roleInfo
      console.log(roleInfo)
      this.showEditDialogVisible = true;
    },
    // 编辑提交角色
    async saveRoleInfo() {
      const {data: res} = await this.$http.put(`roles/${this.roleInfo.id}`,
      {
        roleName: this.roleInfo.roleName,
        roleDesc: this.roleInfo.roleDesc
      })
      if(res.meta.status !== 200) {
        return this.$message.error("修改角色信息失败")
      }
      this.$message.success("修改角色信息成功")
      this.getRolesList()
      this.showEditDialogVisible = false
    },
    // 编辑对话框关闭事件
    editDialogClosed() {
      this.$refs.editRoleRef.resetFields();
    },
    // 根据id删除权限
    async removeRightById(role, id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);

      // 如果用户确认删除,则返回字符串confirm
      // 如果用户取消删除,则返回字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("用户取消删除");
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色权限失败");
      }
      // 防止页面刷新,扩展页合上
      // this.getRolesList()
      role.children = res.data;
    },
    // 展示添加角色对话框
    showAddRoleDialog() {
      this.addDialogVisible = true;
    },
    // 监听添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addRoleRef.resetFields();
    },
    // 添加角色
    async addRole() {
      const { data: res } = await this.$http.post("roles", this.roleForm);
      if (res.meta.status !== 201) {
        return this.$message.error("添加角色失败");
      }
      // 隐藏添加角色对话框
      this.addDialogVisible = false;
      this.$message.success("添加角色成功");
      this.getRolesList();
    },
    // 展示分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id;
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分配权限列表失败");
      }
      this.rightslist = res.data;
      // 递归获取三级节点id
      this.getLeafKeys(role, this.defKeys);
      this.setRightDialogVisible = true;
      // console.log(res.data);
    },
    // 通过递归形式,获取角色所有三级权限的id,
    // 并保存到defKeys数组
    getLeafKeys(node, arr) {
      // 如果当前节点node不包含children属性,则为三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    // 监听分配权限对话框关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    // 根据id删除对应用户信息
    async removeRoleById(id) {
      // 弹窗询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取消删除，则返回字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败!");
      }
      this.$message.success("删除角色成功!");
      this.getRolesList();
    },
    // 树形控件角色权限选中与半选中节点的id
    async allotRights() {
      const keys = [
        ...this.$refs.rightRef.getCheckedKeys(),
        ...this.$refs.rightRef.getHalfCheckedKeys(),
      ];
      const idStr = keys.join(",");
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败");
      }
      this.$message.success("分配权限成功");
      this.getRolesList();
      this.setRightDialogVisible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>