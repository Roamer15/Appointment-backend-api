import { useState } from "react";
import { searchProviders } from "../../../services/api";
import ClientUI from "../../clientUI/ClientUI";
import { UserDataContext } from "../../../context/userContext";
import { useContext } from "react";

export default function ClientLayout() {
  const {userData: clientData} = useContext(UserDataContext)
      const userData =
        clientData || JSON.parse(sessionStorage.getItem("user"));
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
        } catch (error) {
          console.error("Search failed:", error.message);
        }
      } else {
        setProviders([]);
      }
    };

    return (
        <ClientUI userData={userData} handleChange={handleChange} query={query} setQuery={setQuery} providers={providers}/>
    )
}