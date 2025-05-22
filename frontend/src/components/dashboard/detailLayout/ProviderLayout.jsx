import { useState } from "react";
import ProviderUI from "../../providerUI/ProviderUI";

export default function ProviderLayout({ userData }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed((prev) => !prev);
 


  return (
      <ProviderUI userData={userData} collapsed={collapsed} toggleSidebar={toggleSidebar}/>
  ) 
}
