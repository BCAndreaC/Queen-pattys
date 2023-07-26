import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState, Fragment, useRef } from "react";

interface Products {
  ProductsItems: ProductsItem[];
}

interface ProductsItem {
  id: number;
  name: string;
  price: number;
  type: string;
}

function ProductsTable({
  ProductsItems,
  handleDelete,
  handleAddProduct,
  handleEdit,
  error,
}: {
  ProductsItems: Products["ProductsItems"];
  handleDelete: (id: number | null) => void;
  handleEdit: (id: number, name: string, price: number, type: string) => void;
  handleAddProduct: (name: string, price: number, type: string) => Promise<object> | Promise<void>;
  error: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [selectedProductEdit, setSelectedProductEdit] = useState<number | null>(
    null
  );

  return (
    <div className="mx-auto pt-12 ">
      <AddProduct handleAddProduct={handleAddProduct} error={error} />
      <div className="rounded-xl overflow-hidden outline-4 outline outline-kitchenText ">
        <table className=" bg-blackInput  table-fixed">
          <thead>
            <tr className="border-b border-kitchenText md:h-16 md:text-xl">
              <th className="md:w-16">ID</th>
              <th className="md:w-52">Nombre</th>
              <th className="md:w-24">Precio</th>
              <th className="md:w-20">Tipo</th>
              <th className="md:w-20"></th>
              <th className="md:w-20"></th>
            </tr>
          </thead>
          <tbody>
            {ProductsItems.map((u) => (
              <tr
                key={u.id}
                className="border-b border-kitchenText md:h-16 md:text-xl text-center"
              >
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.price}</td>
                <td>{u.type}</td>
                <td
                  onClick={() => setSelectedProductEdit(u.id)}
                  className="text-yellowTimer font-medium hover:cursor-pointer"
                >
                  Editar
                </td>
                <td
                  onClick={() => setSelectedProduct(u.id)}
                  className="text-errorRed font-medium hover:cursor-pointer"
                >
                  Borrar
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <>
        {selectedProduct !== null && (
          <ModalDeleteProducts
            selectedProduct={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onCompleted={handleDelete}
          ></ModalDeleteProducts>
        )}
        {selectedProductEdit !== null && (
          <ModalEditProducts
            selectedProductEdit={selectedProductEdit}
            onClose={() => setSelectedProductEdit(null)}
            ProductsItems={ProductsItems}
            onSubmit={handleEdit}
          ></ModalEditProducts>
        )}
      </>
    </div>
  );
}

function ModalDeleteProducts({
  selectedProduct,
  onClose,
  onCompleted,
}: {
  selectedProduct: number | null;
  onClose: () => void;
  onCompleted: (selectedProduct: number | null) => void;
}) {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open && selectedProduct !== null} as={Fragment}>
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
                        Producto con ID: {selectedProduct}
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-white">
                          ¿Estas segurx que deseas eliminar este producto?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gunMetal px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md outline outline-1 outline-greenConfirm bg-greenConfirm hover:bg-gray-50 px-3 py-2 text-sm font-semibold text-gunMetal shadow-sm  sm:mt-0 sm:w-auto"
                    onClick={() => {
                      onCompleted(selectedProduct);
                      onClose();
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md outline outline-1 outline-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-500 text-white shadow-sm  sm:ml-3 sm:w-auto mr-6"
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

function ModalEditProducts({
  selectedProductEdit,
  onClose,
  onSubmit,
  ProductsItems,
}: {
  selectedProductEdit: number;
  onClose: () => void;
  onSubmit: (
    selectedProductEdit: number,
    name: string,
    price: number,
    type: string
  ) => void;
  ProductsItems: Products["ProductsItems"];
}) {
  const selectedProduct = ProductsItems.find(
    (u) => u.id === selectedProductEdit
  );
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState("");

  if (!selectedProduct) {
    return null;
  }

  return (
    <Transition.Root show={open !== null} as={Fragment}>
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
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <Dialog.Title
                      as="h2"
                      className="text-base font-semibold leading-6 text-kitchenText mt-2"
                    >
                      {" "}
                      Editar producto {selectedProductEdit}
                    </Dialog.Title>

                    <div className="mt-2">
                      <form className="p-6 pt-6">
                        <label className="text-sm text-white">Nombre</label>
                        <input
                          type="text"
                          placeholder={selectedProduct.name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                          required
                        />
                        <label className="text-sm text-white">Precio</label>
                        <input
                          type="number"
                          placeholder={selectedProduct.price.toString()}
                          onChange={(e) => setPrice(parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                          required
                        />
                        <label className="text-sm text-white ">Tipo</label>
                        <br />
                        <div className="flex flex-row justify-evenly mt-4">
                          <div>
                            <label
                              className="text-sm text-white inline-flex "
                              htmlFor="Desayuno"
                            >
                              Desayuno
                            </label>
                            <input
                              type="radio"
                              id="desayuno"
                              name="type"
                              value="desayuno"
                              className="text-sm text-white ml-2"
                              required
                              onChange={(e) => setType(e.target.value)}
                            />
                          </div>
                          <div>
                            <label
                              className="text-sm text-white inline-flex"
                              htmlFor="almuerzo"
                            >
                              Almuerzo
                            </label>
                            <input
                              type="radio"
                              id="almuerzo"
                              name="type"
                              value="almuerzo"
                              className="text-sm text-white ml-2"
                              required
                              onChange={(e) => setType(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-gunMetal px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mb-4 mr-6 mt-6 justify-center">
                          <button
                            type="submit"
                            className="mt-3 inline-flex w-full justify-center rounded-md bg-greenConfirm px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            onClick={() => {
                              onSubmit( selectedProductEdit, name, price, type,);
                              onClose();
                                
                            }}
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            className="inline-flex w-full justify-center rounded-md outline outline-1 outline-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto mr-6 "
                            onClick={() => onClose()}
                            ref={cancelButtonRef}
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition.Root>
  );
}

function AddProduct({
  handleAddProduct,
  error,
}: {
  handleAddProduct: (name: string, price: number, type: string) => Promise<object> | Promise<void>;
  error: string;
}) {
  const [openAdd, setOpenAdd] = useState(false);

  return (
    <div className="flex flex-row-reverse">
      <button
        className="outline outline-2 outline-kitchenText rounded-lg md:w-20 md:h-12 m-5 text-6xl flex flex-col justify-center items-center mr-1"
        onClick={() => setOpenAdd(true)}
      >
        +
      </button>
      <>
        {openAdd && (
          <AddProductModal
            onClose={() => setOpenAdd(false)}
            onSubmit={handleAddProduct}
            error={error}
          />
        )}
      </>
    </div>
  );
}

function AddProductModal({
  onClose,
  onSubmit,
  error,
}: {
  onClose: () => void;
  onSubmit: (name: string, price: number, type: string) => Promise<object> | Promise<void>;
  error: string;
}) {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [type, setType] = useState("");

  return (
    <Transition.Root show={open !== null} as={Fragment}>
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
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h2"
                        className="text-base font-semibold leading-6 text-kitchenText mt-2"
                      >
                        {" "}
                        Crear producto
                      </Dialog.Title>

                      <div className="mt-2">
                        <form className="p-6 pt-6">
                          <label className="text-sm text-white">Nombre</label>
                          <input
                            type="text"
                            placeholder="Nombre"
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                            required
                          />
                          <label className="text-sm text-white">Precio</label>
                          <input
                            type="number"
                            placeholder="Precio"
                            onChange={(e) => setPrice(parseInt(e.target.value))}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                            required
                          />
                          <label className="text-sm text-white ">Tipo</label>
                          <br />
                          <div className="flex flex-row justify-evenly mt-4">
                            <div>
                              <label
                                className="text-sm text-white inline-flex "
                                htmlFor="Desayuno"
                              >
                                Desayuno
                              </label>
                              <input
                                type="radio"
                                id="desayuno"
                                name="type"
                                value="desayuno"
                                onChange={(e) => setType(e.target.value)}
                                className="text-sm text-white ml-2"
                                required
                              />
                            </div>
                            <div>
                              <label
                                className="text-sm text-white inline-flex"
                                htmlFor="almuerzo"
                              >
                                Almuerzo
                              </label>
                              <input
                                type="radio"
                                id="almuerzo"
                                name="type"
                                value="almuerzo"
                                onChange={(e) => setType(e.target.value)}
                                className="text-sm text-white ml-2"
                                required
                              />
                            </div>
                          </div>
                          {error && (
                            <p className="text-red-400 font-medium">{error}</p>
                          )}
                          <div className="bg-gunMetal px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mb-4 mr-6 mt-6 justify-center">
                            <button
                              type="submit"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-greenConfirm px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => {
                                onSubmit(name, price, type);
                                onClose();
                              }}
                            >
                              Crear
                            </button>
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md outline outline-1 outline-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto mr-6 "
                              onClick={() => onClose()}
                              ref={cancelButtonRef}
                            >
                              Cancelar
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export { ProductsTable };
