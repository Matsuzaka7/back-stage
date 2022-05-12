import request from '@/utils/request'

// sku列表接口
const host = process.env.VUE_APP_BASE_API
export const reqSkuList = (page,limit) => request({
  url:host+`/admin/product/list/${page}/${limit}`,
  method:'get'
})

// 上架
export const reqSale = (skuId) => request({
  url:host+`/admin/product/onSale/${skuId}`,
  method:'get'
})

// 下架
export const reqCancel = (skuId) => request({
  url:host+`/admin/product/cancelSale/${skuId}`,
  method:'get'
})

// 获取sku详情的接口
export const reqSkuById = (skuId) => request({
  url:host+`/admin/product/getSkuById/${skuId}`,
  method:'get'
})