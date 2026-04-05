'use client'

import { useState } from 'react'

interface UploadedFont {
  filename: string
  url: string
  purpose: string
}

export default function UploadFontsPage() {
  const [fonts, setFonts] = useState<UploadedFont[]>([])
  const [uploading, setUploading] = useState(false)
  const [currentPurpose, setCurrentPurpose] = useState('headlines')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/upload-font', {
        method: 'POST',
        body: formData,
      })
      
      const data = await res.json()
      
      if (data.url) {
        setFonts(prev => [...prev, {
          filename: data.filename,
          url: data.url,
          purpose: currentPurpose
        }])
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  const copyConfig = () => {
    const config = fonts.map(f => `${f.purpose}: ${f.url}`).join('\n')
    navigator.clipboard.writeText(config)
  }

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-charcoal mb-8">Upload Brand Fonts</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-sand mb-8">
          <h2 className="text-lg font-medium text-charcoal mb-4">Upload a Font File</h2>
          
          <div className="mb-4">
            <label className="block text-sm text-charcoal/70 mb-2">Font Purpose</label>
            <select 
              value={currentPurpose}
              onChange={(e) => setCurrentPurpose(e.target.value)}
              className="w-full p-3 border border-sand rounded bg-cream"
            >
              <option value="headlines">Headlines (Display Font)</option>
              <option value="body">Body Text</option>
              <option value="accent">Accent / Navigation</option>
            </select>
          </div>
          
          <label className="block">
            <span className="sr-only">Choose font file</span>
            <input
              type="file"
              accept=".woff,.woff2,.ttf,.otf"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-charcoal/70
                file:mr-4 file:py-3 file:px-6
                file:rounded file:border-0
                file:text-sm file:font-medium
                file:bg-charcoal file:text-cream
                hover:file:bg-charcoal/90
                file:cursor-pointer cursor-pointer
                disabled:opacity-50"
            />
          </label>
          
          {uploading && <p className="mt-4 text-charcoal/70">Uploading...</p>}
        </div>

        {fonts.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-sand">
            <h2 className="text-lg font-medium text-charcoal mb-4">Uploaded Fonts</h2>
            
            <div className="space-y-3 mb-6">
              {fonts.map((font, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-cream rounded">
                  <div>
                    <p className="font-medium text-charcoal">{font.filename}</p>
                    <p className="text-sm text-charcoal/50">{font.purpose}</p>
                  </div>
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">Uploaded</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-charcoal/5 rounded text-sm font-mono overflow-auto">
              <p className="text-charcoal/50 mb-2">Font URLs:</p>
              {fonts.map((f, i) => (
                <p key={i} className="text-charcoal break-all">{f.purpose}: {f.url}</p>
              ))}
            </div>
            
            <button
              onClick={copyConfig}
              className="mt-4 w-full py-3 bg-charcoal text-cream rounded hover:bg-charcoal/90 transition-colors"
            >
              Copy Font URLs
            </button>
          </div>
        )}
        
        <p className="mt-8 text-sm text-charcoal/50">
          Upload your 3 brand fonts (.woff2 preferred). Once uploaded, share the font URLs with me and I will configure them in the site.
        </p>
      </div>
    </div>
  )
}
