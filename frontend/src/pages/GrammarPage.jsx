import React, { useState } from 'react';
import { PageHeader } from '../components/common';
import { useLanguage } from '../context/LanguageContext';

const GRAMMAR_DATA = {
  noun: {
    icon: '🏷️',
    titleKey: 'Noun',
    titleTelugu: 'నామవాచకం (Noun)',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    definition: 'A noun is the name of a person, place, animal, or thing.',
    telugu: 'వ్యక్తి, స్థలం, జంతువు లేదా వస్తువు పేరు నౌన్ అంటారు.',
    examples: [
      { e: 'Boy (అబ్బాయి)', s: 'The boy is playing.' },
      { e: 'School (పాఠశాల)', s: 'I go to school.' },
      { e: 'Dog (కుక్క)', s: 'The dog is running.' },
      { e: 'Book (పుస్తకం)', s: 'She reads a book.' }
    ],
    practice: [
      'Which is a noun? Run / Book / Quickly / Beautiful',
      'Fill: The ___ is big. (school / run / quickly)',
      'Find nouns in: "The girl and her dog sat under the tree."'
    ]
  },
  pronoun: {
    icon: '👤',
    titleKey: 'Pronoun',
    titleTelugu: 'సర్వనామం (Pronoun)',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-300',
    definition: 'A pronoun is a word used in place of a noun.',
    telugu: 'నౌన్ స్థానంలో వాడే ప్రొనౌన్ అంటారు.',
    examples: [
      { e: 'I (నేను)', s: 'I am a student.' },
      { e: 'He (అతడు)', s: 'He goes to school.' },
      { e: 'She (ఆమె)', s: 'She reads books.' },
      { e: 'They (వారు)', s: 'They play cricket.' }
    ],
    practice: [
      '___ is going to school. (He / Book / Run)',
      'Replace: "Ram is a student. ___ studies hard."'
    ]
  },
  verb: {
    icon: '⚡',
    titleKey: 'Verb',
    titleTelugu: 'క్రియ (Verb)',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    definition: 'A verb is a word that describes an action or state.',
    telugu: 'చర్య లేదా స్థితిని తెలిపే పదాన్ని వెర్బ్ అంటారు.',
    examples: [
      { e: 'Run (పరుగెత్తు)', s: 'He runs fast.' },
      { e: 'Eat (తినుట)', s: 'She eats rice.' },
      { e: 'Write (రాయుట)', s: 'I write a letter.' },
      { e: 'Sleep (నిద్ర)', s: 'The baby sleeps.' }
    ],
    practice: [
      'Identify verb: He ___ fast. (runs/book/happy)',
      'Which is a verb? Beautiful / Run / School'
    ]
  },
  adjective: {
    icon: '🎨',
    titleKey: 'Adjective',
    titleTelugu: 'విశేషణం (Adjective)',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    definition: 'An adjective is a word that describes or modifies a noun.',
    telugu: 'నౌన్‌ని వర్ణించే పదాన్ని అడ్జెక్టివ్ అంటారు.',
    examples: [
      { e: 'Big (పెద్ద)', s: 'The big dog ran.' },
      { e: 'Beautiful (అందమైన)', s: 'She is beautiful.' },
      { e: 'Tall (పొడవైన)', s: 'He is very tall.' },
      { e: 'Smart (తెలివైన)', s: 'She is smart.' }
    ],
    practice: [
      'Choose adj: The ___ dog ran. (big/run/school)',
      'Which describes a noun? Quickly / Beautiful / Eat'
    ]
  },
  adverb: {
    icon: '🏃',
    titleKey: 'Adverb',
    titleTelugu: 'క్రియావిశేషణం (Adverb)',
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    definition: 'An adverb modifies a verb, adjective, or another adverb — often answers how, when, where.',
    telugu: 'వెర్బ్, అడ్జెక్టివ్ లేదా మరొక ఆడ్వెర్బ్‌ని మారిస్తుంది.',
    examples: [
      { e: 'Quickly (వేగంగా)', s: 'He runs quickly.' },
      { e: 'Slowly (మెల్లగా)', s: 'She walks slowly.' },
      { e: 'Always (ఎప్పుడూ)', s: 'I always study.' },
      { e: 'Very (చాలా)', s: 'She is very tall.' }
    ],
    practice: [
      'Is "quickly" an adverb? Yes / No',
      'Find the adverb: "She speaks very softly."'
    ]
  },
  tenses: {
    icon: '⏰',
    titleKey: 'Tenses',
    titleTelugu: 'కాలాలు (Tenses)',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-300',
    definition: 'Tense tells us WHEN an action happens – past, present, or future.',
    telugu: 'పని జరిగిన సమయాన్ని తెలిపే వ్యాకరణ నియమాన్ని కాలం (Tense) అంటారు.',
    examples: [
      { e: 'Present: I go to school.', s: '' },
      { e: 'Past: I went to school.', s: '' },
      { e: 'Future: I will go to school.', s: '' },
      { e: 'Continuous: I am going.', s: '' }
    ],
    practice: [
      'Yesterday, she ___ to market. (went/goes/will go)',
      'Choose future: I ___ help you. (will/am/was)'
    ]
  },
  articles: {
    icon: '📝',
    titleKey: 'Articles',
    titleTelugu: 'ఆర్టికల్స్ (Articles)',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-300',
    definition: 'Articles (a, an, the) are used before nouns. A/An = indefinite; The = definite.',
    telugu: '"a", "an", "the" పదాలను ఆర్టికల్స్ అంటారు. నౌన్ ముందు వాటిని వాడతాం.',
    examples: [
      { e: 'A dog', s: 'I saw a dog.' },
      { e: 'An apple', s: 'She ate an apple.' },
      { e: 'The sun', s: 'The sun is bright.' },
      { e: 'An hour', s: 'Wait an hour.' }
    ],
    practice: [
      'Fill: "___ orange, ___ book, ___ egg"',
      'Complete: "___ Earth is ___ planet." (A/An/The)'
    ]
  },
  voice: {
    icon: '🔄',
    titleKey: 'Active & Passive Voice',
    titleTelugu: 'కర్తరి & కర్మణి (Voice)',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-300',
    definition: 'Active: subject does the action. Passive: subject receives the action.',
    telugu: 'యాక్టివ్‌లో కర్త పని చేస్తాడు. పాసివ్‌లో కర్మ పని చేయబడుతుంది.',
    examples: [
      { e: 'Active: Ram wrote a letter.', s: '' },
      { e: 'Passive: A letter was written by Ram.', s: '' },
      { e: 'Active: She sings a song.', s: '' },
      { e: 'Passive: A song is sung by her.', s: '' }
    ],
    practice: [
      'Change to passive: "The boy broke the window."',
      'Active or Passive? "A book was read by her."'
    ]
  }
};

