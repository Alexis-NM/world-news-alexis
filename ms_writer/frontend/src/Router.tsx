import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";

const ArticleList = lazy(() => import("./pages/ArticleList/ArticleList"));
const CreateArticle = lazy(() => import("./pages/CreateArticle"));
const EditArticle = lazy(() => import("./pages/EditArticle"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/articles" replace />, // En attendant d'avoir une vrai epage d'accueil
      },
      {
        path: "/articles",
        element: <Suspense fallback={<p>Chargement...</p>}><ArticleList /></Suspense>,
      },
      {
        path: "/articles/create",
        element: <Suspense fallback={<p>Chargement...</p>}><CreateArticle /></Suspense>,
      },
      {
        path: "/articles/:id/edit",
        element: <Suspense fallback={<p>Chargement...</p>}><EditArticle /></Suspense>,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
