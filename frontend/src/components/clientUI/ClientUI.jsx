import styles from "./ClientUI.module.css";
import TopBarClient from "../dashboard/topBarClient/TopBarClient";
import { Outlet } from "react-router";
import Footer from "../footer/Footer";
export default function ClientUI({
  userData,
  handleChange,
  query,
  setQuery,
  providers,
}) {
  return (
  <>
    <div className={styles.layoutClient}>
      <TopBarClient
        userData={userData}
        handleChange={handleChange}
        query={query}
        setQuery={setQuery}
        providers={providers}
      />
      <Outlet key="client" />
    </div>
    <Footer></Footer>
  </>
  
  );
}
