const dentalServices = [
  {
    id: "general",
    title: "General Dentistry",
    shortDescription: "Comprehensive dental care for your family, focused on prevention, early detection, and standard treatments.",
    longDescription: "Our general dentistry services form the foundation of lifelong oral health. We prioritize preventative measures and patient education, ensuring your teeth and gums stay healthy, strong, and pain-free.",
    price: "From $90",
    duration: "45-60 mins",
    icon: "shield",
    treatments: [
      "Routine Cleanings & Screenings",
      "Digital X-rays & Diagnostic Exams",
      "Composite (Tooth-Colored) Fillings",
      "Periodontal (Gum Disease) Therapy",
      "Root Canal Treatment"
    ]
  },
  {
    id: "cosmetic",
    title: "Cosmetic Dentistry",
    shortDescription: "Transform your smile and build confidence with our range of customized aesthetic treatments.",
    longDescription: "A beautiful smile is a powerful asset. Our cosmetic services combine state-of-the-art dental science with artistic design to address discoloration, misalignment, chips, or gaps, leaving you with a radiant smile you'll love to show off.",
    price: "From $150",
    duration: "30-90 mins",
    icon: "sparkles",
    treatments: [
      "In-Office Teeth Whitening",
      "Porcelain & Composite Veneers",
      "Dental Bonding",
      "Smile Makeovers",
      "Gum Contouring"
    ]
  },
  {
    id: "implants",
    title: "Dental Implants",
    shortDescription: "Permanent, natural-looking replacement for missing teeth to restore both function and aesthetics.",
    longDescription: "Dental implants are the gold standard for tooth replacement. Unlike bridges or dentures, implants fuse with your jawbone, preserving bone structure, restoring full chewing capability, and looking exactly like natural teeth.",
    price: "From $1,500",
    duration: "60-120 mins",
    icon: "anchor",
    treatments: [
      "Single Tooth Implants",
      "Multi-Tooth Bridge Implants",
      "All-on-4® Full Arch Implants",
      "Bone Grafting & Sinus Lifts",
      "Implant Restoration Maintenance"
    ]
  },
  {
    id: "ortho",
    title: "Orthodontics",
    shortDescription: "Align your teeth and bite with traditional braces or clear, removable Invisalign® aligners.",
    longDescription: "Straight teeth do more than improve your looks; they make cleaning easier and improve chewing efficiency and speech. We provide advanced orthodontic plans for children, teens, and adults, custom-tailored to your lifestyle.",
    price: "From $3,000",
    duration: "30-45 mins (visits)",
    icon: "grid",
    treatments: [
      "Invisalign® Clear Aligners",
      "Traditional Ceramic & Metal Braces",
      "Bite Correction & Alignments",
      "Custom Post-Treatment Retainers",
      "Early Orthodontic Assessments"
    ]
  },
  {
    id: "pediatric",
    title: "Pediatric Dentistry",
    shortDescription: "Gentle, fun, and warm dental care tailored specifically for infants, children, and teens.",
    longDescription: "We believe a positive early experience sets the tone for a lifetime of healthy smiles. Our pediatric department offers a warm, anxiety-free environment with specialized dentists who explain treatments in a kid-friendly way.",
    price: "From $80",
    duration: "30-45 mins",
    icon: "smile",
    treatments: [
      "First Dental Visit Assessments",
      "Gentle Cleanings & Fluoride Therapy",
      "Protective Dental Sealants",
      "Early Orthodontic Evaluations",
      "Cavity Prevention & Fillings"
    ]
  },
  {
    id: "emergency",
    title: "Emergency Care",
    shortDescription: "Immediate, high-priority dental care for sudden pain, accidents, or broken teeth.",
    longDescription: "Dental emergencies can be stressful and extremely painful. We offer same-day, high-priority appointments to relieve pain, repair trauma, treat infections, and save damaged teeth.",
    price: "Varies",
    duration: "Varies",
    icon: "activity",
    treatments: [
      "Severe Toothache Management",
      "Broken, Chipped, or Cracked Teeth Repair",
      "Knocked-Out (Avulsed) Tooth Treatment",
      "Emergency Root Canals",
      "Gum Abscess & Infection Treatment"
    ]
  }
];

