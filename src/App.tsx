import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import HistoryPage from './pages/HistoryPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'
import { ShortLink, generateShortCode, copyToClipboard } from './types'

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

  const createShortLink = (url: string): ShortLink => {
    const newLink: ShortLink = {
      id: Date.now().toString(),
      shortCode: generateShortCode(),
      originalUrl: url,
      createdAt: new Date(),
      clickCount: 0
    }
    return newLink
  }

  const handleCreateLink = (url: string) => {
    const newLink = createShortLink(url)
    setLinks(prev => [newLink, ...prev])
    setCurrentShortLink(newLink)
  }

  const handleDeleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id))
  }

  const handleClearAll = () => {
    setLinks([])
    setCurrentShortLink(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage
              links={links}
              currentShortLink={currentShortLink}
              onCreateLink={handleCreateLink}
              onDeleteLink={handleDeleteLink}
              onClearAll={handleClearAll}
              onCopyLink={copyToClipboard}
            />
          } 
        />
        <Route path="/gecmis" element={<HistoryPage links={links} onDeleteLink={handleDeleteLink} onCopyLink={copyToClipboard} />} />
        <Route path="/ayarlar" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
export type { ShortLink }
