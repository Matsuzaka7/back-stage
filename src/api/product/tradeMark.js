// 获取品牌管理数据的模块
// /admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'
const host = process.env.VUE_APP_BASE_API
export const reqTradeMarkList = (page, limit) => request(
  {
    url:host+ `/admin/product/baseTrademark/${page}/${limit}`,
    methods: 'get'
  }
)

// 处理添加品牌的
// 新增 /admin/product/baseTrademark/save, post(携带两个参数，名称/logo)
// 修改 /admin/product/baseTrademark/update 。put（三个参数，id，名称，logo）

export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return request({
      url:host+ '/admin/product/baseTrademark/update',
      method: 'put',
      data: tradeMark
    })
  } else {
    return request({
      url:host+ '/admin/product/baseTrademark/save',
      method: 'post',
      data: tradeMark
    })
  }
}

// 删除品牌
export const reqDeleteTradeMark = (id) => request({
  url:host+ `/admin/product/baseTrademark/remove/${id}`,
  method: 'delete'
})