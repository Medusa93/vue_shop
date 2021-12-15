<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登陆 -->
      <el-form
        v-if="!isReg"
        :model="loginForm"
        status-icon
        :rules="loginFormRules"
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="loginForm.password"
            autocomplete="off"
            prefix-icon="el-icon-lock"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登陆</el-button>
          <el-button type="info" @click="resetForm('loginFormRef')"
            >重置</el-button
          >
          <!-- <el-button type="danger" @click="add">添加新用户</el-button> -->
        </el-form-item>
      </el-form>
      <!-- 注册 -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    // var checkUser = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error("用户名不能为空"));
    //   }
    //   let username = /^[a-zA-Z0-9_\u4e00-\u9fa5]{3,16}$/;
    //   if (!username.test(value)) {
    //     callback(new Error("用户名必须在3-16位"));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      isReg: false,
      // 登陆
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 登陆验证
      loginFormRules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        username: [
          { required: true, message: "请输入登陆名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 登陆
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200) return this.$message.error("登录失败!");
        this.$message.success("登陆成功!");
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push("/home");
      });
    },
  },
};
</script>
<style lang="less" scoped>
.login_container {
  background: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avater_box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  box-shadow: 0 0 10px #ddd;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: #eee;
  }
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
</style>