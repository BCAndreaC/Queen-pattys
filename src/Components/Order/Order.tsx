import { MenuBtn, FoodItems, Client, OrderSum } from "./Order.components.tsx";
import { useEffect, useState } from "react";
import { Logo } from "../Login/Login.components.tsx";
import { fetchProducts } from "../../Services/products.tsx";
import { Navbar } from "../Navbar/Navbar.tsx";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Order() {
  const [products, setProducts] = useState([]);
  const [counters, setCounters] = useState<{ [key: string]: number }>({});
  const [selectedClient, setSelectedClient] = useState("");
  const [category, setCategory] = useState("Desayuno");
  const notifyToDeliver = () => toast.success('Pedido enviado a cocina');
  const handleOrderSubmit = () => {
    setCounters({});
    notifyToDeliver();
  };
  const menuItems = products;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (localStorage.getItem("token") === null) {
      navigate("/");
    }
  };

  const handleDelivers = () => {
      navigate("/delivers");
  };
  
  
  useEffect(() => {
    fetchProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error("Error setting products:", error);
      });
  }, []);

  return (
    <>
    <Navbar handleLogout={handleLogout} handleDelivers={handleDelivers}></Navbar>
    <section className=" bg-gunMetal min-h-screen min-w-fit flex flex-col items-center pt-10 ">
      <Logo></Logo>
      <ToastContainer
          theme="dark"
          toastClassName={() => "flex bg-blackInput p-4 rounded justify-between border-2 border-kitchenText"}
          bodyClassName={() => "flex flex-row text-kitchenText items-center"}
          hideProgressBar
        />
      <div className="flex justify-center items-center w-4/6 md:w-4/5 lg:w-3/5 mt-10">
        <MenuBtn meals={['Desayuno', 'Almuerzo']} setCategory={setCategory}></MenuBtn>  
      </div>
      <div className="grid grid-cols-[60%,40%] md:w-4/5 lg:w-3/5">
        <div>
          <FoodItems
            items={menuItems}
            counters={counters}
            setCounters={setCounters}
            category={category}
          ></FoodItems>
        </div>
        <div className="grid grid-rows-[0.2fr,1fr]">
          <Client setSelectedClient={setSelectedClient}></Client>
          <OrderSum
            counters={counters}
            menuItems={menuItems}
            selectedClient={selectedClient}
            onOrderSubmit={handleOrderSubmit}
          ></OrderSum>
        </div>
      </div>
    </section>
    </>
  );
}

export { Order };
