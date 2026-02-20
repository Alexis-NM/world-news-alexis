import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";
import styles from "./Header.module.css";

export default function Header() {
	return (
		<header className={styles.header}>
			<div className={styles.headerContent}>
				<NavLink
					to="/articles"
					className={({ isActive }) =>
						`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`
					}
				>
					Mes articles
				</NavLink>
				<NavLink to="/" className={styles.logoLink}>
					<img src={logo} alt="World News" className={styles.logo} />
				</NavLink>
				<NavLink
					to="/articles/create"
					className={({ isActive }) =>
						`${styles.navLink} ${styles.navLinkCreate} ${isActive ? styles.navLinkActive : ""}`
					}
				>
					Nouvel article
				</NavLink>
			</div>
		</header>
	);
}
