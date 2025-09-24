import type { LucideIcon } from 'lucide-react';

export interface WhoCanBenefit {
  name: string;
  slug: string;
  iconName: string;
  benefits: string; // The short summary for the card on the main page
  imageUrl: string;
  imageAlt: string;
  dataAiHint: string;
  
  // New detailed structure for the page
  introduction: string; // A powerful opening statement
  commonChallenges: string[];
  r8Solution: {
    title: string;
    description: string;
    keyStages: {
      name: string;
      slug: string;
      reason: string;
    }[];
  };

  classNames: {
    textColor: string;
    textGradient: string;
    borderColor: string;
    shadowColor: string;
    glowFilter: string;
    buttonGradient: string;
    buttonGlow: string;
    hoverBgColor: string;
    hoverTextColor: string;
  };
}

export const whoCanBenefitData: WhoCanBenefit[] = [
  {
    name: "Professional Athletes & Fitness Enthusiasts",
    slug: "athletes",
    iconName: 'Award',
    benefits: "Maximize performance, accelerate recovery, and prevent injuries to gain a competitive edge.",
    imageUrl: "/benefit-banner-athletes.jpg",
    imageAlt: "Banner showcasing benefits of R8 for athletes",
    dataAiHint: "athlete training",
    introduction: "For those who demand the absolute most from their bodies, the R8 System is not just a therapy—it's the ultimate competitive advantage. We deconstruct and rebuild your body's performance engine for unparalleled power and resilience.",
    commonChallenges: [
      "Hitting performance plateaus that won't budge.",
      "Nagging, recurring injuries that derail training.",
      "Slow recovery times that limit training frequency and intensity.",
      "Loss of mobility or power in specific movements.",
    ],
    r8Solution: {
      title: "The R8 Solution: Engineering Your Competitive Edge",
      description: "R8 Ascent is a deep dive into your biomechanics. We don't just treat symptoms; we re-engineer your body's systems for peak efficiency. We find the hidden 'energy leaks' in your movements and patch them, allowing for a more powerful and explosive output.",
      keyStages: [
        { name: "REVEAL", slug: "reveal", reason: "Pinpoints the exact biomechanical inefficiencies or hidden weaknesses limiting your performance." },
        { name: "REPAIR", slug: "repair", reason: "Accelerates muscle and tissue recovery at a cellular level, allowing for more intense and frequent training." },
        { name: "REMAP", slug: "remap", reason: "Optimizes your brain-body connection for faster reaction times and more precise motor control." },
        { name: "REACTIVATE", slug: "reactivate", reason: "Unleashes your body's maximum power output and endurance capacity for competition day." }
      ]
    },
    classNames: {
      textColor: 'text-primary',
      textGradient: 'text-gradient-primary-accent',
      borderColor: 'border-primary/20',
      shadowColor: 'shadow-primary/10',
      glowFilter: 'drop-shadow(0 0 15px hsl(var(--primary)))',
      buttonGradient: 'bg-gradient-to-r from-primary to-accent',
      buttonGlow: 'glow-primary hover:glow-primary',
      hoverBgColor: 'hover:bg-primary/10',
      hoverTextColor: 'hover:text-primary',
    }
  },
  {
    name: "Corporate Professionals & Desk Workers",
    slug: "corporate-individuals",
    iconName: 'Users',
    benefits: "Combat sedentary lifestyle effects, alleviate stress-related pain, and boost energy levels.",
    imageUrl: "/benefit-banner-corporate.jpg",
    imageAlt: "Banner showcasing R8 benefits for corporate professionals' well-being",
    dataAiHint: "corporate wellness",
    introduction: "The modern professional's life often means being chained to a desk, leading to a body that's constantly under silent siege. R8 is the definitive antidote to the 'desk-bound' body, performing a full system recalibration to undo the damage of a sedentary lifestyle.",
    commonChallenges: [
      "Chronic neck, shoulder, and lower back pain from sitting.",
      "Persistent stiffness and loss of flexibility.",
      "Headaches and brain fog linked to poor posture.",
      "Low energy levels and high stress impacting productivity.",
    ],
    r8Solution: {
      title: "The R8 Solution: Rebooting the Desk-Bound Body",
      description: "R8 Vitality focuses on systematically dismantling the patterns of a sedentary life. We release the chronically tight muscles, realign your spine and posture, and reboot the nervous system that's been under constant, low-grade stress. It's about restoring the natural, energetic state your body was meant to have.",
      keyStages: [
        { name: "REMOVE", slug: "remove", reason: "Targets and dissolves the deep-seated muscle knots and fascial adhesions caused by prolonged sitting." },
        { name: "RECONSTRUCT", slug: "reconstruct", reason: "Rebuilds core stability and corrects the spinal misalignments that lead to postural decay." },
        { name: "REALIGN", slug: "realign", reason: "Uses AI-powered analysis to retrain your body to hold an optimal, effortless posture." },
        { name: "RECOVER", slug: "recover", reason: "Calms the over-stimulated nervous system, reducing stress and improving mental clarity." }
      ]
    },
    classNames: {
      textColor: 'text-accent',
      textGradient: 'text-gradient-secondary-accent',
      borderColor: 'border-accent/20',
      shadowColor: 'shadow-accent/10',
      glowFilter: 'drop-shadow(0 0 15px hsl(var(--accent)))',
      buttonGradient: 'bg-gradient-to-r from-accent to-secondary',
      buttonGlow: 'glow-accent hover:glow-accent',
      hoverBgColor: 'hover:bg-accent/10',
      hoverTextColor: 'hover:text-accent',
    }
  },
  {
    name: "Chronic Pain Sufferers",
    slug: "chronic-pain-sufferers",
    iconName: 'HeartHandshake',
    benefits: "Find lasting relief from persistent pain by addressing root causes instead of just masking symptoms.",
    imageUrl: "/benefit-banner-chronic-pain.jpg",
    imageAlt: "Banner depicting relief from chronic pain through R8 therapy",
    dataAiHint: "healing light",
    introduction: "Living with chronic pain shrinks your world and drains your spirit. R8 Reclaim is your definitive path out of that prison. We don't just 'manage' your pain; we hunt down its source with relentless precision and dismantle it, piece by piece.",
    commonChallenges: [
      "Pain that has lasted for months or years with no solution.",
      "Treatments that provide only temporary relief.",
      "Loss of mobility and ability to enjoy daily activities.",
      "Frustration and hopelessness from a lack of clear answers.",
    ],
    r8Solution: {
      title: "The R8 Solution: Terminating Pain at its Source",
      description: "Our approach is radically different. We use advanced diagnostics to find the true origin of your pain—be it a structural issue, a neurological pattern, or a fascial restriction. We then deploy a targeted arsenal of therapies to resolve that root cause, effectively turning off the 'pain alarm' for good and restoring your body's natural, pain-free state.",
      keyStages: [
        { name: "REVEAL", slug: "reveal", reason: "Goes beyond MRI reports to find the functional root cause of the pain, which is often missed by static imaging." },
        { name: "REMOVE", slug: "remove", reason: "Releases the specific trigger points and adhesions that are referring pain signals throughout your body." },
        { name: "REPAIR", slug: "repair", reason: "Heals the underlying damaged or inflamed tissues at a cellular level, promoting true, lasting recovery." },
        { name: "RECOVER", slug: "recover", reason: "Reboots the nervous system to break the chronic pain cycle, calming overactive nerve signals." }
      ]
    },
    classNames: {
      textColor: 'text-secondary',
      textGradient: 'text-gradient-secondary-accent',
      borderColor: 'border-secondary/20',
      shadowColor: 'shadow-secondary/10',
      glowFilter: 'drop-shadow(0 0 15px hsl(var(--secondary)))',
      buttonGradient: 'bg-gradient-to-r from-secondary to-primary',
      buttonGlow: 'glow-secondary hover:glow-secondary',
      hoverBgColor: 'hover:bg-secondary/10',
      hoverTextColor: 'hover:text-secondary',
    }
  },
  {
    name: "Active Seniors",
    slug: "active-seniors",
    iconName: 'Shield',
    benefits: "Enhance mobility, maintain independence, and improve balance for a vibrant, active lifestyle.",
    imageUrl: "/benefit-banner-active-seniors.jpg",
    imageAlt: "Banner showcasing R8 benefits for active seniors' mobility and vitality",
    dataAiHint: "senior fitness",
    introduction: "Aging is inevitable, but decline is a choice. R8 Vitality is your partner in vibrant aging, focusing on preserving the strength, mobility, and confidence you need to live your golden years to the absolute fullest.",
    commonChallenges: [
      "Increased stiffness and reduced range of motion.",
      "Fear of falling due to balance issues.",
      "Difficulty with daily activities like walking, climbing stairs, or lifting.",
      "A desire to stay active and independent without pain.",
    ],
    r8Solution: {
      title: "The R8 Solution: The Blueprint for Vibrant Longevity",
      description: "Our approach for active seniors focuses on reinforcing the body's core systems. We work on improving joint health, enhancing muscle activation to improve balance and reaction times, and ensuring your posture is efficient to minimize strain. R8 helps you maintain the physical confidence to live independently and enjoy every moment.",
      keyStages: [
        { name: "RECONSTRUCT", slug: "reconstruct", reason: "Strengthens the core and improves joint stability to provide a solid foundation for movement." },
        { name: "REALIGN", slug: "realign", reason: "Corrects age-related postural shifts, reducing strain on the spine and joints." },
        { name: "REMAP", slug: "remap", reason: "Improves the brain-body connection, which is crucial for maintaining balance and quick reaction times." },
        { name: "REACTIVATE", slug: "reactivate", reason: "Safely builds functional strength, making daily activities easier and more enjoyable." }
      ]
    },
    classNames: {
      textColor: 'text-primary',
      textGradient: 'text-gradient-primary-accent',
      borderColor: 'border-primary/20',
      shadowColor: 'shadow-primary/10',
      glowFilter: 'drop-shadow(0 0 15px hsl(var(--primary)))',
      buttonGradient: 'bg-gradient-to-r from-primary to-accent',
      buttonGlow: 'glow-primary hover:glow-primary',
      hoverBgColor: 'hover:bg-primary/10',
      hoverTextColor: 'hover:text-primary',
    }
  },
  {
    name: "Anyone Seeking Transformation",
    slug: "seeking-transformation",
    iconName: 'Zap',
    benefits: "Overcome physical limitations, achieve peak health, and unlock your body's full potential.",
    imageUrl: "/benefit-banner-transformation.jpg",
    imageAlt: "Banner symbolizing personal transformation through R8 system",
    dataAiHint: "personal transformation",
    introduction: "Whether you're recovering from an old injury that never quite healed, stuck at a fitness plateau, or simply feel that your body is not performing at its best, R8 is your catalyst for profound change. It's for anyone ready to stop settling for 'good enough' and start living in a body that is truly optimized.",
    commonChallenges: [
      "A feeling that 'something is off' but no clear diagnosis.",
      "Frustration with a lack of progress in fitness or rehab.",
      "A desire to proactively invest in future health and prevent issues.",
      "Knowing you can feel better, move better, and live with more energy.",
    ],
    r8Solution: {
      title: "The R8 Solution: Your Body, Re-Engineered",
      description: "The R8 Core program is a comprehensive system overhaul. We take a holistic view, using our 8-stage protocol to identify and resolve limitations you may not even be aware of. We clear out old patterns, rebuild your foundation, and optimize every system for a complete physical and energetic reset. This is your opportunity to reclaim the powerful, pain-free body you were born to own.",
      keyStages: [
        { name: "REVEAL", slug: "reveal", reason: "Uncovers the full picture of your body's condition, connecting dots that others miss." },
        { name: "RECONSTRUCT", slug: "reconstruct", reason: "Builds a powerful, integrated structure that serves as the foundation for all movement." },
        { name: "RECOVER", slug: "recover", reason: "Resets your nervous system, which is key to unlocking new levels of energy and well-being." },
        { name: "REACTIVATE", slug: "reactivate", reason: "The final stage that integrates all improvements and unleashes your body's true, untapped potential." }
      ]
    },
    classNames: {
      textColor: 'text-accent',
      textGradient: 'text-gradient-secondary-accent',
      borderColor: 'border-accent/20',
      shadowColor: 'shadow-accent/10',
      glowFilter: 'drop-shadow(0 0 15px hsl(var(--accent)))',
      buttonGradient: 'bg-gradient-to-r from-accent to-secondary',
      buttonGlow: 'glow-accent hover:glow-accent',
      hoverBgColor: 'hover:bg-accent/10',
      hoverTextColor: 'hover:text-accent',
    }
  },
];
