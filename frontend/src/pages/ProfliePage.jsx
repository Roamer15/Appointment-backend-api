import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import ProfileCard from "../components/profile/ProfileCard";

export default function Profile() {
    const [profile, setProfile] = useState([])

    async function fetchProfileData() {
        try {
            const profileRes = await api.getProfileData()
            console.log(profileRes)
            setProfile(profileRes)
            toast.success('Profile data succesfully fetched')
        }
        catch(error) {
            console.error(`Failed to fetch profile details`, error.message)
            toast.error('Failed to fetch profile details')
        }   
    }

    useEffect(() => {
        fetchProfileData()
    }, [])

    return (
        <ProfileCard profileData={profile}/>
    )
}