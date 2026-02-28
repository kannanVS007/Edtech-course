'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Language = 'en' | 'ta';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations = {
    en: {
        welcome: 'Welcome to Premium EdTech',
        login: 'Login',
        register: 'Register',
        dashboard: 'Dashboard',
        courses: 'My Courses',
        profile: 'Profile',
        logout: 'Logout',
        enrolled: 'Enrolled',
        completed: 'Completed',
        startLearning: 'Start Learning',
        heroTag: 'Transforming Bilingual Education',
        heroTitle: 'Master New Skills Properly.',
        heroDesc: 'Join 10,000+ creators and engineers learning in Tamil & English. Structured modules, interactive tests, and industry feedback.',
        browseCourses: 'Browse Courses',
        startLearningNow: 'Start Learning Now',
        topMentors: 'Top Mentors From',
        activeStudents: 'Active Students',
        totalCourses: 'Total Courses',
        successRate: 'Success Rate',
        hoursContent: 'Hours Content',
        featuresTitle: 'Engineered for Excellence.',
        featuresDesc: 'We\'ve dismantled traditional learning and rebuilt it from the ground up for the modern creator.',
        bilingualTitle: 'Bilingual Mastery',
        bilingualDesc: 'Seamlessly toggle between Tamil and English. High-quality localized technical terminology.',
        industryTitle: 'Industry Validation',
        industryDesc: 'Certificates verified on blockchain. Gain industry-recognized credentials that top startups trust.',
        neuralTitle: 'Neural Learning',
        neuralDesc: 'Adaptive quizzes that identify your weak spots and suggest targeted modules for improvement.',
        readyToSpecialize: 'Ready to Specialize?',
        exploreAll: 'Explore All Programs',
        goPro: 'Ready to Go Pro?',
        ctaDesc: 'Join 12,000+ skillers and start building your future today. Limited seats for the 2026 cohort.',
        footerDesc: 'The premium destination for bilingual technical education. Handcrafted with passion for the next generation of engineers.',
        copyright: '© 2026 Become A Skiller EdTech. Handcrafted by V.S. Kannan.',
        adminPanel: 'Admin Panel',
        allCourses: 'All Courses',
        quizzes: 'Quizzes',
        bookmarks: 'Bookmarks',
        settings: 'Settings',
        exploreCourses: 'Explore Courses',
        searchPlaceholder: 'Search courses, mentors...',
        category: 'Category',
        level: 'Level',
        languageLabel: 'Language',
        noResults: 'No courses found',
        adjustSearch: 'Try adjusting your search or filters.',
        clearFilters: 'Clear all filters',
        results: 'results',
    },
    ta: {
        welcome: 'பிரீமியம் எட்டெக் வரவேற்கிறோம்',
        login: 'உள்நுழை',
        register: 'பதிவு செய்யுங்கள்',
        dashboard: 'டாஷ்போர்டு',
        courses: 'எனது படிப்புகள்',
        profile: 'சுயவிவரம்',
        logout: 'வெளியேறு',
        enrolled: 'பதிவு செய்யப்பட்டது',
        completed: 'முடிக்கப்பட்டது',
        startLearning: 'கற்கத் தொடங்குங்கள்',
        heroTag: 'இருமொழி கல்வியை மாற்றுகிறது',
        heroTitle: 'புதிய திறன்களை சரியாக மாஸ்டர் செய்யுங்கள்.',
        heroDesc: 'தமிழ் மற்றும் ஆங்கிலத்தில் கற்கும் 10,000+ படைப்பாளர்கள் மற்றும் பொறியாளர்களுடன் இணையுங்கள். கட்டமைக்கப்பட்ட தொகுதிகள், ஊடாடும் சோதனைகள் மற்றும் தொழில் கருத்துக்கள்.',
        browseCourses: 'படிப்புகளை உலாவுக',
        startLearningNow: 'இப்போதே கற்கத் தொடங்குங்கள்',
        topMentors: 'சிறந்த வழிகாட்டிகள்',
        activeStudents: 'செயலில் உள்ள மாணவர்கள்',
        totalCourses: 'மொத்த படிப்புகள்',
        successRate: 'வெற்றி விகிதம்',
        hoursContent: 'மணிநேர உள்ளடக்கம்',
        featuresTitle: 'சிறப்புக்காக வடிவமைக்கப்பட்டது.',
        featuresDesc: 'நாங்கள் பாரம்பரிய கற்றலை அகற்றி, நவீன படைப்பாளருக்காக அடித்தளத்திலிருந்து மீண்டும் கட்டியெழுப்பினோம்.',
        bilingualTitle: 'இருமொழி தேர்ச்சி',
        bilingualDesc: 'தமிழ் மற்றும் ஆங்கிலத்திற்கு இடையில் தடையின்றி மாறவும். உயர்தர உள்ளூர்மயமைக்கப்பட்ட தொழில்நுட்ப கலைச்சொற்கள்.',
        industryTitle: 'தொழில் சரிபார்ப்பு',
        industryDesc: 'பிளாக்செயினில் சரிபார்க்கப்பட்ட சான்றிதழ்கள். சிறந்த ஸ்டார்ட்அப்கள் நம்பும் தொழில் அங்கீகாரம் பெற்ற நற்சான்றிதழ்களைப் பெறுங்கள்.',
        neuralTitle: 'நியூரல் கற்றல்',
        neuralDesc: 'உங்களின் பலவீனமான இடங்களைக் கண்டறிந்து, முன்னேற்றத்திற்கான இலக்கு தொகுதிகளைப் பரிந்துரைக்கும் அடாப்டிவ் வினாடி வினாக்கள்.',
        readyToSpecialize: 'நிபுணத்துவம் பெற தயாரா?',
        exploreAll: 'அனைத்து திட்டங்களையும் ஆராயுங்கள்',
        goPro: 'ப்ரோ ஆக தயாரா?',
        ctaDesc: '12,000+ ஸ்கில்லர்களுடன் இணைந்து உங்கள் எதிர்காலத்தை இன்றே உருவாக்கத் தொடங்குங்கள். 2026 ஆம் ஆண்டிற்கான வரையறுக்கப்பட்ட இடங்கள்.',
        footerDesc: 'இருமொழி தொழில்நுட்பக் கல்விக்கான பிரீமியம் தளம். அடுத்த தலைமுறை பொறியியலாளர்களுக்கான ஆர்வத்துடன் வடிவமைக்கப்பட்டது.',
        copyright: '© 2026 பிகம் எ ஸ்கில்லர் எட்டெக். வி.எஸ். கண்ணனால் உருவாக்கப்பட்டது.',
        adminPanel: 'நிர்வாக குழு',
        allCourses: 'அனைத்து படிப்புகள்',
        quizzes: 'வினாடி வினாக்கள்',
        bookmarks: 'அடையாளக்குறிகள்',
        settings: 'அமைப்புகள்',
        exploreCourses: 'படிப்புகளை ஆராயுங்கள்',
        searchPlaceholder: 'பாடங்கள், வழிகாட்டிகளைத் தேடுங்கள்...',
        category: 'வகை',
        level: 'நிலை',
        languageLabel: 'மொழி',
        noResults: 'படிப்புகள் எதுவும் கிடைக்கவில்லை',
        adjustSearch: 'உங்கள் தேடல் அல்லது வடிப்பான்களைச் சரிசெய்ய முயற்சிக்கவும்.',
        clearFilters: 'அனைத்து வடிப்பான்களையும் அகற்று',
        results: 'முடிவுகள்',
    },
};

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set, get) => ({
            language: 'en',
            setLanguage: (lang) => set({ language: lang }),
            t: (key) => {
                const lang = get().language;
                return (translations[lang] as any)[key] || key;
            },
        }),
        {
            name: 'language-storage',
        }
    )
);
