<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>电商后台管理系统</div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏导航 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体区域 -->
      <el-main><router-view /></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList();
  },
  data() {
    return {
      menulist: [],
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-claim",
        102: "el-icon-s-order",
        145: "el-icon-reading",
      },
      isCollapse: false,
    };
  },
  methods: {
    logout() {
      window.sessionStorage.removeItem("token");
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      // console.log(res.data);
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background: #333744;
  .el-menu {
    border: none;
  }
  .toggle-button {
    background: #4a5064;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    font-size: 10px;
    line-height: 24px;
    cursor: pointer;
  }
}
.el-main {
  background: #eaedf1;
}
</style>