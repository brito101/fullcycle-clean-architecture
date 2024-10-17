import Address from "./domain/customer/value-object/address";
import Order from "./domain/checkout/entity/order";
import OrderItem from "./domain/checkout/entity/order_item";
import Customer from "./domain/customer/entity/customer";

let customer = new Customer("1", "John");

const address = new Address("Street 1", "123", "123456", "City");

customer.address = address;
customer.activate();

const item1 = new OrderItem("1", "1", "Item 1", 10, 2);
const item2 = new OrderItem("2", "1", "Item 2", 20, 2);
const item3 = new OrderItem("3", "1", "Item 3", 30, 2);

const order = new Order("1", "1", [item1, item2, item3]);

console.log(order.total());
