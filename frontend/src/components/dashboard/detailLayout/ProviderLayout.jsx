import SideBar from "../sidebar/SIdeBar";
import TopBar from "../topbar/TopBar";
import styles from "./ProviderLayout.module.css";
import { useState } from "react";
import { Outlet } from "react-router";
//import Footer from "../../footer/Footer";
import TopBarClient from "../topBarClient/TopBarClient";
import { searchProviders } from "../../../services/api";

export default function ProviderLayout({ userData }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);
  const [query, setQuery] = useState('');
const [providers, setProviders] = useState([]);

const handleChange = async (e) => {
  const searchTerm = e.target.value;
  setQuery(searchTerm);

  if (searchTerm.length > 1) {
    try {
      const response = await searchProviders({ q: searchTerm });
      const data = await response.json();
      setProviders(data.providers || []);
      console.log(providers)
    } catch (error) {
      console.error("Search failed:", error);
    }
  } else {
    setProviders([]);
  }
};


  return userData?.role === "provider" ? (
    <div className={styles.layout}>
      <SideBar userData={userData} collapsed={collapsed} />
      <div className={styles.main}>
        <TopBar userData={userData} toggleSidebar={toggleSidebar} />
        <div className={styles.content}>
          <Outlet key="provider"/>
        </div>
      </div>
    </div>
  ) : (
    
      <div className={styles.layoutClient}>
        <TopBarClient userData={userData} handleChange={handleChange} query={query} setQuery={setQuery} providers={providers}/>
        <Outlet key="client"/>
      </div>
      
  );
}
