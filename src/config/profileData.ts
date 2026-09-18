import {
  ProfileConfig,
  JourneyMilestone,
  ActivityItem,
  GalleryItem,
  UpdatePost,
  PublicResourceDocument,
  FAQItem,
} from '../types';

/**
 * ============================================================================
 * CENTRALIZED EDITABLE PROFILE DATA
 * ============================================================================
 * You can easily modify your name, contact details, journey, activities,
 * links, and vision in this single file.
 * All fields with '[...]' are placeholders you can update anytime.
 */

export const INITIAL_PROFILE: ProfileConfig = {
  name: 'Kavyansh Kayastha',
  communitySubtitle: 'कायस्थ',
  role: 'Nagar Mantri, Mathura',
  organisation: 'Akhil Bharatiya Vidyarthi Parishad (ABVP)',
  city: 'Mathura, Uttar Pradesh, India',
  hometown: 'Bareilly, Uttar Pradesh, India',
  residence: '[AREA/LOCALITY, MATHURA — ONLY IF I PROVIDE IT]',
  nativePlace: 'Bareilly, Uttar Pradesh, India',
  dob: '[DOB — ONLY IF I WANT TO DISPLAY IT]',
  education: '[COLLEGE / UNIVERSITY / COURSE]',
  currentYearSemester: '',
  joiningDate: 'June 2026',
  joiningYear: '2026',
  journeyBio: 'June 2026 mein ABVP se judkar chhatra evam yuva karyakramo mein sakriya bhaagidari.',
  email: 'kavyanshkayasthabvp@gmail.com',
  phone: '+91 63950 14760',
  officeLocation: 'Mathura Nagar Karyalaya / ABVP Office, Mathura, Uttar Pradesh',
  socials: {
    instagram: 'https://www.instagram.com/kavyansh_kayastha?stkn=MWlwaDRlZ3JqbjJoNw==',
    facebook: 'https://www.facebook.com/share/19hZUZE4Eu/',
    linkedin: '',
    twitterX: 'https://x.com/KavyanshS51156',
    youtube: '',
  },
  // Official profile photo of Kavyansh Kayastha (Centralized profile.photo) - PERMANENTLY LOCKED
  photo: '/kavyansh-kayastha.jpg',
  photoUrl: '/kavyansh-kayastha.jpg', 
  isPhotoLocked: true,
  shortIntro:
    'Students, youth and society ke issues ko sunna, unhe samajhna aur appropriate platform tak pahunchana meri public-service journey ka important part hai.',
  detailedAbout:
    'Main Kavyansh Kayastha, vartamaan mein Akhil Bharatiya Vidyarthi Parishad ke Nagar Mantri, Mathura ke roop mein student/youth activities mein actively associated hoon. Mera focus students aur young people se jude issues ko sunna, samajhna aur unke appropriate resolution ke liye concerned platform tak pahunchana hai.',
  visionPoints: [
    {
      title: 'Listening to Students (छात्रों की आवाज़)',
      description:
        'Campuses, colleges, aur hostels mein students ki genuine samasyaon ko dhyan se sunna aur unhe prashasan evam uchit manchon tak pahunchana.',
      icon: 'Headphones',
    },
    {
      title: 'Youth Participation (युवा सहभागिता)',
      description:
        'Rashtrahit aur samajik karya mein yuva shakti ko sakaratmak aur nirmaan-kaari gatividhiyon se jodna.',
    icon: 'Users',
    },
    {
      title: 'Education-Related Awareness (शैक्षिक जागरूकता)',
      description:
        'Scholarships, entrance exams, student welfare schemes, aur educational rights ke baare mein awareness failana.',
      icon: 'GraduationCap',
    },
    {
      title: 'Reaching Authorities (उचित मंच तक समाधान)',
      description:
        'Students aur administration ke beech ek jimmedaar, vinamra aur prabhavshali bridge banna bina kisi aswabhavik daawe ke.',
      icon: 'Landmark',
    },
    {
      title: 'Social Responsibility (सामाजिक दायित्व)',
      description:
        'Raktadaan (Blood Donation), swachhata, environmental campaigns aur aapatkaal mein sewa karya mein sakriya rehna.',
      icon: 'HeartHandshake',
    },
    {
      title: 'Constructive Public Engagement (सकारात्मक जनसम्पर्क)',
      description:
        'Samaj ke sabhi vargon ke sath samvaad, nishpakshata, aur lok-sewa ki pavitra bhavna ke sath nirantar karya karna.',
      icon: 'Compass',
    },
  ],
};

