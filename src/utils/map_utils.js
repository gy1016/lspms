const name2pinyin = {
  武汉市: 'wuhan',
  黄石市: 'huangshi',
  十堰市: 'shiyan',
  宜昌市: 'yichang',
  襄阳市: 'xiangyang',
  鄂州市: 'ezhou',
  荆门市: 'jingmen',
  孝感市: 'xiaogan',
  荆州市: 'jingzhou',
  黄冈市: 'huanggang',
  咸宁市: 'xianning',
  随州市: 'suizhou',
  恩施土家族苗族自治州: 'enshi',
  仙桃市: 'xiantao',
  潜江市: 'qianjiang',
  天门市: 'tianmen',
  神农架林区: 'shennongjia'
}

export function getProvinceMapInfo (arg) {
  const path = `${arg}.json`
  return {
    key: name2pinyin[arg],
    path: path
  }
}
