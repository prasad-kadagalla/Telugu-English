const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Vocabulary = require('../models/Vocabulary');
const bcrypt = require('bcryptjs');

const lessonsData = [
  {
    title: 'What is a Noun?',
    category: 'grammar',
    subcategory: 'parts-of-speech',
    level: 'beginner',
    order: 1,
    estimatedTime: 10,
    content: {
      definition: 'A noun is the name of a person, place, animal, or thing.',
      teluguExplanation: 'వ్యక్తి, స్థలం, జంతువు లేదా వస్తువు పేరు నౌన్ అంటారు.',
      examples: [
        { english: 'Boy', telugu: 'అబ్బాయి', sentence: 'The boy is playing.' },
        { english: 'School', telugu: 'పాఠశాల', sentence: 'I go to school every day.' },
        { english: 'Dog', telugu: 'కుక్క', sentence: 'The dog is barking.' },
        { english: 'Book', telugu: 'పుస్తకం', sentence: 'She reads a book.' },
      ],
      practiceQuestions: [
        'Which is a noun? → Run / Book / Quickly / Beautiful',
        'Fill: The ___ is big. (school / run / quickly)',
        'Find 3 nouns in: "The girl and her dog sat under the tree."',
      ],
      tips: ['Nouns can be singular or plural.', 'Proper nouns always start with a capital letter.'],
    },
    tags: ['noun', 'parts of speech', 'grammar basics'],
  },
  {
    title: 'Pronouns Explained',
    category: 'grammar',
    subcategory: 'parts-of-speech',
    level: 'beginner',
    order: 2,
    estimatedTime: 10,
    content: {
      definition: 'A pronoun is a word used in place of a noun.',
      teluguExplanation: 'నౌన్ స్థానంలో వాడే పదాన్ని ప్రొనౌన్ అంటారు.',
      examples: [
        { english: 'I', telugu: 'నేను', sentence: 'I am a student.' },
        { english: 'He', telugu: 'అతడు', sentence: 'He goes to school.' },
        { english: 'She', telugu: 'ఆమె', sentence: 'She reads books.' },
        { english: 'They', telugu: 'వారు', sentence: 'They play cricket.' },
      ],
      practiceQuestions: [
        '___ is going to school. (He / Book / Run)',
        'Replace the noun: "Ram is a student. ___ studies hard."',
      ],
      tips: ['Personal pronouns: I, you, he, she, it, we, they.', 'Use "he" for males, "she" for females.'],
    },
    tags: ['pronoun', 'parts of speech'],
  },
  {
    title: 'Simple Present Tense',
    category: 'tenses',
    subcategory: 'present',
    level: 'beginner',
    order: 3,
    estimatedTime: 15,
    content: {
      definition: 'Simple present tense describes habits, facts, and regular actions.',
      teluguExplanation: 'నిత్యం జరిగే పనులను తెలుపడానికి సింపుల్ ప్రెజెంట్ టెన్స్ వాడతారు.',
      examples: [
        { english: 'I go to school.', telugu: 'నేను పాఠశాలకు వెళ్తాను.', sentence: '' },
        { english: 'She reads books.', telugu: 'ఆమె పుస్తకాలు చదువుతుంది.', sentence: '' },
        { english: 'They play cricket.', telugu: 'వారు క్రికెట్ ఆడతారు.', sentence: '' },
      ],
      practiceQuestions: [
        'Fill: She ___ to school every day. (go/goes/went)',
        'Is this present tense? "He played football." Yes / No',
      ],
      tips: ['For he/she/it → add "s" or "es" to the verb.', 'Signal words: every day, always, usually, often.'],
    },
    tags: ['tenses', 'present', 'simple present'],
  },
  {
    title: 'Articles: A, An, The',
    category: 'articles',
    level: 'beginner',
    order: 4,
    estimatedTime: 10,
    content: {
      definition: 'Articles (a, an, the) are used before nouns. "A" and "an" are indefinite; "the" is definite.',
      teluguExplanation: '"a", "an", "the" పదాలను ఆర్టికల్స్ అంటారు. నౌన్ ముందు వాటిని వాడతాం.',
      examples: [
        { english: 'A dog', telugu: 'ఒక కుక్క', sentence: 'I saw a dog.' },
        { english: 'An apple', telugu: 'ఒక యాపిల్', sentence: 'She ate an apple.' },
        { english: 'The sun', telugu: 'సూర్యుడు', sentence: 'The sun rises in the east.' },
      ],
      practiceQuestions: [
        'Use a or an: "___ orange, ___ book, ___ egg, ___ car"',
        '"___ Earth is ___ planet." (A/An/The)',
      ],
      tips: ['Use "an" before vowel sounds: a, e, i, o, u.', '"The" is used for specific or unique nouns.'],
    },
    tags: ['articles', 'a', 'an', 'the'],
  },
  {
    title: 'Active and Passive Voice',
    category: 'grammar',
    subcategory: 'voice',
    level: 'intermediate',
    order: 5,
    estimatedTime: 20,
    content: {
      definition: 'In active voice the subject does the action. In passive voice the subject receives the action.',
      teluguExplanation: 'యాక్టివ్ వాయిస్‌లో కర్త పని చేస్తాడు. పాసివ్ వాయిస్‌లో కర్మ పని చేయబడుతుంది.',
      examples: [
        { english: 'Active: Ram wrote a letter.', telugu: 'రాముడు ఒక ఉత్తరం రాశాడు.', sentence: '' },
        { english: 'Passive: A letter was written by Ram.', telugu: 'రాముడిచే ఒక ఉత్తరం రాయబడింది.', sentence: '' },
      ],
      practiceQuestions: [
        'Change to passive: "The boy broke the window."',
        'Active or Passive? "A song was sung by her."',
      ],
      tips: ['Passive = is/am/are/was/were + past participle + "by".'],
    },
    tags: ['active voice', 'passive voice', 'grammar'],
  },
];

