import { Sequelize } from "sequelize-typescript";

import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import OrderItemModel from "./order-item.model";
import ProductModel from "../../../product/repository/sequelize/product.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import Address from "../../../../domain/customer/value-object/address";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import Product from "../../../../domain/product/entity/product";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";
import Customer from "../../../../domain/customer/entity/customer";
import OrderRepository from "./order.repository";
import OrderModel from "./order.model";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", "1", "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order = new Order("1", "1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "1",
          product_id: "1",
        },
      ],
    });
  });

  it("should update a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", "1", "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order = new Order("1", "1", [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    //Primeira modificação, acrescentando mais um item
    const orderItem2 = new OrderItem(
      "2",
      product.id,
      product.name,
      product.price,
      2
    );

    order.changeItems([orderItem1, orderItem2]);

    await orderRepository.update(order);
    const orderModel2 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel2.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: "1",
          product_id: "1",
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          order_id: "1",
          product_id: "1",
        },
      ],
    });

    //Segunda modificação, removendo dois itens e adicionando um novo item
    const orderItem3 = new OrderItem(
      "3",
      product.id,
      product.name,
      product.price,
      4
    );

    order.changeItems([orderItem3]);

    await orderRepository.update(order);
    const orderModel3 = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel3.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem3.id,
          name: orderItem3.name,
          price: orderItem3.price,
          quantity: orderItem3.quantity,
          order_id: "1",
          product_id: "1",
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", "1", "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order = new Order("1", "1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    const foundOrder = await orderRepository.find(orderModel.id);

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      items: foundOrder.items.map((item) => ({
        id: item.id,
        name: item.name,
        order_id: foundOrder.id,
        price: item.price,
        product_id: item.productId,
        quantity: item.quantity,
      })),
      total: foundOrder.total(),
    });
  });

  it("should find all orders", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", "1", "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("1", "Product 1", 10);
    await productRepository.create(product);

    const orderItem1 = new OrderItem(
      "1",
      product.id,
      product.name,
      product.price,
      2
    );

    const order1 = new Order("1", "1", [orderItem1]);

    const orderItem2 = new OrderItem(
      "2",
      product.id,
      product.name,
      product.price,
      2
    );

    const order2 = new Order("2", "1", [orderItem2]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order1, order2];

    expect(orders).toEqual(foundOrders);
  });
});
