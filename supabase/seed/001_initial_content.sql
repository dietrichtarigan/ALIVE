-- Seed hero sections
INSERT INTO public.hero_sections (slug, title, subtitle, cta_primary_text, cta_primary_url, cta_secondary_text, cta_secondary_url, is_published, position)
VALUES 
  (
    'home-hero',
    'Give your big idea the design it deserves',
    'Professionally designed blocks and templates built with React, Shadcn/ui and Tailwind that will help your product stand out.',
    'Get Started',
    '#get-started',
    'Github',
    'https://github.com',
    true,
    0
  );

-- Seed CTA blocks
INSERT INTO public.cta_blocks (slug, title, description, cta_text, cta_url, is_published, position)
VALUES
  (
    'home-cta',
    'Ready to get started?',
    'Join thousands of teams who trust our platform to build amazing products.',
    'Start your free trial',
    '#signup',
    true,
    0
  );

-- Seed FAQ items
INSERT INTO public.faq_items (slug, question, answer, category, is_published, position)
VALUES
  (
    'what-is-launch-ui',
    'What is Launch UI?',
    'Launch UI is a collection of professionally designed React components built with Shadcn/ui and Tailwind CSS to help you build beautiful websites faster.',
    'general',
    true,
    0
  ),
  (
    'how-does-pricing-work',
    'How does pricing work?',
    'We offer flexible pricing plans to suit teams of all sizes. All plans include core features with premium tiers offering advanced capabilities and priority support.',
    'pricing',
    true,
    1
  ),
  (
    'can-i-customize',
    'Can I customize the components?',
    'Yes! All components are fully customizable. You have access to the source code and can modify them to match your brand and requirements.',
    'technical',
    true,
    2
  ),
  (
    'what-support-included',
    'What support is included?',
    'All plans include email support. Premium and Enterprise plans include priority support with faster response times and dedicated account management.',
    'support',
    true,
    3
  );

-- Seed pricing tiers
INSERT INTO public.pricing_tiers (slug, name, price, currency, billing_period, description, features, cta_text, cta_url, is_popular, is_published, position)
VALUES
  (
    'starter',
    'Starter',
    0,
    'USD',
    'month',
    'Perfect for getting started',
    '["Access to basic components", "Community support", "Regular updates", "Personal projects"]',
    'Get Started',
    '#signup',
    false,
    true,
    0
  ),
  (
    'pro',
    'Pro',
    29,
    'USD',
    'month',
    'Best for professionals',
    '["All Starter features", "Premium components", "Priority email support", "Commercial projects", "Advanced templates"]',
    'Start Free Trial',
    '#signup',
    true,
    true,
    1
  ),
  (
    'enterprise',
    'Enterprise',
    99,
    'USD',
    'month',
    'For teams and organizations',
    '["All Pro features", "Unlimited projects", "Dedicated support", "Custom development", "SLA guarantee", "Team collaboration"]',
    'Contact Sales',
    '#contact',
    false,
    true,
    2
  );

-- Seed feature items
INSERT INTO public.feature_items (slug, title, description, icon_name, category, is_published, position)
VALUES
  (
    'responsive-design',
    'Responsive Design',
    'All components are fully responsive and work beautifully on any device size.',
    'layout',
    'core',
    true,
    0
  ),
  (
    'dark-mode',
    'Dark Mode Support',
    'Built-in dark mode support for all components with seamless theme switching.',
    'moon',
    'core',
    true,
    1
  ),
  (
    'typescript',
    'TypeScript First',
    'Fully typed components with TypeScript for better developer experience and fewer bugs.',
    'code',
    'developer',
    true,
    2
  ),
  (
    'accessibility',
    'Accessible',
    'WCAG compliant components ensuring your app is usable by everyone.',
    'accessibility',
    'core',
    true,
    3
  ),
  (
    'customizable',
    'Fully Customizable',
    'Tailwind-based styling makes it easy to customize every aspect of the components.',
    'palette',
    'design',
    true,
    4
  ),
  (
    'documentation',
    'Great Documentation',
    'Comprehensive documentation with examples and best practices for every component.',
    'book',
    'support',
    true,
    5
  );