const quizzesData = [
  { question: 'Which word is a NOUN?', questionTelugu: 'ఏ పదం నౌన్?', type: 'mcq', options: ['Run', 'Beautiful', 'School', 'Quickly'], correctAnswer: 2, category: 'grammar', difficulty: 'easy', explanation: 'School is the name of a place — that makes it a noun.', explanationTelugu: 'పాఠశాల అనేది ఒక స్థలం పేరు కాబట్టి అది నౌన్.', points: 10 },
  { question: 'Complete: "She ___ to school every day."', type: 'mcq', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1, category: 'grammar', difficulty: 'easy', explanation: 'With "she" (third person singular) we add "s" → goes.', points: 10 },
  { question: 'Which is an ADJECTIVE?', type: 'mcq', options: ['Jump', 'Quickly', 'Tall', 'Eat'], correctAnswer: 2, category: 'grammar', difficulty: 'easy', explanation: '"Tall" describes a noun — it is an adjective.', points: 10 },
  { question: 'Choose the correct ARTICLE: "___ apple a day keeps the doctor away."', type: 'mcq', options: ['A', 'An', 'The', 'No article'], correctAnswer: 1, category: 'articles', difficulty: 'easy', explanation: '"Apple" starts with a vowel sound, so we use "an".', explanationTelugu: '"apple" అనే పదం vowel తో మొదలవుతుంది కాబట్టి "an" వాడాలి.', points: 10 },
  { question: 'What is the PAST tense of "go"?', type: 'mcq', options: ['Goes', 'Going', 'Gone', 'Went'], correctAnswer: 3, category: 'tenses', difficulty: 'easy', explanation: 'The irregular past tense of "go" is "went".', points: 10 },
  { question: 'Which sentence is in PASSIVE voice?', type: 'mcq', options: ['She sang a song.', 'He runs fast.', 'A song was sung by her.', 'They play cricket.'], correctAnswer: 2, category: 'grammar', difficulty: 'medium', explanation: '"A song was sung by her" is passive — subject receives the action.', points: 15 },
  { question: 'Telugu word "పాఠశాల" means:', type: 'mcq', options: ['Home', 'School', 'Market', 'Temple'], correctAnswer: 1, category: 'vocabulary', difficulty: 'easy', explanation: 'పాఠశాల = School in English.', points: 10 },
  { question: 'Which is a PRONOUN?', type: 'mcq', options: ['Book', 'Beautiful', 'She', 'Run'], correctAnswer: 2, category: 'grammar', difficulty: 'easy', explanation: '"She" is a personal pronoun used in place of a female name.', points: 10 },
  { question: 'Complete: "I ___ my homework yesterday."', type: 'mcq', options: ['do', 'does', 'did', 'doing'], correctAnswer: 2, category: 'tenses', difficulty: 'easy', explanation: '"Yesterday" signals past tense, so we use "did".', points: 10 },
  { question: 'What type of word is "quickly"?', type: 'mcq', options: ['Noun', 'Verb', 'Adjective', 'Adverb'], correctAnswer: 3, category: 'grammar', difficulty: 'easy', explanation: '"Quickly" tells us HOW something is done — that makes it an adverb.', points: 10 },
  { question: 'Use ___ before "hour": "I waited ___ hour."', type: 'mcq', options: ['a', 'an', 'the', 'no article'], correctAnswer: 1, category: 'articles', difficulty: 'medium', explanation: '"Hour" starts with a silent H, giving a vowel sound — use "an".', points: 15 },
  { question: 'Is this statement TRUE or FALSE? "All nouns are proper nouns."', type: 'true_false', options: ['True', 'False'], correctAnswer: 1, category: 'grammar', difficulty: 'easy', explanation: 'FALSE. Nouns can be common (book, dog) or proper (India, Ram).', points: 5 },
];

