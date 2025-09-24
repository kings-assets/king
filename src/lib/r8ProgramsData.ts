
export interface R8ProgramTargetedStage {
  name: string;
  slug: string;
  description?: string; 
}

export interface R8ProgramPricing {
  price: string; 
  packagePrice?: string;
  details: string;
}

export interface R8Program {
  id: string;
  slug: string;
  name: string;
  iconName: string;
  whoIsItFor: string;
  description: string;
  keyBenefits: string[];
  targetedR8Stages: R8ProgramTargetedStage[];
  imageBannerUrl: string; 
  imageCardUrl: string;   
  dataAiHint: string;
  pricing: R8ProgramPricing;
}

export const r8Programs: R8Program[] = [
  {
    id: "ascent",
    slug: "ascent",
    name: "R8 Ascent: Elite Performance & Recovery",
    iconName: 'Award',
    imageBannerUrl: "/1st.png",
    imageCardUrl: "/1st.png",
    dataAiHint: "athlete energy",
    whoIsItFor: "Professional athletes, fitness enthusiasts, and anyone looking to push their physical limits.",
    description: "This program is engineered for those who refuse to accept limits. R8 Ascent elevates your performance, accelerates injury recovery, and gives you an undeniable edge by optimizing every facet of your physical being. It's a deep dive into your biomechanics, fine-tuning your mind-body connection for unparalleled speed, power, and control. We don't just help you recover; we help you evolve.",
    keyBenefits: [
      "Unrivaled performance and competitive edge.",
      "3-5x faster recovery from training & injuries.",
      "Improved endurance, strength, and agility.",
      "Enhanced muscle elasticity and superior biomechanics.",
      "Reduced risk of re-injury and proactive conditioning."
    ],
    pricing: {
        price: "Single Session: ₹4000",
        packagePrice: "Package (4 Sessions): ₹14,000",
        details: "A single session is great for a targeted boost. The 4-session package is recommended for focused improvement and conditioning."
    },
    targetedR8Stages: [
      { name: "REVEAL", slug: "reveal", description: "Pinpoint performance limiters." },
      { name: "REPAIR", slug: "repair", description: "Address micro-trauma." },
      { name: "RECONSTRUCT", slug: "reconstruct", description: "Forge superior structural integrity." },
      { name: "REMAP", slug: "remap", description: "Optimize brain-body OS." },
      { name: "REACTIVATE", slug: "reactivate", description: "Unleash peak power." }
    ]
  },
  {
    id: "genesis",
    slug: "genesis",
    name: "R8 Genesis: Your Launchpad to Fitness",
    iconName: 'Zap',
    imageBannerUrl: "/2nd.png",
    imageCardUrl: "/2nd.png",
    dataAiHint: "hopeful start",
    whoIsItFor: "Beginners, those new to therapy, and individuals seeking a safe path to foundational strength.",
    description: "R8 Genesis is your ideal starting point on the path to wellness. This program gently introduces you to the core principles of the R8 system, focusing on building foundational body strength, preventing pain, and establishing correct movement patterns. It’s designed to eliminate initial aches, correct postural issues from daily life, and prepare your body for continuous improvement. We prioritize education, safety, and building habits that last a lifetime.",
    keyBenefits: [
      "Safe and effective entry into fitness or sports.",
      "Elimination of initial aches and soreness.",
      "Improved posture and enhanced basic movement control.",
      "Better body awareness and confidence.",
      "Build a strong foundation to prevent future injuries."
    ],
    pricing: {
        price: "Single Session: ₹2500",
        packagePrice: "Package (4 Sessions): ₹9,000",
        details: "Perfect for understanding your body's immediate needs. The 4-session package provides a structured, guided start to your wellness journey."
    },
    targetedR8Stages: [
      { name: "REVEAL", slug: "reveal", description: "Understand your body's starting point." },
      { name: "REMOVE", slug: "remove", description: "Dissolve initial roadblocks." },
      { name: "REPAIR", slug: "repair", description: "Fix imbalances and tightness." },
      { name: "REALIGN", slug: "realign", description: "Learn correct postural habits." }
    ]
  },
  {
    id: "apex",
    slug: "apex",
    name: "R8 Apex: Physique & Strength Optimization",
    iconName: 'BarChart3',
    imageBannerUrl: "/3rd.png",
    imageCardUrl: "/3rd.png",
    dataAiHint: "muscle anatomy",
    whoIsItFor: "Bodybuilders, physique competitors, and athletes focused on hypertrophy and strength without injury.",
    description: "This program is for the dedicated athlete who understands that true strength is built on a flawless foundation. R8 Apex goes beyond mere recovery to enhance muscle growth, optimize body symmetry, and prevent the wear and tear of intense training. We work on enhancing cellular energy for growth, perfecting the mind-muscle connection for precise contractions, and reinforcing your structural integrity for heavy lifting. It's about building a masterpiece physique that is as resilient as it is powerful.",
    keyBenefits: [
      "Maximum muscle hypertrophy and growth.",
      "Achieve aesthetic body symmetry and proportion.",
      "Accelerated muscle recovery for increased training frequency.",
      "Superior mind-muscle connection and injury prevention.",
      "Unprecedented training frequency and effectiveness."
    ],
    pricing: {
        price: "Custom Quote",
        details: "Due to its highly specialized nature, this program requires a comprehensive assessment. Pricing is tailored to your specific goals and protocol duration."
    },
    targetedR8Stages: [
      { name: "REVEAL", slug: "reveal", description: "Identify muscle imbalances." },
      { name: "REPAIR", slug: "repair", description: "Accelerate muscle fiber repair." },
      { name: "RECONSTRUCT", slug: "reconstruct", description: "Enhance structural integrity for lifts." },
      { name: "REMAP", slug: "remap", description: "Boost mind-muscle connection." },
      { name: "REACTIVATE", slug: "reactivate", description: "Boost cellular energy for growth." },
    ]
  },
  {
    id: "reclaim",
    slug: "reclaim",
    name: "R8 Reclaim: Chronic Pain Elimination",
    iconName: 'HeartHandshake',
    imageBannerUrl: "/4th.png",
    imageCardUrl: "/4th.png",
    dataAiHint: "healing light",
    whoIsItFor: "Individuals suffering from long-standing chronic pain (back pain, neck stiffness, sciatica) who haven't found lasting relief.",
    description: "R8 Reclaim is your definitive path to freedom from the prison of chronic pain. This program is meticulously designed to hunt down and eliminate the root cause of your pain, not just its symptoms. Using a revolutionary holistic approach, we combine advanced diagnostics with precise therapies to restore natural body function, heal deep-seated issues, and grant you lasting liberation from persistent discomfort. This is where the cycle of pain ends.",
    keyBenefits: [
      "Lasting relief from chronic pain, not just temporary fixes.",
      "Identification and elimination of the root cause of pain.",
      "Regained mobility and freedom of movement.",
      "Improved overall quality of life and mental well-being.",
      "A proactive approach to prevent future pain recurrence."
    ],
    pricing: {
        price: "Single Session: ₹3000",
        packagePrice: "Package (4 Sessions): ₹11,000",
        details: "A single session can provide tangible relief. The 4-session package is designed for lasting root-cause elimination and comprehensive healing."
    },
    targetedR8Stages: [
      { name: "REVEAL", slug: "reveal", description: "Find the true source of your pain." },
      { name: "REMOVE", slug: "remove", description: "Release chronic tension." },
      { name: "REPAIR", slug: "repair", description: "Heal damaged tissues." },
      { name: "RECOVER", slug: "recover", description: "Calm overactive pain signals." },
    ]
  },
  {
    id: "vitality",
    slug: "vitality",
    name: "R8 Vitality: Longevity & Modern Wellness",
    iconName: 'Users',
    imageBannerUrl: "/5th.png",
    imageCardUrl: "/5th.png",
    dataAiHint: "corporate wellness",
    whoIsItFor: "Modern professionals battling sedentary lifestyle issues, or active seniors seeking longevity.",
    description: "R8 Vitality is the antidote to modern life. It directly counters the effects of prolonged sitting, digital strain, and the natural impacts of aging. We address stress-induced pain, correct poor posture, and actively enhance mobility to ensure you move through life with ease and energy. This program is about proactive health management, sustained energy, and vibrant longevity, helping you thrive, not just survive.",
    keyBenefits: [
      "Counters the negative effects of a sedentary lifestyle.",
      "Reduces stress-related pain and dramatically improves posture.",
      "Boosts energy levels and enhances mental clarity.",
      "Enhances mobility and flexibility for active aging.",
      "Maintains independence and mitigates age-related physical decline."
    ],
    pricing: {
        price: "Single Session: ₹2800",
        packagePrice: "Monthly Plan (4 Sessions): ₹10,000",
        details: "Perfect for regular maintenance and proactive wellness. The monthly plan ensures consistent progress and helps you stay ahead of modern life's physical tolls."
    },
    targetedR8Stages: [
      { name: "REVEAL", slug: "reveal", description: "Assess postural and stress issues." },
      { name: "REMOVE", slug: "remove", description: "Release sedentary tension." },
      { name: "REALIGN", slug: "realign", description: "Instill healthy posture." },
      { name: "RECOVER", slug: "recover", description: "Balance body for vitality." },
    ]
  },
  {
    id: "core",
    slug: "core",
    name: "R8 Core: Complete Physical Reset",
    iconName: 'Layers',
    imageBannerUrl: "/6th.png",
    imageCardUrl: "/6th.png",
    dataAiHint: "holistic balance",
    whoIsItFor: "Anyone seeking a profound physical transformation or ready to invest in their body's full potential.",
    description: "R8 Core is our flagship program—a complete body reset for those who seek total optimization. It systematically applies the entire 8-stage R8 protocol to recalibrate your body from the inside out, addressing every underlying issue from the cellular to the neurological level. This program builds profound resilience, integrated strength, and perfect biomechanics, allowing you to reclaim the powerful, pain-free body you were born to own. This is the ultimate investment in yourself.",
    keyBenefits: [],
    pricing: {
        price: "Contact for Custom Quote",
        details: "This is a fully customized, bespoke protocol based on a comprehensive assessment and your unique goals. Contact us for a consultation to design your ultimate transformation."
    },
    targetedR8Stages: [
      { name: "REVEAL", slug: "reveal" }, { name: "REMOVE", slug: "remove" },
      { name: "REPAIR", slug: "repair" }, { name: "RECONSTRUCT", slug: "reconstruct" },
      { name: "RECOVER", slug: "recover" }, { name: "REALIGN", slug: "realign" },
      { name: "REMAP", slug: "remap" }, { name: "REACTIVATE", slug: "reactivate" }
    ]
  }
];
