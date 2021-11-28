const state = {
  count: 2,
  minder: {},
  editor: {},
  working: {
    editing: false,
    saving: false,
    draging: false
  },
  callbackQueue: [],
  config: {
    // 右侧面板最小宽度
    ctrlPanelMin: 250,

    // 右侧面板宽度
    ctrlPanelWidth: parseInt(window.localStorage.__dev_minder_ctrlPanelWidth) || 250,

    // 分割线宽度
    dividerWidth: 3,

    // 默认语言
    defaultLang: 'zh-cn',

    // 放大缩小比例
    zoom: [
      10,
      20,
      30,
      50,
      80,
      100,
      120,
      150,
      200
    ]
  }
}

const mutations = {

  changeDrag(state, bool) {
    state.working.draging = bool
  },

  setMinder(state, data) {
    state.minder = data
  },

  setEditor(state, data) {
    state.editor = data
  },

  changeSave(state, bool) {
    state.working.saving = bool
  },

  changeCount(state) {
    state.count++
  },

  increment(state) {
    state.count++
  },

  decrement(state) {
    state.count--
  },

  registerEvent(state, callback) {
    state.callbackQueue.push(callback)
  },

  setConfig(state) {
    var supported = Object.keys(state.config)
    var configObj = {}

    // 支持全配置
    if (typeof key === 'object') {
      configObj = key
    } else {
      configObj[key] = value
    }

    for (var i in configObj) {
      if (configObj.hasOwnProperty(i) && supported.indexOf(i) !== -1) {
        state.config[i] = configObj[i]
      } else {
        console.error('Unsupported config key: ', key, ', please choose in :', supported.join(', '))
        return false
      }
    }
    return true
  }
}

const actions = {
  changeCount: ({
    commit
  }) => commit('changeCount'),

  increment: ({
    commit
  }) => commit('increment'),

  decrement: ({
    commit
  }) => commit('decrement'),

  incrementIfOdd({
    commit,
    state
  }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },

  incrementAsync({
    commit
  }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  },

  setConfig: ({
    commit
  }) => commit('setConfig'),

  registerEvent: ({
    commit
  }) => commit('registerEvent', callback),

  executeCallback({
    commit,
    state
  }) {
    state.callbackQueue.forEach(function(ele) {
      ele.apply(this, arguments)
    })
  },

  isQuotaExceeded(e) {
    var quotaExceeded = false
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true
            break
          case 1014:
            // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true
            }
            break
        }
      } else if (e.number === -2147024882) {
        // Internet Explorer 8
        quotaExceeded = true
      }
    }
    return quotaExceeded
  },

  getMemory({
    commit,
    state
  }, key) {
    var value = window.localStorage.getItem(key)
    var result = null || JSON.parse(value)
    return result
  },

  setMemory({
    commit,
    state
  }, data) {
    try {
      window.localStorage.setItem(data.key, JSON.stringify(data.value))
      return true
    } catch (e) {
      if (this.isQuotaExceeded(e)) {
        return false
      }
    }
  },

  removeMemory(key) {
    var value = window.localStorage.getItem(key)
    window.localStorage.removeItem(key)
    return value
  },

  clearMemory() {
    window.localStorage.clear()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
