import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState, useRef } from "react";

interface Users {
  UsersItems: UserItem[];
}

interface UserItem {
  id: number;
  email: string;
  password: string;
  role: string;
}

function UsersTable({
  UsersItems,
  handleDelete,
  handleEditUser,
  handleAddUser,
}: {
  UsersItems: Users["UsersItems"];
  handleDelete: (id: number) => void;
  handleEditUser: (
    id: number,
    email: string,
    password: string,
    role: string
  ) => void;
  handleAddUser: (
    email: string,
    password: string,
    role: string
  ) => Promise<object>;
}) {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [selectedUserEdit, setSelectedUserEdit] = useState<number | null>(null);

  return (
    <div className="mx-auto pt-12 ">
      <AddUser handleAddUser={handleAddUser} />
      <div className="rounded-xl overflow-hidden outline-4 outline outline-kitchenText ">
        <table className=" bg-blackInput   table-fixed">
          <thead>
            <tr className="border-b border-kitchenText md:h-16 md:text-xl">
              <th className="md:w-16">ID</th>
              <th className="md:w-24">Rol</th>
              <th className="md:w-72">Correo</th>
              <th className="md:w-20"></th>
              <th className="md:w-20"></th>
            </tr>
          </thead>
          <tbody>
            {UsersItems.map((u) => (
              <tr
                key={u.id}
                className="border-b border-kitchenText md:h-16 md:text-xl text-center"
              >
                <td>{u.id}</td>
                <td>{u.role}</td>
                <td>{u.email}</td>
                <td
                  onClick={() => setSelectedUserEdit(u.id)}
                  className="text-yellowTimer font-medium hover:cursor-pointer"
                >
                  Editar
                </td>
                <td
                  onClick={() => setSelectedUser(u.id)}
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
        {selectedUser !== null && (
          <DeleteModalUsers
            selectedUser={selectedUser}
            onClose={() => setSelectedUser(null)}
            onCompleted={handleDelete}
          ></DeleteModalUsers>
        )}
        {selectedUserEdit !== null && (
          <EditUserModal
            selectedUserEdit={selectedUserEdit}
            onClose={() => setSelectedUserEdit(null)}
            onSubmit={handleEditUser}
            UsersItems={UsersItems}
          />
        )}
      </>
    </div>
  );
}

function AddUser({
  handleAddUser,
}: {
  handleAddUser: (
    email: string,
    password: string,
    role: string
  ) => Promise<object>;
}) {
  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-row-reverse">
      <button
        className="outline outline-2 outline-kitchenText rounded-lg md:w-20 md:h-12 m-5 text-6xl flex flex-col justify-center items-center mr-1"
        onClick={() => setShowModal(true)}
      >
        +
      </button>
      <>
        {showModal && (
          <AddUserModal onClose={handleModalClose} onSubmit={handleAddUser} />
        )}
      </>
    </div>
  );
}

function AddUserModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (email: string, password: string, role: string) => Promise<object>;
}) {
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(email, password, role)
      .then(onClose)
      .catch((err) => {
        switch (err.message) {
          case "Password is too short":
            setError("La contraseña es muy corta");
            break;
          case "Email already exists":
            setError("El correo ya existe");
            break;
          default:
            setError("");
            break;
        }
      });
  };

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
                        Crear usuarix
                      </Dialog.Title>

                      <div className="mt-2">
                        <form className="p-6 pt-6" onSubmit={handleSubmit}>
                          <label className="text-sm text-white">Correo</label>
                          <input
                            type="email"
                            placeholder="Correo electrónico"
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                            required
                          />
                          <label className="text-sm text-white">
                            Contraseña
                          </label>
                          <input
                            type="password"
                            placeholder="Contraseña"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                            required
                          />
                          <label className="text-sm text-white ">Rol</label>
                          <br />
                          <div className="flex flex-row justify-evenly mt-4">
                            <div>
                              <label
                                className="text-sm text-white inline-flex "
                                htmlFor="admin"
                              >
                                Admin
                              </label>
                              <input
                                type="radio"
                                id="admin"
                                name="role"
                                value="admin"
                                onChange={(e) => setRole(e.target.value)}
                                className="text-sm text-white ml-2"
                                required
                              />
                            </div>
                            <div>
                              <label
                                className="text-sm text-white inline-flex"
                                htmlFor="waiter"
                              >
                                Waiter
                              </label>
                              <input
                                type="radio"
                                id="waiter"
                                name="role"
                                value="waiter"
                                onChange={(e) => setRole(e.target.value)}
                                className="text-sm text-white ml-2"
                              />
                            </div>
                            <div>
                              <label
                                className="text-sm text-white inline-flex"
                                htmlFor="chef"
                              >
                                Chef
                              </label>
                              <input
                                type="radio"
                                id="chef"
                                name="role"
                                value="chef"
                                onChange={(e) => setRole(e.target.value)}
                                className="text-sm text-white ml-2"
                              />
                            </div>
                          </div>
                          {error && (
                            <p className="text-red-400 font-medium text-sm my-4">
                              {error}
                            </p>
                          )}
                          <div className="bg-gunMetal px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mb-4 mr-6 mt-3 justify-center">
                            <button
                              type="submit"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-greenConfirm px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                              Crear
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

