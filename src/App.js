import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./components/Login";
import Customerdash from "./components/Customerdash";
import Admin from "./components/Admin";
import Employeedash from "./components/Employeedash";
import Withdrawsection from "./components/Withdrawsection";
import Depositsection from "./components/Depositsection";
import Profile from "./components/Profile";
import Createnewaccount from "./components/Createnewaccount";
import Account from "./components/Account";
import Createnewuser from "./components/Createnewuser";
import Alltransaction from "./components/Alltransactions";
import User from "./components/User";
import Emplouser from "./components/Emplouser";
import Emploaccount from "./components/Emploaccount";
import Emplotransaction from "./components/Emplotransaction";
import Mytransaction from "./components/Mytransaction";
import Transfersection from "./components/Transfersection";
import Resetpassword from "./components/Resetpassword";
import Forgotpassword from "./components/Forgotpassword";
import Confirmpassword from "./components/Confirmpassword";
import Edituser from "./components/Edituser";
import Editaccount from "./components/Editaccount";
import Viewuser from "./components/Viewuser";
import Viewaccount from "./components/Viewaccount";
import Viewtransaction from "./components/Viewtransaction";
import Viewemplouser from "./components/Viewemplouser";
import Viewadminaccount from "./components/Viewadminaccount";
import Viewadmintransaction from "./components/Viewadmintransaction";

function App() {
  return (
    <>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/customerdash" element={<Customerdash />} />
          <Route path="/emplyoeedash" element={<Employeedash />} />
          <Route path="/withdrawsection" element={<Withdrawsection />} />
          <Route path="/depositsection" element={<Depositsection />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/createnewaccount" element={<Createnewaccount />} />
          <Route path="/updateaccount/:aId" element={<Editaccount />} />
          <Route path="/viewaccount/:aId" element={<Viewaccount />} />
          <Route path="/viewadminaccount/:aId" element={<Viewadminaccount />} />
          <Route path="/viewadmintransaction/:tId" element={<Viewadmintransaction />} />
          <Route path="/account" element={<Account />} />
          <Route path="/createnewuser" element={<Createnewuser />} />
          <Route path="/updateuser/:uId" element={<Edituser />} />
          <Route path="/viewuser/:uId" element={<Viewuser />} />
          <Route path="/alltransaction" element={<Alltransaction />} />
          <Route path="/viewtransaction/:tId" element={<Viewtransaction />} />
          <Route path="/user" element={<User />} />
          <Route path="/emplouser" element={<Emplouser />} />
          <Route path="/viewemplouser/:uId" element={<Viewemplouser />} />
          <Route path="/emploaccount" element={<Emploaccount />} />
          <Route path="/emplotransaction" element={<Emplotransaction />} />
          <Route path="/mytransaction" element={<Mytransaction />} />
          <Route path="/transfersection" element={<Transfersection />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="/confirmpassword" element={<Confirmpassword />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}


export default App;
