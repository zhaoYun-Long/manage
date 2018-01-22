<template>
  <div class="box">
    <el-form ref="ruleForm" :model="form" :rules = 'rules' class="demo-ruleForm" label-width="80px">
      <el-form-item label="账号" prop="username">
        <el-input prefix-icon="myicon myicon-user" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input prefix-icon="myicon myicon-key" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handle">登录</el-button>
        <el-button @click="resetForm('ruleForm')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {login} from '../api/api.js'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handle: function () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {
            username: this.form.username,
            password: this.form.password
          }
          // console.log('6666')
          login(params).then(res => {
            console.log(res)
            if (res.meta.status === 200) {
              localStorage.setItem('long', res.data.token)
              this.$router.push({name: 'home'})
            } else {
              this.$message({
                showClose: true,
                message: res.meta.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-form {
    position: absolute;
    width: 400px;
    left: 50%;
    margin-left: -200px;
    top: 50%;
    margin-top: -93px;
    color: orange !important;
  }
  .box {
    position: relative;
  }
</style>
