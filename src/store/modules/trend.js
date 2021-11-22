export default {
  namespaced: true,
  state: {
    cascaderIndexId: [1, 1]
  },
  mutations: {
    alterCascaderIndexId (state, currentId) {
      state.cascaderIndexId = currentId
    }
  },
  actions: {}
}
