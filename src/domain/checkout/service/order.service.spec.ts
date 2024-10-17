
import Customer from "../../customer/entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order.service";

describe("Order service unit test", () => {
  it("should place an order", () => {
    const customer = new Customer("1", "John");
    const item1 = new OrderItem("1", "1", "Item 1", 10, 2);
    const item2 = new OrderItem("2", "1", "Item 2", 20, 2);

    const order = OrderService.placeOrder(customer, [item1, item2]);
    expect(customer.rewardPoints).toBe(30);

    expect(order.total()).toBe(60);
  });

  it("should get total of all orders", () => {
    const item1 = new OrderItem("1", "1", "Item 1", 10, 2);
    const item2 = new OrderItem("2", "1", "Item 2", 20, 2);

    const order1 = new Order("1", "1", [item1, item2]);
    const order2 = new Order("2", "1", [item1]);
    const order3 = new Order("3", "1", [item2]);

    const total = OrderService.total([order1, order2, order3]);
    expect(total).toBe(120);
  });
});
