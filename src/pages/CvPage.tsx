import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

type PdfStatus = 'loading' | 'available' | 'missing';
type PdfCheck = {
  url: string;
  status: PdfStatus;
};

const CvPage = () => {
  const { lang, t } = useI18n();
  const pdfUrl = `/cv/cv-${lang}.pdf`;
  const [pdfCheck, setPdfCheck] = useState<PdfCheck>({ url: pdfUrl, status: 'loading' });
  const pdfStatus = pdfCheck.url === pdfUrl ? pdfCheck.status : 'loading';

  useEffect(() => {
    const controller = new AbortController();

    fetch(pdfUrl, { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        const contentType = response.headers.get('content-type') || '';
        setPdfCheck({
          url: pdfUrl,
          status: response.ok && contentType.includes('application/pdf') ? 'available' : 'missing',
        });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setPdfCheck({ url: pdfUrl, status: 'missing' });
      });

    return () => controller.abort();
  }, [pdfUrl]);

  return (
    <section className="min-h-screen px-6 pt-32 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <p className="font-mono text-sm uppercase tracking-[0.35em] text-neon-cyan mb-3">
            {t.cvPage.eyebrow}
          </p>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">
                {t.cvPage.title}
              </h1>
              <p className="max-w-2xl text-gray-400 leading-relaxed">{t.cvPage.description}</p>
            </div>
            {pdfStatus === 'available' ? (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded border border-neon-cyan px-5 py-3 font-mono text-sm uppercase tracking-wider text-neon-cyan transition-colors hover:bg-neon-cyan hover:text-black"
              >
                {t.cvPage.openPdf}
                <ExternalLink size={16} />
              </a>
            ) : (
              <span className="inline-flex items-center justify-center gap-2 rounded border border-white/20 px-5 py-3 font-mono text-sm uppercase tracking-wider text-gray-500">
                {t.cvPage.openPdf}
                <ExternalLink size={16} />
              </span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45 }}
          className="glass-panel overflow-hidden rounded-2xl border-white/10 shadow-[0_0_60px_rgba(0,243,255,0.08)]"
        >
          {pdfStatus === 'available' ? (
            <object
              key={pdfUrl}
              data={pdfUrl}
              type="application/pdf"
              className="h-[72vh] min-h-[520px] w-full bg-white"
              aria-label={t.cvPage.title}
            >
              <div className="flex min-h-[520px] flex-col items-center justify-center gap-4 p-8 text-center">
                <p className="max-w-xl text-gray-300">{t.cvPage.fallback}</p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-neon-cyan hover:text-white"
                >
                  {t.cvPage.openPdf}
                  <ExternalLink size={16} />
                </a>
              </div>
            </object>
          ) : (
            <div className="flex min-h-[520px] flex-col items-center justify-center gap-4 p-8 text-center">
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-cyan">
                {pdfStatus === 'loading' ? t.cvPage.loading : t.cvPage.eyebrow}
              </p>
              {pdfStatus === 'missing' && (
                <p className="max-w-xl text-gray-300">{t.cvPage.missingPdf}</p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CvPage;
