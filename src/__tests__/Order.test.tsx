import { Order } from "../Components/Order/Order";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import userEvent from "@testing-library/user-event";

import { postOrders } from "../Services/orders";

const localStorageMock = (function () {
  const store: { [key: string]: string } = {};

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const navigateMock = jest.fn();
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: () => navigateMock,
}));

function mockProductsRes(body: object): Response {
  return {
    json: () => Promise.resolve(body),
  } as Response;
}

describe("Order", () => {
  it("Renderiza el componente Order", () => {
    expect(Order).toBeTruthy();
  });

  it("Fetches the products from the API.", () => {
    const jsonBody = {
      products: [
        {
          id: 1,
          name: "Café americano",
          price: 1000,
          type: "Desayuno",
          dateEntry: "2022-03-05 15:14:10",
        },
      ],
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve());
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.resolve(mockProductsRes(jsonBody)));
    // the param expected is a valid Response object, however, Response is not global in Node nor JSDOM, so we have to mock it

    render(
      <MemoryRouter>
        <Order></Order>
      </MemoryRouter>
    );

    setTimeout(() => {
      expect(screen.getByText("Café americano")).toBeInTheDocument();
    }, 5000);

    // TypeError: items.map is not a function y no se encuentra el texto en el DOM: ¿se está tardando en renderizar?
  });

  it("posts the order in an object with keys of client, id, status, dataEntry and products, which is an array of objects of the products.", () => {
    const user = userEvent.setup();
    const jsonBody = {
      userId: 15254,
      client: "Carol Shaw",
      products: [
        {
          qty: 5,
          product: {
            id: 1214,
            name: "Sandwich de jamón y queso",
            price: 1000,
            type: "Desayuno",
            dateEntry: "2022-03-05 15:14:10",
          },
        },
      ],
      status: "pending",
      dateEntry: "2022-03-05 15:14:10",
    };

    global.fetch = jest.fn().mockImplementation(() => Promise.resolve());
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.resolve(mockProductsRes(jsonBody)));

    render(
      <MemoryRouter>
        <Order/>
      </MemoryRouter>
    )

    const postBtn = screen.getByTestId('post-order-btn');
    user.click(postBtn);

  });
});

describe("handleLogout", () => {
  it("should remove the token when clicking in the logout button", () => {
    localStorage.setItem("token", "test-token");
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Order />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByTestId("logout-btn");
    user.click(logoutBtn);

    setTimeout(() => {
      expect(localStorageMock.getItem("token")).toBeNull();
      expect(navigateMock).toHaveBeenCalledWith("/");
      expect(navigateMock).toBeCalledTimes(1);
    }, 1000);
  });

  it('must post the order in the API when clicking the button Enviar a cocina', () => {
    jest.mock('../Services/orders', () => ({
      postOrders: jest.fn(() => Promise.resolve({ data: {}}))
    }))
  
    render(
      <MemoryRouter>
        <Order/>
      </MemoryRouter>
    )
    const postOrderBtn = screen.getByTestId('post-order-btn');
    fireEvent.click(postOrderBtn);

    const mockOrder = {
      client: 'selectedClient',
      id: 1,
      products: [
        { qty: 2, product: { id: 1, name: 'Item 1', price: 10, type: 'type1', dataEntry: expect.any(String) } },
        { qty: 1, product: { id: 2, name: 'Item 2', price: 20, type: 'type2', dataEntry: expect.any(String) } },
      ],
      status: 'pending',
      dataEntry: expect.any(String),
    }

    expect(postOrders).toHaveBeenCalledWith(mockOrder);
  })
});
