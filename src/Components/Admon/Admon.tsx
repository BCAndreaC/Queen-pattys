import { Logo } from "../Login/Login.components.tsx";
import { UsersTable } from "./Users.components";
import { AdmonNavbar } from "../Navbar/AdmonNavbar.tsx";
import { useNavigate } from "react-router";
import {
  getUsers,
  postUser,
  deleteUsers,
  patchUsers,
} from "../../Services/users.tsx";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Admon() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (localStorage.getItem("token") === null) {
      navigate("/");
    }
  };
  const notifyDelete = () => toast.success("Usuarix eliminadx");
  const notifyAdd = () => toast.success("Nuevx usuarix");
  const notifyEdit = () => toast.success("Usuarix editadx");

  function handleUsers() {
    return getUsers()
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => {
        console.error("ERROR DE HANDLEUSERS", error);
      });
  }

  function handleDelete(userID: number) {
    return deleteUsers(userID)
      .then(() => {
        handleUsers();
        notifyDelete();

      })
      .catch((error) => {
        console.error("ERROR DE HANDLEDELETE", error);
        
      });
  }

  function handleEdit(
    userID: number,
    email: string,
    password: string,
    role: string
  ) {
  return  patchUsers(userID, email, password, role)
      .then(() => {
        handleUsers();
        notifyEdit();
      })
      .catch((error) => {
        console.error("ERROR DE HANDLEEDIT", error);
      });
  }

  function handleAddUser(email: string, password: string, role: string) {
   return postUser(email, password, role)
      .then((data) => {
        handleUsers();
        notifyAdd();
        return data;
      })
  }

  useEffect(() => {
    handleUsers();
  }, []);

  return (
    <>
      <AdmonNavbar handleLogout={handleLogout} />
      <section className="flex flex-col bg-gunMetal min-h-screen min-w-fit ">
        <div className="mt-10 ">
          <Logo />
        </div>
        <UsersTable
          UsersItems={users}
          handleDelete={handleDelete}
          handleEditUser={handleEdit}
          handleAddUser={handleAddUser}
        ></UsersTable>
        <ToastContainer
          theme="dark"
          toastClassName={() => "flex bg-blackInput p-4 rounded justify-between border-2 border-kitchenText"}
          bodyClassName={() => "flex flex-row text-kitchenText items-center"}
          hideProgressBar
        />
      </section>
    </>
  );
}
