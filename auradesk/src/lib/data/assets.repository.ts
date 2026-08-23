import { siteConfig } from '@/config/site'
import type { UploadedAsset } from '@/types/asset'

/**
 * Asset data layer. Upload is mocked — replace with apiClient.post when bucket is ready.
 */
export const assetsSeed: UploadedAsset[] = [
  {
    id: 'default-desk',
    name: 'minimalist-oak-desk.jpg',
    originalName: 'desk-photo-final.jpg',
    size: '245 KB',
    type: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?q=80&w=600&auto=format&fit=crop',
    uploadedAt: '2026-06-25 10:15',
  },
  {
    id: 'default-chair',
    name: 'aura-ergo-chair.jpg',
    originalName: 'ergo-chair-grey-view.jpg',
    size: '189 KB',
    type: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=600&auto=format&fit=crop',
    uploadedAt: '2026-06-25 10:18',
  },
]

export function buildAssetCdnUrl(slug: string, extension: string): string {
  const suffix = Math.random().toString(36).substring(4, 8)
  return `https://${siteConfig.cdnHost}/assets/${slug}-${suffix}.${extension}`
}

export async function getAssets(): Promise<UploadedAsset[]> {
  // return apiClient.get<UploadedAsset[]>(endpoints.assets.list)
  return assetsSeed
}
