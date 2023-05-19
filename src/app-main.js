import { React, useState, createContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { LayoutMainPage } from './pages/main';
import { MainPage } from './pages/main-page';
import { BookPage } from './pages/book';
import { RulesPage } from './pages/rules-page';
import { TermsPage } from './pages/terms-page';
import { RegisterPage } from './pages/register-page';
import { AuthPage } from './pages/auth-page';
import { ForgotPassPage } from './pages/forgot-pass-page';

import { Header } from './components/header';
import { Footer } from './components/footer';
import { ProtectedRoutes } from './components/protected-routes';
import { ProtectedAuthRoutes } from './components/protected-auth-routes';

export const App = () => (
  <HashRouter>
    <Header />
    <Routes>
      <Route path='/' element={<Navigate to='/auth' />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<LayoutMainPage />}>
          <Route path='/books/:category' element={<MainPage />} />
          <Route path='/rules' element={<RulesPage />} />
          <Route path='/terms' element={<TermsPage />} />
        </Route>

        <Route path='/books/:category/:id' element={<BookPage />} />
      </Route>
      <Route element={<ProtectedAuthRoutes />}>
        <Route path='/auth' element={<AuthPage />} />
        <Route path='/registration' element={<RegisterPage />} />
        <Route path='/forgot-pass' element={<ForgotPassPage />} />
      </Route>
    </Routes>
    <Footer />
  </HashRouter>
);