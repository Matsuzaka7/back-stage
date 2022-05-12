import request from '@/utils/request'

const host = process.env.VUE_APP_BASE_API
// 获取spu列表数据
export const reqSpuList = (page,limit,category3Id) => request({
  url:host+ `admin/product/${page}/${limit}`,
  method: 'get',
  params: {category3Id}
})

// 获取SPU信息
export const reqSpu = (spuId) => request({
  url:host+ `admin/product/getSpuById/${spuId}`,
  method: 'get'
})

// 获取品牌信息
export const reqTradMarkList = () => request({
  url:host+ `admin/product/baseTrademark/getTrademarkList`,
  method: 'get'
})

// 获取SPU图标
export const reqSpuImageList = (spuId) => request({
  url:host+ `admin/product/spuImageList/${spuId}`,
  method: 'get'
})

// 获取销售属性
export const reqBaseSaleAttrList = () => request({
  url:host+ `admin/product/baseSaleAttrList`,
  method: 'get'
})

// 修改spu或添加spu
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 如果携带的参数带有id代表修改
  if(spuInfo.id){
    return request({
      url:host+ '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    // 没有带id,代表添加
    return request({
      url:host+ '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除spu
export const reqDeleteSpu = (spuId) => request({
  url:host+`/admin/product/deleteSpu/${spuId}`,
  method:'delete'
})

// 获取销售属性数据
export const reqSpuSaleAttrList = (spuId) => request({
  url:host+ `/admin/product/spuSaleAttrList/${spuId}`,
  method: 'get'
})

// 获取平台属性的数据
export const reqAttrInfoList = (CateGory1Id,CateGory2Id,CateGory3Id) => request({
  url:host+ `/admin/product/attrInfoList/${CateGory1Id}/${CateGory2Id}/${CateGory3Id}`,
  method: 'get'
})

// 添加sku
export const reqAddSku = (skuInfo) => request({
  url:host+ `/admin/product/saveSkuInfo`,
  method: 'post',
  data:skuInfo
})

// 获取sku列表接口
export const reqSkuList = (spuId) => request({
  url:host+ `/admin/product/findBySpuId/${spuId}`,
  method: 'get',
})