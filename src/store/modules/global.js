// 存放获取到的指标列表，显示开关，当前状态
const state = {
  cityImage: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAdNJREFUWEftV00vA1EUPW/Qabqpr6gQJT7bCBtsK5WwELGidjYSfgMLCz+DnY1QO91Z+NhYYENCW0VMUyJCqUR0auZJRxqjMzWPNor0rSbvntx75txz38sjyPMiea6PAoHfq8BxHT9AIE+zeIQQLtgmxKdYsOmYjAr4W6whdPQ0MSWNRW8QPNx0CKKHCa8CZSZgN1GysA50uQxz0sl+YHdr0xFOuA3BaYACgb+hwFoAuHrUdrevEWguB948sB2kBEv6HqCXTiExrxdjUsCIAAabwFfZJHDcUyYTikcH3tbQ4wT7GH5lCnptsLR3om55Xbd+eKwfTzv6U8KkgNFo0X9PwBcAkj5IXzMuoL4UUCsQ3Z7F88WGAjXXu1HmmkPWLUhIwPm9lkBrxduemsBL9BSyGFP2SbEZJRXO7AkUPBC6Ax6etTp0VgMl3McWpPqfQid9kLUH5veA/UstgcluoKvmnUDt4iquV4Y+AG0eHyLjIz93DsjxB3C8VSGR+s5agYIJc6UAlRMjzghu1fk0d4HfbhoFsGJU9LtxKomVahIaAifN4CXRNExBLRxIA0shCVCGtAgw6+GTcQ44S8Ycguj9VAGWgrnE/N6HSS7/8rNceVfgFc7ATzB5pDV0AAAAAElFTkSuQmCC',
  ecologyImage: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAwdJREFUWEfFll1IFFEYht9vxsgdKQkrKuiP6CabVagQoqCIoFTQHfOiMIp+ILvoByLppropSoy67KIMCiQQZyWSEImgFCGFcGfVm7ro/yKKKD3bjzNfrLnl2s6c4xo6t+c97/ucb77zcQgz/NEM50MZwHB2lQN8F+ABAD0E6h6B2/3dbH0xlUOoA8SsNhBK/wkj9JOH28Nhuz4bECWA/FjZvJ80+w0AIyCkCxrqRaF9bzIgSgCGY5UBuK9mzI1Cy6lFYfMPFb0qwEUAZ1QMxzRtuuB9X0uiH2V7FAGqegFel2bGcEHQAwI6PR0139bYL4MgpADGgLUYLt75mCRPWOAfQA672s5EcfNbP40UIM+pqmHwHR+DzwDmAtD8Apj4UmJt1Pf3SQFCMesyEU4HnOAUAw0BZR7SNL1kqLA5OT8y3GJJlxiOdQPAwQDZawZdIfA1fw1fF2a0NluAKIDKwEZi1DHDgIZzPrqnwrRLsgLIi0UeM9FmSaEGoWMbPPSCsSSD9rkw7dVZARhxKw5Goew+A3QU4IUAzmfQfhKmnfG2SJvQcKz3ABbJAJj4IWm0Fy76ACyYqBemnTFLBSA5UmfJAEbXWV8PGjkE0JF0PTcKM5qxkaUAISfyiEBbVAAY1KAx2pm4I03PXqkItz7IqgdCfdYJ0nBVBQDAK2Hayw3H6gKwcWyPbwMm16UVyOuvLGZPe6YIAA/eVh36BgaPvg/Yw8lEke07I6QASRMjbt0CY78SBOGw7lGnS9wDoEOYthU4Q1RM5wxGClyXknd8hUzPjPpE2K7Li0WahsPRPTK9UgVGq+BEygE6BmB7sCnZwmypmu1UrlJ5LyoDpEJDTsVScE4FMc//A6KBxw2gmDDtItnJU+uTBshkbMStJ2Bs+j0LkBBhO+jtmGYxZYDcePUyjd20V4/f1MtqDshKaTiRAwDdHK+bVoBQLNJERLv/AvAXYUbzZeD/rQdy+6pXarp7dtycaBemvWPaAFJBSRCikQsaaR+GzZbj0w6gGjhRN+VbkG1wat8vY5D6IQWw4KIAAAAASUVORK5CYII=',
  agricultureImage: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABYVJREFUWEe1l3lsVFUUxr/vPim8V5Z5raIi9A1B45aouKCCieAS0QSjMWKIa11wCSgucYlRxBA1EAPGJVA0YOQfMRITjBqXgAgCpqiRVGOidl4rEKudGZS+Vtq5n3kzrbSdaZ1WvX/ee885v7O++4ghrkzoLfaDaEkslg29+Ykgqhuiij7XWa5wOnRnVAXt21tDd64B1xK6BY7Tqpzu8oO2ueXq6X+vbICGBlRMGO097gfR4kyTt5YW+0RNshavGMP3/CCqGg5E2QCx8nTKu8IY3pyoabsuE3opUo/IchmB9TC4OFETnTdUiKEBhO4MgpcAuOkImDldsA0OcVVOeAfAbgCbeuqjXJChATRXnoac3WAMv5VwLqBlAh8isItAq4Bbc1YXOIazywUZEkDs1YFm73JrNQ/gRRBW0+B8C2ynsFTQcwRPhbQO5Nt+EP2j/n+8UCqUmZT3KixfhKOvCTtFMD8aYoEFHoVFBQ03S7qqS5h+VDL6crB0DAvgYGPlMZ1Gn0n4yBDjrbCPxFgC0yCuFXQ+iKuN0cJxk9pf+s8BYoWZ0F0IMQHiaUEXENwG2gsh8ymgPwCOAbHRr4mu+V8A8m0ZepFjcqdbmTpY7IbBXlnTQmp93ii51ZGWjw2idweCGFYKMo2VtXS6tjojRvze1dF1aqzcn9yxJdM4aiYcLoY4s2CQnwHK+kF05X8KkG3ylkp4nMROWe4g7Y4KBzu8ie0/p1PuepLXdxv8CMClDjBnoCgMLwIpbyqIbQC83p4RmmvBqQQei/cF3kjoDQGrqoLo7lJRGD6A7DgYs7lIqfAEiDkAjpS0keRDAL72g2jqvwbINFaeUUH90mlynuAsGkGu6bR6EkC/SuctftD2eib04vF8Zr5GgojZ0DsrEUTx3t9r0Ahkmt2rYc08QOcASPZI2RwvM46eBzAB0PtW/J7AsaTGWpjXjexoGvuN5PzQIxMDpENvdVUQ3VkWQGvKnW7I9wCMKw6dPiHMx4Ke7XWWEvSWY2ydtc6bMFoKy4095wTOFlDffzwPGIFM6NVL+ILAmqKCI9b5NVFttsn7QMJlfTwi3pdgJX1KclmhG7FOwiEC89Vlg6opHU29wIr9S4fefEPU/vpnNPOoCvdpgQ/3vmUtllRPjp5qbMSohHHnA3yh97kxulcygaQHC92ANQTuyN+xdlY8MwYFiL0H+TJlDwrcUITYrSSb8m4XecjQdlpxNoTZIMaD2gIxCWi7teyiwVwCbqxnpNFEb1L73gEB4rdffq6DKwEtKtU6PXk80DzyeGudrwhstcQmS21yunRCfiqGnvKV3+TtLLwd8mufH0THDVqE6bDyYdJeTpgWSUWPTRK7NKZiNg903pFIti3PNHkvQljQneuDBDdZ8Bmj3EprUU/DRw73HFf6NW33DwqQaXI3H57lJepfvMFAo0S8KqDOAHVxdfe/GX+KrWVtzxwAkKoQplcmo/2DAmRD71sBJ5cKfbz3ZzYaPTJRuRbQtYWiYi2JI0Ut7yNDvAbhtu69Bgd4tNT3oKgNM6GXjgdXSQBxhZ9seyAdes0EJkJoyec1GU3Nhm4MFHfMSd2yLYV3ourtIXdB9Qnp30vpLAWggbw3xDQA06xw+JVDvKYc6qsmR6tiudZG9zxDzLDiGGPUSpnpiWTbvIF0FgFkQ2+/gGOKBKgtfk37rHTofsfDXna3dmEu9JeJZz+ADxNBVF0+QN+2Kch1G8+E7iKAK/rleh1ydok/uSNVykg69L6RdFd1sv3z8lLQ6C6C6WvkEOyUo4OOn+IOkUwLpT0Q9tDYPYmg46eBvIv3M6H3JMBqP2i7ryyAglDlhkKV8632DnPPhBP/+G0wI4OdtYajTzGwDQP9IwzrQTJUmN6/9P1l/wJdUXI/7lfIcgAAAABJRU5ErkJggg==',
  cityColor: '#E56665',
  ecologyColor: '#98CC72',
  agricultureColor: '#F5C753',
  // 控制地球旋转动画
  mapVisual: true,
  // 控制switch开关
  planVisual: false,
  // 当前指标id
  currentIndex: 1,
  // 当前指标名称，主要用于图标标题
  currentIndexName: '',
  // 指标列表
  factorList: [],
  // 指标列表按照类型分类
  factorCategory: []
}

const mutations = {
  initFactorList (state, factorList) {
    state.factorList = factorList
  },
  initFactorCategory (state, factorCategory) {
    state.factorCategory = factorCategory
  },
  initCurrentIndexName (state) {
    state.currentIndexName = state.factorList.filter(item => item.id === state.currentIndex)[0].IndexName
  },
  alterFactorList (state, factorList) {
    state.factorList = factorList.map(item => {
      return {
        id: item.id,
        IndexType: item.IndexType,
        IndexName: item.IndexName,
        AlarmValue: item.AlarmValue
      }
    })
  },
  alterIndex (state, index) {
    state.currentIndex = index
    state.currentIndexName = state.factorList.filter(item => item.id === state.currentIndex)[0].IndexName
  },
  alterMapVisual (state) {
    state.mapVisual = !state.mapVisual
  },
  alterPlanVisual (state) {
    state.planVisual = true
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
