<template>
  <div>
    <div class="el-header">
      <el-tooltip
        class="item"
        effect="dark"
        content="Tarot 经典塔罗"
        placement="bottom-start"
      >
        <span>Tarot</span>
      </el-tooltip>
      <el-tooltip
        class="item"
        effect="dark"
        content="刷新"
        placement="bottom-end"
      >
        <span
          class="el-icon-refresh-right"
          id="refresh"
          @mouseover="over()"
          @mouseout="out()"
          @click="refresh()"
        ></span
      ></el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    over() {
      document.getElementById("refresh").classList.add("bgc");
    },
    out() {
      document.getElementById("refresh").classList.remove("bgc");
    },
    refresh() {
      window.location.reload();
    },
  },
};
</script>

<style scoped>
#refresh {
  border-radius: 15px;
  margin-top: 10px;
  font-weight: bold;
  line-height: 45px;
  font-size: 24px;
  float: right;
  cursor: pointer;
  text-align: center;
  height: 45px;
  width: 45px;
}
.el-header {
  background-color: #3f51b5;
  padding-left: 32px;
  font-size: 28px;
  color: white;
  line-height: 64px;
  height: 64px;
}
.bgc {
  background-color: rgba(255, 255, 255, 0.165);
}
.item {
  margin: 4px;
}
</style>