export const INITIAL_JOURNEY: JourneyMilestone[] = [
  {
    id: 'j-1',
    yearOrDate: 'June 2026',
    title: 'ABVP से जुड़ाव',
    englishLabel: 'ABVP Journey Begins',
    description:
      'June 2026 में अखिल भारतीय विद्यार्थी परिषद से जुड़कर मेरी संगठनात्मक यात्रा की शुरुआत हुई। संगठन की विचारधारा, कार्यपद्धति और छात्र-युवा गतिविधियों को समझने की दिशा में यह मेरी शुरुआत रही।',
    category: 'ABVP Journey',
    status: 'Journey Begins',
    badge: 'Journey Begins',
    isPublished: true,
    isCurrentResponsibility: false,
  },
  {
    id: 'j-2',
    yearOrDate: 'June – July 2026',
    title: 'संगठन को समझने की शुरुआत',
    englishLabel: 'Understanding the Organisation',
    description:
      'संगठन से जुड़ने के शुरुआती समय में कार्यपद्धति, संगठनात्मक अनुशासन और छात्र-युवा संवाद से जुड़े विषयों को समझने पर ध्यान दिया।',
    category: 'Organisation',
    status: 'Early Journey',
    badge: 'Early Journey',
    isPublished: true,
    isCurrentResponsibility: false,
  },
  {
    id: 'j-3',
    yearOrDate: 'July – August 2026',
    title: 'संगठनात्मक सहभागिता',
    englishLabel: 'Organisational Participation',
    description:
      'ABVP के साथ आगे बढ़ते हुए संगठनात्मक गतिविधियों और संवाद में सहभागिता की दिशा में मेरी यात्रा जारी रही। जिम्मेदारियों को समझने और संगठनात्मक कार्यशैली के साथ आगे बढ़ने का यह चरण रहा।',
    category: 'Organisation',
    status: 'Journey Continues',
    badge: 'Journey Continues',
    isPublished: true,
    isCurrentResponsibility: false,
  },
  {
    id: 'j-4',
    yearOrDate: 'August 2026',
    title: 'नई जिम्मेदारियों की ओर',
    englishLabel: 'Towards Greater Responsibility',
    description:
      'संगठन के साथ निरंतर जुड़ाव के दौरान जिम्मेदारी और छात्र-युवा संवाद के प्रति अपनी भूमिका को और गंभीरता से समझने की दिशा में आगे बढ़ा।',
    category: 'Organisational Journey',
    status: 'Growth',
    badge: 'Growth',
    isPublished: true,
    isCurrentResponsibility: false,
  },
  {
    id: 'j-5',
    yearOrDate: '9 September 2026',
    title: 'नगर मंत्री, मथुरा',
    englishLabel: 'Current Responsibility',
    description:
      '9 September 2026 को अखिल भारतीय विद्यार्थी परिषद में नगर मंत्री, मथुरा का वर्तमान दायित्व प्राप्त हुआ। यह मेरी संगठनात्मक यात्रा में वर्तमान जिम्मेदारी का महत्वपूर्ण चरण है।',
    category: 'Current Responsibility',
    status: 'CURRENT',
    badge: 'वर्तमान दायित्व',
    location: 'Mathura, Uttar Pradesh',
    isPublished: true,
    isCurrentResponsibility: true,
  },
  {
    id: 'j-6',
    yearOrDate: 'September 2026 – Present',
    title: 'वर्तमान दायित्व के साथ आगे',
    englishLabel: 'Present Journey',
    description:
      'वर्तमान दायित्व के साथ संगठनात्मक कार्यों, छात्र संवाद और जनसंपर्क से जुड़े विषयों में सक्रिय सहभागिता की दिशा में यात्रा जारी है।',
    category: 'Present',
    status: 'Active',
    badge: 'Active',
    location: 'Mathura, Uttar Pradesh',
    isPublished: true,
    isCurrentResponsibility: false,
  },
];

// Official activities and initiatives will be recorded here as verified by Nagar Mantri, Mathura
export const INITIAL_ACTIVITIES: ActivityItem[] = [];

// Clean initial gallery. Photos are only populated via verified Admin Dashboard uploads.
export const INITIAL_GALLERY: GalleryItem[] = [];

export const INITIAL_UPDATES: UpdatePost[] = [
  {
    id: 'upd-1',
    title: 'Mathura University Examination Schedule Guidance & Helpline Activated',
    category: 'Student Information',
    date: 'September 2026',
    summary:
      'Upcoming semester examinations ke liye chhatron ki suvidha hetu helpline aur verification help desk chalu.',
    description:
      'Vidyarthi parishad ke sahayog se sabhi degree college chhatron ko admit card download, exam center locator, aur re-evaluation guidelines ke baare mein sampurna jaankari uplabdh karai ja rahi hai. Kisi bhi query ke liye portal par Issue Raise karein.',
  },
  {
    id: 'upd-2',
    title: 'UP Post-Matric Scholarship Form Verification Drive Update',
    category: 'Important Update',
    date: 'September 2026',
    summary:
      'Scholarship portal par biometric attendance aur bank account NPCI seeding se judi samasyaon par vishesh help session.',
    description:
      'Chhatra dhyan dein ki aavedan submit karne ke baad hard copy college me samay par jama karayein. Biometric mapping me aa rahi samasya ko lekar nodal officer se baatcheet ki gayi hai.',
  },
  {
    id: 'upd-3',
    title: 'Upcoming Blood Donation Drive in Mathura — Volunteers Invited',
    category: 'Event Announcement',
    date: 'September 2026',
    summary:
      'Sewa saptah ke anttargat swaichhik raktadaan shivir aayojit hoga. Yuva saathi volunteer form bharein.',
    description:
      'Samajik utardayitva ke tahat aayojit hone wale shivir mein sabhi swasth vidyarthiyo aur yuvaon se aahwan hai ki aage aakar jeevandayee yogdaan dein.',
  },
];

