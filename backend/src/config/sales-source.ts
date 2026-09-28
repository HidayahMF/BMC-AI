export const salesDataSource = {
  customer: 'dbo.MAS_CUSTOMER',
  orderHeader: 'dbo.SLS_SALESORDER_HED_NEW',
  orderDetail: 'dbo.SLS_SALESORDER_NEW',
  product: 'dbo.MAS_KATALOG_SALES',
  deliveryHeader: 'dbo.SLS_DELIVERYORDER_HED_NEW',
  deliveryDetail: 'dbo.SLS_DELIVERYORDER_NEW',
} as const;

export const salesSourceStatus = 'PROBABLE_ACTIVE' as const;
export const salesRelationshipStatus = 'CONFIRMED_BY_DATA' as const;
export const deliveryRelationshipStatus = 'PROBABLE' as const;

export const oldSalesSources = ['dbo.SLS_SALESORDER_HED', 'dbo.SLS_SALESORDER', 'dbo.SLS_PRODUCT'] as const;
