
export interface R8Stage {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  slug: string;
  explanation: string;
  analogy: string;
  keyFocusAreas: string[];
  imageUrl: string;
  imageAlt: string;
  dataAiHint: string;
}

export const r8Stages: R8Stage[] = [
    {
        id: "reveal",
        title: "REVEAL",
        subtitle: "Quantum Diagnostics",
        iconName: 'Eye',
        slug: "reveal",
        explanation: "The foundational stage where we employ advanced, non-invasive diagnostics to create a comprehensive map of your body's condition. We move beyond symptoms to identify the true root causes of pain, dysfunction, or performance plateaus, providing a precise blueprint for your transformation.",
        analogy: "A high-resolution satellite scan of your body's terrain, revealing not just the main roads but every hidden path and roadblock.",
        keyFocusAreas: [
          "Pinpointing root causes of issues",
          "Advanced biomechanical and postural analysis",
          "Comprehensive movement pattern assessment",
          "Creating a data-driven therapeutic strategy"
        ],
        imageUrl: "/r8-stage-reveal-banner.jpg",
        imageAlt: "Advanced diagnostic scanning for R8 REVEAL stage",
        dataAiHint: "body scan diagnostics",
    },
    {
        id: "remove",
        title: "REMOVE",
        subtitle: "Dissolving Roadblocks",
        iconName: 'Zap',
        slug: "remove",
        explanation: "This stage focuses on clearing the physical obstacles that impede your body's natural function and healing. We use targeted techniques to release deep-seated muscle tension, break down scar tissue, and dissolve fascial adhesions that restrict movement and cause pain.",
        analogy: "Clearing out the debris, fallen trees, and boulders from a clogged river, allowing the water to flow freely again.",
        keyFocusAreas: [
          "Instrument-Assisted Soft Tissue Mobilization",
          "Myofascial and trigger point release",
          "Breaking down scar tissue and adhesions",
          "Improving circulation and nutrient flow"
        ],
        imageUrl: "/r8-stage-remove-banner.jpg",
        imageAlt: "Symbolic representation of tissue release for R8 REMOVE stage",
        dataAiHint: "energy clearing therapy",
    },
     {
        id: "repair",
        title: "REPAIR",
        subtitle: "Cellular Rejuvenation",
        iconName: 'RefreshCcw',
        slug: "repair",
        explanation: "Here, we harness cutting-edge technologies like Photobiomodulation (PBM) and Pulsed Electromagnetic Field (PEMF) therapy to accelerate healing at the cellular level. This stage reduces inflammation, enhances tissue regeneration, and boosts your cells' energy production for faster, more efficient recovery.",
        analogy: "A high-tech pit crew for your cells, providing them with the advanced tools needed to repair and refuel at superhuman speed.",
        keyFocusAreas: [
          "Accelerating tissue healing 3-5x",
          "Reducing inflammation and pain",
          "Stimulating mitochondrial function with PBM/PEMF",
          "Promoting collagen synthesis and cellular health"
        ],
        imageUrl: "/r8-stage-repair-banner.jpg",
        imageAlt: "Visualization of cellular rejuvenation for R8 REPAIR stage",
        dataAiHint: "cellular repair technology",
    },
    {
        id: "reconstruct",
        title: "RECONSTRUCT",
        subtitle: "Forging Structural Integrity",
        iconName: 'Layers3',
        slug: "reconstruct",
        explanation: "This stage is about rebuilding your body's foundational support system. Through precise spinal and joint alignment techniques, we correct structural imbalances and forge superior integrity, creating a powerful, stable framework that can withstand physical stress and prevent future injuries.",
        analogy: "Architecturally reinforcing a building's foundation and support beams, ensuring it can withstand any storm.",
        keyFocusAreas: [
          "Spinal and joint alignment",
          "Correcting deep-seated structural imbalances",
          "Building a strong and stable core foundation",
          "Enhancing load-bearing capacity and resilience"
        ],
        imageUrl: "/r8-stage-reconstruct-banner.jpg",
        imageAlt: "Skeletal alignment visualization for R8 RECONSTRUCT stage",
        dataAiHint: "spinal blueprint therapy",
    },
    {
        id: "recover",
        title: "RECOVER",
        subtitle: "Deep Nervous System Reboot",
        iconName: 'BedDouble',
        slug: "recover",
        explanation: "True recovery goes beyond muscle. This stage focuses on rebooting your autonomic nervous system, shifting you from a state of chronic stress ('fight or flight') to deep relaxation ('rest and digest'). This calms pain signals, improves sleep, and optimizes your body's innate healing capabilities.",
        analogy: "Rebooting a computer's operating system to close all background processes and restore it to a calm, efficient state.",
        keyFocusAreas: [
          "Vagus nerve stimulation for stress reduction",
          "Down-regulating pain signals",
          "Improving sleep quality and recovery cycles",
          "Balancing the autonomic nervous system"
        ],
        imageUrl: "/r8-stage-recover-banner.jpg",
        imageAlt: "Deep relaxation and system balancing for R8 RECOVER stage",
        dataAiHint: "calm athlete recovery",
    },
     {
        id: "realign",
        title: "REALIGN",
        subtitle: "AI-Powered Postural Evolution",
        iconName: 'Layout',
        slug: "realign",
        explanation: "Using advanced AI analysis, we deconstruct your posture and movement patterns. This stage focuses on correcting ingrained habits and asymmetries, realigning your body to its most efficient and powerful state. It's about achieving effortless, perfect posture that enhances performance and eliminates strain.",
        analogy: "Using a laser-guided system to perfectly align a car's chassis for optimal performance and minimal wear.",
        keyFocusAreas: [
          "AI-driven postural analysis and correction",
          "Optimizing biomechanical efficiency",
          "Eliminating strain from poor posture",
          "Developing effortless, balanced alignment"
        ],
        imageUrl: "/r8-stage-realign-banner.jpg",
        imageAlt: "AI-powered posture analysis for R8 REALIGN stage",
        dataAiHint: "posture alignment consultation",
    },
    {
        id: "remap",
        title: "REMAP",
        subtitle: "Rewiring Brain-Body OS",
        iconName: 'Brain',
        slug: "remap",
        explanation: "This stage upgrades your 'neural software.' Through specialized neuroplasticity exercises, we enhance the communication between your brain and your body. This improves motor control, coordination, reaction time, and proprioception, allowing for more precise and powerful movements.",
        analogy: "Upgrading your computer's operating system and processor for faster, more accurate performance.",
        keyFocusAreas: [
          "Neuroplasticity and motor control training",
          "Improving coordination and reaction time",
          "Enhancing proprioception (body awareness)",
          "Optimizing the brain-body connection"
        ],
        imageUrl: "/r8-stage-remap-banner.jpg",
        imageAlt: "Brain neuroplasticity visualization for R8 REMAP stage",
        dataAiHint: "brain pathways training",
    },
    {
        id: "reactivate",
        title: "REACTIVATE",
        subtitle: "Unleashing Peak Energy & Performance",
        iconName: 'Flame',
        slug: "reactivate",
        explanation: "The final stage where all the optimizations converge. We push your body to safely integrate its new capabilities, unlocking new levels of strength, speed, and endurance. This is about taking your newly perfected system and unleashing its full, untapped potential for peak energy and performance in life and sport.",
        analogy: "Taking a fully restored and upgraded classic car onto the racetrack to see what it can truly do.",
        keyFocusAreas: [
          "Integrating new strength and mobility",
          "Maximizing functional power and endurance",
          "Unlocking untapped physical potential",
          "Peak performance application in sport and life"
        ],
        imageUrl: "/r8-stage-reactivate-banner.jpg",
        imageAlt: "Athlete achieving peak performance for R8 REACTIVATE stage",
        dataAiHint: "peak power energy",
    },
];
