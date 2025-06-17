import { useState } from "react";
import ProviderUI from "../../providerUI/ProviderUI";
import { UserDataContext } from "../../../context/userContext";
import { useContext } from "react";

export default function ProviderLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);
const { user: contextUser } = useContext(UserDataContext);
const storedUser = JSON.parse(sessionStorage.getItem("user"));
const user = contextUser || storedUser;


  return (
    <ProviderUI
      userData={user}
      collapsed={collapsed}
      toggleSidebar={toggleSidebar}
    />
  );
}
