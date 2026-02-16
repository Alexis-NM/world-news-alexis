import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { CategoryProvider } from "../contexts/CategoryContext";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <CategoryProvider>
      <div className={styles.layout}>
        <Header />
        <main className={styles.main}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </CategoryProvider>
  );
}
