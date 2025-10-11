import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const BookingModal = ({ isOpen, onClose, service }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    email: '',
    phone: '',
    businessType: '',
    serviceDate: '',
    urgency: 'standard',
    specialRequirements: '',
    smsAlerts: true,
    emailAlerts: true
  });

  const [errors, setErrors] = useState({});

  const businessTypeOptions = [
    { value: 'fishing-cooperative', label: 'Fishing Cooperative' },
    { value: 'individual-fisherman', label: 'Individual Fisherman' },
    { value: 'aquaculture', label: 'Aquaculture Operation' },
    { value: 'shipping-company', label: 'Shipping Company' },
    { value: 'marine-tourism', label: 'Marine Tourism' },
    { value: 'research-institution', label: 'Research Institution' },
    { value: 'government-agency', label: 'Government Agency' },
    { value: 'other', label: 'Other' }
  ];

  const urgencyOptions = [
    { value: 'standard', label: 'Standard (7-14 days)', description: 'Regular processing time' },
    { value: 'priority', label: 'Priority (3-5 days)', description: '+50% fee' },
    { value: 'urgent', label: 'Urgent (24-48 hours)', description: '+100% fee' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.businessName?.trim()) newErrors.businessName = 'Business name is required';
    if (!formData?.contactPerson?.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData?.email?.trim()) newErrors.email = 'Email is required';
    if (!formData?.phone?.trim()) newErrors.phone = 'Phone number is required';
    if (!formData?.businessType) newErrors.businessType = 'Business type is required';
    if (!formData?.serviceDate) newErrors.serviceDate = 'Service date is required';

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      // Mock booking submission
      alert(`Booking request submitted for ${service?.name}!\n\nReference: NARA-${Date.now()}\nEstimated cost: ${calculateTotalCost()}\n\nYou will receive confirmation via SMS and email within 2 hours.`);
      onClose();
    }
  };

  const calculateTotalCost = () => {
    if (!service) return 'LKR 0';
    
    let basePrice = service?.price;
    if (formData?.urgency === 'priority') basePrice *= 1.5;
    if (formData?.urgency === 'urgent') basePrice *= 2;
    
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(basePrice);
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-lg scientific-border ocean-depth-shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-ocean-deep to-ocean-medium rounded-lg flex items-center justify-center">
                <Icon name={service?.icon} size={20} color="white" />
              </div>
              <div>
                <h2 className="font-headline text-xl font-bold text-text-primary">Book Service</h2>
                <p className="text-sm text-text-secondary">{service?.name}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-text-primary">Business Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Business/Organization Name"
                type="text"
                placeholder="Enter business name"
                value={formData?.businessName}
                onChange={(e) => handleInputChange('businessName', e?.target?.value)}
                error={errors?.businessName}
                required
              />
              
              <Input
                label="Contact Person"
                type="text"
                placeholder="Enter contact person name"
                value={formData?.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
                error={errors?.contactPerson}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter email address"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
              />
              
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+94 XX XXX XXXX"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
              />
            </div>

            <Select
              label="Business Type"
              placeholder="Select your business type"
              options={businessTypeOptions}
              value={formData?.businessType}
              onChange={(value) => handleInputChange('businessType', value)}
              error={errors?.businessType}
              required
            />
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-text-primary">Service Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Preferred Service Date"
                type="date"
                value={formData?.serviceDate}
                onChange={(e) => handleInputChange('serviceDate', e?.target?.value)}
                error={errors?.serviceDate}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                required
              />
              
              <Select
                label="Service Urgency"
                options={urgencyOptions}
                value={formData?.urgency}
                onChange={(value) => handleInputChange('urgency', value)}
              />
            </div>

            <Input
              label="Special Requirements"
              type="text"
              placeholder="Any specific requirements or notes"
              value={formData?.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
              description="Optional: Describe any specific needs or constraints"
            />
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-text-primary">Notification Preferences</h3>
            
            <div className="space-y-3">
              <Checkbox
                label="SMS Alerts"
                description="Receive critical updates and reminders via SMS"
                checked={formData?.smsAlerts}
                onChange={(e) => handleInputChange('smsAlerts', e?.target?.checked)}
              />
              
              <Checkbox
                label="Email Notifications"
                description="Receive detailed reports and documentation via email"
                checked={formData?.emailAlerts}
                onChange={(e) => handleInputChange('emailAlerts', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cta text-text-secondary">Base Service Cost:</span>
              <span className="font-cta-medium text-text-primary">
                {new Intl.NumberFormat('en-LK', {
                  style: 'currency',
                  currency: 'LKR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })?.format(service?.price)}
              </span>
            </div>
            {formData?.urgency !== 'standard' && (
              <div className="flex items-center justify-between mb-2">
                <span className="font-cta text-text-secondary">
                  {formData?.urgency === 'priority' ? 'Priority Fee (+50%):' : 'Urgent Fee (+100%):'}
                </span>
                <span className="font-cta-medium text-warning">
                  +{new Intl.NumberFormat('en-LK', {
                    style: 'currency',
                    currency: 'LKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })?.format(service?.price * (formData?.urgency === 'priority' ? 0.5 : 1))}
                </span>
              </div>
            )}
            <div className="border-t border-border pt-2">
              <div className="flex items-center justify-between">
                <span className="font-headline text-lg font-bold text-text-primary">Total Estimated Cost:</span>
                <span className="font-headline text-lg font-bold text-primary">{calculateTotalCost()}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              iconName="Calendar"
              iconPosition="left"
            >
              Submit Booking Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;