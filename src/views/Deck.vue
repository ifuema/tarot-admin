<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :xs="23" :sm="24" :md="24" :lg="19" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>卡组列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="add()"
              >添加卡组</el-button
            >
          </div>
          <el-collapse v-model="activeNames" accordion>
            <el-collapse-item
              v-for="item in cellList"
              :name="item.id"
              :key="item.id"
            >
              <template slot="title">
                <div style="width: 100%">
                  {{ item.title }}
                  <span class="title">{{ item.label }}</span>
                </div>
              </template>
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="价格">
                  <span>{{ item.price }}</span>
                </el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  class="handle"
                  size="small"
                  @click="update(item.id)"
                ></el-button>
                <br />
                <el-form-item label="上架日期">
                  <span>{{ item.day }}</span>
                </el-form-item>
                <el-popconfirm
                  @confirm="del(item.id)"
                  title="确定删除此卡组吗？"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    class="handle"
                    size="small"
                    slot="reference"
                  ></el-button>
                </el-popconfirm>
              </el-form>
              <el-transfer
                :button-texts="['移出', '添加']"
                v-model="item.card"
                :data="data"
                style="margin-left: 24px"
                @change="
                  (value, direction, movedKeys) =>
                    change(value, direction, movedKeys, item.id)
                "
              ></el-transfer>
            </el-collapse-item>
          </el-collapse> </el-card
      ></el-col>
    </el-row>
    <el-dialog :title="form.title" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="卡组名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <br />
          <el-input-number v-model="form.num" :min="1"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Deck",
  data() {
    return {
      activeNames: [],
      cellList: [],
      data: [],
      dialogFormVisible: false,
      form: {
        name: "",
        text: "",
        num: 10,
        title: "",
        id: 0,
      },
      date: new Date(),
      monthEnglish: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
    };
  },
  mounted() {
    this.selectcell();
    this.selectcard();
  },
  methods: {
    selectcell() {
      this.$axios
        .get("/homeCellList")
        .then((res) => {
          if (res.statusText == "OK") {
            this.cellList = res.data;
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
    selectcard() {
      this.$axios
        .get("/cardList")
        .then((res) => {
          if (res.statusText == "OK") {
            res.data.forEach((item) => {
              this.data.push({
                key: item.id,
                label: item.text,
                disabled: false,
              });
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
    change(value, direction, movedKeys, id) {
      if (value.length == 0) {
        this.$alert("卡组不能为空 ！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        this.cellList.forEach((item) => {
          if (item.id == id) {
            item.card = item.card.concat(movedKeys);
          }
        });
      } else if (value.length > 7) {
        this.$alert("卡组卡牌数不能超过7张 ！", "提示", {
          confirmButtonText: "确定",
          type: "warning",
        });
        this.cellList.forEach((item) => {
          if (item.id == id) {
            movedKeys.forEach((mcd) => {
              item.card.forEach((cd, index) => {
                if (cd == mcd) {
                  item.card.splice(index, 1);
                }
              });
            });
          }
        });
      } else {
        this.cellList.forEach((item) => {
          if (item.id == id) {
            this.$axios
              .put("/homeCellList/" + id, item)
              .then((res) => {
                if (res.statusText == "OK") {
                  this.$message.success("保存成功");
                  this.dialogFormVisible = false;
                } else {
                  console.log(res);
                  this.$message.error("保存失败");
                }
              })
              .catch((err) => {
                console.log(err);
                this.$message.error("保存失败");
              });
          }
        });
      }
    },
    add() {
      this.form.name = "";
      this.form.text = "";
      this.form.num = 10;
      this.form.id = 0;
      this.form.title = "添加卡组";
      this.dialogFormVisible = true;
    },
    submit() {
      if (this.form.name.replace(/[ ]/g, "") == "") {
        this.$message.warning("卡组名称不能为空");
      } else if (this.form.text.replace(/[ ]/g, "") == "") {
        this.$message.warning("简介不能为空");
      } else if (this.form.num == undefined) {
        this.$message.warning("价格不能为空");
      } else if (this.form.name.length > 6) {
        this.$message.warning("卡组名称不能超过6个字符");
      } else if (this.form.text.length > 21) {
        this.$message.warning("简介不能超过21个字符");
      } else {
        if (this.form.id == 0) {
          let data = {
            title: this.form.name,
            label: this.form.text,
            icon: "fire-o",
            card: [1],
            price: this.form.num,
            day:
              this.monthEnglish[this.date.getMonth()] +
              " " +
              this.date.getDate() +
              "," +
              this.date.getFullYear(),
          };
          this.$axios
            .post("/homeCellList", data)
            .then((res) => {
              if (res.statusText == "Created") {
                this.$message.success("添加成功");
                this.selectcell();
                this.dialogFormVisible = false;
              } else {
                console.log(res);
                this.$message.error("添加失败");
              }
            })
            .catch((err) => {
              console.log(err);
              this.$message.error("添加失败");
            });
        } else {
          this.cellList.forEach((item) => {
            if (item.id == this.form.id) {
              item.title = this.form.name;
              item.label = this.form.text;
              item.price = this.form.num;
              this.change([true], null, null, this.form.id);
            }
          });
        }
      }
    },
    update(id) {
      this.cellList.forEach((item) => {
        if (item.id == id) {
          this.form.name = item.title;
          this.form.text = item.label;
          this.form.num = item.price;
          this.form.title = "修改卡组";
          this.form.id = item.id;
          this.dialogFormVisible = true;
        }
      });
    },
    del(id) {
      this.$axios
        .delete("/homeCellList/" + id)
        .then((res) => {
          if (res.statusText == "OK") {
            this.$message.success("删除成功");
            this.selectcell();
          } else {
            console.log(res);
            this.$message.error("删除失败");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("删除失败");
        });
    },
  },
};
</script>

<style>
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
</style>

<style scoped>
.box-card {
  margin-top: 24px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.title {
  color: #909399;
  float: right;
}
.demo-table-expand {
  font-size: 0;
  margin-bottom: 24px;
  margin-left: 24px;
  margin-right: 24px;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
}
.handle {
  float: right;
}
</style>