import { Logo } from "../Login/Login.components.tsx";
import { getOrders, patchDelivers } from "../../Services/orders.tsx";
import { useState, useEffect, Fragment, useRef } from "react";
import { Dialog, Transition} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";
import { DeliversNavbar } from "../Navbar/DeliversNavbar.tsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Order {
  id: number;
  client: string;
  status: string;
  dataEntry: string;
  products: {
    qty: number;
    product: {
      name: string;
      price: number;
      type: string;
      dataEntry: string;
    };
  }[];
}

function Modal({
  selectedOrderID,
  onClose,
  onCompleted,
}: {
  selectedOrderID: number;
  onClose: () => void;
  onCompleted: (orderID: number) => void;
}) {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open && selectedOrderID !== null} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gunMetal text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-gunMetal px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-kitchenText"
                      >
                        Confirmación
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-white">
                          ¿Confirmas que el pedido ha sido entregado?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gunMetal px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-greenConfirm px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={() => {
                      onCompleted(selectedOrderID);
                      onClose();
                    }}
                  >
                    Confirmar
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto mr-6 outline outline-1 outline-red-600"                    
                    onClick={() => onClose()}
                    ref={cancelButtonRef}
                  >
                    Cancelar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export function Delivers() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderID, setSelectedOrderID] = useState<number | null>(null);
  const kitchenOrders = orders.filter((o) => o.status === "Delivering");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (localStorage.getItem("token") === null) {
      navigate("/");
    }
  };
  const notifyDelivered = () => toast.success('Pedido entregado');

  function handleOrders() {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("ERROR DE GET ORDERS", error);
      });
  }

  function handleOrderCompleted(orderID: number) {
    patchDelivers(orderID)
      .then(() => {
        handleOrders();
        notifyDelivered();
      })
      .catch((error) => {
        console.error("ERROR DE PATCH ORDERS", error);
      });
  }

  function returns(){
    navigate('/order')
  }

  useEffect(() => {
    handleOrders();
  }, []);

  return (
    <>
      <DeliversNavbar handleLogout={handleLogout} returns={returns} />
      <section className="flex flex-col justify-evenly items-start bg-gunMetal min-h-screen min-w-fit max-w-screen">
        <Logo />
        <ToastContainer
          theme="dark"
          toastClassName={() => "flex bg-blackInput p-4 rounded justify-between border-2 border-kitchenText"}
          bodyClassName={() => "flex flex-row text-kitchenText items-center"}
          hideProgressBar
        />
        <section className="block mx-auto mt-6 md:w-4/5 lg:w-3/4 xl:w-2/3 2xl:w-3/5">
          {kitchenOrders.map((order) => (
          <div key={order.id}>
            <div className="bg-blackInput rounded-3xl p-4 w-full outline outline-1 outline-celadon">
              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-2xl font-medium text-kitchenText">
                    <h3>
                      <a href="#">Orden ID: {order.id}</a>
                    </h3>
                    <p className="ml-4 text-yellowTimer text-lg">
                      Hora de pedido: {order.dataEntry}
                    </p>
                  </div>
                </div>
                {/* empieza mapeo para insertar name ?? */}
                {order.products.map((element, index) => (
                  <div
                    className="flex flex-1 items-end justify-between text-sm"
                    key={index}
                  >
                    <p className="mt-1 text-xl text-kitchenText font-light">
                      {element.product.name} x{element.qty}
                    </p>
                  </div>
                ))}
                {/* termina para insertar qty */}
              </div>

              <div className="flex flex-row-reverse ">
                <button
                  type="button"
                  className="font-medium text-xl text-gunMetal rounded-md bg-celadon p-2 shadow-md shadow-slate-900 hover:bg-gray-100 mt-4"
                  onClick={() => setSelectedOrderID(order.id)}
                >
                  Entregado
                </button>
              </div>
            </div>
            <br />
          </div>
        ))}
        </section>

        <>
          {selectedOrderID !== null && (
            <Modal
              selectedOrderID={selectedOrderID}
              onClose={() => setSelectedOrderID(null)}
              onCompleted={handleOrderCompleted}
            ></Modal>
          )}
        </>
      </section>
    </>
  );
}