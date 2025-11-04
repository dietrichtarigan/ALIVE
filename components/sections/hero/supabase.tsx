import { type VariantProps } from 'class-variance-authority'
import { ArrowRightIcon } from 'lucide-react'
import { ReactNode } from 'react'

import { siteConfig } from '@/config/site'
import { createSupabaseServerClient } from '@/lib/supabase-server'
import { cn } from '@/lib/utils'

import Github from '../../logos/github'
import { Badge } from '../../ui/badge'
import { Button, buttonVariants } from '../../ui/button'
import Glow from '../../ui/glow'
import { Mockup, MockupFrame } from '../../ui/mockup'
import Screenshot from '../../ui/screenshot'
import { Section } from '../../ui/section'

interface HeroButtonProps {
  href: string
  text: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  icon?: ReactNode
  iconRight?: ReactNode
}

interface HeroProps {
  title?: string
  description?: string
  mockup?: ReactNode | false
  badge?: ReactNode | false
  buttons?: HeroButtonProps[] | false
  className?: string
  slug?: string
}

async function getHeroContent(slug: string = 'home-hero') {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  return data
}

export default async function Hero({
  title,
  description,
  mockup = (
    <Screenshot
      srcLight="/dashboard-light.png"
      srcDark="/dashboard-dark.png"
      alt="Launch UI app screenshot"
      width={1248}
      height={765}
      className="w-full"
    />
  ),
  badge = (
    <Badge variant="outline" className="animate-appear">
      <span className="text-muted-foreground">
        New version of Launch UI is out!
      </span>
      <a href={siteConfig.getStartedUrl} className="flex items-center gap-1">
        Get started
        <ArrowRightIcon className="size-3" />
      </a>
    </Badge>
  ),
  buttons,
  className,
  slug = 'home-hero',
}: HeroProps) {
  // Try to load from Supabase, fallback to props
  const content = await getHeroContent(slug)

  const heroTitle = content?.title || title || 'Give your big idea the design it deserves'
  const heroDescription =
    content?.subtitle ||
    description ||
    'Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.'

  const fallbackHeroButtons: HeroButtonProps[] = content?.cta_primary_text
    ? [
        {
          href: content.cta_primary_url || siteConfig.getStartedUrl,
          text: content.cta_primary_text,
          variant: 'default' as HeroButtonProps['variant'],
        },
        ...(content.cta_secondary_text
          ? [
              {
                href: content.cta_secondary_url || siteConfig.links.github,
                text: content.cta_secondary_text,
                variant: 'glow' as HeroButtonProps['variant'],
                icon: <Github className="mr-2 size-4" />,
              },
            ]
          : []),
      ]
    : [
        {
          href: siteConfig.getStartedUrl,
          text: 'Get Started',
          variant: 'default' as HeroButtonProps['variant'],
        },
        {
          href: siteConfig.links.github,
          text: 'Github',
          variant: 'glow' as HeroButtonProps['variant'],
          icon: <Github className="mr-2 size-4" />,
        },
      ]

  const heroButtons = buttons || fallbackHeroButtons

  return (
    <Section className={cn('fade-bottom overflow-hidden pb-0 sm:pb-0 md:pb-0', className)}>
      <div className="max-w-container mx-auto flex flex-col gap-12 pt-16 sm:gap-24">
        <div className="flex flex-col items-center gap-6 text-center sm:gap-12">
          {badge !== false && badge}
          <h1 className="animate-appear from-foreground to-foreground dark:to-muted-foreground relative z-10 inline-block bg-linear-to-r bg-clip-text text-4xl leading-tight font-semibold text-balance text-transparent drop-shadow-2xl sm:text-6xl sm:leading-tight md:text-8xl md:leading-tight">
            {heroTitle}
          </h1>
          <p className="text-md animate-appear text-muted-foreground relative z-10 max-w-[740px] font-medium text-balance opacity-0 delay-100 sm:text-xl">
            {heroDescription}
          </p>
          {heroButtons && heroButtons.length > 0 && (
            <div className="animate-appear relative z-10 flex justify-center gap-4 opacity-0 delay-300">
              {heroButtons.map((button, index) => (
                <Button key={index} variant={button.variant || 'default'} size="lg" asChild>
                  <a href={button.href}>
                    {button.icon}
                    {button.text}
                    {button.iconRight || null}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </div>
        {mockup !== false && (
          <div className="pointer-events-none relative z-10 mb-[-20vw] px-4 sm:mb-[-15vw] sm:px-6 md:mb-[-10vw] md:px-8">
            <Mockup className="pointer-events-auto">
              <MockupFrame />
              {mockup}
              <Glow className="from-pink-500 via-purple-500 to-blue-500 blur-[120px] sm:blur-[200px]" />
            </Mockup>
          </div>
        )}
      </div>
    </Section>
  )
}
