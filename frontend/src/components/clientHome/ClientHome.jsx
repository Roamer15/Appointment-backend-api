import { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import styles from "./ClientHome.module.css";
import { formatTime } from "../../utils/timeFormatter";
import { useNavigate } from "react-router";

export default function ClientHome() {
  const [appointments, setAppointments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentProviderIndex, setCurrentProviderIndex] = useState(0);
  const carouselRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch appointments
        const appointmentsRes = await api.getClientAppointments();
        const today = new Date().toISOString().split('T')[0];
        const todaysAppointments = appointmentsRes.appointments.filter(
          appointment => appointment.day === today
        );
        
        // Fetch providers
        const providersRes = await api.getProviders();
        
        setAppointments(todaysAppointments);
        setProviders(providersRes.providers);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextProvider = () => {
    setCurrentProviderIndex(prev => 
      Math.min(prev + 1, providers.length - 3) // Show 3 at a time
    );
  };

  const prevProvider = () => {
    setCurrentProviderIndex(prev => Math.max(prev - 1, 0));
  };

  const goToProvider = (index) => {
    setCurrentProviderIndex(Math.min(index, providers.length - 3));
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Appointments Section */}
        <div className={styles.appointments}>
          <h2 className={styles.title}>Today's Appointments</h2>
          {appointments.length > 0 ? (
            appointments.map((appointment, index) => (
              <div key={index} className={styles.availableAppointments}>
                <h4>
                  {appointment.provider_first_name} {appointment.provider_last_name}
                </h4>
                <div className={styles.timeInfo}>
                  <span className={styles.time}>
                    {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>No appointments for today</div>
          )}
        </div>

        {/* Providers Carousel */}
        <div className={styles.providerCarousel}>
          <h3 className={styles.carouselTitle}>Meet our top specialists</h3>
          
          <div className={styles.carouselContainer}>
            <button 
              className={styles.carouselBtn} 
              onClick={prevProvider}
              disabled={currentProviderIndex === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            
            <div className={styles.carouselTrack} ref={carouselRef}>
              <div 
                className={styles.carouselInner}
                style={{
                  transform: `translateX(-${currentProviderIndex * (100 / 3)}%)`
                }}
              >
                {providers.map((provider, index) => (
                  <div key={index} className={styles.providerCard} onClick={() => navigate(`/client/provider/${provider.provider_id}`)}>
                    <div 
                      className={styles.profileBg}
                      style={{ backgroundImage: `linear-gradient(to right, #f68f3b, #f6c05c)` }}
                    ></div>
                    <div className={styles.dividerLine}></div>
                    <div className={styles.profileImgContainer}>
                      <img 
                        src={provider.profile_image_url || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                        alt={provider.first_name}
                        className={styles.profileImg}
                      />
                    </div>
                    <div className={styles.profileInfo}>
                      <h4 className={styles.providerName}>
                        {provider.first_name} {provider.last_name}
                      </h4>
                      <p className={styles.providerSpecialty}>{provider.specialty}</p>
                      <p className={styles.providerBio}>{provider.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <button 
              className={styles.carouselBtn} 
              onClick={nextProvider}
              disabled={currentProviderIndex >= providers.length - 3}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          
          <div className={styles.indicatorDots}>
            {providers.slice(0, Math.max(1, providers.length - 2)).map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentProviderIndex ? styles.activeDot : ''}`}
                onClick={() => goToProvider(index)}
                aria-label={`Go to provider ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}