import { useLocation } from "react-router";
import ProviderLayout from "../components/dashboard/detailLayout/ProviderLayout";

export default function Dashboard() {
  const location = useLocation();
  const userData =
    location.state?.user || JSON.parse(sessionStorage.getItem("user"));
  return (
    <>
      <ProviderLayout userData={userData}/>
    </>
  );
}
