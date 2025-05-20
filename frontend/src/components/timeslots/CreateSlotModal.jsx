import { useState, useEffect } from 'react';
import styles from './CreateSlotModal.module.css';
import api from '../../services/api';
import { toast } from 'react-toastify';

export default function CreateSlotModal({ onClose, onSlotCreated }) {
  const [formData, setFormData] = useState({
    day: '',  // State uses 'day'
    startTime: '',
    endTime: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Date validation
    if (!formData.day) {
      newErrors.day = 'Date is required';
    } else {
      const selectedDate = new Date(formData.day);
      if (selectedDate < today) {
        newErrors.day = 'Date cannot be in the past';
      }
    }

    // Time validation
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required';
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
      const slotData = {
        day: formData.day,
        startTime: `${formData.startTime}:00`,
        endTime: `${formData.endTime}:00`
      };

      const res = await api.createTimeSlot(slotData);
      console.log(res)
      toast.success('Time slot created successfully!');
      onSlotCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create time slot');
      console.error('Creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Create New Time Slot</h3>
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
              {isSubmitting ? 'Creating...' : 'Create Slot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}