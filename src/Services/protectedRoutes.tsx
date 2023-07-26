import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({
  element,
  allowedRoles,
}: {
  element: ReactNode;
  allowedRoles: string[];
}) => {
  const userRoles = localStorage.getItem("role");

  if (!userRoles || !allowedRoles.includes(userRoles)) {
    return <Navigate to="/" />;
  }
  return <>{element} </>;
};
