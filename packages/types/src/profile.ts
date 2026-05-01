export interface SocialLink {
  id: string
  platform: string
  url: string
  order: number
}

export interface Profile {
  id: string
  name: string
  roleTitle: string
  tagline: string
  bio: string
  workingMethod: string
  avatarUrl: string | null
  resumeUrl: string | null
  location: string | null
  socialLinks: SocialLink[]
}
