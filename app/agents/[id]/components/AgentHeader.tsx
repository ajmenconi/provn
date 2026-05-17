import { Agent, LetterGrade } from '@/types/agent';

function gradeColor(grade: LetterGrade): string {
  if (grade === 'A+' || grade === 'A') return 'bg-emerald-500 ring-emerald-400';
  if (grade === 'B+' || grade === 'B') return 'bg-amber-500 ring-amber-400';
  return 'bg-orange-500 ring-orange-400';
}

function yearsLicensed(issueDateStr: string): number {
  const issued = new Date(issueDateStr);
  const now = new Date();
  return now.getFullYear() - issued.getFullYear();
}

function formatLicenseDate(issueDateStr: string): string {
  return new Date(issueDateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

interface Props {
  agent: Agent;
}

export default function AgentHeader({ agent }: Props) {
  const years = yearsLicensed(agent.licenseIssueDate);

  return (
    <div className="bg-slate-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Top row */}
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          {/* Headshot */}
          <div className="shrink-0">
            {agent.headshotUrl ? (
              <img
                src={agent.headshotUrl}
                alt={agent.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover ring-2 ring-slate-600"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-slate-700 ring-2 ring-slate-600 flex items-center justify-center">
                <span className="text-3xl sm:text-4xl font-bold text-slate-400">
                  {agent.name.split(' ').map((n) => n[0]).join('')}
                </span>
              </div>
            )}
          </div>

          {/* Name + details */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{agent.name}</h1>

            {/* Brokerage */}
            <div className="flex items-center gap-2 mt-1">
              {agent.brokerageLogoUrl ? (
                <img src={agent.brokerageLogoUrl} alt={agent.brokerageName} className="h-5 object-contain" />
              ) : null}
              <span className="text-slate-300 text-sm">{agent.brokerageName}</span>
            </div>

            {/* Location */}
            <p className="text-slate-400 text-sm mt-1">
              {agent.primaryCity}, {agent.primaryCounty} County, CA
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {/* License type */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  agent.licenseType === 'Broker'
                    ? 'bg-amber-500 text-amber-950'
                    : 'bg-slate-600 text-slate-200'
                }`}
              >
                {agent.licenseType}
              </span>

              {/* License status */}
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  agent.licenseStatus === 'Active'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {agent.licenseStatus}
              </span>

              {/* DRE license */}
              <span className="text-xs text-slate-400">
                DRE #{' '}
                <a
                  href="https://www2.dre.ca.gov/PublicASP/pplinfo.asp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline hover:text-blue-300"
                >
                  {agent.licenseNumber}
                </a>
              </span>
            </div>

            {/* License date */}
            <p className="text-xs text-slate-500 mt-1.5">
              Licensed {formatLicenseDate(agent.licenseIssueDate)} &mdash;{' '}
              <span className="text-slate-300 font-medium">Licensed {years} years</span>
              <span className="block text-slate-600 mt-0.5">Source: CA DRE</span>
            </p>

            {/* Languages */}
            {agent.languages.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {agent.languages.map((lang) => (
                  <span
                    key={lang}
                    className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Provn Score */}
          <div className="flex flex-col items-center shrink-0 mt-2 sm:mt-0">
            <div
              className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full ring-4 ${gradeColor(agent.provnLetterGrade)} flex flex-col items-center justify-center shadow-lg`}
            >
              <span className="text-3xl sm:text-4xl font-black text-white leading-none">
                {agent.provnLetterGrade}
              </span>
              <span className="text-xs text-white/80 mt-0.5">{agent.provnScore}/100</span>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-center">Provn Score</p>
            <p className="text-xs text-slate-600 text-center">Verified by Provn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
