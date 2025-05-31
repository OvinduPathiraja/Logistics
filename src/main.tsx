import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css';
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_IaAUBnAbo",
  client_id: "3up0p11te2v4br2jgamahgqc5p",
  redirect_uri: "https://vercel.com/codict008ovindugmailcoms-projects/logistics/Fr5Ec9bNL2yjd1Fqpa7m2Xubuqkr/dashboard",
  post_logout_redirect_uri: "https://vercel.com/codict008ovindugmailcoms-projects/logistics/Fr5Ec9bNL2yjd1Fqpa7m2Xubuqkr/",
  response_type: "code",
  scope: "email openid phone",
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);