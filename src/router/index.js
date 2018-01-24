import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login'
import Home from '@/components/home'
import Welcome from '@/components/welcome'
import User from '@/components/user/user'
import RightList from '@/components/right/rightList'
import UserList from '@/components/right/userList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', name: 'users', component: User},
        {
          path: '/rights',
          name: 'right',
          component: RightList
        },
        {
          path: '/roles',
          name: 'role',
          component: UserList
        }
      ]
    }
  ]
})
