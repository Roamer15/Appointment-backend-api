import styles from './CreateSlotModal.module.css'
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api';

export default function UpdateSlotModal({onClose, onSlotUpdated, slotId}) {

    const [formData, setFormData] = useState({
        day: '', 
        startTime: '',
        endTime: '',
      });
      const [errors, setErrors] = useState({});
      const [isSubmitting, setIsSubmitting] = useState(false);
    
      const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        
          const selectedDate = new Date(formData.day);
          if (selectedDate < today) {
            newErrors.day = 'Date cannot be in the past';
          }
        
    
        if (formData.startTime && formData.endTime) {
          const start = new Date(`2000-01-01T${formData.startTime}`);
          const end = new Date(`2000-01-01T${formData.endTime}`);
          
          if (end <= start) {
            newErrors.endTime = 'End time must be after start time';
          }
    
          const minDuration = 15 * 60 * 1000;
          if ((end - start) < minDuration) {
            newErrors.endTime = 'Minimum slot duration is 15 minutes';
          }
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
    
      useEffect(() => {
        validateForm();
      }, [formData]);
    
      const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };
    
      const handleSubmit = async e => {
  e.preventDefault();
  setIsSubmitting(true);

  if (!validateForm()) {
    setIsSubmitting(false);
    toast.error('Please fix validation errors');
    return;
  }

  try {
    const payload = {};

    if (formData.day) {
      payload.day = new Date(formData.day).toISOString(); // convert to ISO
    }

    if (formData.startTime) {
      payload.startTime = `${formData.startTime}:00`; // ensure HH:mm:ss
    }

    if (formData.endTime) {
      payload.endTime = `${formData.endTime}:00`;
    }

    const res = await api.updateTimeSlot(payload, slotId);
    console.log(res)
    toast.success('Time slot updated successfully!');
    onSlotUpdated();
    onClose();
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update time slot');
    console.error('Update error:', err);
  } finally {
    setIsSubmitting(false);
  }
};

    
      const today = new Date().toISOString().split('T')[0];
    
      return (
        <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
          <div className={styles.modal}>
            <div className={styles.header}>
              <h3>Update Time Slot</h3>
              <button type="button" className={styles.closeBtn} onClick={onClose}>x</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Date</label>
                <input
                  type="date"
                  name="day"
                  min={today}
                  value={formData.day}
                  onChange={handleChange}
                  className={errors.day ? styles.errorInput : ''}
                />
                {errors.day && <span className={styles.errorText}>{errors.day}</span>}
              </div>
    
              <div className={styles.formGroup}>
                <label>Start Time</label>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className={errors.startTime ? styles.errorInput : ''}
                />
                {errors.startTime && <span className={styles.errorText}>{errors.startTime}</span>}
              </div>
    
              <div className={styles.formGroup}>
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className={errors.endTime ? styles.errorInput : ''}
                />
                {errors.endTime && <span className={styles.errorText}>{errors.endTime}</span>}
              </div>
    
              <div className={styles.actions}>
                <button type="button" onClick={onClose} className={styles.cancel}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submit}
                  disabled={isSubmitting || Object.keys(errors).length > 0}
                >
                  {isSubmitting ? 'Updating...' : 'Update Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      );
}