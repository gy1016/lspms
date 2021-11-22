const state = {
  // 主要是将planning表和admin表进行了联合查询，故没有三大分区
  regionMap: [],
  // 单独将admin从regionMap中分离出来
  adminRegionMap: [],
  // 单独将103个区的信息从regionMap中分离出来
  planRegionMap: [],
  // 三大分区的划分
  planTypeMap: {
    1: [],
    2: [],
    3: []
  },
  timeList: [],
  // 第一次请求得到的数据，
  // 后需要将根据数组中的每一项是否含有BelongRegionID来将其划分成为不同等级的数据
  valueList: [],
  threeValueList: [],
  // 用来表示mapData中数据的混杂情况，1：既有县又有市；2：只有县没有市；3：只有市没有县
  situation: 1,
  // 对valueList按年分组产生的数据
  mapData: {},
  adminMapData: {},
  // 这个是按照市分类的县级数据
  planMapData: {},
  threeTrendData: {},
  // 这个是用于存储清除市级区域后的县级数据，并没有进行按市分类
  planMapData2: {},
  threeMapData: {}
}

const mutations = {
  initRegionMap (state, regionMap) {
    // 每个子区，以及子区所属的父区，有很大的冗余度，但是我懒得改...
    state.regionMap = regionMap
    const tmp = regionMap.map(item => item.administration)
    // 利用Map对提取出来的父区进行去重
    const map = new Map()
    for (const item of tmp) {
      if (!map.has(item.id)) {
        map.set(item.id, item)
      }
    }
    state.adminRegionMap = [...map.values()]
    // 把从服务器中取到的关联查询中的子区都提取出来
    // 完全可以与父区在一个遍历中处理，有很大的优化空间，但我懒得改
    state.planRegionMap = regionMap.map(item => {
      if (item.Type === 1) {
        state.planTypeMap[1].push(item.Name_CH)
      } else if (item.Type === 2) {
        state.planTypeMap[2].push(item.Name_CH)
      } else {
        state.planTypeMap[3].push(item.Name_CH)
      }
      return {
        id: item.id,
        BelongRegionID: item.BelongRegionID,
        Type: item.Type,
        Name_CH: item.Name_CH,
        Name_EN: item.Name_EN
      }
    })
  },
  initValueList (state, list) {
    let minRegionID = null
    let maxRegionID = null
    state.threeValueList = []
    // 根据指标ID，从服务器中取到的值列表，与时间和区域有关，这里很麻烦啊
    state.valueList = list
    // 先根据RegionID给每个值赋一个区名
    state.valueList.map(item => {
      minRegionID = !minRegionID ? item.RegionID : Math.min(minRegionID, item.RegionID)
      maxRegionID = !maxRegionID ? item.RegionID : Math.max(maxRegionID, item.RegionID)
      // 如果该指标值的RegionID大于100，则为该指标添加BelongRegionID字段
      if (item.RegionID > 100) {
        const planning = state.planRegionMap.filter(plan => plan.id === item.RegionID)[0]
        item.RegionName = planning.Name_CH
        item.BelongRegionID = planning.BelongRegionID
      } else {
        if (item.RegionID === 19) {
          item.name = '城市发展区'
          state.threeValueList.push(item)
        } else if (item.RegionID === 20) {
          item.name = '重点生态功能区'
          state.threeValueList.push(item)
        } else if (item.RegionID === 21) {
          item.name = '农产品主产区'
          state.threeValueList.push(item)
        } else {
          // 不大于100说明是17个市级加上3大分区，则只为其添加RegionName
          const administration = state.adminRegionMap.filter(admin => {
            // console.log(item.RegionID)
            return admin.id === item.RegionID
          })[0]
          // console.log(administration)
          item.RegionName = administration.Name_CH
        }
      }
    })
    // console.log('minRegionID:'+minRegionID+'...'+'maxRegionID:'+maxRegionID)
    if (maxRegionID > 100 && minRegionID < 22) {
      state.situation = 1
    } else if (maxRegionID < 22) {
      state.situation = 3
    } else {
      state.situation = 2
    }
  },
  initTimeList (state) {
    state.timeList = [...new Set(state.valueList.map(item => item.Time))].sort((a, b) => a - b)
  },
  initMapData (state) {
    state.mapData = {}
    state.adminMapData = {}
    state.planMapData = {}
    // 规划分区开关下，用于显示每年每个县级区域的数据
    state.planMapData2 = {}
    // 首先对请求到的Value大集合进行按年分组
    // 如果是子区，则为其添加belong字段
    // 最后得到的结果是一个对象，首先键的集合是年份
    // 某一年下可能含有县级数据，也可能含有市级数据
    // 其中县级数据含有belong字段
    state.timeList.map(year => {
      let max
      let min = 0
      state.mapData[year] = state.valueList.filter(item => item.Time === year).map(item => {
        if (!max) {
          max = item.Value
        } else {
          max = Math.max(max, item.Value)
          min = Math.min(min, item.Value)
        }
        // max = Math.max(max, item.Value)
        const tmp = {
          name: item.RegionName,
          value: item.Value
        }
        if (!item.BelongRegionID) {
          return tmp
        } else {
          tmp.belong = item.BelongRegionID
          return tmp
        }
      })
      state.mapData[year].push({ max, min })
    })
    // 对mapData进行数据分类
    /*
      1. mapData中既有县级数据，又有市级数据
         解决方法对mapData进行遍历，
         如果item没有belong则将其推入adminMapData
    */
    /*
      2. mapData中只有县级数据，没有市级数据
         解决方法对mapData进行遍历，
         将planMapData的数据进行累加得到adminMapData
    */
    /*
      3. mapData中没有县级数据，只有市级数据
         解决方法对mapData进行遍历
    */
    // console.log('state.situation:' + state.situation)
    if (state.situation === 1) {
      state.timeList.map(year => {
        // 一个循环解决的问题写两个，真不愧是我
        // 用map不用forEach，真不愧是我
        state.adminMapData[year] = state.mapData[year].filter(data => !data.belong && data.name)
        // state.adminMapData[year].pop()
        let min = Math.min(...state.adminMapData[year].map(d => d.value))
        let max = Math.max(...state.adminMapData[year].map(d => d.value))
        state.adminMapData[year].push({ max, min })
        // 处理规划分区显示数据
        state.planMapData2[year] = state.mapData[year].filter(data => data.belong)
        min = Math.min(...state.planMapData2[year].map(d => d.value))
        max = Math.max(...state.planMapData2[year].map(d => d.value))
        state.planMapData2[year].push({ max, min })
      })
    } else if (state.situation === 3) {
      // 只有市级的数据，弄规划分区也没意思了，直接赋值mapData算了
      state.adminMapData = state.mapData
      state.planMapData2 = state.mapData
    } else {
      // 只有县级的，就直接赋值就好了
      // 并将县级数据和成市级
      state.planMapData2 = state.mapData
      state.timeList.map(year => {
        let max
        let min = 0
        state.adminMapData[year] = state.adminRegionMap.map(admin => {
          const totalValue = state.valueList.filter(item => item.Time === year).reduce((pre, current) => {
            if (current.BelongRegionID === admin.id) {
              return pre + current.Value
            } else {
              return pre + 0
            }
          }, 0)
          if (!max) {
            max = totalValue
          } else {
            max = Math.max(max, totalValue)
            min = Math.min(min, totalValue)
          }
          return {
            name: admin.Name_CH,
            value: totalValue
          }
        })
        state.adminMapData[year].push({ max, min })
      })
    }
    // planMapData单独进行处理
    // 这种处理方法适用于所有情况，因为它是对valueList直接进行处理的
    // 并且，若只有市级数据，那么这种处理方法会直接将县级数据置为0
    state.adminRegionMap.map(admin => {
      state.planMapData[admin.Name_CH] = {}
      state.timeList.map(year => {
        let max
        let min = 0
        state.planMapData[admin.Name_CH][year] = state.valueList.filter(item => {
          return item.Time === year && item.BelongRegionID === admin.id
        }).map(value => {
          if (!max) {
            max = value.Value
          } else {
            max = Math.max(max, value.Value)
            min = Math.min(min, value.Value)
          }
          // max = Math.max(max, item.Value)
          return {
            name: value.RegionName,
            value: value.Value
          }
        })
        // 如果指标值列表中没有某个区域，那么max最终还是undefined，设置成0算了
        if (!max) {
          max = 0
        }
        state.planMapData[admin.Name_CH][year].push({ max, min })
      })
    })
    state.threeTrendData['城市发展区'] = {}
    state.threeTrendData['重点生态功能区'] = {}
    state.threeTrendData['农产品主产区'] = {}
    state.timeList.map(year => {
      state.threeTrendData['城市发展区'][year] = []
      state.threeTrendData['重点生态功能区'][year] = []
      state.threeTrendData['农产品主产区'][year] = []
      state.valueList.filter(item => item.Time === year && item.BelongRegionID).map(d => {
        if (state.planTypeMap[1].includes(d.RegionName)) {
          state.threeTrendData['城市发展区'][year].push({
            name: d.RegionName,
            value: d.Value
          })
        } else if (state.planTypeMap[2].includes(d.RegionName)) {
          state.threeTrendData['重点生态功能区'][year].push({
            name: d.RegionName,
            value: d.Value
          })
        } else {
          state.threeTrendData['农产品主产区'][year].push({
            name: d.RegionName,
            value: d.Value
          })
        }
      })
    })
  },
  // 根据threeValueList生成threeMapData
  initThreeData (state) {
    state.threeMapData = {}
    // 如果三大分区有市级的数据
    // 否则则按三大分区对valueList遍历相加
    // 还有一种情况是没有三大分区数据，只有市级
    if (state.threeValueList.length) {
      state.timeList.map(year => {
        state.threeMapData[year] = state.threeValueList.filter(item => item.Time === year).map(item => {
          const tmp = {
            name: item.name,
            value: item.Value
          }
          if (!item.BelongRegionID) {
            return tmp
          } else {
            tmp.belong = item.BelongRegionID
            return tmp
          }
        })
      })
    } else {
      state.timeList.map(year => {
        state.threeMapData[year] = []
        for (let i = 1; i < 4; i++) {
          const tmp = {
            name: '',
            value: 0
          }
          if (i === 1) {
            tmp.name = '城市发展区'
          } else if (i === 2) {
            tmp.name = '重点生态功能区'
          } else if (i === 3) {
            tmp.name = '农产品主产区'
          }
          tmp.value = state.valueList.filter(item => item.Time === year && state.planTypeMap[i].includes(item.RegionName)).reduce((pre, current) => {
            return pre + current.Value
          }, 0)
          state.threeMapData[year].push(tmp)
        }
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
