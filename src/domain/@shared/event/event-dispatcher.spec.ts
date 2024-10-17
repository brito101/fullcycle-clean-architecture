import SendConsoleLog1WhenCustomerIsCreatedHandler from "../../customer/event/handler/send-console-log1-when-customer-is-created.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../../customer/event/handler/send-console-log2-when-customer-is-created.handler";
import SendConsoleLogWhenCustomerChangeAddressHandler from "../../customer/event/handler/send-console-log-when-customer-change-address.handler";
import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-is-product-created.handler";
import EventDispatcher from "./event-dispatcher";
import CustomerCreatedEvent from "../../customer/event/customer-created.event";
import Address from "../../customer/value-object/address";
import CustomerChangeAddressEvent from "../../customer/event/customer-change-address.event";
import ProductCreatedEvent from "../../product/event/product-created.event";
import Customer from "../../customer/entity/customer";

describe("Domain event unit test", () => {
  it("should register an event handler", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new SendEmailWhenProductIsCreatedHandler();

    const eventHandler2 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler3 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const eventHandler4 = new SendConsoleLogWhenCustomerChangeAddressHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler1);

    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler3);
    eventDispatcher.register("CustomerChangeAddressEvent", eventHandler4);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(2);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length
    ).toBe(1);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler3);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(eventHandler1);
  });

  it("should unregister an event handler", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new SendEmailWhenProductIsCreatedHandler();

    const eventHandler2 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler3 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const eventHandler4 = new SendConsoleLogWhenCustomerChangeAddressHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler3);
    eventDispatcher.register("CustomerChangeAddressEvent", eventHandler4);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler3);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(eventHandler4);

    eventDispatcher.unregister("ProductCreatedEvent", eventHandler1);
    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.unregister("CustomerCreatedEvent", eventHandler3);
    eventDispatcher.unregister("CustomerChangeAddressEvent", eventHandler4);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeDefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]
    ).toBeDefined();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length
    ).toBe(0);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"].length
    ).toBe(0);
  });

  it("should unregister all event handlers", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new SendEmailWhenProductIsCreatedHandler();

    const eventHandler2 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler3 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const eventHandler4 = new SendConsoleLogWhenCustomerChangeAddressHandler();

    eventDispatcher.register("ProductCreatedEvent", eventHandler1);

    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler3);
    eventDispatcher.register("CustomerChangeAddressEvent", eventHandler4);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler3);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(eventHandler4);

    eventDispatcher.unregisterAll();

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"]
    ).toBeUndefined();
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"]
    ).toBeUndefined();
  });

  it("should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();

    const eventHandler1 = new SendEmailWhenProductIsCreatedHandler();
    const eventHandler2 = new SendConsoleLog1WhenCustomerIsCreatedHandler();
    const eventHandler3 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
    const eventHandler4 = new SendConsoleLogWhenCustomerChangeAddressHandler();

    const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
    const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");
    const spyEventHandler3 = jest.spyOn(eventHandler3, "handle");
    const spyEventHandler4 = jest.spyOn(eventHandler4, "handle");

    eventDispatcher.register("ProductCreatedEvent", eventHandler1);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler3);
    eventDispatcher.register("CustomerChangeAddressEvent", eventHandler4);

    expect(
      eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler1);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandler2);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandler3);
    expect(
      eventDispatcher.getEventHandlers["CustomerChangeAddressEvent"][0]
    ).toMatchObject(eventHandler4);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    const customer = new Customer("1", "Customer 1");
    customer.address = new Address( "Street 1", "123","City 1","123456");

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(productCreatedEvent);
    eventDispatcher.notify(customerCreatedEvent);

    customer.changeAddress(new Address( "Street 2", "456","City 2","7891011"));

    const customerChangeAddressEvent = new CustomerChangeAddressEvent(customer);

    eventDispatcher.notify(customerChangeAddressEvent);

    expect(spyEventHandler1).toHaveBeenCalled();
    expect(spyEventHandler2).toHaveBeenCalled();
    expect(spyEventHandler3).toHaveBeenCalled();
    expect(spyEventHandler4).toHaveBeenCalled();
  });
});
