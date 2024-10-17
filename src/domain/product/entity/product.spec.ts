import Product from "./product";

describe("Product unit test", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Product("", "Product 1", 10)).toThrow("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => new Product("1", "", 10)).toThrow("Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => new Product("1", "Product 1", -1)).toThrow(
      "Price must be greater than zero"
    );
  });

  it("should change name", () => {
    const product = new Product("1", "Product 1", 10);
    product.changeName("Product 2");
    expect(product.name).toBe("Product 2");
  });

  it("should change price", () => {
    const product = new Product("1", "Product 1", 10);
    product.changePrice(20);
    expect(product.price).toBe(20);
  })
});
