// 获取平台属性管理模块
import request from '@/utils/request'

const host = process.env.VUE_APP_BASE_API
// 获取一级分类
export const reqCategory1List = () => request({
  url:host+ '/admin/product/getCategory1',
  method: 'get'
})

// 获取二级菜单
export const reqCategory2List = (category1Id) => request({
  url:host+ `/admin/product/getCategory2/${category1Id}`,
  method: 'get'
})

// 获取三级分类
export const reqCategory3List = (category2Id) => request({
  url:host+ `/admin/product/getCategory3/${category2Id}`,
  method: 'get'
})

// 获取平台属性的接口
export const reqAttrList = (category1Id, category2Id, category3Id) => request({
  url:host+ `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}/`,
  method: 'get'
})

// 添加属性与属性值
export const reqAddOrUpdateAttr = (data) => request({
  url:host+ `/admin/product/saveAttrInfo/`,
  method: 'post',
  data
})

