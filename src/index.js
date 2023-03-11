import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { QueryClient, QueryClientProvider } from "react-query"
import { Provider } from "react-redux"
import store from "./Redux/Store/store";

import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter } from 'react-router-dom'



const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    }
  }
})


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ToastContainer autoClose={3000} />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
