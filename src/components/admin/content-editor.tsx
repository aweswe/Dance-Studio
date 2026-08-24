'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Save, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { updateBanner, updateSiteContent, updateFAQ } from '@/actions/content'

interface BannerShape {
  active: boolean
  text: string
  ctaLink: string
}

interface FaqRow {
  question: string
  answer: string
}

export function ContentEditor({
  initialBanner,
  initialStats,
  initialFaqs,
}: {
  initialBanner: any
  initialStats: { students: string; years: string; programmes: string; awards: string }
  initialFaqs: FaqRow[]
}) {
  const router = useRouter()

  // Banner — DB shape {active, text, ctaLink}; tolerate legacy string banners
  const legacyText = typeof initialBanner === 'string' ? initialBanner : ''
  const bannerObj = (initialBanner && typeof initialBanner === 'object') ? initialBanner : null
  const [banner, setBanner] = useState<BannerShape>({
    active: bannerObj?.active ?? !!legacyText,
    text: bannerObj?.text ?? legacyText,
    ctaLink: bannerObj?.ctaLink ?? '',
  })

  const [stats, setStats] = useState(initialStats)
  const [faqs, setFaqs] = useState<FaqRow[]>(initialFaqs.length > 0 ? initialFaqs : [{ question: '', answer: '' }])
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null)

  const flash = (ok: boolean, text: string) => setFeedback({ ok, text })

  const saveBanner = async () => {
    const res = await updateBanner(banner)
    if (res.success) {
      flash(true, 'Banner saved')
      router.refresh()
    } else flash(false, res.error ?? 'Could not save banner')
  }

  const saveStats = async () => {
    const entries: [string, string][] = [
      ['stats_students', stats.students],
      ['stats_years', stats.years],
      ['stats_programmes', stats.programmes],
      ['stats_awards', stats.awards],
    ]
    let failed = false
    for (const [key, value] of entries) {
      const res = await updateSiteContent(key, value)
      if (!res.success) failed = true
    }
    if (!failed) {
      flash(true, 'Stats saved')
      router.refresh()
    } else flash(false, 'Could not save stats')
  }

  const saveFaqs = async () => {
    const clean = faqs.filter((f) => f.question.trim() && f.answer.trim())
    const res = await updateFAQ(clean)
    if (res.success) {
      flash(true, 'FAQs saved')
      router.refresh()
    } else flash(false, res.error ?? 'Could not save FAQs')
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <p className={`text-sm ${feedback.ok ? 'text-green' : 'text-red-500'}`}>{feedback.text}</p>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Settings className="text-bl" size={20} />
          <h3 className="font-display text-xl text-blk">Announcement Banner</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="banner-active"
              className="rounded text-bl focus:ring-bl"
              checked={banner.active}
              onChange={(e) => setBanner({ ...banner, active: e.target.checked })}
            />
            <label htmlFor="banner-active" className="text-sm font-medium text-blk">Show banner on website</label>
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Banner Text</label>
            <Input
              placeholder="e.g., Early bird registrations open for Summer Camp!"
              value={banner.text}
              onChange={(e) => setBanner({ ...banner, text: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Call to Action Link (Optional)</label>
            <Input
              placeholder="/contact"
              value={banner.ctaLink}
              onChange={(e) => setBanner({ ...banner, ctaLink: e.target.value })}
            />
          </div>
          <Button className="flex items-center gap-2" onClick={saveBanner}><Save size={16} /> Save Changes</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Settings className="text-bl" size={20} />
          <h3 className="font-display text-xl text-blk">Homepage Stats</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-mu mb-1">Students Trained</label>
            <Input value={stats.students} onChange={(e) => setStats({ ...stats, students: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Years of Experience</label>
            <Input value={stats.years} onChange={(e) => setStats({ ...stats, years: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Programmes</label>
            <Input value={stats.programmes} onChange={(e) => setStats({ ...stats, programmes: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm text-mu mb-1">Awards</label>
            <Input value={stats.awards} onChange={(e) => setStats({ ...stats, awards: e.target.value })} />
          </div>
        </div>
        <div className="mt-4">
          <Button className="flex items-center gap-2" onClick={saveStats}><Save size={16} /> Save Stats</Button>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
          <Settings className="text-bl" size={20} />
          <h3 className="font-display text-xl text-blk">FAQs</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start">
              <Input
                placeholder="Question"
                value={faq.question}
                onChange={(e) => {
                  const next = [...faqs]
                  next[i] = { ...next[i], question: e.target.value }
                  setFaqs(next)
                }}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) => {
                    const next = [...faqs]
                    next[i] = { ...next[i], answer: e.target.value }
                    setFaqs(next)
                  }}
                />
                <button
                  className="p-2 text-mu hover:text-red-500 rounded-md hover:bg-red-50 shrink-0"
                  onClick={() => setFaqs(faqs.filter((_, j) => j !== i))}
                  aria-label="Remove FAQ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}>
            <Plus size={16} /> Add FAQ
          </Button>
          <Button className="flex items-center gap-2" onClick={saveFaqs}><Save size={16} /> Save FAQs</Button>
        </div>
      </Card>
    </div>
  )
}
