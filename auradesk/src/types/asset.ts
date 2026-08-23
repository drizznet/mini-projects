export interface UploadedAsset {
  id: string
  name: string
  originalName: string
  size: string
  type: string
  url: string
  uploadedAt: string
}

export interface UploadQueueItem {
  id: string
  file: File
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  url?: string
}