export default function GrammarPage() {
  const { language, t: translate } = useLanguage();
  const [active, setActive] = useState('noun');
  const t = GRAMMAR_DATA[active];

  // Format examples: strip Telugu if interface is English
  const formatExampleText = (text) => {
    if (language === 'english') {
      return text.replace(/\s*\(.*\)/, '');
    }
    return text;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <PageHeader
        icon="📖"
        title={translate('grammar.header_title')}
        subtitle={translate('grammar.header_sub')}
      />

      {/* Tab strip */}
      <div className="flex gap-2 flex-wrap mb-5">
        {Object.entries(GRAMMAR_DATA).map(([k, v]) => (
          <button key={k}
            onClick={() => setActive(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all
              ${active === k
                ? `${v.bg} ${v.border} ${v.color}`
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
            {v.icon} {language === 'english' ? v.titleKey : v.titleTelugu}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="card shadow-sm border border-slate-200 fade-in bg-white rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
          <span className="text-3xl">{t.icon}</span>
          <h2 className={`text-xl font-bold ${t.color}`}>
            {language === 'english' ? t.titleKey : t.titleTelugu}
          </h2>
        </div>

        {/* Definition */}
        <div className={`${t.bg} border-l-4 ${t.border} rounded-r-xl p-4 mb-4`}>
          <p className="text-xs font-semibold text-slate-400 mb-1">{translate('grammar.definition')}</p>
          <p className="text-slate-800 font-semibold">{t.definition}</p>
        </div>

        {/* Telugu Explanation */}
        {language === 'telugu' && (
          <div className="bg-purple-50 border-l-4 border-purple-300 rounded-r-xl p-4 mb-4">
            <p className="text-xs font-semibold text-purple-400 mb-1">{translate('grammar.explanation')}</p>
            <p className="text-purple-800 telugu-text font-medium">{t.telugu}</p>
          </div>
        )}

        {/* Examples */}
        <div className="bg-emerald-50 rounded-xl p-4 mb-4 border border-emerald-100">
          <p className="text-xs font-semibold text-emerald-600 mb-3 uppercase tracking-wider">{translate('grammar.examples')}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {t.examples.map((ex, i) => (
              <div key={i} className="bg-white rounded-lg px-3.5 py-2.5 border border-emerald-200 shadow-sm">
                <p className="font-semibold text-slate-800 text-sm">
                  {formatExampleText(ex.e)}
                </p>
                {ex.s && <p className="text-slate-500 text-xs mt-1 italic font-medium">{ex.s}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Practice */}
        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 mb-3 uppercase tracking-wider">{translate('grammar.practice')}</p>
          <ol className="space-y-2.5">
            {t.practice.map((p, i) => (
              <li key={i} className="text-sm text-slate-700 flex gap-2 font-medium">
                <span className="font-bold text-amber-600 shrink-0">{i + 1}.</span> {p}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
