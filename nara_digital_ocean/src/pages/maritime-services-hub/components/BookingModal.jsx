import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { useTranslation } from 'react-i18next';

const BookingModal = ({ isOpen, onClose, service }) => {
  const { t } = useTranslation(['maritime', 'common']);
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

  const businessTypeOptions = useMemo(
    () => [
      { value: 'fishing-cooperative', label: t('bookingModal.businessTypes.fishingCooperative') },
      { value: 'individual-fisherman', label: t('bookingModal.businessTypes.individualFisherman') },
      { value: 'aquaculture', label: t('bookingModal.businessTypes.aquaculture') },
      { value: 'shipping-company', label: t('bookingModal.businessTypes.shippingCompany') },
      { value: 'marine-tourism', label: t('bookingModal.businessTypes.marineTourism') },
      { value: 'research-institution', label: t('bookingModal.businessTypes.researchInstitution') },
      { value: 'government-agency', label: t('bookingModal.businessTypes.governmentAgency') },
      { value: 'other', label: t('bookingModal.businessTypes.other') }
    ],
    [t]
  );

  const urgencyOptions = useMemo(
    () => [
      {
        value: 'standard',
        label: t('bookingModal.urgency.options.standard.label'),
        description: t('bookingModal.urgency.options.standard.description')
      },
      {
        value: 'priority',
        label: t('bookingModal.urgency.options.priority.label'),
        description: t('bookingModal.urgency.options.priority.description')
      },
      {
        value: 'urgent',
        label: t('bookingModal.urgency.options.urgent.label'),
        description: t('bookingModal.urgency.options.urgent.description')
      }
    ],
    [t]
  );

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.businessName?.trim()) newErrors.businessName = t('bookingModal.errors.businessName');
    if (!formData?.contactPerson?.trim()) newErrors.contactPerson = t('bookingModal.errors.contactPerson');
    if (!formData?.email?.trim()) newErrors.email = t('bookingModal.errors.email');
    if (!formData?.phone?.trim()) newErrors.phone = t('bookingModal.errors.phone');
    if (!formData?.businessType) newErrors.businessType = t('bookingModal.errors.businessType');
    if (!formData?.serviceDate) newErrors.serviceDate = t('bookingModal.errors.serviceDate');

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      const referenceId = `NARA-${Date.now()}`;
      alert(
        `${t('bookingModal.messages.success', { service: service?.name })}\n\n` +
        `${t('bookingModal.messages.reference', { reference: referenceId })}\n` +
        `${t('bookingModal.messages.estimatedCost', { cost: calculateTotalCost() })}\n\n` +
        `${t('bookingModal.messages.followUp')}`
      );
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
                <h2 className="font-headline text-xl font-bold text-text-primary">
                  {t('serviceCard.bookService')}
                </h2>
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
            <h3 className="font-headline text-lg font-bold text-text-primary">
              {t('bookingModal.headers.businessInfo')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('bookingModal.labels.businessName')}
                type="text"
                placeholder={t('bookingModal.placeholders.businessName')}
                value={formData?.businessName}
                onChange={(e) => handleInputChange('businessName', e?.target?.value)}
                error={errors?.businessName}
                required
              />
              
              <Input
                label={t('bookingModal.labels.contactPerson')}
                type="text"
                placeholder={t('bookingModal.placeholders.contactPerson')}
                value={formData?.contactPerson}
                onChange={(e) => handleInputChange('contactPerson', e?.target?.value)}
                error={errors?.contactPerson}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('bookingModal.labels.email')}
                type="email"
                placeholder={t('bookingModal.placeholders.email')}
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                error={errors?.email}
                required
              />
              
              <Input
                label={t('bookingModal.labels.phone')}
                type="tel"
                placeholder={t('bookingModal.placeholders.phone')}
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                error={errors?.phone}
                required
              />
            </div>

            <Select
              label={t('bookingModal.labels.businessType')}
              placeholder={t('bookingModal.placeholders.businessType')}
              options={businessTypeOptions}
              value={formData?.businessType}
              onChange={(value) => handleInputChange('businessType', value)}
              error={errors?.businessType}
              required
            />
          </div>

          {/* Service Details */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-text-primary">
              {t('bookingModal.headers.serviceDetails')}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('bookingModal.labels.serviceDate')}
                type="date"
                value={formData?.serviceDate}
                onChange={(e) => handleInputChange('serviceDate', e?.target?.value)}
                error={errors?.serviceDate}
                min={new Date()?.toISOString()?.split('T')?.[0]}
                required
              />
              
              <Select
                label={t('bookingModal.urgency.label')}
                options={urgencyOptions}
                value={formData?.urgency}
                onChange={(value) => handleInputChange('urgency', value)}
              />
            </div>

            <Input
              label={t('bookingModal.labels.specialRequirements')}
              type="text"
              placeholder={t('bookingModal.placeholders.specialRequirements')}
              value={formData?.specialRequirements}
              onChange={(e) => handleInputChange('specialRequirements', e?.target?.value)}
              description={t('bookingModal.descriptions.specialRequirements')}
            />
          </div>

          {/* Notification Preferences */}
          <div className="space-y-4">
            <h3 className="font-headline text-lg font-bold text-text-primary">
              {t('bookingModal.headers.notifications')}
            </h3>
            
            <div className="space-y-3">
              <Checkbox
                label={t('bookingModal.notifications.sms.label')}
                description={t('bookingModal.notifications.sms.description')}
                checked={formData?.smsAlerts}
                onChange={(e) => handleInputChange('smsAlerts', e?.target?.checked)}
              />
              
              <Checkbox
                label={t('bookingModal.notifications.email.label')}
                description={t('bookingModal.notifications.email.description')}
                checked={formData?.emailAlerts}
                onChange={(e) => handleInputChange('emailAlerts', e?.target?.checked)}
              />
            </div>
          </div>

          {/* Cost Summary */}
          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cta text-text-secondary">
                {t('bookingModal.costSummary.baseCost')}
              </span>
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
                  {formData?.urgency === 'priority'
                    ? t('bookingModal.costSummary.priorityFee')
                    : t('bookingModal.costSummary.urgentFee')}
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
                <span className="font-headline text-lg font-bold text-text-primary">
                  {t('bookingModal.costSummary.total')}
                </span>
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
              {t('common:cancel')}
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
              iconName="Calendar"
              iconPosition="left"
            >
              {t('bookingModal.buttons.submit')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
