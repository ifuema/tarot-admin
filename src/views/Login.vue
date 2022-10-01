<template>
  <div class="body">
    <el-container>
      <el-header height="64px"><Header /></el-header>
      <el-main>
        <el-row type="flex" justify="center">
          <el-col :span="16"
            ><el-card class="box-card"
              ><el-row type="flex" justify="center">
                <el-col :span="23">
                  <el-form
                    :model="from"
                    status-icon
                    :rules="rules"
                    ref="login"
                    class="loginfrom"
                    ><h1>登录</h1>
                    <p class="title">塔罗牌后台管理系统</p>
                    <el-form-item label="用户名" prop="username">
                      <el-input
                        v-model="from.username"
                        autocomplete="off"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                      <el-input
                        type="password"
                        v-model="from.password"
                        autocomplete="off"
                      ></el-input> </el-form-item
                    ><br />
                    <el-form-item>
                      <el-tooltip
                        class="item"
                        effect="dark"
                        content="登录后台管理系统"
                        placement="bottom"
                      >
                        <el-button
                          type="success"
                          @click="login('login')"
                          class="loginbutton"
                          round
                          >登录</el-button
                        ></el-tooltip
                      >
                    </el-form-item>
                  </el-form></el-col
                ></el-row
              ></el-card
            ></el-col
          >
        </el-row>
      </el-main>
      <el-footer height="24px">
        <div>Copyright © 2022 <span class="author">Ifuema</span></div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "Login",
  components: {
    Header,
  },
  data() {
    var checkUsername = (rule, value, callback) => {
      if (value.replace(/[ ]/g, "") == "") {
        return callback(new Error("用户名不能为空"));
      } else {
        callback();
      }
    };
    var checkPassword = (rule, value, callback) => {
      if (value.replace(/[ ]/g, "") == "") {
        return callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    return {
      from: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ validator: checkUsername, trigger: "blur" }],
        password: [{ validator: checkPassword, trigger: "blur" }],
      },
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios
            .get("/admin?username=" + this.from.username)
            .then((res) => {
              if (res.statusText == "OK") {
                if (
                  res.data.length == 0 ||
                  res.data[0].password != this.from.password
                ) {
                  this.$message({
                    message: "用户名或密码错误",
                    type: "warning",
                  });
                } else {
                  window.sessionStorage.setItem(
                    "appadmin",
                    JSON.stringify({
                      username: res.data[0].username + "_" + res.data[0].id,
                    })
                  );
                  this.$router.push({ path: "/home" });
                  this.$notify({
                    title: "成功",
                    message: "登录成功",
                    type: "success",
                  });
                }
              } else {
                console.log(res);
                this.$message.error("服务连接错误");
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("服务连接错误");
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
.loginfrom .el-input__inner {
  border-top: none;
  border-left: none;
  border-right: none;
  border-radius: 0;
}
.loginfrom .el-form-item__label {
  font-size: 7px;
  line-height: 12px;
}
</style>
<style scoped>
.body {
  height: 100%;
}
.el-main {
  background-color: #e9eef3;
}
.el-container {
  height: 100vh;
}
.el-footer {
  background-color: #e9eef3;
  font-size: 15px;
  text-align: center;
  line-height: 24px;
  padding-bottom: 34px;
}
.box-card {
  width: 100%;
  border-radius: 10px;
  margin-top: 10vh;
}
.loginbutton {
  width: 100%;
}
.loginfrom {
  line-height: 12px;
}
.title {
  margin-bottom: 50px;
}
.el-header {
  padding: 0;
}
.item {
  margin: 4px;
}
</style>