const vocabData = [
  { word: 'School', meaning: 'పాఠశాల', phonetic: '/skuːl/', pronunciation: 'skool', exampleSentence: 'I go to school every day.', exampleTelugu: 'నేను రోజూ పాఠశాలకు వెళ్తాను.', category: 'school', difficulty: 'easy' },
  { word: 'Book', meaning: 'పుస్తకం', phonetic: '/bʊk/', pronunciation: 'book', exampleSentence: 'She reads a book at night.', category: 'school', difficulty: 'easy' },
  { word: 'Teacher', meaning: 'ఉపాధ్యాయుడు', phonetic: '/ˈtiːtʃər/', pronunciation: 'tee-cher', exampleSentence: 'The teacher explains the lesson clearly.', category: 'school', difficulty: 'easy' },
  { word: 'Water', meaning: 'నీరు', phonetic: '/ˈwɔːtər/', pronunciation: 'waw-ter', exampleSentence: 'Please give me a glass of water.', category: 'common', difficulty: 'easy' },
  { word: 'Friend', meaning: 'స్నేహితుడు', phonetic: '/frɛnd/', pronunciation: 'frend', exampleSentence: 'He is my best friend.', category: 'common', difficulty: 'easy' },
  { word: 'Home', meaning: 'ఇల్లు', phonetic: '/hoʊm/', pronunciation: 'hohm', exampleSentence: 'I come home at 4 PM.', category: 'places', difficulty: 'easy' },
  { word: 'Food', meaning: 'ఆహారం', phonetic: '/fuːd/', pronunciation: 'food', exampleSentence: 'The food is very delicious.', category: 'food', difficulty: 'easy' },
  { word: 'Sun', meaning: 'సూర్యుడు', phonetic: '/sʌn/', pronunciation: 'sun', exampleSentence: 'The sun rises in the east.', category: 'nature', difficulty: 'easy' },
  { word: 'Moon', meaning: 'చంద్రుడు', phonetic: '/muːn/', pronunciation: 'moon', exampleSentence: 'The moon shines at night.', category: 'nature', difficulty: 'easy' },
  { word: 'Tree', meaning: 'చెట్టు', phonetic: '/triː/', pronunciation: 'tree', exampleSentence: 'We planted a tree in school.', category: 'nature', difficulty: 'easy' },
  { word: 'Bird', meaning: 'పక్షి', phonetic: '/bɜːrd/', pronunciation: 'burd', exampleSentence: 'A bird is singing on the tree.', category: 'animals', difficulty: 'easy' },
  { word: 'River', meaning: 'నది', phonetic: '/ˈrɪvər/', pronunciation: 'riv-er', exampleSentence: 'The river flows near our village.', category: 'nature', difficulty: 'easy' },
  { word: 'Mother', meaning: 'అమ్మ', phonetic: '/ˈmʌðər/', pronunciation: 'muh-ther', exampleSentence: 'My mother cooks delicious food.', category: 'family', difficulty: 'easy' },
  { word: 'Father', meaning: 'నాన్న', phonetic: '/ˈfɑːðər/', pronunciation: 'faa-ther', exampleSentence: 'My father goes to work every day.', category: 'family', difficulty: 'easy' },
  { word: 'Village', meaning: 'గ్రామం', phonetic: '/ˈvɪlɪdʒ/', pronunciation: 'vil-ij', exampleSentence: 'I live in a small village.', category: 'places', difficulty: 'easy' },
  { word: 'Happy', meaning: 'సంతోషంగా', phonetic: '/ˈhæpi/', pronunciation: 'hap-ee', exampleSentence: 'She is very happy today.', category: 'feelings', difficulty: 'easy', synonyms: ['joyful', 'glad'], antonyms: ['sad', 'unhappy'] },
  { word: 'Beautiful', meaning: 'అందమైన', phonetic: '/ˈbjuːtɪfəl/', pronunciation: 'byoo-ti-ful', exampleSentence: 'The garden is very beautiful.', category: 'common', difficulty: 'medium' },
  { word: 'Knowledge', meaning: 'జ్ఞానం', phonetic: '/ˈnɒlɪdʒ/', pronunciation: 'nol-ij', exampleSentence: 'Knowledge is power.', category: 'school', difficulty: 'medium' },
];

