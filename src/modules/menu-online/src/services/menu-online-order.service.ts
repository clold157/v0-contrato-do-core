import { PrismaClient } from '@prisma/client';
import { MenuOnlineOrderRepository } from '../repositories/menu-online-order.repository';
import { MenuOnlineRepository } from '../repositories/menu-online.repository';
import type { CreateOrderDTO, OrderDTO } from '@/src/types/menu-online-order';

export class MenuOnlineOrderService {
  private orderRepository: MenuOnlineOrderRepository;
  private menuRepository: MenuOnlineRepository;

  constructor(private prisma: PrismaClient) {
    this.orderRepository = new MenuOnlineOrderRepository(prisma);
    this.menuRepository = new MenuOnlineRepository(prisma);
  }

  async createOrder(data: CreateOrderDTO): Promise<OrderDTO> {
    if (!data.items || data.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    const order = await this.orderRepository.create(data);

    let subtotal = 0;

    for (const item of data.items) {
      const product = await this.menuRepository.findProductById(data.tenantId, item.productId);

      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }

      if (product.status !== 'active') {
        throw new Error(`Product ${product.name} is not available`);
      }

      let itemPrice = product.basePrice;
      let variationName: string | null = null;
      let variationPrice: number | null = null;

      if (item.variationId && product.priceVariations.length > 0) {
        const variation = product.priceVariations.find((v) => v.id === item.variationId);
        if (!variation) {
          throw new Error(`Variation ${item.variationId} not found for product ${product.name}`);
        }
        itemPrice = variation.price;
        variationName = variation.name;
        variationPrice = variation.price;
      }

      let modifiersTotal = 0;
      const modifiers: Array<{ groupName: string; optionName: string; priceDelta: number }> = [];

      if (item.modifierOptionIds && item.modifierOptionIds.length > 0) {
        const allModifiers = await this.menuRepository.findModifierGroupsByIds(
          data.tenantId,
          product.modifierGroupIds
        );

        for (const modifierGroupId of product.modifierGroupIds) {
          const group = allModifiers.find((g) => g.id === modifierGroupId);
          if (!group) continue;

          const selectedOptions = group.options.filter((opt) => item.modifierOptionIds?.includes(opt.id));

          if (group.isRequired && selectedOptions.length === 0) {
            throw new Error(`Modifier group "${group.name}" is required for product ${product.name}`);
          }

          if (group.maxSelection && selectedOptions.length > group.maxSelection) {
            throw new Error(
              `Too many options selected for modifier group "${group.name}". Max: ${group.maxSelection}`
            );
          }

          for (const option of selectedOptions) {
            modifiersTotal += option.priceDelta;
            modifiers.push({
              groupName: group.name,
              optionName: option.name,
              priceDelta: option.priceDelta,
            });
          }
        }
      }

      const itemTotal = (itemPrice + modifiersTotal) * item.quantity;
      subtotal += itemTotal;

      const orderItemId = await this.orderRepository.createOrderItem(
        order.id,
        data.tenantId,
        product.id,
        product.name,
        product.basePrice,
        item.quantity,
        itemTotal,
        item.variationId,
        variationName,
        variationPrice,
        item.notes
      );

      for (const modifier of modifiers) {
        await this.orderRepository.createOrderItemModifier(
          orderItemId,
          data.tenantId,
          modifier.groupName,
          modifier.optionName,
          modifier.priceDelta
        );
      }
    }

    const deliveryFee = data.deliveryType === 'delivery' ? 5.0 : 0;
    const discount = data.cashbackUsed || 0;

    await this.orderRepository.updateSubtotalAndTotal(order.id, subtotal, deliveryFee, discount);

    const finalOrder = await this.orderRepository.findByPublicCode(data.tenantId, order.publicOrderCode);

    if (!finalOrder) {
      throw new Error('Failed to create order');
    }

    return finalOrder;
  }

  async getOrderByPublicCode(tenantId: string, publicOrderCode: string): Promise<OrderDTO | null> {
    return this.orderRepository.findByPublicCode(tenantId, publicOrderCode);
  }
}
