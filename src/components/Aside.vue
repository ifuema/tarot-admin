<template>
  <div>
    <el-menu
      router
      default-active="/userportrait"
      background-color="#F2F6FC"
      active-text-color="#536dfe"
    >
      <el-menu-item index="/userportrait">
        <i class="el-icon-s-marketing"></i>
        <span slot="title" class="title">用户画像</span>
      </el-menu-item>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span class="title">账户管理</span>
        </template>
        <el-menu-item index="/towermaster"
          ><span class="title">塔牌师</span></el-menu-item
        >
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-ticket"></i>
          <span class="title">塔牌管理</span>
        </template>
        <el-menu-item index="/deck"
          ><span class="title">牌组</span></el-menu-item
        >
      </el-submenu>
      <br />
      <el-menu-item>
        <i class="el-icon-remove-outline"></i>
        <span slot="title" class="title" @click="logout()">退出登录</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "Aside",
  methods: {
    logout() {
      window.sessionStorage.removeItem("appadmin");
      this.$router.push("/");
      this.$notify({
        title: "成功",
        message: "注销成功",
        type: "success",
      });
    },
  },
};
</script>

<style scoped>
.title {
  margin-left: 24px;
}
</style>