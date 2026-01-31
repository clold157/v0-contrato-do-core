'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, MapPin, User, Phone, Mail, CreditCard, Banknote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useCart } from '../../context/CartContext';
import type { CreateOrderDTO } from '@/src/types/menu-online-order';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const tenantSlug = params.tenantSlug as string;
  const { items, getTotalPrice, clearCart } = useCart();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'credit' | 'debit' | 'pix' | 'cash'>('credit');

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deliveryAddress: '',
    deliveryNumber: '',
    deliveryDistrict: '',
    deliveryCity: '',
    deliveryState: '',
    deliveryZip: '',
    deliveryComplement: '',
    deliveryReference: '',
    notes: '',
  });

  const subtotal = getTotalPrice();
  const deliveryFee = deliveryType === 'delivery' ? 5.0 : 0;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData: CreateOrderDTO = {
        tenantId: '',
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? formData.deliveryAddress : undefined,
        deliveryNumber: deliveryType === 'delivery' ? formData.deliveryNumber : undefined,
        deliveryDistrict: deliveryType === 'delivery' ? formData.deliveryDistrict : undefined,
        deliveryCity: deliveryType === 'delivery' ? formData.deliveryCity : undefined,
        deliveryState: deliveryType === 'delivery' ? formData.deliveryState : undefined,
        deliveryZip: deliveryType === 'delivery' ? formData.deliveryZip : undefined,
        deliveryComplement: deliveryType === 'delivery' ? formData.deliveryComplement : undefined,
        deliveryReference: deliveryType === 'delivery' ? formData.deliveryReference : undefined,
        notes: formData.notes || undefined,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variationId: item.variationId,
          modifierOptionIds: item.modifierOptionIds,
          notes: item.notes,
        })),
      };

      const response = await fetch(`/menu/${tenantSlug}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const result = await response.json();
      const order = result.data;

      clearCart();
      router.push(`/menu/${tenantSlug}/orders/${order.publicOrderCode}`);
    } catch (error) {
      console.error('[v0] Error creating order:', error);
      alert('Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">Carrinho vazio</h2>
            <p className="text-muted-foreground text-sm">
              Adicione itens ao carrinho antes de finalizar o pedido
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href={`/menu/${tenantSlug}`}>Voltar ao cardápio</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-50 bg-card border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/menu/${tenantSlug}`}>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">Finalizar Pedido</h1>
            <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? 'item' : 'itens'}</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Tipo de Pedido</h2>
          </div>
          <RadioGroup value={deliveryType} onValueChange={(value) => setDeliveryType(value as 'delivery' | 'pickup')}>
            <div className="flex items-center justify-between border-2 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="cursor-pointer font-semibold">
                  Entrega em domicílio
                </Label>
              </div>
              <Badge>R$ 5,00</Badge>
            </div>
            <div className="flex items-center justify-between border-2 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="cursor-pointer font-semibold">
                  Retirar no local
                </Label>
              </div>
              <Badge variant="secondary">Grátis</Badge>
            </div>
          </RadioGroup>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Seus Dados</h2>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customerName">Nome completo *</Label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
                placeholder="Digite seu nome"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefone/WhatsApp *</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                value={formData.customerPhone}
                onChange={handleInputChange}
                required
                placeholder="(00) 00000-0000"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail">E-mail (opcional)</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleInputChange}
                placeholder="seu@email.com"
              />
            </div>
          </div>
        </Card>

        {deliveryType === 'delivery' && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold">Endereço de Entrega</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <Label htmlFor="deliveryAddress">Endereço *</Label>
                  <Input
                    id="deliveryAddress"
                    name="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={handleInputChange}
                    required={deliveryType === 'delivery'}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryNumber">Nº *</Label>
                  <Input
                    id="deliveryNumber"
                    name="deliveryNumber"
                    value={formData.deliveryNumber}
                    onChange={handleInputChange}
                    required={deliveryType === 'delivery'}
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="deliveryDistrict">Bairro *</Label>
                  <Input
                    id="deliveryDistrict"
                    name="deliveryDistrict"
                    value={formData.deliveryDistrict}
                    onChange={handleInputChange}
                    required={deliveryType === 'delivery'}
                    placeholder="Centro"
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryCity">Cidade *</Label>
                  <Input
                    id="deliveryCity"
                    name="deliveryCity"
                    value={formData.deliveryCity}
                    onChange={handleInputChange}
                    required={deliveryType === 'delivery'}
                    placeholder="São Paulo"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="deliveryState">Estado *</Label>
                  <Input
                    id="deliveryState"
                    name="deliveryState"
                    value={formData.deliveryState}
                    onChange={handleInputChange}
                    required={deliveryType === 'delivery'}
                    placeholder="SP"
                    maxLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryZip">CEP *</Label>
                  <Input
                    id="deliveryZip"
                    name="deliveryZip"
                    value={formData.deliveryZip}
                    onChange={handleInputChange}
                    required={deliveryType === 'delivery'}
                    placeholder="00000-000"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="deliveryComplement">Complemento</Label>
                <Input
                  id="deliveryComplement"
                  name="deliveryComplement"
                  value={formData.deliveryComplement}
                  onChange={handleInputChange}
                  placeholder="Apto, Bloco, Casa..."
                />
              </div>
              <div>
                <Label htmlFor="deliveryReference">Ponto de referência</Label>
                <Input
                  id="deliveryReference"
                  name="deliveryReference"
                  value={formData.deliveryReference}
                  onChange={handleInputChange}
                  placeholder="Próximo ao..."
                />
              </div>
            </div>
          </Card>
        )}

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Forma de Pagamento</h2>
          </div>
          <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as typeof paymentMethod)}>
            {['credit', 'debit', 'pix', 'cash'].map((method) => (
              <div key={method} className="flex items-center border-2 rounded-xl p-4 hover:border-primary transition-colors cursor-pointer">
                <RadioGroupItem value={method} id={method} />
                <Label htmlFor={method} className="ml-3 cursor-pointer font-semibold flex-1">
                  {method === 'credit' && 'Cartão de Crédito'}
                  {method === 'debit' && 'Cartão de Débito'}
                  {method === 'pix' && 'PIX'}
                  {method === 'cash' && 'Dinheiro na Entrega'}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </Card>

        <Card className="p-6 space-y-4">
          <div>
            <Label htmlFor="notes">Observações do Pedido</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Alguma observação sobre o pedido?"
              rows={3}
              className="resize-none"
            />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-bold">Resumo do Pedido</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold">R$ {subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taxa de entrega</span>
              <span className="font-semibold">R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <Button type="submit" size="lg" className="w-full h-14 text-base font-bold" disabled={isSubmitting}>
          {isSubmitting ? 'Finalizando...' : `Confirmar Pedido • R$ ${total.toFixed(2)}`}
        </Button>
      </form>
    </div>
  );
}
