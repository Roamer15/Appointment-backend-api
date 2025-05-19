import { useLocation } from "react-router";
import TopBar from "../components/dashboard/topbar/TopBar";
import SideBar from "../components/dashboard/sidebar/SIdeBar";

export default function Dashboard() {
  const location = useLocation();
  const userData =
    location.state?.user || JSON.parse(sessionStorage.getItem("user"));
  console.log(userData);

  return (
    <>
      <TopBar userData={userData} />
      <SideBar />
    </>
  );
}
