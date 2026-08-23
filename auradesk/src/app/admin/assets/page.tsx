'use client'

import React, { useState, useRef } from 'react'
import { Upload, FileCode, CheckCircle, Copy, ExternalLink, Trash2, File, Image as ImageIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { assetsSeed, buildAssetCdnUrl } from '@/lib/data/assets.repository'
import type { UploadedAsset, UploadQueueItem } from '@/types/asset'

export default function AdminAssetsPage() {
  const [queue, setQueue] = useState<UploadQueueItem[]>([])
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>(assetsSeed)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Format file size helper
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  // Handle file addition
  const addFilesToQueue = (files: FileList) => {
    const newItems: UploadQueueItem[] = Array.from(files).map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      progress: 0,
      status: 'idle'
    }))
    setQueue((prev) => [...prev, ...newItems])
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = () => {
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Simulate Cloud Bucket upload
  const uploadItem = async (item: UploadQueueItem) => {
    if (item.status === 'uploading' || item.status === 'success') return

    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 0 } : q))
    )

    // Simulate upload progress over 2 seconds
    const duration = 1500
    const steps = 10
    const intervalTime = duration / steps
    
    for (let step = 1; step <= steps; step++) {
      await new Promise((resolve) => setTimeout(resolve, intervalTime))
      setQueue((prev) =>
        prev.map((q) =>
          q.id === item.id ? { ...q, progress: Math.min((step / steps) * 100, 95) } : q
        )
      )
    }

    // Done uploading - generate CDN URL
    const fileExtension = item.file.name.split('.').pop() || 'png'
    const nameSlug = item.file.name
      .split('.')[0]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
    const finalUrl = buildAssetCdnUrl(nameSlug, fileExtension)

    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: 'success', progress: 100, url: finalUrl } : q))
    )

    // Add to completed assets gallery
    const newAsset: UploadedAsset = {
      id: item.id,
      name: `${nameSlug}.${fileExtension}`,
      originalName: item.file.name,
      size: formatBytes(item.file.size),
      type: item.file.type,
      url: finalUrl,
      uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    }
    setUploadedAssets((prev) => [newAsset, ...prev])
  }

  const uploadAll = async () => {
    const idleItems = queue.filter((item) => item.status === 'idle')
    await Promise.all(idleItems.map((item) => uploadItem(item)))
  }

  const removeQueueItem = (id: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== id))
  }

  const deleteAsset = (id: string) => {
    setUploadedAssets((prev) => prev.filter((asset) => asset.id !== id))
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="flex-1 bg-background py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="border-b border-border/40 pb-6 mb-8 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Admin Environment
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Asset Bucket Manager
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload images, layouts, or assets directly to {siteConfig.name}&apos;s cloud CDN bucket and copy the generated link to use in your code.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Center Upload Area */}
          <div className="lg:col-span-2 space-y-6 text-left">
            
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileInput}
              className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragOver
                  ? 'border-primary bg-primary/5 scale-[0.99]'
                  : 'border-border bg-card/50 hover:bg-card hover:border-foreground/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                multiple
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Drag &amp; drop file here, or <span className="text-primary hover:underline">browse files</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Supports PNG, JPG, JPEG, WEBP, SVG up to 10MB
              </p>
            </div>

            {/* Upload Queue Section */}
            {queue.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h3 className="text-sm font-bold text-foreground">
                    Upload Queue ({queue.length} file{queue.length > 1 ? 's' : ''})
                  </h3>
                  <button
                    onClick={uploadAll}
                    disabled={queue.every((item) => item.status === 'success' || item.status === 'uploading')}
                    className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                  >
                    Upload All
                  </button>
                </div>

                <div className="divide-y divide-border/40 max-h-72 overflow-y-auto pr-1">
                  {queue.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden min-w-0 flex-1">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-accent text-foreground">
                          {item.file.type.startsWith('image/') ? (
                            <ImageIcon className="h-4 w-4" />
                          ) : (
                            <File className="h-4 w-4" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {item.file.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {formatBytes(item.file.size)}
                          </p>
                          {item.status === 'uploading' && (
                            <div className="w-full bg-accent h-1.5 rounded-full mt-1.5 overflow-hidden">
                              <motion.div
                                className="bg-primary h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${item.progress}%` }}
                                transition={{ ease: 'easeInOut' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.status === 'success' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Ready
                          </span>
                        ) : item.status === 'uploading' ? (
                          <span className="text-[10px] font-semibold text-primary animate-pulse">
                            Uploading...
                          </span>
                        ) : (
                          <button
                            onClick={() => uploadItem(item)}
                            className="rounded bg-accent hover:bg-accent/80 px-2 py-1 text-[10px] font-bold text-foreground"
                          >
                            Upload
                          </button>
                        )}
                        <button
                          disabled={item.status === 'uploading'}
                          onClick={() => removeQueueItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Uploaded Assets List */}
          <div className="space-y-6 text-left">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-foreground border-b border-border/40 pb-3">
                Cloud Assets ({uploadedAssets.length})
              </h2>

              <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1">
                {uploadedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="flex flex-col rounded-lg border border-border/60 bg-accent/20 p-3 space-y-2 hover:border-border transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-accent border border-border text-foreground">
                        <FileCode className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-semibold text-foreground truncate" title={asset.name}>
                          {asset.name}
                        </h4>
                        <p className="text-[9px] text-muted-foreground leading-none mt-1">
                          Original: {asset.originalName} ({asset.size})
                        </p>
                      </div>
                      <button
                        onClick={() => deleteAsset(asset.id)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Delete asset"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Copy Box */}
                    <div className="flex items-center gap-1 bg-card rounded border border-border/80 px-2 py-1">
                      <span className="text-[10px] text-muted-foreground truncate flex-grow">
                        {asset.url}
                      </span>
                      <button
                        onClick={() => copyToClipboard(asset.url, asset.id)}
                        className="text-muted-foreground hover:text-foreground p-1 transition-colors relative"
                        title="Copy CDN URL"
                      >
                        {copiedId === asset.id ? (
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 absolute right-full mr-1.5 top-1/2 -translate-y-1/2 bg-card border border-border px-1 rounded shadow">
                            Copied!
                          </span>
                        ) : null}
                        <Copy className="h-3 w-3" />
                      </button>
                      <a
                        href={asset.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-muted-foreground hover:text-foreground p-1 transition-colors"
                        title="Open asset link"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
