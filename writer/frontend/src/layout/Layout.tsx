import { Outlet } from "react-router-dom";
import { CategoryProvider } from "../contexts/CategoryContext";
import Footer from "./Footer";
import Header from "./Header";
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
