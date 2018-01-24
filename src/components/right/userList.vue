<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }"><span>首页</span></el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容">
      <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success">添加用户</el-button>
    </div>
    <el-table
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope='scope'>
          <el-row :key="item.id" v-for="item in scope.row.children">
            <el-col :span="3">
              <el-tag color="orange" closable @close="handleClose(item.id,scope.row)">{{item.authName}}</el-tag>
              <i v-if="item.children.length>0" class="el-icon-d-arrow-right"></i>
            </el-col>
            <el-col :span="21">
              <el-row :key="mid.id" v-for="mid in item.children">
                <el-col :span="4">
                  <el-tag color="green" closable @close="handleClose(mid.id,scope.row)">{{mid.authName}}</el-tag>
                  <i v-if="mid.children.length>0" class="el-icon-d-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag color="#ccc" closable :key="last.id" @close="handleClose(last.id,scope.row)" v-for="last in mid.children">{{last.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        label="#"
        width="50">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="200">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        width="500"
        label="描述">
      </el-table-column>
      <el-table-column
        width="260"
        label="操作">
        <template slot-scope='scope'>
          <el-button size='small' type="primary" icon="el-icon-edit"></el-button>
          <el-button size='small' type="danger" icon="el-icon-delete"></el-button>
          <el-button @click='editRight(scope.row)' size='small' type="info" icon="el-icon-news"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加修改权限树状弹窗 -->
    <el-dialog title="编辑用户信息" ref="treeForm" :visible.sync="dialogTree">
      <el-tree
        ref="rightTree"
        :data="treeData"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultChecked"
        :props="defaultProps">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="changeRight">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {rightUserList, deleteSingleRight, allRights, giveRights} from '../../api/api.js'
export default {
  data () {
    return {
      currentId: '',
      defaultChecked: [],
      dialogTree: false,
      currentRole: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      treeData: [],
      tableData: []
    }
  },
  methods: {
    // 获取第三层id
    getThirdId (row, arr) {
      row.forEach((item) => {
        if (!item.children) {
          arr.push(item.id)
        } else {
          this.getThirdId(item.children, arr)
        }
      })
    },
    // 修改权限
    changeRight () {
      let ids = this.$refs['rightTree'].getCheckedNodes()
      let tmp = ids.map((item) => {
        return item.id + ',' + item.pid
      }).join(',').split(',')
      let result = new Set(tmp)
      let result2 = ([...result].join(','))
      giveRights({roleId: this.currentId, rids: result2}).then(res => {
        if (res.meta.status === 200) {
          this.dialogTree = false
        }
      })
    },
    editRight (row) {
      this.currentId = row.id
      this.defaultChecked = []
      this.getThirdId(row.children, this.defaultChecked)
      this.dialogTree = true
    },
    // 删除单条用户权限
    handleClose (id, row) {
      this.currentRole = row
      deleteSingleRight({
        roleId: row.id,
        rightId: id
      }).then(res => {
        if (res.meta.status === 200) {
          this.currentRole.children = res.data
        }
      })
    },
    initList () {
      rightUserList().then(res => {
        if (res.meta.status === 200) {
          this.tableData = res.data
        }
      })
    },
    treeInit () {
      allRights({type: 'tree'}).then(res => {
        if (res.meta.status === 200) {
          this.treeData = res.data
        }
      })
    }
  },
  mounted () {
    // 初始化数据列表
    this.initList()
    this.treeInit()
  }
}
</script>
<style scoped>
  .el-breadcrumb {
    background-color: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
  }
  .el-tag  {
    margin-left: 5px;
  }
  .authlist {
    border-top: solid 1px #D3DCE6;
    padding-bottom: 5px;
  }
  .arrow {
    font-size: 18px;
    font-weight: bold;
  }
</style>
