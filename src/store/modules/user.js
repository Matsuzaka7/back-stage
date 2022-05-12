import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { anyRoutes,resetRouter,asyncRoutes,constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    // 服务器返回的菜单,根据不同角色返回的标记信息
    routes:[],
    // 有些按钮,不同角色是按不了的
    buttons:[],
    // 角色信息
    roles:[],
    // 对比之后的 [项目已有的异步路由和需要展示的路由]
    resultAsyncRoutes:[],
    // 用户最终需要的全部路由
    resultAllRoutes:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state,userInfo)=>{
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes;
    state.buttons = userInfo.buttons;
    state.roles = userInfo.roles;
  },
  // 最终计算出来的异步路由
  SET_RESULTASYNCROUTES:(state,asyncRoutes) =>{
    // 保存异步路由
    state.resultAsyncRoutes = asyncRoutes;
    // 计算当前用户需要的所有的路由
    state.resultAllRoutes = constantRoutes.concat(state.resultAsyncRoutes,anyRoutes)
    // 给路由器新增新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义对比的函数
const computedAsyncRoutes = (asyncRoutes,routes) =>{
  // 过滤当前用户所需要的异步路由
  return asyncRoutes.filter(item=>{
    if(routes.indexOf(item.name)!=-1){
      // 如果有子元素(子路由),就一直递归
      if(item.children && item.children.length){
        item.children = computedAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}

const actions = {
  // 用户登录
  async login({ commit }, userInfo) {
    // 结构用户名
    const { username, password } = userInfo;
    let res = await login({ username: username.trim(), password: password });
    if (res.code === 20000) {
      commit('SET_TOKEN', res.data.token);
      setToken(res.data.token)
      return 'ok'
    } else {
      new Promise.reject(new Error('错误'))
    }
    /* return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    }) */
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        // vuex存储用户信息
        commit('SET_USERINFO',data)
        // 最终计算的
        commit('SET_RESULTASYNCROUTES',computedAsyncRoutes(asyncRoutes,data.routes))
        resolve(data)

      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

