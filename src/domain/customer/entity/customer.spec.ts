import Address from "../value-object/address";
import Customer from "./customer";

describe("Customer unit test", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Customer("", "John")).toThrow("customer: Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => new Customer("1", "")).toThrow("customer: Name is required");
  });

  it("should throw error when id and name are empty", () => {
    expect(() => {
      let customer = new Customer("", "");
    }).toThrow("customer: Id is required,customer: Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("1", "John");
    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should activate a customer", () => {
    const customer = new Customer("1", "John");
    const address = new Address("Street 1", "123", "123456", "City");
    customer.address = address;
    customer.activate();
    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate a customer", () => {
    const customer = new Customer("1", "John");
    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });

  it("should throw error when address is undefined when you activate a customer", () => {
    const customer = new Customer("1", "John");
    expect(() => customer.activate()).toThrow(
      "Address is required to activate a customer"
    );
  });

  it("should add reward points", () => {
    const customer = new Customer("1", "John");
    expect(customer.rewardPoints).toBe(0);
    customer.addRewardPoints(5);
    expect(customer.rewardPoints).toBe(5);
    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(15);
  });
});