function DeleteModalUsers({
  selectedUser,
  onClose,
  onCompleted,
}: {
  selectedUser: number;
  onClose: () => void;
  onCompleted: (selectedUser: number) => void;
}) {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open && selectedUser !== null} as={Fragment}>
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
                          ¿Estas segurx que deseas eliminar este usuarix?
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
                      onCompleted(selectedUser);
                      onClose();
                    }}
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto mr-6 outline outline-1 outline-red-600"
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

function EditUserModal({
  selectedUserEdit,
  onClose,
  onSubmit,
  UsersItems,
}: {
  selectedUserEdit: number;
  onClose: () => void;
  onSubmit: (
    selectedUserEdit: number,
    email: string,
    password: string,
    role: string
  ) => void;
  UsersItems: Users["UsersItems"];
}) {
  const selectedUser = UsersItems.find((u) => u.id === selectedUserEdit);
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");

  if (!selectedUser) {
    return null;
  }

  return (
    <Transition.Root show={open && selectedUserEdit !== null} as={Fragment}>
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
                        Usuarix ID {selectedUserEdit}
                      </Dialog.Title>

                      <div className="mt-2">
                        <form className="p-6 pt-6">
                          <label className="text-sm text-white">Correo</label>
                          <input
                            type="email"
                            placeholder={selectedUser.email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                            required
                          />
                          <label className="text-sm text-white">
                            Contraseña
                          </label>
                          <input
                            type="password"
                            placeholder={selectedUser.password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 mb-5 text-sm text-black"
                            required
                          />
                          <label className="text-sm text-white ">Rol</label>
                          <br />
                          <div className="flex flex-row justify-evenly mt-4">
                            <div>
                              <label
                                className="text-sm text-white inline-flex "
                                htmlFor="admin"
                              >
                                Admin
                              </label>
                              <input
                                type="radio"
                                id="admin"
                                name="role"
                                value="admin"
                                onChange={(e) => setRole(e.target.value)}
                                className="text-sm text-white ml-2"
                                required
                              />
                            </div>
                            <div>
                              <label
                                className="text-sm text-white inline-flex"
                                htmlFor="waiter"
                              >
                                Waiter
                              </label>
                              <input
                                type="radio"
                                id="waiter"
                                name="role"
                                value="waiter"
                                onChange={(e) => setRole(e.target.value)}
                                className="text-sm text-white ml-2"
                              />
                            </div>
                            <div>
                              <label
                                className="text-sm text-white inline-flex"
                                htmlFor="chef"
                              >
                                Chef
                              </label>
                              <input
                                type="radio"
                                id="chef"
                                name="role"
                                value="chef"
                                onChange={(e) => setRole(e.target.value)}
                                className="text-sm text-white ml-2"
                              />
                            </div>
                          </div>

                          {error && (
                            <p className="text-red-400 font-medium">{error}</p>
                          )}
                          <div className="bg-gunMetal px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 mb-4 mr-6  mt-6 justify-center">
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-greenConfirm px-6 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => {
                                if (!email || !password || !role) {
                                  setError(
                                    "Por favor, completa todos los campos."
                                  );
                                } else {
                                  onSubmit(
                                    selectedUserEdit,
                                    email,
                                    password,
                                    role
                                  );
                                  onClose();
                                }
                              }}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto mr-6 outline outline-1 outline-red-600"
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

export { UsersTable };
