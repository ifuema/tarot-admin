<template>
  <div>
    <div v-if="username == ''">
      <el-row type="flex" justify="center">
        <el-col :sm="12" :lg="6">
          <el-result icon="warning" title="警告" subTitle="请重新登录账户再试">
            <template slot="extra">
              <el-button type="primary" size="medium" @click="login()"
                >去登录</el-button
              >
            </template>
          </el-result>
        </el-col>
      </el-row>
    </div>
    <div v-else>
      <el-container class="body">
        <el-header height="64px"><Header /></el-header>
        <el-container>
          <el-aside width="248px" class="hidden-xs-only">
            <Aside />
          </el-aside>
          <el-container class="bg">
            <el-main><router-view></router-view></el-main>
            <el-footer height="54px">
              <div>Tarot后台管理系系统：{{ username }}</div>
              <div>{{ time }}</div>
            </el-footer>
          </el-container>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import "element-ui/lib/theme-chalk/display.css";

export default {
  name: "Home",
  components: {
    Header,
    Aside,
  },
  data() {
    return {
      time: new Date(),
      username: "",
    };
  },
  mounted() {
    this.username = JSON.parse(
      window.sessionStorage.getItem("appadmin")
    ).username;
  },
  methods: {
    login() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.el-header {
  padding: 0;
}
.el-main {
  background-color: Transparent;
  min-width: 300px;
}
.body {
  height: 100vh;
}
.el-aside {
  background-color: #f2f6fc;
}
.el-footer {
  background-color: Transparent;
  color: #909399;
  font-size: 10px;
  text-align: right;
  line-height: 18px;
}
.bg {
  background-image: url(../assets/img/bg.jpg);
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: 100% 100%;
}
</style>