router.post('/', async (req, res) => {
  const { secret } = req.body;
  if (secret !== 'seed_my_production_db_please') {
    return res.status(401).json({ success: false, message: 'Unauthorized. Invalid secret key.' });
  }

  try {
    // 1. Clean existing records
    await User.deleteMany();
    await Lesson.deleteMany();
    await Quiz.deleteMany();
    await Vocabulary.deleteMany();

    // 2. Hash and seed default users
    const rawUsers = [
      { name: 'Admin User', email: process.env.ADMIN_EMAIL || 'admin@teluguenglish.com', password: process.env.ADMIN_PASSWORD || 'Admin@123', role: 'admin', school: 'HQ', class: '' },
      { name: 'Priya Sharma', email: 'priya@student.com', password: 'Student@123', role: 'student', school: 'ZP High School Vizag', class: '9th', totalPoints: 980 },
      { name: 'Ravi Kumar',   email: 'ravi@student.com',  password: 'Student@123', role: 'student', school: 'Govt High School Kurnool', class: '8th', totalPoints: 920 },
      { name: 'Anitha Reddy', email: 'anitha@student.com',password: 'Student@123', role: 'student', school: 'MPP School Nellore', class: '10th', totalPoints: 870 }
    ];

    const hashedUsers = await Promise.all(
      rawUsers.map(async (u) => ({
        ...u,
        password: await bcrypt.hash(u.password, 12),
      }))
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const admin = createdUsers.find((u) => u.role === 'admin');

    // 3. Seed Lessons with inline slugs
    const formattedLessons = lessonsData.map((l) => ({
      ...l,
      slug: l.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 80),
      createdBy: admin._id
    }));
    const createdLessons = await Lesson.insertMany(formattedLessons);

    // 4. Seed Quizzes
    const formattedQuizzes = quizzesData.map((q) => ({ ...q, createdBy: admin._id }));
    const createdQuizzes = await Quiz.insertMany(formattedQuizzes);

    // 5. Seed Vocabulary
    const formattedVocab = vocabData.map((v) => ({ ...v, createdBy: admin._id }));
    const createdVocab = await Vocabulary.insertMany(formattedVocab);

    res.json({
      success: true,
      message: 'Cloud Database successfully seeded!',
      counts: {
        users: createdUsers.length,
        lessons: createdLessons.length,
        quizzes: createdQuizzes.length,
        vocabulary: createdVocab.length
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
