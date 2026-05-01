import type { Profile } from '@portfolio/types'

interface IdentitySectionProps {
  profile: Profile
}

export function IdentitySection({ profile }: IdentitySectionProps) {
  return (
    <section aria-labelledby="identity-heading">
      <p className="text-xs font-mono text-text-disabled uppercase tracking-[0.2em] mb-4">About Me</p>
      <h2 id="identity-heading" className="text-display-md font-bold text-text-primary mb-6">
        {profile.name}
      </h2>
      <p className="text-lg text-text-secondary mb-4">{profile.roleTitle}</p>
      <div className="text-base text-text-secondary leading-relaxed space-y-4 max-w-prose">
        {profile.bio.split('\n\n').map((paragraph, i) => (
          <p key={i}>
            {paragraph.split('\n').map((line, j, arr) => (
              <span key={j}>
                {line}
                {j < arr.length - 1 && <br />}
              </span>
            ))}
          </p>
        ))}
      </div>
      {profile.location && (
        <p className="text-sm text-text-secondary mt-4">{profile.location}</p>
      )}
      {profile.socialLinks.length > 0 && (
        <div className="flex gap-4 mt-6">
          {profile.socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary hover:text-text-primary transition-colors underline underline-offset-4"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
