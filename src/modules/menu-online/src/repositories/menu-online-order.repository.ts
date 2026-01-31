import { PrismaClient } from '@prisma/client';
import type { CreateOrderDTO, OrderDTO, OrderItemDTO, OrderItemModifierDTO } from '@/src/types/menu-online-order';

export class MenuOnlineOrderRepository {
  constructor(private prisma: PrismaClient) {}

  private generateOrderCode(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${timestamp}-${random}`;
  }

  async create(data: CreateOrderDTO): Promise<OrderDTO> {
    const publicOrderCode = this.generateOrderCode();

    const order = await this.prisma.menuOnlineOrder.create({
      data: {
        tenantId: data.tenantId,
        publicOrderCode,
        status: 'pending',
        subtotal: 0,
        discount: data.cashbackUsed || 0,
        cashbackUsed: data.cashbackUsed || 0,
        deliveryFee: 5.0,
        total: 0,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail || null,
        deliveryType: data.deliveryType,
        deliveryAddress: data.deliveryAddress || null,
        deliveryDistrict: data.deliveryDistrict || null,
        deliveryCity: data.deliveryCity || null,
        deliveryState: data.deliveryState || null,
        deliveryZip: data.deliveryZip || null,
        deliveryNumber: data.deliveryNumber || null,
        deliveryComplement: data.deliveryComplement || null,
        deliveryReference: data.deliveryReference || null,
        notes: data.notes || null,
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            modifiers: true,
          },
        },
      },
    });

    return this.mapToDTO(order);
  }

  async findByPublicCode(tenantId: string, publicOrderCode: string): Promise<OrderDTO | null> {
    const order = await this.prisma.menuOnlineOrder.findUnique({
      where: {
        tenantId_publicOrderCode: {
          tenantId,
          publicOrderCode,
        },
      },
      include: {
        items: {
          include: {
            modifiers: true,
          },
        },
      },
    });

    return order ? this.mapToDTO(order) : null;
  }

  async updateSubtotalAndTotal(orderId: string, subtotal: number, deliveryFee: number, discount: number): Promise<void> {
    const total = subtotal + deliveryFee - discount;
    await this.prisma.menuOnlineOrder.update({
      where: { id: orderId },
      data: {
        subtotal,
        deliveryFee,
        discount,
        total,
        updatedAt: new Date(),
      },
    });
  }

  async createOrderItem(
    orderId: string,
    tenantId: string,
    productId: string,
    nameSnapshot: string,
    basePrice: number,
    quantity: number,
    total: number,
    variationId?: string | null,
    variationName?: string | null,
    variationPrice?: number | null,
    notes?: string | null
  ): Promise<string> {
    const orderItem = await this.prisma.menuOnlineOrderItem.create({
      data: {
        orderId,
        tenantId,
        productId,
        nameSnapshot,
        basePrice,
        quantity,
        total,
        variationId: variationId || null,
        variationName: variationName || null,
        variationPrice: variationPrice || null,
        notes: notes || null,
      },
    });

    return orderItem.id;
  }

  async createOrderItemModifier(
    orderItemId: string,
    tenantId: string,
    modifierName: string,
    optionName: string,
    priceDelta: number
  ): Promise<void> {
    await this.prisma.menuOnlineOrderItemModifier.create({
      data: {
        orderItemId,
        tenantId,
        modifierName,
        optionName,
        priceDelta,
      },
    });
  }

  private mapToDTO(order: unknown): OrderDTO {
    const o = order as {
      id: string;
      publicOrderCode: string;
      status: string;
      subtotal: number;
      discount: number;
      cashbackUsed: number;
      deliveryFee: number;
      total: number;
      customerName: string;
      customerPhone: string;
      customerEmail: string | null;
      deliveryType: string;
      deliveryAddress: string | null;
      deliveryDistrict: string | null;
      deliveryCity: string | null;
      deliveryState: string | null;
      deliveryZip: string | null;
      deliveryNumber: string | null;
      deliveryComplement: string | null;
      deliveryReference: string | null;
      notes: string | null;
      createdAt: Date;
      updatedAt: Date;
      items: {
        id: string;
        productId: string;
        nameSnapshot: string;
        basePrice: number;
        variationId: string | null;
        variationName: string | null;
        variationPrice: number | null;
        quantity: number;
        total: number;
        notes: string | null;
        modifiers: {
          id: string;
          modifierName: string;
          optionName: string;
          priceDelta: number;
        }[];
      }[];
    };

    return {
      id: o.id,
      publicOrderCode: o.publicOrderCode,
      status: o.status as OrderStatus,
      subtotal: o.subtotal,
      discount: o.discount,
      cashbackUsed: o.cashbackUsed,
      deliveryFee: o.deliveryFee,
      total: o.total,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      customerEmail: o.customerEmail,
      deliveryType: o.deliveryType as OrderDeliveryType,
      deliveryAddress: o.deliveryAddress,
      deliveryDistrict: o.deliveryDistrict,
      deliveryCity: o.deliveryCity,
      deliveryState: o.deliveryState,
      deliveryZip: o.deliveryZip,
      deliveryNumber: o.deliveryNumber,
      deliveryComplement: o.deliveryComplement,
      deliveryReference: o.deliveryReference,
      notes: o.notes,
      items: o.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        nameSnapshot: item.nameSnapshot,
        basePrice: item.basePrice,
        variationId: item.variationId,
        variationName: item.variationName,
        variationPrice: item.variationPrice,
        quantity: item.quantity,
        total: item.total,
        notes: item.notes,
        modifiers: item.modifiers.map((mod) => ({
          id: mod.id,
          modifierName: mod.modifierName,
          optionName: mod.optionName,
          priceDelta: mod.priceDelta,
        })),
      })),
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    };
  }
}
