<template>
  <div>
    <template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }"><span>首页</span></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容">
      <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" @click="dialogFormVisible = true">添加用户</el-button>

    </div>

      <el-table
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="180">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="电话">
        </el-table-column>
        <el-table-column
          width="180"
          prop="type"
          label="用户状态">
          <template slot-scope="scope">
            <el-switch
              @change="toggleStatus(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog title="请输入用户信息" ref="ruleForm" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form :model="form" :rules="rules">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" :label-width="formLabelWidth" prop="password">
            <el-input v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="form.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import {userInfo, addUser, toggleUserState} from '../../api/api.js'
export default {
  data () {
    return {
      currentPage: 1,
      pagesize: 1,
      total: 0,
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      form: {
        name: '',
        password: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入邮箱', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { type: 'number', message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.currentPage = val
      this.initList()
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.initList()
    },
    toggleStatus (data) {
      console.log(data)
      toggleUserState({
        uId: data.id,
        state: data.mg_state
      }).then(res => {
        if (res.meta.status === 200) {
          console.log(res)
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        }
      })
    },
    initList () {
      userInfo({
        query: '',
        pagenum: this.currentPage,
        pagesize: this.pagesize
      }).then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data.users
          this.total = res.data.total
          this.currentPage = res.data.pagenum
        }
      })
    },
    closeDialog () {
      addUser({
        username: this.form.name,
        password: this.form.password,
        email: this.form.email,
        mobile: this.form.mobile
      }).then(res => {
        if (res.meta.status === 201) {
          console.log(res)
          this.initList()
        }
      })
    }
  },
  mounted () {
    this.initList()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-breadcrumb {
    line-height: 50px;
    height: 50px;
    color: orange;
    opacity: 0.4;
  }
  .el-input {
    width: 400px;
    background-color: rgba(0,0,0,0);
  }
  .el-table {
    opacity: 0.7;
  }
</style>
