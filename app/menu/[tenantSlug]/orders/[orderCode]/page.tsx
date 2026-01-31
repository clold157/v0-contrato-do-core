'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Clock, Package, Bike, Check, MapPin, User, Phone, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { OrderDTO } from '@/src/types/menu-online-order';

export default function OrderConfirmationPage() {
  const params = useParams();
  const tenantSlug = params.tenantSlug as string;
  const orderCode = params.orderCode as string;

  const [order, setOrder] = useState<OrderDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/menu/${tenantSlug}/orders/${orderCode}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const result = await response.json();
        setOrder(result.data);
      } catch (err) {
        console.error('[v0] Error fetching order:', err);
        setError('Pedido não encontrado');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [tenantSlug, orderCode]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Carregando pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 mx-auto flex items-center justify-center">
            <Package className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Pedido não encontrado</h2>
            <p className="text-muted-foreground text-sm">
              O pedido que você está procurando não existe ou foi cancelado
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href={`/menu/${tenantSlug}`}>Voltar ao cardápio</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Pedido Recebido', icon: CheckCircle2 },
    { key: 'confirmed', label: 'Confirmado', icon: Check },
    { key: 'preparing', label: 'Em Preparo', icon: Package },
    { key: 'ready', label: 'Pronto', icon: Clock },
    ...(order.deliveryType === 'delivery' ? [{ key: 'in_delivery', label: 'Em Entrega', icon: Bike }] : []),
    { key: 'completed', label: 'Concluído', icon: CheckCircle2 },
  ];

  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'confirmed':
      case 'preparing':
        return 'bg-primary text-primary-foreground';
      case 'ready':
      case 'in_delivery':
        return 'bg-primary text-primary-foreground';
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'cancelled':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'Aguardando Confirmação';
      case 'confirmed':
        return 'Confirmado';
      case 'preparing':
        return 'Em Preparo';
      case 'ready':
        return 'Pronto para Retirada';
      case 'in_delivery':
        return 'Saiu para Entrega';
      case 'completed':
        return 'Pedido Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card className="p-6 text-center space-y-4 border-success">
          <div className="w-20 h-20 rounded-full bg-success/10 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Pedido Realizado!</h1>
            <p className="text-muted-foreground">Seu pedido foi recebido com sucesso</p>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Código do Pedido:</span>
            <span className="text-lg font-bold">{order.publicOrderCode}</span>
          </div>
          <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-bold">Acompanhe seu Pedido</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.key} className="flex items-start gap-4">
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isCompleted
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    {index < statusSteps.length - 1 && (
                      <div
                        className={`absolute top-10 left-5 w-0.5 h-8 ${
                          isCompleted ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pt-2">
                    <p className={`font-semibold ${isCurrent ? 'text-primary' : ''}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Status atual do seu pedido
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Itens do Pedido</h2>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold">
                    {item.quantity}x {item.nameSnapshot}
                  </p>
                  {item.variationName && (
                    <p className="text-sm text-muted-foreground">{item.variationName}</p>
                  )}
                  {item.modifiers.length > 0 && (
                    <ul className="text-sm text-muted-foreground mt-1">
                      {item.modifiers.map((mod) => (
                        <li key={mod.id}>
                          + {mod.optionName}
                          {mod.priceDelta > 0 && ` (R$ ${mod.priceDelta.toFixed(2)})`}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.notes && (
                    <p className="text-sm text-muted-foreground italic mt-1">
                      Obs: {item.notes}
                    </p>
                  )}
                </div>
                <span className="font-semibold text-nowrap">
                  R$ {item.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">R$ {order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de entrega</span>
              <span className="font-semibold">R$ {order.deliveryFee.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm text-success">
                <span>Desconto</span>
                <span className="font-semibold">- R$ {order.discount.toFixed(2)}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">
                R$ {order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Detalhes do Pedido</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-semibold">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Contato</p>
                <p className="font-semibold">{order.customerPhone}</p>
              </div>
            </div>
            {order.deliveryType === 'delivery' && order.deliveryAddress && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Endereço de Entrega</p>
                  <p className="font-semibold">
                    {order.deliveryAddress}, {order.deliveryNumber}
                  </p>
                  {order.deliveryComplement && (
                    <p className="text-sm">{order.deliveryComplement}</p>
                  )}
                  <p className="text-sm">
                    {order.deliveryDistrict} - {order.deliveryCity}/{order.deliveryState}
                  </p>
                  <p className="text-sm">CEP: {order.deliveryZip}</p>
                  {order.deliveryReference && (
                    <p className="text-sm text-muted-foreground italic mt-1">
                      Referência: {order.deliveryReference}
                    </p>
                  )}
                </div>
              </div>
            )}
            {order.deliveryType === 'pickup' && (
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Tipo de Entrega</p>
                  <p className="font-semibold">Retirada no Local</p>
                </div>
              </div>
            )}
            {order.notes && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Observações</p>
                <p className="text-sm">{order.notes}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="space-y-3">
          <Button asChild className="w-full" size="lg">
            <Link href={`/menu/${tenantSlug}`}>Fazer Novo Pedido</Link>
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Guarde este código para acompanhar seu pedido:{' '}
            <span className="font-bold">{order.publicOrderCode}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
