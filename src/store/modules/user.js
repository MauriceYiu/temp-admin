import {login, loginInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import router from '../../router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  role: '',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLE: (state, role) => {
    state.role = role
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      login({mobile: username.trim(), password: password,app:'staff'}).then(response => {
        const {data} = response
        commit('User-Token', data.jwtToken)
        commit('SET_TOKEN', data.token)
        commit('SET_ROLE', 'admin')
        localStorage.setItem('roleName', data.role && data.role.text)
        localStorage.setItem('uid', data.id)
        localStorage.setItem('sdktoken', data.imToken)
        localStorage.setItem('User-Token', data.jwtToken)
        localStorage.setItem('name', data.extra.trueName || data.extra.wxName)
        localStorage.setItem('avatar', data.extra.trueAvatar || data.extra.wxAvatar)
        localStorage.setItem('menus', JSON.stringify(data.menus));
        localStorage.setItem('permissions', JSON.stringify(data.permissions));
        setToken(data.token)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      loginInfo({token: state.token}).then(response => {
        const {data} = response
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_TOKEN', data.token)
        commit('SET_ROLE', 'admin')
        localStorage.setItem('roleName', data.role && data.role.text)
        localStorage.setItem('role', data.role && data.role.value)
        localStorage.setItem('uid', data.id)
        localStorage.setItem('departmentId', data.departmentId)
        localStorage.setItem('sdktoken', data.imToken)
        localStorage.setItem('name', data.extra.trueName || data.extra.wxName)
        localStorage.setItem('avatar', data.extra.trueAvatar || data.extra.wxAvatar)
        localStorage.setItem('menus', JSON.stringify(data.menus));
        localStorage.setItem('permissions', JSON.stringify(data.permissions));
        const {name, avatar} = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      localStorage.removeItem('role')
      removeToken()
      resetRouter()
      resolve()
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

