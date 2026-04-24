import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AnaSayfa } from './pages/AnaSayfa'
import type { ShortLink } from './types'
import { generateShortCode } from './utils/generateCode'

function App() {
  const [links, setLinks] = useState<ShortLink[]>([
    {
      id: '1',
      shortCode: 'v01d',
      originalUrl: 'https://www.verylongdomainname.com/article/the-monolith-and-the-void-design-system-v1-draft',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      clickCount: 0
    },
    {
      id: '2',
      shortCode: 'p0rt4l',
      originalUrl: 'https://github.com/design-systems/monolith-void-repo/pull/42',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      clickCount: 0
    },
    {
      id: '3',
      shortCode: 'd4rk',
      originalUrl: 'https://figma.com/file/12345/void-ui-kit?node-id=0-1',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      clickCount: 0
    }
  ])

  const [currentShortLink, setCurrentShortLink] = useState<ShortLink | null>(null)

  const createShortLink = useCallback((url: string): ShortLink => {
    const newLink: ShortLink = {
      id: Date.now().toString(),
      shortCode: generateShortCode(),
      originalUrl: url,
      createdAt: new Date(),
      clickCount: 0
    }
    return newLink
  }, [])

  const handleCreateLink = useCallback((url: string) => {
    const newLink = createShortLink(url)
    setLinks(prev => [newLink, ...prev])
    setCurrentShortLink(newLink)
  }, [createShortLink])

  const handleDeleteLink = useCallback((id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id))
  }, [])

  const handleClearAll = useCallback(() => {
    setLinks([])
    setCurrentShortLink(null)
  }, [])

  const handleCopyLink = useCallback(async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <AnaSayfa
              links={links}
              currentShortLink={currentShortLink}
              onCreateLink={handleCreateLink}
              onDeleteLink={handleDeleteLink}
              onClearAll={handleClearAll}
              onCopyLink={handleCopyLink}
            />
          } 
        />
        <Route path="/gecmis" element={<div className="p-8"><h1 className="text-2xl font-bold">Geçmiş</h1><p className="text-on-surface-variant mt-2">Bu sayfa yakında eklenecek.</p></div>} />
        <Route path="/ayarlar" element={<div className="p-8"><h1 className="text-2xl font-bold">Ayarlar</h1><p className="text-on-surface-variant mt-2">Bu sayfa yakında eklenecek.</p></div>} />
        <Route path="*" element={<div className="p-8"><h1 className="text-2xl font-bold">Sayfa Bulunamadı</h1><Link to="/" className="text-primary hover:underline mt-2">Ana sayfaya dön</Link></div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
export type { ShortLink }