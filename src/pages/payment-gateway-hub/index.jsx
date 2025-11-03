import React, { useState, useEffect } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import PaymentMethodCard from './components/PaymentMethodCard';
import OrderSummary from './components/OrderSummary';
import SecurityBadges from './components/SecurityBadges';
import { cn } from '../../utils/cn';

const PaymentGatewayHub = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('method'); // method, details, confirmation
  const [paymentDetails, setPaymentDetails] = useState({
    customerType: 'individual',
    email: '',
    phone: '',
    organizationName: '',
    taxId: ''
  });

  // Mock order data (would come from marketplace)
  const [orderData] = useState({
    orderNumber: 'NARA-' + Date.now()?.toString()?.slice(-6),
    items: [
      {
        id: '1',
        title: 'Marine Ecosystem Analysis Report',
        type: 'Digital Product',
        division: 'Marine Research',
        price: 3500,
        quantity: 1,
        image: '/public/assets/images/no_image.png'
      },
      {
        id: '2',
        title: 'Oceanographic Dataset 2024',
        type: 'Digital Dataset',
        division: 'Oceanography',
        price: 5500,
        quantity: 1,
        image: '/public/assets/images/no_image.png'
      }
    ],
    subtotal: 9000,
    processingFee: 100,
    taxes: 1365, // 15% VAT
    discount: 0,
    total: 10465,
    currency: 'LKR',
    customerType: 'individual'
  });

  // Sri Lankan Payment Methods
  const paymentMethods = [
    {
      id: 'govpay',
      name: 'GovPay',
      type: 'government',
      description: 'Official government payment platform for secure institutional transactions',
      processingTime: 'Instant',
      fees: 'Free for gov agencies',
      isAvailable: true,
      supportedFeatures: ['Instant Settlement', 'Tax Integration', 'Audit Trail', 'Bulk Payments'],
      maxAmount: 1000000,
      minAmount: 100
    },
    {
      id: 'lankapay',
      name: 'LankaPay',
      type: 'bank',
      description: 'National payment network connecting all major Sri Lankan banks',
      processingTime: '2-5 minutes',
      fees: 'LKR 25 + 0.5%',
      isAvailable: true,
      supportedFeatures: ['Real-time Transfer', 'Mobile Banking', 'ATM Network', 'Multi-bank Support'],
      maxAmount: 500000,
      minAmount: 50
    },
    {
      id: 'sampath-bank',
      name: 'Sampath Bank',
      type: 'bank',
      description: 'Direct integration with Sampath Bank online banking platform',
      processingTime: '1-3 minutes',
      fees: 'LKR 30 per transaction',
      isAvailable: true,
      supportedFeatures: ['Online Banking', 'Mobile App', 'SMS Alerts', 'Transaction History'],
      maxAmount: 300000,
      minAmount: 100
    },
    {
      id: 'commercial-bank',
      name: 'Commercial Bank',
      type: 'bank',
      description: 'Secure payment gateway through Commercial Bank of Ceylon',
      processingTime: '1-3 minutes',
      fees: 'LKR 35 per transaction',
      isAvailable: true,
      supportedFeatures: ['Internet Banking', 'CardNet', 'ComBank Mobile', 'Auto Debit'],
      maxAmount: 250000,
      minAmount: 100
    },
    {
      id: 'hnb',
      name: 'Hatton National Bank',
      type: 'bank',
      description: 'HNB PayGate for secure online transactions',
      processingTime: '1-3 minutes',
      fees: 'LKR 28 per transaction',
      isAvailable: true,
      supportedFeatures: ['HNB Mobile', 'Internet Banking', 'SMS Banking', 'Card Payments'],
      maxAmount: 200000,
      minAmount: 100
    },
    {
      id: 'dfcc',
      name: 'DFCC Bank',
      type: 'bank',
      description: 'DFCC online payment gateway with enhanced security features',
      processingTime: '1-3 minutes',
      fees: 'LKR 32 per transaction',
      isAvailable: true,
      supportedFeatures: ['Online Banking', 'Mobile Banking', 'Card Payments', 'Standing Orders'],
      maxAmount: 150000,
      minAmount: 100
    },
    {
      id: 'ezcash',
      name: 'eZ Cash',
      type: 'mobile',
      description: 'Leading mobile wallet service in Sri Lanka',
      processingTime: 'Instant',
      fees: 'LKR 15 + 1%',
      isAvailable: true,
      supportedFeatures: ['QR Payments', 'Mobile Top-up', 'Bill Payments', 'P2P Transfers'],
      maxAmount: 100000,
      minAmount: 10
    },
    {
      id: 'mcash',
      name: 'mCash',
      type: 'mobile',
      description: 'Dialog mCash mobile payment platform',
      processingTime: 'Instant',
      fees: 'LKR 12 + 0.75%',
      isAvailable: true,
      supportedFeatures: ['QR Code', 'NFC Payments', 'Merchant Payments', 'Utility Bills'],
      maxAmount: 75000,
      minAmount: 10
    }
  ];

  const customerTypes = [
    { value: 'individual', label: 'Individual Researcher' },
    { value: 'institutional', label: 'Educational Institution' },
    { value: 'government', label: 'Government Agency' },
    { value: 'commercial', label: 'Commercial Entity' }
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handleCustomerTypeChange = (type) => {
    setPaymentDetails(prev => ({ ...prev, customerType: type }));
  };

  const handleProceedToPayment = async () => {
    if (!selectedPaymentMethod) return;

    setIsProcessing(true);
    setCurrentStep('details');
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  };

  const handleSubmitPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setCurrentStep('confirmation');
      setIsProcessing(false);
    }, 3000);
  };

  const handleBackToMarketplace = () => {
    window.location.href = '/nara-digital-marketplace';
  };

  const getStepIcon = (step) => {
    switch (step) {
      case 'method': return 'CreditCard';
      case 'details': return 'FileText';
      case 'confirmation': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const isStepComplete = (step) => {
    switch (step) {
      case 'method': return selectedPaymentMethod !== null;
      case 'details': return currentStep === 'confirmation';
      case 'confirmation': return false;
      default: return false;
    }
  };

  const isStepActive = (step) => {
    return currentStep === step;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBackToMarketplace}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon name="ArrowLeft" size={20} className="text-gray-600" />
              </button>
              <a href="/" className="flex items-center gap-2">
                <img src="/assets/nara-logo.png" alt="NARA logo" className="w-8 h-8 object-contain" />
                <span className="sr-only">Home</span>
              </a>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                  <Icon name="ShieldCheck" className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Payment Gateway Hub</h1>
                  <p className="text-xs text-gray-500">Secure Sri Lankan Payment Processing</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm text-gray-600">Order Total</div>
                <div className="text-lg font-semibold text-green-600">
                  {orderData?.currency} {orderData?.total?.toLocaleString()}
                </div>
              </div>
              
              <div className="w-2 h-8 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>
      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-8">
              {['method', 'details', 'confirmation']?.map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                    isStepActive(step) 
                      ? "border-blue-600 bg-blue-600 text-white" 
                      : isStepComplete(step)
                        ? "border-green-600 bg-green-600 text-white" :"border-gray-300 bg-white text-gray-400"
                  )}>
                    <Icon 
                      name={isStepComplete(step) ? "Check" : getStepIcon(step)} 
                      size={16} 
                    />
                  </div>
                  
                  <div className="ml-3 hidden sm:block">
                    <div className={cn(
                      "text-sm font-medium",
                      isStepActive(step) ? "text-blue-600" : 
                      isStepComplete(step) ? "text-green-600" : "text-gray-400"
                    )}>
                      {step?.charAt(0)?.toUpperCase() + step?.slice(1)}
                    </div>
                  </div>
                  
                  {index < 2 && (
                    <div className={cn(
                      "w-16 h-0.5 ml-4",
                      isStepComplete(step) ? "bg-green-600" : "bg-gray-300"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Content - Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {currentStep === 'method' && (
              <>
                {/* Payment Method Selection */}
                <section>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Choose Payment Method
                    </h2>
                    <p className="text-gray-600">
                      Select your preferred Sri Lankan payment gateway for secure transaction processing
                    </p>
                  </div>

                  {/* Customer Type Selection */}
                  <div className="mb-8 bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="User" size={18} />
                      Customer Type
                    </h3>
                    
                    <Select
                      value={paymentDetails?.customerType}
                      onChange={handleCustomerTypeChange}
                      options={customerTypes}
                      className="max-w-md"
                    />
                    
                    <p className="text-sm text-gray-500 mt-2">
                      Different pricing and features available based on customer type
                    </p>
                  </div>

                  {/* Payment Methods Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {paymentMethods?.map((method) => (
                      <PaymentMethodCard
                        key={method?.id}
                        method={method}
                        onSelect={handlePaymentMethodSelect}
                        isSelected={selectedPaymentMethod?.id === method?.id}
                        isLoading={isProcessing && selectedPaymentMethod?.id === method?.id}
                      />
                    ))}
                  </div>

                  {/* Continue Button */}
                  {selectedPaymentMethod && (
                    <div className="mt-8 flex justify-end">
                      <Button
                        size="lg"
                        onClick={handleProceedToPayment}
                        disabled={isProcessing}
                        iconName="ArrowRight"
                        iconPosition="right"
                        className="bg-blue-600 hover:bg-blue-700 text-white min-w-[200px]"
                      >
                        {isProcessing ? "Loading..." : "Continue to Payment"}
                      </Button>
                    </div>
                  )}
                </section>
              </>
            )}

            {currentStep === 'details' && selectedPaymentMethod && (
              <>
                {/* Payment Details Form */}
                <section className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Payment Details
                    </h2>
                    <p className="text-gray-600">
                      Complete your payment using {selectedPaymentMethod?.name}
                    </p>
                  </div>

                  {/* Selected Payment Method Info */}
                  <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Icon name={selectedPaymentMethod?.type === 'government' ? 'Building' : 'CreditCard'} 
                            size={20} className="text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-900">
                          {selectedPaymentMethod?.name}
                        </div>
                        <div className="text-sm text-blue-700">
                          Processing Time: {selectedPaymentMethod?.processingTime} • 
                          Fee: {selectedPaymentMethod?.fees}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Email Address"
                        type="email"
                        required
                        value={paymentDetails?.email}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, email: e?.target?.value }))}
                        placeholder="your.email@example.com"
                      />
                      
                      <Input
                        label="Mobile Number"
                        type="tel"
                        required
                        value={paymentDetails?.phone}
                        onChange={(e) => setPaymentDetails(prev => ({ ...prev, phone: e?.target?.value }))}
                        placeholder="+94 77 123 4567"
                      />
                    </div>

                    {paymentDetails?.customerType !== 'individual' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          label="Organization Name"
                          required
                          value={paymentDetails?.organizationName}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, organizationName: e?.target?.value }))}
                          placeholder="University of Colombo"
                        />
                        
                        <Input
                          label="Tax ID / VAT Number"
                          value={paymentDetails?.taxId}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, taxId: e?.target?.value }))}
                          placeholder="134-556-789"
                        />
                      </div>
                    )}
                  </div>

                  {/* Terms and Conditions */}
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <input 
                        type="checkbox" 
                        id="terms" 
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                          Privacy Policy
                        </a>
                        . I understand that digital products are non-refundable after download.
                      </label>
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="mt-8 flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('method')}
                      disabled={isProcessing}
                      iconName="ArrowLeft"
                    >
                      Back
                    </Button>
                    
                    <Button
                      size="lg"
                      onClick={handleSubmitPayment}
                      disabled={isProcessing}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      iconName={isProcessing ? "Loader" : "Lock"}
                    >
                      {isProcessing ? "Processing Payment..." : `Pay ${orderData?.currency} ${orderData?.total?.toLocaleString()}`}
                    </Button>
                  </div>
                </section>
              </>
            )}

            {currentStep === 'confirmation' && (
              <>
                {/* Payment Confirmation */}
                <section className="text-center space-y-6">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" size={40} className="text-green-600" />
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Payment Successful!
                    </h2>
                    <p className="text-lg text-gray-600">
                      Your order has been confirmed and is being processed
                    </p>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-6 text-left max-w-md mx-auto">
                    <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Number</span>
                        <span className="font-medium">{orderData?.orderNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="font-medium">{selectedPaymentMethod?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount Paid</span>
                        <span className="font-medium text-green-600">
                          {orderData?.currency} {orderData?.total?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Date</span>
                        <span className="font-medium">
                          {new Date()?.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center">
                    <Button
                      variant="outline"
                      iconName="Download"
                    >
                      Download Receipt
                    </Button>
                    
                    <Button
                      onClick={handleBackToMarketplace}
                      iconName="ArrowLeft"
                    >
                      Back to Marketplace
                    </Button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Digital products will be available in your account within 5 minutes.
                    Check your email for download instructions.
                  </div>
                </section>
              </>
            )}
          </div>

          {/* Order Summary - Right Column */}
          <div className="space-y-6">
            <OrderSummary 
              order={orderData}
              onEdit={currentStep === 'method' ? handleBackToMarketplace : undefined}
              isProcessing={isProcessing}
            />
            
            <SecurityBadges className="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentGatewayHub;