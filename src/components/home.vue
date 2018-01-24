<template>
  <el-container style="height: 100%; border: 1px solid #eee;">
    <el-aside width="200px">
      <el-menu
      router
      >
        <el-submenu
        :key="item.id"
        :index="item.path"
        v-for="item in menuData">
          <template slot="title"><i class="el-icon-location-outline"></i>{{item.authName}}</template>
            <el-menu-item class="el-icon-tickets" :key="tags.id" :index="tags.path" v-for="tags in item.children">{{tags.authName}}</el-menu-item>
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
import {getMenu} from '../api/api.js'
export default {
  data () {
    return {
      menuData: []
    }
  },
  methods: {
    logout () {
      localStorage.removeItem('long')
      this.$router.push('/')
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    }
  },
  mounted () {
    getMenu().then(res => {
      if (res.meta.status === 200) {
        this.menuData = res.data
        console.log(res.data)
      }
    })
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
