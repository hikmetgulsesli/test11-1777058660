import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { AnaSayfa } from './screens/AnaSayfa'
import { YonlendirmeEkrani } from './screens/YonlendirmeEkrani'
import { HataSayfasi } from './screens/HataSayfasi'
import { useLinkHistory } from './hooks/useLinkHistory'
import { generateShortCode } from './utils/generateCode'
import type { ShortLink } from './types'

function App() {
  const { history, addLink, removeLink, clearHistory } = useLinkHistory()

  const [currentShortLink, setCurrentShortLink] = useState<ShortLink | null>(null)

  const handleCreateLink = useCallback((url: string) => {
    const shortCode = generateShortCode()
    addLink(url, shortCode)
    const newLink: ShortLink = {
      id: Date.now().toString(),
      shortCode,
      originalUrl: url,
      createdAt: new Date(),
      clickCount: 0
    }
    setCurrentShortLink(newLink)
  }, [addLink])

  const handleDeleteLink = useCallback((id: string) => {
    removeLink(id)
  }, [removeLink])

  const handleClearAll = useCallback(() => {
    clearHistory()
    setCurrentShortLink(null)
  }, [clearHistory])

  const handleCopyLink = useCallback(async (text: string): Promise<void> => {
    await navigator.clipboard.writeText(text)
  }, [])

  const handleRedirect = useCallback((shortCode: string) => {
    console.log('Redirecting to:', shortCode)
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <AnaSayfa
              history={history}
              currentShortLink={currentShortLink}
              onCreateLink={handleCreateLink}
              onDeleteLink={handleDeleteLink}
              onClearAll={handleClearAll}
              onCopyLink={handleCopyLink}
            />
          } 
        />
        <Route 
          path="/r/:shortCode" 
          element={
            <YonlendirmeEkrani onRedirect={handleRedirect} />
          } 
        />
        <Route 
          path="/:shortCode" 
          element={
            <HataSayfasi code={404} message="Bu kısa link artık mevcut değil" />
          } 
        />
        <Route path="/gecmis" element={<div className="p-8"><h1 className="text-2xl font-bold">Geçmiş</h1><p className="text-on-surface-variant mt-2">Bu sayfa yakında eklenecek.</p></div>} />
        <Route path="/ayarlar" element={<div className="p-8"><h1 className="text-2xl font-bold">Ayarlar</h1><p className="text-on-surface-variant mt-2">Bu sayfa yakında eklenecek.</p></div>} />
        <Route path="*" element={<HataSayfasi code={404} message="Sayfa bulunamadı" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
export type { ShortLink }
