import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import MultilingualContent from '../../components/compliance/MultilingualContent';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { t, i18n } = useTranslation('contact');
  const language = useMemo(() => (i18n.language || 'en').split('-')[0], [i18n.language]);
  const sections = t('sections', { returnObjects: true });
  const info = sections?.info || {};
  const formSection = sections?.form || {};
  const mapSection = sections?.map || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const renderLines = (lines = []) =>
    lines.map((line, index) => (
      <span key={`${line}-${index}`}>
        {line}
        {index !== lines.length - 1 && <br />}
      </span>
    ));

  return (
    <MultilingualContent language={language}>
      <Helmet>
        <title>{t('seo.title')}</title>
        <meta name="description" content={t('seo.description')} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 py-20 px-4 text-white">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="mb-6 text-5xl font-bold">{t('hero.title')}</h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-100">{t('hero.description')}</p>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 md:grid-cols-2">
              {/* Contact Information */}
              <div>
                <h2 className="mb-8 text-3xl font-bold text-slate-900">{info.title}</h2>

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-blue-100 p-3">
                      <Icon name="MapPin" size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.office?.title}</h3>
                      <p className="text-slate-600">{renderLines(info.office?.lines)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-green-100 p-3">
                      <Icon name="Phone" size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.phone?.title}</h3>
                      <p className="text-slate-600">{renderLines(info.phone?.lines)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-purple-100 p-3">
                      <Icon name="Mail" size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.email?.title}</h3>
                      <p className="text-slate-600">
                        {info.email?.primary && (
                          <>
                            <a href={`mailto:${info.email.primary}`} className="text-blue-600 hover:underline">
                              {info.email.primary}
                            </a>
                            <br />
                          </>
                        )}
                        {info.email?.secondary && (
                          <a href={`mailto:${info.email.secondary}`} className="text-blue-600 hover:underline">
                            {info.email.secondary}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="rounded-lg bg-amber-100 p-3">
                      <Icon name="Clock" size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-slate-900">{info.hours?.title}</h3>
                      <p className="text-slate-600">
                        {(info.hours?.lines || []).map((line, index) => (
                          <span
                            key={`${line}-${index}`}
                            className={index === (info.hours?.lines?.length || 0) - 1 ? 'text-sm text-slate-500' : ''}
                          >
                            {line}
                            {index !== (info.hours?.lines?.length || 0) - 1 && <br />}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                  <h3 className="mb-4 text-lg font-semibold text-slate-900">{info.quickLinks?.title}</h3>
                  <div className="space-y-3">
                    <a href="/procurement-recruitment-portal" className="flex items-center text-blue-600 transition-colors hover:text-blue-700">
                      <Icon name="Briefcase" size={18} className="mr-2" />
                      {info.quickLinks?.careers}
                    </a>
                    <a href="/nara-news-updates-center" className="flex items-center text-blue-600 transition-colors hover:text-blue-700">
                      <Icon name="Newspaper" size={18} className="mr-2" />
                      {info.quickLinks?.news}
                    </a>
                    <a href="/emergency-response-network" className="flex items-center text-red-600 transition-colors hover:text-red-700">
                      <Icon name="AlertTriangle" size={18} className="mr-2" />
                      {info.quickLinks?.emergency}
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="mb-8 text-3xl font-bold text-slate-900">{formSection.title}</h2>

                <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg">
                  <div className="mb-6">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                      {formSection.fields?.name?.label} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={formSection.fields?.name?.placeholder}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                      {formSection.fields?.email?.label} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={formSection.fields?.email?.placeholder}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="subject" className="mb-2 block text-sm font-medium text-slate-700">
                      {formSection.fields?.subject?.label} *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={formSection.fields?.subject?.placeholder}
                    />
                  </div>

                  <div className="mb-6">
                    <label htmlFor="message" className="mb-2 block text-sm font-medium text-slate-700">
                      {formSection.fields?.message?.label} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full resize-none rounded-lg border border-slate-300 px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                      placeholder={formSection.fields?.message?.placeholder}
                    />
                  </div>

                  <Button type="submit" className="flex w-full items-center justify-center gap-2 bg-blue-600 py-3 text-lg font-medium text-white hover:bg-blue-700">
                    <Icon name="Send" size={20} />
                    {formSection.submit}
                  </Button>

                  <p className="mt-4 text-center text-sm text-slate-500">{formSection.responseNotice}</p>
                  <p className="mt-2 text-center text-xs text-slate-400">{formSection.disclaimer}</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="bg-slate-50 py-16 px-4">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-slate-900">{mapSection.title}</h2>
            <div className="overflow-hidden rounded-xl shadow-2xl border border-slate-200">
              <iframe
                title="NARA Location Map"
                src="https://www.google.com/maps?q=National+Aquatic+Resources+Research+and+Development+Agency+NARA+Crow+Island+Colombo+15+Sri+Lanka&output=embed"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
            <div className="mt-6 text-center">
              <a
                href="https://www.google.com/maps/dir//National+Aquatic+Resources+Research+and+Development+Agency+(NARA),+Crow+Island,+Colombo+15,+Sri+Lanka"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                <Icon name="Navigation" size={20} />
                {mapSection.getDirections}
              </a>
            </div>
          </div>
        </section>
      </div>
    </MultilingualContent>
  );
};

export default ContactUs;
