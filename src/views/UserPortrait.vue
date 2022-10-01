<template>
  <div>
    <el-row type="flex" justify="center" v-if="judge()">
      <el-col>
        <el-empty description="当前用户数量过少，无法生成用户画像"></el-empty
      ></el-col>
    </el-row>
    <el-row type="flex" class="row-bg" justify="space-around" v-else>
      <el-col :xs="24" :sm="23" :md="16" :lg="10" :xl="10">
        <el-card>
          <div slot="header" class="clearfix">
            <span>年龄统计</span>
          </div>
          <div id="age" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
      <el-col :span="7" class="hidden-sm-and-down">
        <el-card>
          <div slot="header" class="clearfix">
            <span>性别比例</span>
          </div>
          <div id="gender" style="width: 100%; height: 400px"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/display.css";

export default {
  name: "UserPortrait",
  data() {
    return {
      genders: [
        { value: 0, name: "公子" },
        { value: 0, name: "小姐" },
        { value: 0, name: "其他" },
      ],
      ages: {
        section: ["16以下", "16-30", "31-45", "45及以上"],
        num: [0, 0, 0, 0],
      },
    };
  },
  mounted() {
    this.select();
  },
  methods: {
    judge() {
      var agenum = 0;
      var gendernum = 0;
      this.ages.num.forEach((ageitem) => {
        agenum += ageitem;
      });
      this.genders.forEach((genderitem) => {
        gendernum += genderitem.value;
      });
      if (agenum == 0 || gendernum == 0) {
        return true;
      } else {
        return false;
      }
    },
    select() {
      this.$axios
        .get("/users")
        .then((res) => {
          if (res.statusText == "OK") {
            var date = new Date();
            res.data.forEach((item) => {
              this.genders.forEach((genderitem) => {
                if (genderitem.name == item.gender) {
                  genderitem.value += 1;
                }
              });
              if (item.birthday != "未知") {
                var birthday = new Date(item.birthday);
                var newage = date.getFullYear() - birthday.getFullYear();
                if (newage >= 0 && newage < 16) {
                  this.ages.num[0] += 1;
                } else if (newage >= 16 && newage < 30) {
                  this.ages.num[1] += 1;
                } else if (newage >= 31 && newage < 45) {
                  this.ages.num[2] += 1;
                } else if (newage >= 45) {
                  this.ages.num[3] += 1;
                }
              }
            });
            this.$nextTick(function () {
              this.age();
              this.gender();
            });
          } else {
            console.log(res);
            this.$message.error("服务连接错误");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("服务连接错误");
        });
    },
    age() {
      var myChart = this.$echarts.init(document.getElementById("age"));
      var option = {
        title: {
          text: "",
        },
        tooltip: {},
        legend: {
          data: ["年龄"],
        },
        xAxis: {
          data: this.ages.section,
        },
        yAxis: {},
        series: [
          {
            name: "年龄",
            type: "bar",
            data: this.ages.num,
          },
        ],
      };
      myChart.setOption(option);
    },
    gender() {
      var myChart = this.$echarts.init(document.getElementById("gender"));
      var option = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "20",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: this.genders,
          },
        ],
      };
      myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.row-bg {
  margin-top: 24px;
}
</style>