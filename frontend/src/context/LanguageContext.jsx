import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext(null);

const dictionary = {
  english: {
    nav: {
      home: 'Home',
      pronunciation: 'Pronunciation',
      grammar: 'Grammar',
      quiz: 'Quiz',
      vocabulary: 'Vocabulary',
      daily: 'Daily Goal',
      leaderboard: 'Leaderboard',
      admin: 'Admin Panel',
      login: 'Login',
      register: 'Register',
      logout: 'Logout'
    },
    home: {
      free_tag: '🎓 Free for Telugu Medium Students',
      title_part1: 'Learn English Easily',
      title_part2: 'Through Telugu 🌟',
      subtitle: 'Improve pronunciation, grammar, vocabulary, and speaking skills with interactive lessons and exercises.',
      get_started: '🚀 Start Learning',
      take_quiz: '🧠 Take a Quiz',
      login_prompt: 'Already a student?',
      login_here: 'Login here',
      stats_students: 'Students Learning',
      stats_grammar: 'Grammar Topics',
      stats_quizzes: 'Quiz Questions',
      stats_free: 'Free Forever',
      features_header: '⭐ Features',
      testi_header: '💬 Student Testimonials',
      cta_title: 'Ready to Start? 🚀',
      cta_desc: 'Join thousands of Telugu students improving their English every day.',
      cta_button: 'Register Free 🎓',
      feat_pron_title: 'Real-time Pronunciation',
      feat_pron_desc: 'Speak into your microphone and get instant feedback on your English pronunciation accuracy.',
      feat_gram_title: 'Bilingual Grammar Lessons',
      feat_gram_desc: 'Understand English tenses, articles, and parts of speech explained clearly in Telugu.',
      feat_quiz_title: 'Interactive Quizzes',
      feat_quiz_desc: 'Earn points, level up, and build streaks by completing daily fun grammar and vocabulary quizzes.',
      feat_vocab_title: 'Daily Vocabulary',
      feat_vocab_desc: 'Learn 5 new English words every day with phonetic guides, audio, and Telugu meanings.',
      feat_daily_title: 'Daily Practice',
      feat_daily_desc: 'Daily goals for grammar, pronunciation, and vocabulary to build a habit.',
      feat_leader_title: 'Leaderboard',
      feat_leader_desc: 'Compete with students across Andhra Pradesh and Telangana. Earn badges!',
      open: 'Open →'
    },
    grammar: {
      header_title: 'Grammar Learning',
      header_sub: 'Learn English grammar topics with clear explanations',
      definition: '📌 Definition',
      explanation: '🗣️ Explanation',
      examples: '✅ Examples',
      practice: '✏️ Practice Questions',
      tips: '💡 Tips'
    },
    vocab: {
      header_title: 'Vocabulary Builder',
      header_sub: 'Learn English words with translations, phonetic guides, and audio',
      search_placeholder: '🔍 Search in English or Telugu...',
      all_categories: 'All Categories',
      mark_learned: '📖 Mark as Learned',
      learned: '✅ Learned! +2 pts',
      pronunciation: 'Pronunciation',
      example: 'Example'
    },
    pron: {
      header_title: 'Pronunciation Guide',
      header_sub: 'Speak English words and check your pronunciation accuracy',
      score: 'Accuracy Score',
      click_record: 'Click record, then speak the word clearly',
      record: '🎙️ Record',
      stop: '⏹️ Stop',
      listening: '🔊 Listening...',
      next_word: '⏭️ Next Word',
      excellent: 'Excellent! Perfect pronunciation.',
      good: 'Good job! Try a bit clearer next time.',
      try_again: 'Keep trying! Practice makes perfect.'
    },
    quiz: {
      header_title: 'Interactive Quiz',
      header_sub: 'Test your grammar, vocabulary, and tense skills',
      submit: 'Submit Answer',
      next: 'Next Question',
      explanation: 'Explanation',
      points: 'Points',
      correct: 'Correct! +10 pts',
      wrong: 'Incorrect!'
    },
    daily: {
      header_title: 'Daily Practice Goals',
      header_sub: 'Complete daily tasks to maintain your streak',
      streak_message: 'Your current streak: {streak} days!',
      streak_sub: 'Practice every day to build your learning habit.'
    },
    leaderboard: {
      header_title: 'Student Leaderboard',
      header_sub: 'Top performing students this month',
      rank: 'Rank',
      student: 'Student',
      school: 'School',
      points: 'Points'
    },
    dashboard: {
      header_title: 'Student Dashboard',
      header_sub: 'Track your progress, streaks, and badges',
      welcome: 'Welcome back, {name}!',
      streak: 'Current Streak',
      points: 'Total Points',
      badges: 'Badges Earned',
      no_badges: 'No badges earned yet. Keep practicing!'
    }
  },
  telugu: {
    nav: {
      home: 'హోమ్',
      pronunciation: 'ఉచ్ఛారణ',
      grammar: 'వ్యాకరణం',
      quiz: 'క్విజ్',
      vocabulary: 'పదజాలం',
      daily: 'రోజువారీ లక్ష్యం',
      leaderboard: 'లీడర్‌బోర్డ్',
      admin: 'అడ్మిన్ ప్యానెల్',
      login: 'లాగిన్',
      register: 'రిజిస్టర్',
      logout: 'లాగౌట్'
    },
    home: {
      free_tag: '🎓 తెలుగు మీడియం విద్యార్థులకు ఉచితం',
      title_part1: 'తెలుగు ద్వారా ఇంగ్లీష్',
      title_part2: 'సులభంగా నేర్చుకోండి 🌟',
      subtitle: 'ఇంటరాక్టివ్ పాఠాలు మరియు వ్యాయామాలతో ఉచ్ఛారణ, వ్యాకరణం, పదజాలం మరియు మాట్లాడే నైపుణ్యాలను మెరుగుపరచండి.',
      get_started: '🚀 నేర్చుకోవడం ప్రారంభించండి',
      take_quiz: '🧠 క్విజ్ రాయండి',
      login_prompt: 'ఇప్పటికే ఖాతా ఉందా?',
      login_here: 'ఇక్కడ లాగిన్ అవ్వండి',
      stats_students: 'నేర్చుకుంటున్న విద్యార్థులు',
      stats_grammar: 'వ్యాకరణ అంశాలు',
      stats_quizzes: 'క్విజ్ ప్రశ్నలు',
      stats_free: 'ఎప్పటికీ ఉచితం',
      features_header: '⭐ ఫీచర్లు',
      testi_header: '💬 విద్యార్థుల అభిప్రాయాలు',
      cta_title: 'ప్రారంభించడానికి సిద్ధంగా ఉన్నారా? 🚀',
      cta_desc: 'ప్రతిరోజూ తమ ఇంగ్లీషును మెరుగుపరుచుకుంటున్న వేలాది మంది తెలుగు విద్యార్థులతో చేరండి.',
      cta_button: 'ఉచితంగా నమోదు చేసుకోండి 🎓',
      feat_pron_title: 'నిజ-సమయ ఉచ్ఛారణ',
      feat_pron_desc: 'మీ మైక్రోఫోన్‌లో మాట్లాడి మీ ఇంగ్లీష్ ఉచ్ఛారణ ఖచ్చితత్వంపై తక్షణ ఫీడ్‌బ్యాక్ పొందండి.',
      feat_gram_title: 'ద్విభాషా వ్యాకరణ పాఠాలు',
      feat_gram_desc: 'తెలుగులో స్పష్టంగా వివరించిన ఇంగ్లీష్ టెన్సులు, ఆర్టికల్స్ మరియు పార్ట్స్ ఆఫ్ స్పీచ్ అర్థం చేసుకోండి.',
      feat_quiz_title: 'ఇంటరాక్టివ్ క్విజ్‌లు',
      feat_quiz_desc: 'రోజువారీ వ్యాకరణం మరియు పదజాలం క్విజ్‌లను పూర్తి చేయడం ద్వారా పాయింట్లను, బ్యాడ్జ్‌లను మరియు స్ట్రీక్‌లను పొందండి.',
      feat_vocab_title: 'రోజువారీ పదజాలం',
      feat_vocab_desc: 'ధ్వని గైడ్‌లు, ఆడియో మరియు తెలుగు అర్థాలతో ప్రతిరోజూ 5 కొత్త ఇంగ్లీష్ పదాలను నేర్చుకోండి.',
      feat_daily_title: 'రోజువారీ ప్రాక్టీస్',
      feat_daily_desc: 'అలవాటును పెంపొందించుకోవడానికి వ్యాకరణం, ఉచ్ఛారణ మరియు పదజాలం కొరకు రోజువారీ లక్ష్యాలు.',
      feat_leader_title: 'లీడర్‌బోర్డ్',
      feat_leader_desc: 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణ వ్యాప్తంగా ఉన్న విద్యార్థులతో పోటీపడి, బ్యాడ్జ్‌లను గెలుచుకోండి!',
      open: 'ఓపెన్ చేయండి →'
    },
    grammar: {
      header_title: 'వ్యాకరణ అభ్యాసం',
      header_sub: 'స్పష్టమైన వివరణలతో ఇంగ్లీష్ వ్యాకరణ పాఠాలను నేర్చుకోండి',
      definition: '📌 నిర్వచనం',
      explanation: '🗣️ తెలుగు వివరణ',
      examples: '✅ ఉదాహరణలు',
      practice: '✏️ ప్రాక్టీస్ ప్రశ్నలు',
      tips: '💡 చిట్కాలు'
    },
    vocab: {
      header_title: 'పదజాలం పెంపొందించుకోండి',
      header_sub: 'అనువాదాలు, ధ్వని గైడ్‌లు మరియు ఆడియోతో ఇంగ్లీష్ పదాలను నేర్చుకోండి',
      search_placeholder: '🔍 ఇంగ్లీష్ లేదా తెలుగులో వెతకండి...',
      all_categories: 'అన్ని వర్గాలు',
      mark_learned: '📖 నేర్చుకున్నట్లు గుర్తించు',
      learned: '✅ నేర్చుకున్నారు! +2 పాయింట్లు',
      pronunciation: 'ఉచ్ఛారణ',
      example: 'ఉదాహరణ'
    },
    pron: {
      header_title: 'ఉచ్ఛారణ గైడ్',
      header_sub: 'ఇంగ్లీష్ పదాలు మాట్లాడి మీ ఉచ్ఛారణ ఖచ్చితత్వాన్ని తనిఖీ చేసుకోండి',
      score: 'ఖచ్చితత్వ స్కోరు',
      click_record: 'రికార్డ్ క్లిక్ చేసి, పదాన్ని స్పష్టంగా మాట్లాడండి',
      record: '🎙️ రికార్డ్ చేయి',
      stop: '⏹️ ఆపు',
      listening: '🔊 వింటున్నాను...',
      next_word: '⏭️ తదుపరి పదం',
      excellent: 'అద్భుతం! ఖచ్చితమైన ఉచ్ఛారణ.',
      good: 'మంచి ప్రయత్నం! తదుపరిసారి మరింత స్పష్టంగా ప్రయత్నించండి.',
      try_again: 'ప్రнятనిస్తూ ఉండండి! ప్రాక్టీస్ ద్వారా పరిపూర్ణత వస్తుంది.'
    },
    quiz: {
      header_title: 'ఇంటరాక్టివ్ క్విజ్',
      header_sub: 'మీ వ్యాకరణం, పదజాలం మరియు టెన్స్ నైపుణ్యాలను పరీక్షించుకోండి',
      submit: 'సమర్పించు',
      next: 'తదుపరి ప్రశ్న',
      explanation: 'వివరణ',
      points: 'పాయింట్లు',
      correct: 'సరైన సమాధానం! +10 పాయింట్లు',
      wrong: 'తప్పు సమాధానం!'
    },
    daily: {
      header_title: 'రోజువారీ ప్రాక్టీస్ లక్ష్యాలు',
      header_sub: 'మీ స్ట్రీక్‌ను కొనసాగించడానికి రోజువారీ పనులను పూర్తి చేయండి',
      streak_message: 'మీ ప్రస్తుత స్ట్రీక్: {streak} రోజులు!',
      streak_sub: 'నేర్చుకునే అలవాటును పెంచుకోవడానికి ప్రతిరోజూ ప్రాక్టీస్ చేయండి.'
    },
    leaderboard: {
      header_title: 'విద్యార్థుల లీడర్‌బోర్డ్',
      header_sub: 'ఈ నెలలో అగ్రస్థానంలో నిలిచిన విద్యార్థులు',
      rank: 'ర్యాంక్',
      student: 'విద్యార్థి',
      school: 'పాఠశాల',
      points: 'పాయింట్లు'
    },
    dashboard: {
      header_title: 'విద్యార్థి డాష్‌బోర్డ్',
      header_sub: 'మీ పురోగతి, స్ట్రీక్‌లు మరియు బ్యాడ్జ్‌లను ట్రాక్ చేయండి',
      welcome: 'తిరిగి స్వాగతం, {name}!',
      streak: 'ప్రస్తుత స్ట్రీక్',
      points: 'మొత్తం పాయింట్లు',
      badges: 'పొందిన బ్యాడ్జ్‌లు',
      no_badges: 'ఇంకా ఎలాంటి బ్యాడ్జ్‌లు రాలేదు. ప్రాక్టీస్ చేస్తూ ఉండండి!'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('english');

  useEffect(() => {
    const stored = localStorage.getItem('language');
    if (stored === 'telugu' || stored === 'english') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = (lang) => {
    if (lang === 'telugu' || lang === 'english') {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
    }
  };

  const t = (path) => {
    const parts = path.split('.');
    let current = dictionary[language];
    for (const part of parts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return path; // Fallback to path if not found
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
