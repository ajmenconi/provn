import { Agent } from '@/types/agent';
import SourceLabel from './SourceLabel';

interface Props {
  agent: Agent;
}

export default function PremiumSection({ agent }: Props) {
  if (!agent.isPremium) return null;

  return (
    <section>
      {/* Premium badge header */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs font-semibold bg-amber-500 text-amber-950 px-3 py-1 rounded-full">
          Premium Profile
        </span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <div className="space-y-4">
        {/* Intro video */}
        {agent.introVideoUrl && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Agent Introduction
            </p>
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-900">
              <iframe
                src={agent.introVideoUrl}
                className="w-full h-full"
                allowFullScreen
                title="Agent introduction video"
              />
            </div>
            <SourceLabel source="Agent-submitted · Approved by Provn" />
          </div>
        )}

        {/* Win stories */}
        {agent.winStories.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
              Verified Win Stories
            </p>
            <div className="space-y-4">
              {agent.winStories.map((story, i) => (
                <div key={i} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                      {story.dealType}
                    </span>
                    {story.clientVerified && (
                      <span className="shrink-0 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Client Verified
                      </span>
                    )}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-gray-500">Challenge: </span>
                      <span className="text-gray-700">{story.challenge}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-500">Outcome: </span>
                      <span className="text-gray-700">{story.outcome}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">Transaction value</span>
                    <span className="text-lg font-black text-gray-900">{story.dollarImpact}</span>
                  </div>
                  <SourceLabel source="Agent-submitted · Client confirmation on file · Verified by Provn" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured neighborhood */}
        {agent.featuredNeighborhood && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Featured Market
              </p>
              <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
                {agent.featuredNeighborhood}
              </span>
            </div>
            <div className="bg-gray-100 rounded-lg h-40 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                <p className="text-sm font-medium">Recent Sales Map</p>
                <p className="text-xs">Mapbox integration — configure API key to enable</p>
              </div>
            </div>
            <SourceLabel source="Source: MLS Data · Agent-selected featured market" />
          </div>
        )}
      </div>
    </section>
  );
}
