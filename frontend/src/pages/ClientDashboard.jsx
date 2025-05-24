import ClientLayout from "../components/dashboard/detailLayout/ClientLayout";
import { useLocation } from "react-router";
export default function ClientDashboard() {

    const location = useLocation();
      const userData =
        location.state?.user || JSON.parse(sessionStorage.getItem("user"));
    return (
        <>
        <ClientLayout userData={userData}/>
        </>
        
    )
}