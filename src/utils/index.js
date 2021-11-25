/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// 表单重置
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

// 添加日期范围
export function addDateRange(params, dateRange, propName) {
  const search = params
  search.params = {}
  if (dateRange != null && dateRange !== '') {
    if (typeof (propName) === 'undefined') {
      search['beginTime'] = dateRange[0]
      search['endTime'] = dateRange[1]
    } else {
      search['begin' + propName] = dateRange[0]
      search['end' + propName] = dateRange[1]
    }
  }
  return search
}

/**
 * 添加开始和结束时间到 params 参数中
 *
 * @param params 参数
 * @param dateRange 时间范围。
 *                大小为 2 的数组，每个时间为 yyyy-MM-dd 格式
 * @param propName 加入的参数名，可以为空
 */
export function addBeginAndEndTime(params, dateRange, propName) {
  // 如果未传递 propName 属性，默认为 time
  if (!propName) {
    propName = 'Time'
  } else {
    propName = propName.charAt(0).toUpperCase() + propName.slice(1)
  }
  //  dateRange 为空时参数删除参数的属性
  if (!dateRange) {
    delete params['begin' + propName]
    delete params['end' + propName]
    return params
  }
  // 设置参数
  if (dateRange[0]) {
    params['begin' + propName] = dateRange[0] + ' 00:00:00'
  }
  if (dateRange[1]) {
    params['end' + propName] = dateRange[1] + ' 23:59:59'
  }
  return params
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} pid 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, pid, children, rootId) {
  id = id || 'id'
  pid = pid || 'pid'
  children = children || 'children'
  rootId = rootId || Math.min.apply(Math, data.map(item => { return item[pid] })) || 0
  // 对源数据深度克隆
  const cloneData = JSON.parse(JSON.stringify(data))
  // 循环所有项
  const treeData = cloneData.filter(father => {
    const branchArr = cloneData.filter(child => {
      // 返回每一项的子级数组
      return father[id] === child[pid]
    })
    branchArr.length > 0 ? father.children = branchArr : ''
    // 返回第一层
    return father[pid] === rootId
  })
  return treeData !== '' ? treeData : data
}
