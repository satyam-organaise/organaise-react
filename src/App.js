import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { Route, Router, Routes, useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Data from './pages/Data';
import Folder from './pages/Folder';
import Message from './pages/Message';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Setting from './pages/Setting';
import Login from "./pages/Login"; ////// Delete this page after creating Login system in authservice Page 
import ForgetPassword from './pages/ForgetPassword';
import SignUp from './pages/signup';/////Delete this page after creating signup system in authservice Page 
import { useEffect } from 'react';
import { getAwsCredentialsFromCognito } from "./api/CognitoApi/CognitoApi";
import { Auth } from "@aws-amplify/auth";
import configureAmplify from './services/servicesConfig';/////////// Here we are configure the authication of server
import AuthService from './pages/AuthService';


function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#5454d3',

      },
      secondary: {
        main: '#FF5353',
        dark: "#333333",
      }
    },
    typography: {
      fontFamily: 'Nunito',
      color: "#333333",
      fontWeight: "600"
    },

  });

  const navigate = useNavigate();
  const [isAnonymous, setAnonymous] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState("")

  useEffect(() => {
    configureAmplify();
    getAwsCredentialsFromCognito();
  }, [])

  const setAuthenticatedUserFromCognito = () => {
    ///// Its return the current userInfo
    Auth.currentUserInfo()
      .then(curUser => {
        if (curUser.attributes?.profile === 'none') {
          setIsAuthenticated(false);
        } else {
          setUserId(curUser.attributes.sub);
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.log(`Failed to set authenticated user! ${err}`);
      });
    //getAwsCredentialsFromCognito();
  };

  useEffect(() => {

    Auth.currentAuthenticatedUser()
      .then((d)=>{
        setAuthenticatedUserFromCognito();
      })
      .catch((err) => {
        console.log("error get in app.js", err);
        setIsAuthenticated(false);
        navigate("/login");
      });
  }, [Auth]);




  return (
    <>
      <ThemeProvider theme={theme}>
        {!isAuthenticated
          ?
          <Routes>
            <Route path="/login" element={<AuthService serviceType="login"/>} />
            <Route path="/forget-password" element={<AuthService serviceType="forgetPassword"/>} />
            <Route path="/signup" element={<AuthService serviceType="signup"/>} />
          </Routes>
          :
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/data" element={<Data userId={userId} />} />
            <Route path="/message" element={<Message />} />
            <Route path="/folder" element={<Folder userId={userId} />} />
            {/* 
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/settings" element={<Setting />} /> 
            */}
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="*" element={<>404 page</>} />
          </Routes>
        }

      </ThemeProvider>

    </>
  )
}

export default App
