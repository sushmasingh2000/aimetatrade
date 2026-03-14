import './App.css';
import '../src/assets/css/style.css';
import { routes } from './Components/Routes/routes';
import { Routes, Route } from "react-router-dom";
import Login from './Components/Authentication/Login';
import Registration from './Components/Authentication/Registration';
import Download from './Components/Download';
import TermsAndConditions from './Components/TermsCondition';
import Forgotpassword from './Components/Authentication/ForgotPassword';

function App() {
  return (    
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/download" element={<Download />} />
        <Route path="/term_condition" element={<TermsAndConditions />} />
        <Route path="/forgot" element={<Forgotpassword />} />
        
        {
          routes?.map((i) => {
            return <Route key={i.path} path={i.path} element={i?.component} />
          })
        }
      </Routes>

    </>
  );
}

export default App;
