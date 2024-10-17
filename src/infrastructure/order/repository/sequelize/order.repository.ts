import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";

import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    const currentOrderItems = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    // Extrai os IDs dos itens que estão no objeto `entity`
    const newOrderItemIds = entity.items.map((item) => item.id);

    // Remove os itens que estão no banco de dados, mas não estão mais no `entity`
    for (const currentItem of currentOrderItems) {
      if (!newOrderItemIds.includes(currentItem.id)) {
        await OrderItemModel.destroy({ where: { id: currentItem.id } });
      }
    }

    // Atualiza ou cria os itens do pedido
    for (const item of entity.items) {
      const orderItem = await OrderItemModel.findOne({
        where: { id: item.id },
      });
      if (orderItem) {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            product_id: item.productId,
          },
          { where: { id: item.id } }
        );
      } else {
        await OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        });
      }
    }

    // Atualiza o pedido principal
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total(),
      },
      { where: { id: entity.id } }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: ["items"],
    });

    if (!orderModel) {
      throw new Error("Order not found");
    }

    const orderItems = orderModel.items.map((item) => {
      return new OrderItem(
        item.id,
        item.product_id,
        item.name,
        item.price,
        item.quantity
      );
    });

    return new Order(orderModel.id, orderModel.customer_id, orderItems);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ["items"] });
    return orderModels.map((orderModel) => {
      const orderItems = orderModel.items.map((item) => {
        return new OrderItem(
          item.id,
          item.product_id,
          item.name,
          item.price,
          item.quantity
        );
      });
      return new Order(orderModel.id, orderModel.customer_id, orderItems);
    });
  }
}
