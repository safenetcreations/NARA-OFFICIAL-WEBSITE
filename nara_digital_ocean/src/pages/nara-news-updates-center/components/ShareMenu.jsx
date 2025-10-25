import React, { useCallback, useMemo, useState } from 'react';
import {
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Download,
  Link as LinkIcon,
  MessageCircle,
  Copy
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildArticleSharePayload, downloadArticlePdf } from '../../../utils/share';

const SHARE_OPTIONS = [
  { key: 'facebook', icon: Facebook, color: '#1877F2' },
  { key: 'twitter', icon: Twitter, color: '#1DA1F2' },
  { key: 'linkedin', icon: Linkedin, color: '#0A66C2' },
  { key: 'whatsapp', icon: MessageCircle, color: '#25D366' },
  { key: 'email', icon: Mail, color: '#6366F1' },
  { key: 'copy', icon: Copy, color: '#0EA5E9' }
];

const ShareMenu = ({
  article,
  showLabel = false,
  showLink = false,
  className = '',
  size = 'md',
  orientation = 'row'
}) => {
  const { t, i18n } = useTranslation('news');
  const [copied, setCopied] = useState(false);
  const sharePayload = useMemo(() => buildArticleSharePayload(article, i18n.language), [article, i18n.language]);
  const canUseNavigator = typeof navigator !== 'undefined';

  const handleShare = useCallback(
    (platform) => {
      setCopied(false);
      if (!sharePayload?.url) return;

      if (platform === 'copy') {
        if (canUseNavigator && navigator.clipboard?.writeText) {
          navigator.clipboard
            .writeText(sharePayload.url)
            .then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            })
            .catch(() => {
              setCopied(false);
            });
        }
        return;
      }

      if (platform === 'email') {
        const mailto = `mailto:?subject=${encodeURIComponent(sharePayload.title)}&body=${encodeURIComponent(
          `${sharePayload.summary}\n\n${sharePayload.url}`
        )}`;
        window.open(mailto, '_blank', 'noopener');
        return;
      }

      if (platform === 'whatsapp') {
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
          `${sharePayload.title}\n${sharePayload.url}`
        )}`;
        window.open(whatsappUrl, '_blank', 'noopener');
        return;
      }

      const encodedUrl = encodeURIComponent(sharePayload.url);
      const encodedTitle = encodeURIComponent(sharePayload.title);
      const encodedSummary = encodeURIComponent(sharePayload.summary ?? '');

      const urlMap = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedSummary}`
      };

      const shareUrl = urlMap[platform];
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'noopener');
      }
    },
    [canUseNavigator, sharePayload]
  );

  const handlePdfDownload = useCallback(async () => {
    try {
      await downloadArticlePdf(article, { language: i18n.language, t });
    } catch (error) {
      console.error('Failed to download article PDF', error);
    }
  }, [article, i18n.language, t]);

  const buttonClasses = useMemo(() => {
    const base =
      'inline-flex items-center justify-center rounded-lg bg-transparent text-slate-500 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 hover:scale-110';
    const sizes = {
      sm: 'h-8 w-8 text-base',
      md: 'h-10 w-10 text-lg',
      lg: 'h-12 w-12 text-xl'
    };
    return `${base} ${sizes[size] || sizes.md}`;
  }, [size]);

  const iconSize = useMemo(() => {
    if (size === 'sm') return 16;
    if (size === 'lg') return 22;
    return 18;
  }, [size]);

  const containerClasses = useMemo(() => {
    const base = 'flex items-center gap-2';
    const orient = orientation === 'column' ? 'flex-col items-start gap-3' : 'flex-row flex-wrap';
    return `${base} ${orient} ${className}`;
  }, [className, orientation]);

  return (
    <div className={containerClasses} data-share-menu-root>
      {showLabel && (
        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Share2 className="h-3.5 w-3.5" />
          {t('share.title')}
        </span>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {SHARE_OPTIONS.map(({ key, icon: Icon, color }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleShare(key)}
            className={buttonClasses}
            aria-label={t(`share.${key}`)}
          >
            <Icon size={iconSize} style={{ color }} />
          </button>
        ))}
        <button
          type="button"
          onClick={handlePdfDownload}
          className={buttonClasses}
          aria-label={t('share.pdf')}
        >
          <Download size={iconSize} className="text-blue-600" />
        </button>
      </div>
      {showLink && (
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <LinkIcon className="h-3 w-3 text-blue-500" />
          <span className="truncate max-w-[160px] md:max-w-[220px]">{sharePayload.url}</span>
          {copied && <span className="text-blue-600 font-medium">{t('share.copied')}</span>}
        </div>
      )}
      {!showLink && copied && (
        <span className="text-[11px] font-medium text-blue-600">{t('share.copied')}</span>
      )}
    </div>
  );
};

export default ShareMenu;
