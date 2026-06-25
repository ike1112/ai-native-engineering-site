import Giscus from '@giscus/react';
import { COMMUNITY_CONFIG, hasGiscusConfig } from '../siteConfig';

type CommunityBlockProps = {
  term: string;
};

export default function CommunityBlock({
  term,
}: CommunityBlockProps) {
  const configured = hasGiscusConfig();

  return (
    <section className="pt-8 border-t border-zinc-200 space-y-4">
      <h4 className="font-serif text-lg font-bold text-zinc-950">
        React and comment
      </h4>

      {configured ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-3 sm:p-5">
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
        </div>
      )}
    </section>
  );
}
