<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="22">
        <el-card class="box-card">
          <el-page-header @back="goBack" content="塔罗师详情"> </el-page-header>
          <el-row type="flex" justify="center">
            <el-col :span="23">
              <el-tabs v-model="activeName">
                <el-tab-pane label="个人信息" name="first">
                  <el-descriptions
                    v-loading="loading"
                    class="margin-top"
                    title="基础信息"
                    :column="2"
                    border
                  >
                    <template slot="extra">
                      <el-button type="primary" size="small" @click="update()"
                        >编辑</el-button
                      >
                    </template>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        昵称
                      </template>
                      {{ user.nick }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-paperclip"></i>
                        编号
                      </template>
                      {{ user.id }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-connection"></i>
                        性别
                      </template>
                      <el-tag size="small">{{ user.gender }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-user"></i>
                        账号
                      </template>
                      {{ user.username }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-ship"></i>
                        生日
                      </template>
                      {{ user.birthday }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-coin"></i>
                        余额
                      </template>
                      {{ user.balance }}
                    </el-descriptions-item>
                  </el-descriptions>
                </el-tab-pane>
                <el-tab-pane label="仓库" name="second">
                  <el-timeline>
                    <el-timeline-item
                      placement="top"
                      v-for="item in gridList"
                      :key="item.id"
                    >
                      <el-card>
                        <h4>
                          {{ item.text }}&nbsp;&nbsp;<el-tag
                            size="mini"
                            effect="dark"
                            >×{{ item.num }}</el-tag
                          >
                        </h4>
                        <p>{{ item.message }}</p>
                      </el-card>
                    </el-timeline-item>
                  </el-timeline>
                </el-tab-pane>
              </el-tabs>
            </el-col></el-row
          >
        </el-card>
      </el-col></el-row
    >
    <el-dialog title="编辑塔牌师" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="昵称">
          <el-input v-model="form.nick" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select
            v-model="form.gender"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in form.options"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="form.birthday"
            value-format="yyyy/M/d"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="余额">
          <br />
          <el-input-number v-model="form.balance" :min="0"></el-input-number>
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
  name: "User",
  data() {
    return {
      id: this.$route.params.id,
      activeName: "first",
      loading: true,
      user: {},
      dialogFormVisible: false,
      form: {
        nick: "",
        options: ["公子", "小姐", "其他"],
        gender: "",
        birthday: "",
        balance: 0,
      },
      spacePattern: /^\S*$/,
      nickPattern: /^.{0,4}$/,
      gridList: [],
    };
  },
  mounted() {
    this.select();
  },
  methods: {
    goBack() {
      this.$router.push("/towermaster");
    },
    select() {
      this.$axios
        .get("/users?id=" + this.id)
        .then((res) => {
          if (res.statusText == "OK") {
            if (res.data.length == 0) {
              console.log(res);
            } else {
              this.user = res.data[0];
              this.loading = false;
              this.user.storehouse.forEach((item) => {
                this.$axios
                  .get("/cardList?id=" + item.id)
                  .then((res) => {
                    if (res.statusText == "OK") {
                      res.data[0]["num"] = item.num;
                      this.gridList.push(res.data[0]);
                    } else {
                      console.log(res);
                      this.$message.error("服务连接错误");
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    this.$message.error("服务连接错误");
                  });
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
    },
    update() {
      this.form.nick = this.user.nick;
      this.form.gender = this.user.gender;
      if (this.user.birthday == "未知") {
        this.form.birthday = "";
      } else {
        this.form.birthday = this.user.birthday;
      }
      this.form.balance = this.user.balance;
      this.dialogFormVisible = true;
    },
    submit() {
      if (this.form.nick == "") {
        this.$message.warning("昵称不能为空");
      } else if (!this.spacePattern.test(this.form.nick)) {
        this.$message.warning("昵称不能包含空字符");
      } else if (!this.nickPattern.test(this.form.nick)) {
        this.$message.warning("昵称不能超过最大长度4字符");
      } else {
        this.user.nick = this.form.nick;
        this.user.gender = this.form.gender;
        if (this.form.balance == undefined) {
          this.user.balance = 0;
        } else {
          this.user.balance = this.form.balance;
        }
        if (this.form.birthday != "") {
          this.user.birthday = this.form.birthday;
        }
        this.$axios
          .put("/users/" + this.id, this.user)
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
    },
  },
};
</script>

<style scoped>
.el-tabs {
  margin-top: 24px;
}
.box-card {
  margin-top: 24px;
  min-height: 400px;
}
.margin-top {
  margin-top: 12px;
}
.el-timeline {
  margin-top: 24px;
  margin-bottom: 24px;
}
</style>