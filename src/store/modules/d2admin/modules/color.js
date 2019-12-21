import client from 'webpack-theme-color-replacer/client'
import forElementUI from 'webpack-theme-color-replacer/forElementUI'

export default context => ({
  namespaced: true,
  state: {
    // 颜色
    value: context.env.VUE_APP_ELEMENT_COLOR
  },
  actions: {
    /**
     * @description 设置颜色
     * @param {Object} vuex context
     * @param {String} color 尺寸
     */
    async set ({ state, dispatch, commit }, color) {
      // 记录上个值
      const old = state.value
      // store 赋值
      state.value = color || context.env.VUE_APP_ELEMENT_COLOR
      // 持久化
      await dispatch('d2admin/db/set', {
        dbName: 'sys',
        path: 'color.value',
        value: state.value,
        user: true
      }, { root: true })
      // 应用
      commit('apply', {
        oldColor: old,
        newColor: state.value
      })
    },
    /**
     * @description 从持久化数据读取颜色设置
     * @param {Object} vuex context
     */
    async load ({ state, dispatch, commit }) {
      // 记录上个值
      const old = state.value
      // store 赋值
      state.value = await dispatch('d2admin/db/get', {
        dbName: 'sys',
        path: 'color.value',
        defaultValue: context.env.VUE_APP_ELEMENT_COLOR,
        user: true
      }, { root: true })
      // 应用
      commit('apply', {
        oldColor: old,
        newColor: state.value
      })
    }
  },
  mutations: {
    /**
     * @description 将 vuex 中的主题颜色设置应用到系统中
     * @param {Object} vuex context
     * @param {Object} payload oldColor {String} 旧的颜色
     * @param {Object} payload newColor {String} 新颜色
     */
    apply (state, { oldColor, newColor }) {
      var options = {
        oldColors: [...forElementUI.getElementUISeries(oldColor)],
        newColors: [...forElementUI.getElementUISeries(newColor)]
      }
      client.changer.changeColor(options)
    }
  }
})