export const INITIAL_RESOURCES: PublicResourceDocument[] = [
  {
    id: 'res-1',
    title: 'UP Scholarship & Fee Reimbursement Portal (SWS)',
    category: 'Scholarship Information',
    description:
      'Official Uttar Pradesh Post Matric and Pre Matric scholarship portal registration and status check link.',
    url: 'https://scholarship.up.gov.in',
    buttonText: 'Open Official Portal',
    tag: 'Official Portal',
  },
  {
    id: 'res-2',
    title: 'National Scholarship Portal (NSP)',
    category: 'Scholarship Information',
    description:
      'Central government scholarships for higher education, minority welfare, and merit-cum-means schemes.',
    url: 'https://scholarships.gov.in',
    buttonText: 'Visit NSP Portal',
    tag: 'Govt Portal',
  },
  {
    id: 'res-3',
    title: 'University Student Grievance & Redressal Cell Details',
    category: 'Student Resources',
    description:
      'Guidelines on how to officially file an exam or evaluation grievance with the state university authorities.',
    url: 'https://www.education.gov.in',
    buttonText: 'View Guidelines',
    tag: 'Guide',
  },
  {
    id: 'res-4',
    title: 'National Youth & Career Services Portal (NCS)',
    category: 'Student Resources',
    description:
      'Ministry of Labour & Employment portal for youth internships, apprenticeship opportunities, and job fairs.',
    url: 'https://www.ncs.gov.in',
    buttonText: 'Access NCS Portal',
    tag: 'Career Aid',
  },
  {
    id: 'res-5',
    title: 'National Anti-Ragging Helpline & Affidavit Form',
    category: 'Helpline Information',
    description:
      'Toll-free 24x7 anti-ragging helpline and online student undertaking submission form.',
    url: 'https://www.antiragging.in',
    buttonText: 'Helpline & Undertaking',
    tag: '24/7 Helpline',
  },
  {
    id: 'res-6',
    title: 'District Administration Mathura — Public Service Links',
    category: 'Government Resources',
    description:
      'Official portal of District Magistrate Mathura for public complaints, certificate verification, and citizen services.',
    url: 'https://mathura.nic.in',
    buttonText: 'Mathura Citizen Portal',
    tag: 'Local Admin',
  },
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Who is Kavyansh Kayastha?',
    answer:
      'Kavyansh Kayastha is a student and youth representative serving as Nagar Mantri, Mathura in Akhil Bharatiya Vidyarthi Parishad (ABVP), actively working for student welfare, campus grievance resolution, and positive youth empowerment.',
  },
  {
    id: 'faq-2',
    question: 'What is his current role?',
    answer:
      'His current organizational responsibility is Nagar Mantri, Mathura in Akhil Bharatiya Vidyarthi Parishad (ABVP).',
  },
  {
    id: 'faq-3',
    question: 'Where does he work?',
    answer:
      'He works across educational institutions, campuses, youth centers, and localities within Mathura city and district, Uttar Pradesh.',
  },
  {
    id: 'faq-4',
    question: 'When did he join ABVP?',
    answer:
      'He joined Akhil Bharatiya Vidyarthi Parishad in June 2026, beginning his organizational journey in student and youth service.',
  },
  {
    id: 'faq-5',
    question: 'How can I contact him?',
    answer:
      'You can reach out via the dedicated Contact section on this website, send an email to kavyanshkayasthabvp@gmail.com, or connect through verified social media channels. If you have a specific student/civic problem, you can use the "Raise an Issue" portal.',
  },
  {
    id: 'faq-6',
    question: 'How can I raise an issue (अपनी समस्या कैसे बताएं)?',
    answer:
      'Click the "Raise an Issue" (अपनी समस्या बताएं) button located prominently on the home page and navigation. Fill in your details, select the appropriate issue category, describe the problem, and attach any relevant document. You will receive an issue ticket acknowledgement.',
  },
  {
    id: 'faq-7',
    question: 'Can I submit a student problem or college grievance?',
    answer:
      'Yes. Students can submit issues relating to admissions, examinations, scholarship delays, hostel facilities, documentation, and campus basic amenities.',
  },
  {
    id: 'faq-8',
    question: 'Can I upload documents or photos with my issue?',
    answer:
      'Yes, the issue submission form supports uploading relevant documents, application copies, or photographs (PDF, JPG, PNG up to 10MB) to help understand the matter accurately.',
  },
  {
    id: 'faq-9',
    question: 'How will my submitted information be handled? (Privacy & Security)',
    answer:
      'Privacy is strictly respected. Your phone number, email address, and personal documents are NOT publicly displayed. Submissions are only accessible by authorized administrative review to communicate and represent the matter to appropriate authorities. You also have the right to request deletion of your submitted details at any time.',
  },
];
