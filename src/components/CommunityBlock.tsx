import Giscus from '@giscus/react';
import { MessageSquare, MessagesSquare, ThumbsUp } from 'lucide-react';
import { COMMUNITY_CONFIG, SITE_CONFIG, hasGiscusConfig } from '../siteConfig';

type CommunityBlockProps = {
  title: string;
  term: string;
  prompt?: string;
};

export default function CommunityBlock({
  title,
  term,
  prompt = 'What felt true here? What was unclear? What would you challenge, extend, or test differently?',
}: CommunityBlockProps) {
  const configured = hasGiscusConfig();

  return (
    <section className="pt-8 border-t border-zinc-200 space-y-6">
      <div className="space-y-3">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
          Reader Feedback Loop
        </span>
        <h4 className="font-serif text-lg font-bold text-zinc-950">
          React, comment, or ask a question
        </h4>
        <p className="text-sm text-zinc-600 leading-relaxed max-w-2xl">{prompt}</p>
        <div className="rounded-xl border border-zinc-200 bg-[#FAF9F6] p-4 space-y-2">
          <p className="font-serif text-sm font-semibold text-zinc-950">
            The most useful feedback for this notebook
          </p>
          <ul className="text-sm text-zinc-600 leading-relaxed space-y-1">
            <li>What felt earned or genuinely useful</li>
            <li>What felt unclear, too broad, or under-explained</li>
            <li>What you would test, challenge, or build on next</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="border border-zinc-200 rounded-xl bg-[#FAF9F6] p-4">
          <MessageSquare className="w-4 h-4 text-zinc-900 mb-3" />
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              Article thread
            </p>
            <p className="font-serif text-sm font-bold text-zinc-950">Comment on "{title}"</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Keep feedback attached to the piece so the strongest questions and reactions stay with it.
            </p>
          </div>
        </div>

        <a
          href={SITE_CONFIG.githubDiscussionsUrl}
          target="_blank"
          rel="noreferrer"
          className="border border-zinc-200 rounded-xl bg-white p-4 hover:border-zinc-300 transition-colors"
        >
          <MessagesSquare className="w-4 h-4 text-zinc-900 mb-3" />
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              Discussions
            </p>
            <p className="font-serif text-sm font-bold text-zinc-950">Ask a broader question</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Use GitHub Discussions for bigger questions, follow-ups, or topic threads.
            </p>
          </div>
        </a>

        <a
          href={SITE_CONFIG.githubRepoUrl}
          target="_blank"
          rel="noreferrer"
          className="border border-zinc-200 rounded-xl bg-white p-4 hover:border-zinc-300 transition-colors"
        >
          <ThumbsUp className="w-4 h-4 text-zinc-900 mb-3" />
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">Source</p>
            <p className="font-serif text-sm font-bold text-zinc-950">Follow the notebook repo</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Keep up with changes, stars, and commits in the public repository.
            </p>
          </div>
        </a>

        <div className="border border-zinc-200 rounded-xl bg-white p-4">
          <ThumbsUp className="w-4 h-4 text-zinc-900 mb-3" />
          <div className="space-y-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
              Reactions
            </p>
            <p className="font-serif text-sm font-bold text-zinc-950">Use quick signals too</p>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Reactions help surface what resonated, even when you do not want to write a full reply.
            </p>
          </div>
        </div>
      </div>

      {configured ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <Giscus
            id={`giscus-${term}`}
            repo={COMMUNITY_CONFIG.giscusRepo! as `${string}/${string}`}
            repoId={COMMUNITY_CONFIG.giscusRepoId!}
            category={COMMUNITY_CONFIG.giscusCategory!}
            categoryId={COMMUNITY_CONFIG.giscusCategoryId!}
            mapping={
              COMMUNITY_CONFIG.giscusMapping as
                | 'pathname'
                | 'url'
                | 'title'
                | 'og:title'
                | 'specific'
                | 'number'
            }
            term={term}
            strict={COMMUNITY_CONFIG.giscusStrict as '0' | '1'}
            reactionsEnabled={COMMUNITY_CONFIG.giscusReactionsEnabled as '0' | '1'}
            emitMetadata={COMMUNITY_CONFIG.giscusEmitMetadata as '0' | '1'}
            inputPosition={COMMUNITY_CONFIG.giscusInputPosition as 'top' | 'bottom'}
            theme={COMMUNITY_CONFIG.giscusTheme}
            lang={COMMUNITY_CONFIG.giscusLang}
            loading="lazy"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-4 sm:p-5 space-y-2">
          <p className="font-serif text-sm font-semibold text-zinc-950">
            Comments are almost ready, but Giscus is not configured yet.
          </p>
          <p className="text-sm text-zinc-600 leading-relaxed">
            Enable GitHub Discussions for the repo, add the Giscus environment variables in `.env.local`,
            and this section will turn into the live reaction and comment thread for "{title}".
          </p>
          <p className="font-mono text-[11px] text-zinc-500">Expected thread key: {term}</p>
        </div>
      )}
    </section>
  );
}
