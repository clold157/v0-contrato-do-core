export type MenuOnlineStatus = 'active' | 'inactive';

export type MenuOnlineAvailabilityWindow = {
  days: number[];
  start: string;
  end: string;
};

export type MenuOnlineCategoryDTO = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  status: MenuOnlineStatus;
  availability: MenuOnlineAvailabilityWindow[] | null;
  visibleDelivery: boolean;
  visibleCounter: boolean;
  visibleTable: boolean;
};

export type MenuOnlineProductImageDTO = {
  id: string;
  url: string;
  altText: string | null;
  sortOrder: number;
};

export type MenuOnlinePriceVariationDTO = {
  id: string;
  name: string;
  price: number;
  priceDelta: number;
  isDefault: boolean;
  sortOrder: number;
  status: MenuOnlineStatus;
};

export type MenuOnlineProductDTO = {
  id: string;
  categoryId: string;
  sku: string | null;
  name: string;
  description: string | null;
  status: MenuOnlineStatus;
  sortOrder: number;
  basePrice: number;
  promoPrice: number | null;
  promoStartsAt: string | null;
  promoEndsAt: string | null;
  images: MenuOnlineProductImageDTO[];
  priceVariations: MenuOnlinePriceVariationDTO[];
  modifierGroupIds: string[];
};

export type MenuOnlineModifierGroupDTO = {
  id: string;
  name: string;
  description: string | null;
  minSelect: number;
  maxSelect: number;
  isRequired: boolean;
  sortOrder: number;
  status: MenuOnlineStatus;
};

export type MenuOnlineModifierOptionDTO = {
  id: string;
  groupId: string;
  name: string;
  priceDelta: number;
  sortOrder: number;
  status: MenuOnlineStatus;
};

export type MenuOnlineSettingsDTO = {
  currency: string;
  showOutOfStock: boolean;
  showImages: boolean;
};

export type MenuOnlineComboPricingType = 'fixed_price' | 'discount_percent' | 'discount_amount';

export type MenuOnlineComboItemDTO = {
  id: string;
  productId: string;
  minQty: number;
  maxQty: number;
  sortOrder: number;
  status: MenuOnlineStatus;
};

export type MenuOnlineComboDTO = {
  id: string;
  name: string;
  description: string | null;
  pricingType: MenuOnlineComboPricingType;
  fixedPrice: number | null;
  discountPercent: number | null;
  discountAmount: number | null;
  status: MenuOnlineStatus;
  items: MenuOnlineComboItemDTO[];
};

export type MenuOnlinePublicMenuDTO = {
  tenant: {
    id: string;
    slug: string;
    name: string;
  };
  settings: MenuOnlineSettingsDTO;
  categories: MenuOnlineCategoryDTO[];
  products: MenuOnlineProductDTO[];
  modifierGroups: MenuOnlineModifierGroupDTO[];
  modifierOptions: MenuOnlineModifierOptionDTO[];
  combos: MenuOnlineComboDTO[];
};

export type CartItem = {
  productId: string;
  variationId?: string | null;
  quantity: number;
  modifierOptionIds: string[];
  notes?: string;
  price: number;
};

export type Cart = {
  items: CartItem[];
  cashbackUsed: number;
};