const doctors = [
  {
    id: "dr-jenkins",
    name: "Dr. Sarah Jenkins, DDS",
    title: "Lead Cosmetic & General Dentist",
    bio: "Dr. Sarah Jenkins has over 12 years of clinical experience, specializing in advanced cosmetic restorations and smile makeovers. She graduated from the NYU College of Dentistry and is dedicated to conservative, patient-centered care.",
    qualifications: "DDS, New York University College of Dentistry",
    experience: "12+ Years",
    image: "assets/images/doctor-jenkins.webp",
    specialties: ["Smile Makeovers", "Porcelain Veneers", "Preventive Care"],
    schedule: {
      days: [1, 2, 3, 4, 5], // Mon-Fri
      hours: { start: 9, end: 17 }
    }
  },
  {
    id: "dr-chen",
    name: "Dr. Marcus Chen, DDS, MS",
    title: "Chief of Orthodontics",
    bio: "Dr. Marcus Chen is an elite orthodontist with a passion for modern digital orthodontics, including clear aligner therapy. He holds an MS in Orthodontics from the University of Michigan and is a certified Invisalign® Elite Provider.",
    qualifications: "DDS, MS in Orthodontics, University of Michigan",
    experience: "15+ Years",
    image: "assets/images/doctor-chen.webp",
    specialties: ["Invisalign® Clear Aligners", "Surgical Orthodontics", "Teen Orthodontics"],
    schedule: {
      days: [1, 3, 5], // Mon, Wed, Fri
      hours: { start: 8, end: 16 }
    }
  },
  {
    id: "dr-patel",
    name: "Dr. Priya Patel, DDS",
    title: "Pediatric Specialist",
    bio: "Dr. Priya Patel is known for her warm, cheerful demeanor that instantly puts children at ease. She completed her specialized residency in Pediatric Dentistry at Boston University and focuses heavily on early prevention and child-friendly education.",
    qualifications: "DDS, Pediatric Residency at Boston University",
    experience: "8+ Years",
    image: "assets/images/doctor-patel.webp",
    specialties: ["Child Behavioral Dentistry", "Dental Sealants", "Fluoride Treatments"],
    schedule: {
      days: [2, 4, 6], // Tue, Thu, Sat
      hours: { start: 9, end: 15 }
    }
  },
  {
    id: "dr-kim",
    name: "Dr. Robert Kim, DDS, MD",
    title: "Oral & Maxillofacial Surgeon",
    bio: "Dr. Robert Kim specializes in complex dental implant surgery, bone grafting, and wisdom tooth extractions. He received his medical and dental degrees from Columbia University and has lectured internationally on dental implant innovations.",
    qualifications: "DDS, MD, Columbia University Medical Center",
    experience: "18+ Years",
    image: "assets/images/doctor-kim.webp",
    specialties: ["Dental Implants", "Wisdom Teeth Extractions", "Bone Grafting"],
    schedule: {
      days: [2, 4, 5], // Tue, Thu, Fri
      hours: { start: 8, end: 17 }
    }
  }
];

const reviews = [
  {
    id: 1,
    name: "Eleanor Vance",
    rating: 5,
    date: "May 28, 2026",
    comment: "I've always had severe dental anxiety, but Dr. Jenkins and the team completely changed how I feel about dental visits. They were incredibly patient, explained everything clearly, and the procedure was entirely pain-free.",
    treatment: "Cosmetic Veneers"
  },
  {
    id: 2,
    name: "Jonathan Wright",
    rating: 5,
    date: "June 02, 2026",
    comment: "Dr. Marcus Chen did my Invisalign treatment. The results are amazing, and the progress was tracked digitally at every step. The scheduling was flexible, and the office is exceptionally clean and modern. Highly recommend!",
    treatment: "Invisalign® Alignment"
  },
  {
    id: 3,
    name: "Mariah Gallagher",
    rating: 5,
    date: "May 15, 2026",
    comment: "My 6-year-old son had his first cavity filled by Dr. Patel. I was nervous, but she made it feel like a game for him. He actually asked when we were going back! Outstanding pediatric care.",
    treatment: "Pediatric Filling"
  },
  {
    id: 4,
    name: "David Sterling",
    rating: 5,
    date: "April 20, 2026",
    comment: "I had a dental implant placed by Dr. Kim. From the initial consultation to the final crown placement, the professionalism was top-notch. It feels and looks exactly like my other teeth. The facility uses advanced 3D scanning technology.",
    treatment: "Dental Implant"
  },
  {
    id: 5,
    name: "Sophia Martinez",
    rating: 5,
    date: "June 08, 2026",
    comment: "They squeezed me in for an emergency appointment on a Saturday morning when I woke up with an agonizing toothache. They diagnosed a cracked tooth and treated it on the spot. Lifesavers!",
    treatment: "Emergency Root Canal"
  }
];

const faqs = [
  {
    question: "How often should I visit the dentist for a check-up and cleaning?",
    answer: "For most children and adults, we recommend visiting the dentist twice a year (every 6 months) for a routine exam and professional cleaning. Patients with active gum disease, high cavity susceptibility, or weak immune systems might need more frequent visits, which our team will advise during your consultation."
  },
  {
    question: "Do you accept dental insurance, and what payment options are available?",
    answer: "Yes, we accept most major PPO dental insurance plans. Our staff will file all claims directly on your behalf to maximize your benefits. For out-of-pocket costs and uninsured patients, we offer flexible interest-free payment plans through CareCredit® and accept all major credit cards and HSA/FSA cards."
  },
  {
    question: "What is Invisalign® and how does it compare to traditional braces?",
    answer: "Invisalign® utilizes custom-made, clear, removable aligner trays to gradually shift your teeth. They are virtually invisible and can be taken out to eat, brush, and floss. Traditional metal braces use brackets and wires fixed to your teeth. While Invisalign is ideal for teens and adults seeking a discreet option, traditional braces are sometimes better suited for complex orthodontic alignments."
  },
  {
    question: "What should I do if a permanent tooth gets knocked out?",
    answer: "This is a severe dental emergency. First, find the tooth, handle it only by the crown (top part, NOT the root), and gently rinse it with water if dirty. If possible, try to reinsert the tooth back into its socket and bite down gently. If not, place the tooth in a small cup of milk or saliva and call our clinic immediately. For the best chance of saving the tooth, you must be treated within 60 minutes."
  },
  {
    question: "Are dental X-rays safe, and how often do I need them?",
    answer: "Yes, dental X-rays are exceptionally safe. We use modern digital radiography, which reduces radiation exposure by up to 80-90% compared to traditional film X-rays. We also utilize lead aprons with thyroid collars for extra protection. Typically, a set of bitewing X-rays is recommended once a year, and a full-mouth panoramic scan every 3 to 5 years."
  }
];

// Exporting to make it clean or exposing to global window object for vanilla JS scripts
window.dentalData = {
  services: dentalServices,
  doctors,
  reviews,
  faqs
};
