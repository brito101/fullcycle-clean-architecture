import Order from "./order";
import Product from "../../product/entity/product";
import OrderItem from "./order_item";

describe("Order unit test", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Order("", "1", [])).toThrow("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => new Order("1", "", [])).toThrow("CustomerId is required");
  });

  it("should throw error when items are empty", () => {
    expect(() => new Order("1", "1", [])).toThrow("Items are required");
  });

  it("should calculate total", () => {
    const product = new Product("1", "Product 1", 10);

    const item1 = new OrderItem("1", product.id, "Item 1", 10, 1);
    const item2 = new OrderItem("2", product.id, "Item 2", 20, 2);

    const order1 = new Order("1", "1", [item1]);

    let total = order1.total();
    expect(total).toBe(10);

    const order2 = new Order("2", "1", [item1, item2]);

    total = order2.total();
    expect(total).toBe(50);
  });

  it("should throw error if the items quantity is greater than zero", () => {
    expect(() => {
      const product = new Product("1", "Product 1", 10);
      const item = new OrderItem("1", product.id, "Item 1", 10, 0);
      const order = new Order("1", "1", [item]);
    }).toThrow("Quantity must be greater than zero");
  });
});
