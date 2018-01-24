<template>
  <div>
    <template>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }"><span>首页</span></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="query">
      <el-button slot="append" icon="el-icon-search" @click="queryUser"></el-button>
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
          <template slot-scope="scope">
            <el-button round type="primary" icon="el-icon-edit" @click="singleUserEdit(scope.row)"></el-button>
            <el-button type="primary" icon="el-icon-share" @click="giveRole(scope.row)"></el-button>
            <el-button type="warning" icon="el-icon-delete" @click="deleteUser(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 10, 20, 100]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <el-dialog title="请输入用户信息" :visible.sync="dialogFormVisible" @close="closeDialog">
        <el-form :model="form" ref="ruleForm" :rules="rules">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="form.username" auto-complete="off"></el-input>
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
      <el-dialog title="编辑用户信息" ref="editForm" :visible.sync="dialogEdit" @close="closeEditDialog">
        <el-form :model="editForm" :rules="rules">
          <el-form-item label="用户名称" :label-width="formLabelWidth" prop="name">
            <el-input v-model="editForm.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input v-model="editForm.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="手机号" :label-width="formLabelWidth" prop="mobile">
            <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogEdit = false">取 消</el-button>
          <el-button type="primary" @click="dialogEdit = false">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分配角色弹窗 -->
      <el-dialog title="分配角色" ref="giveRight" :visible.sync="giveRoleEdit">
        <el-row>
          <span>{{thisUser}}</span>
        </el-row>
        <el-select v-model="value" placeholder="请选择" @change="getId">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
        <div slot="footer" class="dialog-footer">
          <el-button @click="giveRoleEdit = false">取 消</el-button>
          <el-button type="primary" @click="handleRole">确 定</el-button>
        </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import {userInfo, addUser, toggleUserState, selectWithId, updataUser, deleteSingle, getRights, editRights} from '../../api/api.js'
export default {
  data () {
    return {
      currentUserId: '',
      currentId: '',
      value: '',
      thisUser: '',
      options: [],
      giveRoleEdit: false,
      query: '',
      currentPage: 1,
      pagesize: 3,
      total: 0,
      tableData: [],
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogEdit: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入邮箱', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 13 到 5 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取id
    getId (a) {
      this.currentId = a
    },
    handleRole () {
      editRights({id: this.currentUserId, rid: this.currentId}).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
        }
      })
      this.giveRoleEdit = false
    },
    // 给角色分配权限

    giveRole (row) {
      this.currentUserId = row.id
      this.thisUser = row.username
      getRights().then(res => {
        if (res.meta.status === 200) {
          this.options = res.data
        }
      })
      this.giveRoleEdit = true
    },
    // 查询用户
    queryUser () {
      this.initList()
    },
    // 根据id删除用户
    deleteUser (params) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSingle(params.id).then(res => {
          this.initList()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据id查询用户信息
    singleUserEdit (params) {
      selectWithId(params.id).then(res => {
        this.dialogEdit = true
        if (res.meta.status === 200) {
          console.log(res)
          this.editForm.id = res.data.id
          this.editForm.username = res.data.username
          this.editForm.email = res.data.email
          this.editForm.mobile = res.data.mobile
        }
      })
    },
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
        query: this.query,
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
      addUser(this.form).then(res => {
        console.log(res)
        if (res.meta.status === 201) {
          console.log(res)
          this.initList()
        }
      })
    },
    closeEditDialog () {
      updataUser(this.editForm).then(res => {
        if (res.meta.status === 200) {
          this.initList()
          this.dialogEdit = false
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
