<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :span="20">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>塔牌师列表</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="text"
              @click="add()"
              >新增塔牌师</el-button
            >
          </div>
          <el-table
            :data="
              users.slice((currentPage - 1) * pageSize, pageSize * currentPage)
            "
            stripe
            style="width: 100%"
            v-loading="loading"
          >
            <el-table-column prop="id" label="编号"> </el-table-column>
            <el-table-column prop="nick" label="昵称"> </el-table-column>
            <el-table-column label="性别">
              <template slot-scope="scope">
                <el-tag size="medium">{{ scope.row.gender }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row.id)"
                  >详情</el-button
                >
                <el-popconfirm
                  @confirm="handleDelete(scope.row.id)"
                  title="确定删除塔牌师吗？"
                >
                  <el-button size="mini" type="danger" slot="reference"
                    >删除</el-button
                  ></el-popconfirm
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            small
            class="pagination"
            :total="users.length"
          >
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="塔牌师注册" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="账号">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
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
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            autocomplete="off"
            show-password
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input
            v-model="form.password1"
            autocomplete="off"
            show-password
            clearable
          ></el-input>
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
  name: "TowerMaster",
  data() {
    return {
      users: [],
      loading: true,
      currentPage: 1,
      pageSize: 6,
      dialogFormVisible: false,
      form: {
        username: "",
        nick: "",
        password: "",
        password1: "",
        options: ["公子", "小姐", "其他"],
        gender: "",
        birthday: "",
      },
      spacePattern: /^\S*$/,
      nickPattern: /^.{0,4}$/,
    };
  },
  mounted() {
    this.select();
  },
  methods: {
    select() {
      this.$axios
        .get("/users")
        .then((res) => {
          if (res.statusText == "OK") {
            this.users = res.data;
            this.loading = false;
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
    handleDelete(id) {
      this.$axios
        .delete("/users/" + id)
        .then((res) => {
          if (res.statusText == "OK") {
            this.$message.success("删除成功");
            this.select();
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
    handleEdit(id) {
      this.$router.push({
        path: "/user/" + id,
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    add() {
      this.form.username = "";
      this.form.nick = "";
      this.form.password = "";
      this.form.password1 = "";
      this.form.gender = "";
      this.form.birthday = "";
      this.dialogFormVisible = true;
    },
    submit() {
      if (this.form.username == "") {
        this.$message.warning("账号不能为空");
      } else if (!this.spacePattern.test(this.form.username)) {
        this.$message.warning("不能包含空字符");
      } else if (this.form.nick == "") {
        this.$message.warning("昵称不能为空");
      } else if (!this.spacePattern.test(this.form.nick)) {
        this.$message.warning("昵称不能包含空字符");
      } else if (!this.nickPattern.test(this.form.nick)) {
        this.$message.warning("昵称不能超过最大长度4字符");
      } else if (this.form.password == "") {
        this.$message.warning("密码不能为空");
      } else if (!this.spacePattern.test(this.form.password)) {
        this.$message.warning("密码不能包含空字符");
      } else if (this.form.password != this.form.password1) {
        this.$message.warning("两次密码不一致");
      } else {
        this.$axios
          .get("/users?username=" + this.form.username)
          .then((res) => {
            if (res.statusText == "OK") {
              if (res.data.length == 0) {
                let data = {
                  username: this.form.username,
                  password: this.form.password,
                  storehouse: [],
                  birthday: this.form.birthday,
                  gender: this.form.gender,
                  nick: this.form.nick,
                  balance: 25,
                };
                if (data.birthday == "") {
                  data.birthday = "未知";
                }
                if (data.gender == "") {
                  data.gender = "未知";
                }
                this.$axios
                  .post("/users", data)
                  .then((res) => {
                    if (res.statusText == "Created") {
                      this.$message.success("添加成功");
                      this.select();
                      this.dialogFormVisible = false;
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
                this.$message.warning("该塔牌师已存在");
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
      }
    },
  },
};
</script>

<style scoped>
.box-card {
  margin-top: 24px;
}
.pagination {
  margin-top: 12px;
  float: right;
  margin-bottom: 12px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>