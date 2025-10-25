import React from 'react';

const ResearchersStudentsHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-24">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6">
        <header className="space-y-4 text-center">
          <span className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-blue-700">
            Researchers & Students
          </span>
          <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Researcher & Student Engagement Hub
          </h1>
          <p className="mx-auto max-w-3xl text-base text-slate-600 sm:text-lg">
            This area is being prepared as the dedicated knowledge space for academic partners,
            student collaborators, and field researchers. Check back soon for curated resources,
            partner programs, and streamlined submission tools.
          </p>
        </header>

        <section className="grid gap-6 rounded-3xl border border-slate-200 bg-white/95 p-10 shadow-xl backdrop-blur-md md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-slate-900">What&apos;s Coming</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Research partnership briefs and data sharing guidelines</li>
              <li>• Integrated submission workflows for collaborative projects</li>
              <li>• Student innovation programs and scholarship updates</li>
              <li>• Live access to the national ocean knowledge base</li>
            </ul>
          </div>

          <div className="space-y-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-inner">
            <h2 className="text-xl font-semibold text-slate-900">Need Something Today?</h2>
            <p className="text-sm text-slate-600">
              Reach out to the NARA Research Partnerships Desk and we&apos;ll connect you with the
              relevant division.
            </p>
            <a
              href="mailto:research@nara.gov.lk"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform duration-300 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              research@nara.gov.lk
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ResearchersStudentsHub;
