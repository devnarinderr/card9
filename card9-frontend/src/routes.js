import { Navigate, useRoutes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';

// layouts
const DashboardLayout = lazy(() => import('./layouts/dashboard'));
const LogoOnlyLayout = lazy(() => import('./layouts/LogoOnlyLayout'));

// auth
const Login = lazy(() => import('./pages/Login/Login'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'));
const Catalogue = lazy(() => import('./pages/CataloguePages/Catalogue/Catalogue'));
const NewCatalogue = lazy(() => import('./pages/CataloguePages/NewCatalogue/NewCatalogue'));
const ViewCatalogue = lazy(() => import('./pages/CataloguePages/ViewCatalogue/ViewCatalogue'));
const EditCatalogue = lazy(() => import('./pages/CataloguePages/EditCatalogue/EditCatalogue'));
const Users = lazy(() => import('./pages/Admin/Users/Users'));
const UserDetail = lazy(() => import('./pages/Admin/UserDetails/UserDetails'));
const ModifyCard = lazy(() => import('./pages/Admin/ModifyCard/ModifyCard'));

const Cards = lazy(() => import('./pages/CardsPages/Cards/Cards'));
const ViewCard = lazy(() => import('./pages/CardsPages/ViewCard/ViewCard'));
const NewCard = lazy(() => import('./pages/CardsPages/NewCard/NewCard'));
const EditCard = lazy(() => import('./pages/CardsPages/EditCard/EditCard'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Background = lazy(() => import('./pages/Background/Background'));
const SingleCard = lazy(() => import('./pages/CardsPages/SingleCard/SingleCard'));
const Support = lazy(() => import('./pages/Support'));
const Feedback = lazy(() => import('./pages/Feedback'));
const Pricing = lazy(() => import('./pages/Pricing/Pricing'));
const Home = lazy(() => import('./pages/Home/Home'));
const NotFound = lazy(() => import('./pages/Page404'));

export default function Router() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {useRoutes([
        {
          path: '/admin',
          element: <DashboardLayout />,
          children: [
            { path: 'users', element: <Users /> },
            { path: 'users/detail/:id', element: <UserDetail /> },
            { path: 'users/detail/:id/edit/:name', element: <ModifyCard /> },
          ],
        },
        {
          path: '/app',
          element: <DashboardLayout />,
          children: [
            { path: 'cards', element: <Cards /> },
            { path: 'cards/new', element: <NewCard /> },
            { path: 'cards/:id', element: <ViewCard /> },
            { path: 'cards/:id/edit', element: <EditCard user="user" /> },
            { path: 'cards/:id/backgrounds', element: <Background /> },

            { path: 'catalogue', element: <Catalogue /> },
            { path: 'catalogue/new', element: <NewCatalogue /> },
            { path: 'catalogue/:id', element: <ViewCatalogue /> },
            { path: 'catalogue/:id/edit', element: <EditCatalogue /> },

            { path: 'settings', element: <Settings /> },
            { path: 'pricing', element: <Pricing /> },
            { path: 'support', element: <Support /> },
            { path: 'feedback', element: <Feedback /> },
          ],
        },
        {
          path: '/',
          element: <LogoOnlyLayout />,
          children: [
            { path: '/', element: <Home /> },
            {
              path: 'dashboard',
              element:
                (user?.role || user?.data?.role) === 'admin' ? (
                  <Navigate to="/admin/users" />
                ) : (
                  <Navigate to="/app/cards" />
                ),
            },
            { path: 'login', element: <Login /> },
            { path: 'forgot-password', element: <ForgotPassword /> },
            { path: 'reset-password/:token', element: <ResetPassword /> },
            { path: 'not-found', element: <NotFound /> },
            { path: '*', element: <Navigate to="/not-found" /> },
          ],
        },
        {
          path: '/',
          children: [{ path: '/:name', element: <SingleCard /> }],
        },
        { path: '*', element: <Navigate to="/not-found" replace /> },
      ])}
    </Suspense>
  );
}