import { useNavigate } from 'react-router';
import styles from './SearchResults.module.css'; // Assuming you're using CSS Modules

export default function SearchResults({ providers }) {
  
  const navigate = useNavigate()
  
  if (!providers || providers.length === 0) {
    return null; // Return nothing if no providers
  }

  return (
    <div className={styles.resultsDropdown}>
      {providers.map((provider) => (
        <div key={provider.provider_id} className={styles.resultItem} onClick={() => navigate(`/client/provider/${provider.provider_id}`)}>
          <img 
            src={provider.profile_image_url} 
            alt={`${provider.first_name} ${provider.last_name}`} 
            className={styles.resultAvatar}
            onError={(e) => {
              e.target.src = "/default-avatar.png";
            }}
          />
          <div className={styles.resultInfo}>
            <p className={styles.name}>
              {provider.first_name} {provider.last_name}
            </p>
            <p className={styles.specialty}>{provider.specialty}</p>
          </div>
        </div>
      ))}
    </div>
  );
}