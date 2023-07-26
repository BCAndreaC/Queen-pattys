import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./Components/Login/Login.tsx";
import { Order } from "./Components/Order/Order.tsx";
import { PrivateRoute } from "./Services/protectedRoutes.tsx";
import { Delivers } from "./Components/Delivers/Delivers.tsx";
import { Admon} from "./Components/Admon/Admon.tsx";
import { AdmonProducts } from "./Components/Admon/AdmonProducts.tsx";
import { Kitchen } from "./Components/Kitchen/Kitchen.tsx";


export function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/order" element={<PrivateRoute element={<Order/>} allowedRoles={['waiter']}></PrivateRoute>} />
        <Route path='/kitchen' element={<PrivateRoute element={<Kitchen/>}  allowedRoles={['chef']}></PrivateRoute>} />
        <Route path= '/delivers' element={<PrivateRoute element={<Delivers/>} allowedRoles={['waiter']}></PrivateRoute>} />
        <Route path= '/admon-users' element={<PrivateRoute element={<Admon/>} allowedRoles={['admin']}></PrivateRoute>} />
        <Route path= '/admon-products' element={<PrivateRoute element={<AdmonProducts/>} allowedRoles={['admin']}></PrivateRoute>} />
      </Routes>
    </BrowserRouter>    
  )
}
