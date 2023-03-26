import { useState } from 'react'
import Typography from '@mui/material/Typography'
import { Route, Router, Routes, useNavigate, useParams, useLocation } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material';
import Dashboard from './pages/Dashboard';
import Data from './pages/Data';/////// Delete this page after creatingful design Page 
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
import FileUpload from './pages/FileUpload';
import FolderData from './pages/FolderData';
import MyMessage from './pages/MyMessage';
import CompanyDetails from './pages/CompanyDetails';
import ContentModels from './pages/ContentModels';
import AllFiles from './pages/AllFiles';
import ChatProvider from './Context/ChatProvider';

function App() {
  const { pageType } = useParams();
  const theme = createTheme({
    palette: {
      primary: {
        main: '#448DF0',

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
  const location = useLocation();
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
          navigate(location.pathname);
        }
      })
      .catch((err) => {
        console.log(`Failed to set authenticated user! ${err}`);
      });
    //getAwsCredentialsFromCognito();
  };

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(
        setAuthenticatedUserFromCognito
      )
      .catch((err) => {
        console.log("error get in app.js", err);
        setIsAuthenticated(false);
        if (location.pathname === "/") {
          navigate("/login");
        } else {
          navigate(location.pathname);
        }


      });
  }, [Auth]);





  return (
    <>
      <ThemeProvider theme={theme}>
        {!isAuthenticated
          ?
          <Routes>
            <Route path="/login" element={<AuthService serviceType="login" />} />
            <Route path="/forget-password" element={<AuthService serviceType="forgetPassword" />} />
            <Route path="/signup" element={<AuthService serviceType="signup" />} />
          </Routes>
          :
          <ChatProvider>
            <Routes>
              {/* <Route path="/" element={<Dashboard />} /> */}
              {/* <Route path="/data" element={<Data userId={userId} />} /> */}
              {/** Delete code  aafter file upload feaature complete */}
              {/* <Route path="/message" element={<Message />} /> */}
              {/** Delete code after creaing new message feature complete */}
              {/* <Route path="/folder" element={<Folder userId={userId} />} /> */}
              {/** Delete code after folder feature complete */}
              <Route path="/companyDetail" element={<CompanyDetails />} />
              <Route path="/upload" element={<FileUpload />} />
              <Route path="/create-folder" element={<FolderData userId={userId} />} />
              <Route path="/" element={<MyMessage userId={userId} />} />
              <Route path="/model" element={<ContentModels />} />
              <Route path="/allFiles" element={<AllFiles />} />

              {/* 
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/settings" element={<Setting />} /> 
            */}
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route path="*" element={<>404 page</>} />
            </Routes>
          </ChatProvider>
        }

      </ThemeProvider>

    </>
  )
}

export default App
