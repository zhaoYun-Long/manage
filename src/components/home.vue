<template>
  <el-container style="height: 100%; border: 1px solid #eee;">
    <el-aside width="200px">
      <el-menu  :default-openeds="['1']" router>
        <el-submenu  index="1">
          <template slot="title"><i class="el-icon-location-outline"></i>用户管理</template>
            <el-menu-item class="el-icon-tickets" index="/users">用户列表</el-menu-item>
        </el-submenu>
        <el-submenu  index="2">
          <template slot="title"><i class="el-icon-loading"></i>权限管理</template>
            <el-menu-item class="el-icon-view" index="/userList">角色列表</el-menu-item>
            <el-menu-item class="el-icon-view" index="right">权限列表</el-menu-item>
        </el-submenu>
        <el-submenu index="3">
          <template slot="title"><i class="el-icon-loading"></i>商品管理</template>
            <el-menu-item class="el-icon-view" index="3-1">商品列表</el-menu-item>
            <el-menu-item class="el-icon-view" index="3-2">分类参数</el-menu-item>
            <el-menu-item class="el-icon-view" index="3-3">商品分类</el-menu-item>
        </el-submenu>
        <el-submenu index="4">
          <template slot="title"><i class="el-icon-loading"></i>订单管理</template>
            <el-menu-item class="el-icon-view" index="1-1">订单列表</el-menu-item>
        </el-submenu>
         <el-submenu index="5">
          <template slot="title"><i class="el-icon-loading"></i>数据统计</template>
            <el-menu-item class="el-icon-view" index="1-1">数据报表</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <span class="topText">long后台管理系统</span>
        <span @click="logout" class="el-icon-close">退出</span>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    const item = {
      date: '2016-05-02',
      name: '王小虎',
      address: '上海市普陀区金沙江路 1518 弄'
    }
    return {
      tableData: Array(10).fill(item)
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('long')
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-header {
    color: orange;
    line-height: 60px;
    position: relative;
  }
  .el-aside {
    color: black;
    background-color:none;
  }
  .el-header .topText {
    position: absolute;
    display: inline-block;
    font-size: 35px;
    left: 50%;
    margin-left: -142px;
  }
  .el-aside .el-menu {
    background-color: rgba(0,0,0,0);
  }
</style>
