import { postOrders } from "../../Services/orders.tsx";

function MenuBtn({ meals, setCategory }: { meals: string[]; setCategory: (menu: string) => void}) {
  return (
    <>
      {meals.map(
        (
          menu 
        ) => (
          <ul
            key={menu}
            onClick={() => setCategory(menu)}
            className="bg-blackBtn rounded-3xl w-full h-20 flex justify-evenly items-center m-3 border-2 border-amber-200 hover:cursor-pointer active:bg-amber-200 active:text-blackBtn"
          >
            {menu === "Desayuno" && (
              <img className="w-16" src="src\assets\breakfast.png"></img>
            )}
            {menu === "Almuerzo" && (
              <img className="w-16" src="src\assets\lunch.png"></img>
            )}
            <li className="text-xl" key={menu}>
              {menu}
            </li>
          </ul>
        )
      )}
    </>
  );
}

interface MenuItem {
  name: string;
  price: number;
  id: number;
  type: string;
}

interface MenuItems {
  items: MenuItem[];
  counters: { [key: string]: number };
  setCounters: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
  category: string;
}

interface ClientProps {
  setSelectedClient: React.Dispatch<React.SetStateAction<string>>;
}

function FoodItems({ items, counters, setCounters, category }: MenuItems) {

  const handleDecrement = (itemName: string) => {
    if (counters[itemName] > 0) {
      setCounters((prevCounters) => ({
        // actualiza el estado de counters. Se utiliza una fx como argumento, que recibe el estado anterior
        ...prevCounters, // operador de propagación para copiar todos los pares clave-valor del estado anterior en un nuevo objeto
        [itemName]: prevCounters[itemName] - 1, // crea o actualiza una propiedad en el nuevo objeto utilizando el nombre del elemento como clave y resta 1 al valor del contador para el elemento específico
      }));
    }
  };
  const handleIncrement = (itemName: string) => {
    setCounters((prevCounters) => ({
      ...prevCounters,
      [itemName]: prevCounters[itemName] ? prevCounters[itemName] + 1 : 1,
    }));
  };

  const filteredItems = items.filter((item) => item.type === category);

  // const breakfastItems = items.filter((item) => item.type === "Desayuno");
  // const lunchItems = items.filter((item) => item.type === "Almuerzo");

  return (
    <>
      {filteredItems.map((item) => (
        <ul
          className="bg-blackBtn rounded-3xl w-84 h-32 flex flex-col justify-evenly items-start m-3 p-6 border-2 border-pink-400 text-xl"
          key={item.name}
        >
          <li className="font-medium text-xl">
            {item.name} {/* Nombre del platillo */}
          </li>
          <div className="flex justify-between w-full">
            <li className="font-light">
              S./{item.price} {/* Precio del platillo */}
            </li>

            <div className="flex justify-between w-1/4 font-medium text-xl">
              <button onClick={() => handleDecrement(item.name)}>-</button>

              <span>{counters[item.name] || 0}</span>

              <button onClick={() => handleIncrement(item.name)}>+</button>
            </div>
          </div>
        </ul>
      ))}    
    </>
  );
}

function Client({ setSelectedClient }: ClientProps) {
  const handleClient = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClient(event.target.value);
  };

  return (
    <select
      name="mesas"
      id="mesas"
      onChange={handleClient}
      className="bg-blackBtn border-2 border-cyan-300 rounded-2xl text-lg m-4 py-2 p-2"
    >
      <option className="text-sm " value="NO CLIENT">Selecciona una mesa</option>
      <option className="text-sm " value="mesa1">Mesa 1</option>
      <option className="text-sm " value="mesa2">Mesa 2</option>
    </select>
  );
}

function OrderSum({
  counters,
  menuItems,
  selectedClient,
  onOrderSubmit,
} : {
  counters: { [key: string]: number };
  menuItems: MenuItem[];
  selectedClient: string;
  onOrderSubmit: () => void;
}) {
  let totalPriceSum = 0;
  const filteredItems = Object.entries(counters).filter(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, count]) => count > 0
  );
  const handleOrder = () => {
    const order = {
      client: selectedClient, // recuperar de seleccion de mesa
      id: "",
      products: filteredItems.map(([itemName, qty]) => {
        const menuItem = menuItems.find((item) => item.name === itemName);
        return {
          qty: qty,
          product: {
            id: menuItem?.id, // obtener id de la API
            name: itemName,
            price: menuItem?.price, // obtener precio de la API
            type: menuItem?.type, // obtener de la API
            dataEntry: new Date().toLocaleString(),
          },
        };
      }),
      status: "pending",
      dataEntry: new Date().toLocaleTimeString(),
    };

    postOrders(order)
      .then((request) => {
        onOrderSubmit();
        return request;
      })
      .catch((error) =>
        console.error("Los productos no pudieron enviarse", error)
      );
  };

  return (
    <ol className="bg-blackBtn border-2 border-cyan-300 rounded-2xl text-xl m-4 text-justify font-medium">
      <li className="text-center font-medium mt-3">RESUMEN</li>

      {filteredItems.map(([itemName, count]) => {
        const item = menuItems.find((menuItem) => menuItem.name === itemName);
        const totalPrice = item ? item.price * count : 0;
        totalPriceSum += totalPrice;

        return (
          <li
            key={itemName}
            className="font-normal text-left m-3 grid grid-cols-[4fr,1fr]"
          >
            {itemName}
            <span className="font-light text-right">x{count}</span>
            <span className="font-normal">${totalPrice.toFixed(2)}</span>
            <br />
            <br />
          </li>
        );
      })}

      <p className="text-left m-3">
        TOTAL <br /> ${totalPriceSum.toFixed(2)}
      </p>
      <button
        className="bg-celadon text-gunMetal mx-auto block w-fit rounded-md px-3 py-1.5 font-semibold shadow-sm sm:leading-7 my-6"
        type="button"
        onClick={handleOrder}
        data-testid="post-order-btn"
      >
        Enviar a cocina
      </button>
    </ol>
  );
}

export { MenuBtn, FoodItems, Client, OrderSum };

