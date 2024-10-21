import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for customer", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a customer", async () => {
    const response = await request(app)
      .post("/customer")
      .send({
        name: "Customer 1",
        address: {
          street: "Street",
          city: "City",
          number: "1",
          zipcode: "Zipcode",
        },
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Customer 1");
    expect(response.body.address.street).toBe("Street");
    expect(response.body.address.city).toBe("City");
    expect(response.body.address.number).toBe("1");
    expect(response.body.address.zipcode).toBe("Zipcode");
  });

  it("should not create a customer", async () => {
    const response = await request(app).post("/customer").send({
      name: "Customer 1",
    });

    expect(response.status).toBe(500);
  });

  it("should list all customers", async () => {
    const response1 = await request(app)
      .post("/customer")
      .send({
        name: "Customer 1",
        address: {
          street: "Street 1",
          city: "City 1",
          number: "1",
          zipcode: "Zipcode 1",
        },
      });

    expect(response1.status).toBe(200);

    const response2 = await request(app)
      .post("/customer")
      .send({
        name: "Customer 2",
        address: {
          street: "Street 2",
          city: "City 2",
          number: "2",
          zipcode: "Zipcode 2",
        },
      });

    expect(response2.status).toBe(200);

    const listResponse = await request(app).get("/customer").send();

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.customers.length).toBe(2);

    const customer1 = listResponse.body.customers[0];
    expect(customer1.name).toBe("Customer 1");
    expect(customer1.address.street).toBe("Street 1");

    const customer2 = listResponse.body.customers[1];
    expect(customer2.name).toBe("Customer 2");
    expect(customer2.address.street).toBe("Street 2");
  });
});
