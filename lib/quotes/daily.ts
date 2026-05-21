export type QuoteCategory =
  | "wisdom"
  | "programming"
  | "motivation"
  | "stoic"
  | "scripture"
  | "philosophy"
  | "creativity"
  | "discipline"
  | "life";

export type Quote = { text: string; author?: string; category: QuoteCategory };

/**
 * Curated quote collection — short, useful, varied. Mix of programming,
 * stoic philosophy, motivation, scripture (Bible, Quran), and modern wisdom.
 * Rotates every 4 hours via slot hashing so the same quote shows for a
 * predictable window then changes.
 */
export const QUOTES: Quote[] = [
  // ── Wisdom / Modern thinkers ─────────────────────────────────────
  { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin", category: "wisdom" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant", category: "wisdom" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", category: "wisdom" },
  { text: "How we spend our days is, of course, how we spend our lives.", author: "Annie Dillard", category: "wisdom" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker", category: "wisdom" },
  { text: "What gets measured, gets managed.", author: "Peter Drucker", category: "wisdom" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", category: "wisdom" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", category: "wisdom" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg", category: "wisdom" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu", category: "wisdom" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle", category: "wisdom" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle", category: "wisdom" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle", category: "wisdom" },
  { text: "Compound interest is the eighth wonder of the world.", author: "attributed to Einstein", category: "wisdom" },
  { text: "If you can't fly, run. If you can't run, walk. If you can't walk, crawl. But keep moving.", author: "Martin Luther King Jr.", category: "wisdom" },
  { text: "The two most powerful warriors are patience and time.", author: "Tolstoy", category: "wisdom" },
  { text: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius", category: "wisdom" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius", category: "wisdom" },
  { text: "Knowledge is of no value unless you put it into practice.", author: "Anton Chekhov", category: "wisdom" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin", category: "wisdom" },

  // ── Programming / Software ──────────────────────────────────────
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson", category: "programming" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck", category: "programming" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger Dijkstra", category: "programming" },
  { text: "Premature optimization is the root of all evil.", author: "Donald Knuth", category: "programming" },
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler", category: "programming" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson", category: "programming" },
  { text: "If debugging is the process of removing software bugs, then programming must be the process of putting them in.", author: "Edsger Dijkstra", category: "programming" },
  { text: "The most damaging phrase in the language is: 'We've always done it this way.'", author: "Grace Hopper", category: "programming" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds", category: "programming" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs", category: "programming" },
  { text: "Walking on water and developing software from a specification are easy if both are frozen.", author: "Edward V. Berard", category: "programming" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House", category: "programming" },
  { text: "There are only two hard things in computer science: cache invalidation and naming things.", author: "Phil Karlton", category: "programming" },
  { text: "Deleted code is debugged code.", author: "Jeff Sickel", category: "programming" },
  { text: "Premature abstraction is just as bad as premature optimization.", category: "programming" },
  { text: "Weeks of coding can save you hours of planning.", category: "programming" },
  { text: "It's not a bug; it's an undocumented feature.", category: "programming" },
  { text: "The function of good software is to make the complex appear to be simple.", author: "Grady Booch", category: "programming" },
  { text: "Inside every large program is a small program struggling to get out.", author: "Tony Hoare", category: "programming" },
  { text: "Controlling complexity is the essence of computer programming.", author: "Brian Kernighan", category: "programming" },

  // ── Stoic ────────────────────────────────────────────────────────
  { text: "You have power over your mind — not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Waste no more time arguing what a good person should be. Be one.", author: "Marcus Aurelius", category: "stoic" },
  { text: "If it is not right, do not do it. If it is not true, do not say it.", author: "Marcus Aurelius", category: "stoic" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Confine yourself to the present.", author: "Marcus Aurelius", category: "stoic" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus", category: "stoic" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus", category: "stoic" },
  { text: "No man is free who is not master of himself.", author: "Epictetus", category: "stoic" },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus", category: "stoic" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca", category: "stoic" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca", category: "stoic" },
  { text: "We suffer more often in imagination than in reality.", author: "Seneca", category: "stoic" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca", category: "stoic" },
  { text: "Difficulties strengthen the mind, as labor does the body.", author: "Seneca", category: "stoic" },
  { text: "While we wait for life, life passes.", author: "Seneca", category: "stoic" },

  // ── Discipline / Habit ──────────────────────────────────────────
  { text: "Discipline equals freedom.", author: "Jocko Willink", category: "discipline" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Rohn", category: "discipline" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn", category: "discipline" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier", category: "discipline" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson", category: "discipline" },
  { text: "We are what we repeatedly do.", author: "Aristotle", category: "discipline" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements.", category: "discipline" },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin", category: "discipline" },
  { text: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin", category: "discipline" },
  { text: "Slow is smooth, smooth is fast.", category: "discipline" },
  { text: "Amateurs sit and wait for inspiration. The rest of us just get up and go to work.", author: "Stephen King", category: "discipline" },
  { text: "Do the best you can until you know better. Then when you know better, do better.", author: "Maya Angelou", category: "discipline" },
  { text: "If you don't have time to do it right, when will you have time to do it over?", author: "John Wooden", category: "discipline" },
  { text: "Whether you think you can, or you think you can't — you're right.", author: "Henry Ford", category: "discipline" },
  { text: "The price of greatness is responsibility.", author: "Winston Churchill", category: "discipline" },

  // ── Motivation / Action ─────────────────────────────────────────
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso", category: "motivation" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke", category: "motivation" },
  { text: "Fall seven times, stand up eight.", category: "motivation" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell", category: "motivation" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche", category: "motivation" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery", category: "motivation" },
  { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs", category: "motivation" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs", category: "motivation" },
  { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson", category: "motivation" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt", category: "motivation" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", category: "motivation" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington", category: "motivation" },
  { text: "Out of difficulties grow miracles.", author: "Jean de La Bruyère", category: "motivation" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe", category: "motivation" },

  // ── Bible (KJV / public domain renderings) ──────────────────────
  { text: "Be still, and know that I am God.", author: "Psalm 46:10", category: "scripture" },
  { text: "Commit thy works unto the Lord, and thy thoughts shall be established.", author: "Proverbs 16:3", category: "scripture" },
  { text: "Whatsoever thy hand findeth to do, do it with thy might.", author: "Ecclesiastes 9:10", category: "scripture" },
  { text: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.", author: "Proverbs 3:5", category: "scripture" },
  { text: "I can do all things through Christ which strengtheneth me.", author: "Philippians 4:13", category: "scripture" },
  { text: "The race is not to the swift, nor the battle to the strong, but time and chance happeneth to them all.", author: "Ecclesiastes 9:11", category: "scripture" },
  { text: "Iron sharpeneth iron; so a man sharpeneth the countenance of his friend.", author: "Proverbs 27:17", category: "scripture" },
  { text: "To every thing there is a season, and a time to every purpose under the heaven.", author: "Ecclesiastes 3:1", category: "scripture" },
  { text: "Cast thy bread upon the waters: for thou shalt find it after many days.", author: "Ecclesiastes 11:1", category: "scripture" },
  { text: "A soft answer turneth away wrath: but grievous words stir up anger.", author: "Proverbs 15:1", category: "scripture" },
  { text: "Pride goeth before destruction, and an haughty spirit before a fall.", author: "Proverbs 16:18", category: "scripture" },
  { text: "Where there is no vision, the people perish.", author: "Proverbs 29:18", category: "scripture" },
  { text: "Better is the end of a thing than the beginning thereof.", author: "Ecclesiastes 7:8", category: "scripture" },
  { text: "Let your light so shine before men, that they may see your good works.", author: "Matthew 5:16", category: "scripture" },
  { text: "Whatsoever ye do, do it heartily, as to the Lord.", author: "Colossians 3:23", category: "scripture" },

  // ── Quran (English interpretations — common translations) ──────
  { text: "Verily, with hardship comes ease.", author: "Quran 94:6", category: "scripture" },
  { text: "Indeed, Allah is with the patient.", author: "Quran 2:153", category: "scripture" },
  { text: "And whoever fears Allah — He will make for him a way out.", author: "Quran 65:2", category: "scripture" },
  { text: "Do not lose hope, nor be sad.", author: "Quran 3:139", category: "scripture" },
  { text: "Indeed, prayer prohibits immorality and wrongdoing.", author: "Quran 29:45", category: "scripture" },
  { text: "And He found you lost and guided you.", author: "Quran 93:7", category: "scripture" },
  { text: "Allah does not burden a soul beyond that it can bear.", author: "Quran 2:286", category: "scripture" },
  { text: "Whoever does righteousness — male or female — while being a believer, We shall give them a good life.", author: "Quran 16:97", category: "scripture" },
  { text: "Speak to people kindly.", author: "Quran 2:83", category: "scripture" },
  { text: "And of His signs is that He created for you mates from yourselves so you may find tranquility.", author: "Quran 30:21", category: "scripture" },
  { text: "So remember Me; I will remember you.", author: "Quran 2:152", category: "scripture" },
  { text: "And whoever puts their trust in Allah, He will be sufficient for them.", author: "Quran 65:3", category: "scripture" },
  { text: "Repel evil with what is better.", author: "Quran 41:34", category: "scripture" },
  { text: "Indeed, the most noble of you in the sight of Allah is the most righteous.", author: "Quran 49:13", category: "scripture" },
  { text: "And We have certainly created man and We know what his soul whispers to him.", author: "Quran 50:16", category: "scripture" },

  // ── Philosophy ──────────────────────────────────────────────────
  { text: "The unexamined life is not worth living.", author: "Socrates", category: "philosophy" },
  { text: "Beware the bareness of a busy life.", author: "Socrates", category: "philosophy" },
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates", category: "philosophy" },
  { text: "An unexamined day is a day not lived.", category: "philosophy" },
  { text: "What we think, we become.", author: "Buddha", category: "philosophy" },
  { text: "Three things cannot be long hidden: the sun, the moon, and the truth.", author: "Buddha", category: "philosophy" },
  { text: "Peace comes from within. Do not seek it without.", author: "Buddha", category: "philosophy" },
  { text: "He who knows others is wise; he who knows himself is enlightened.", author: "Lao Tzu", category: "philosophy" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", category: "philosophy" },
  { text: "When you are content to be simply yourself and don't compare or compete, everybody will respect you.", author: "Lao Tzu", category: "philosophy" },
  { text: "The greatest wealth is a quiet mind.", category: "philosophy" },

  // ── Creativity / Craft ──────────────────────────────────────────
  { text: "The creative adult is the child who survived.", author: "Ursula K. Le Guin", category: "creativity" },
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein", category: "creativity" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou", category: "creativity" },
  { text: "Don't think. Thinking is the enemy of creativity.", author: "Ray Bradbury", category: "creativity" },
  { text: "The chief enemy of creativity is good sense.", author: "Pablo Picasso", category: "creativity" },
  { text: "Art is the elimination of the unnecessary.", author: "Pablo Picasso", category: "creativity" },
  { text: "Have no fear of perfection — you'll never reach it.", author: "Salvador Dalí", category: "creativity" },
  { text: "If you hear a voice within you say 'you cannot paint,' then by all means paint, and that voice will be silenced.", author: "Vincent van Gogh", category: "creativity" },
  { text: "Inspiration exists, but it has to find you working.", author: "Pablo Picasso", category: "creativity" },
  { text: "Great things are done by a series of small things brought together.", author: "Vincent van Gogh", category: "creativity" },

  // ── Additional Quotes ───────────────────────────────────────────
  { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle", category: "wisdom" },
  { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson", category: "motivation" },
  { text: "The mind is everything. What you think you become.", author: "Buddha", category: "philosophy" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon", category: "life" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", category: "motivation" },
  { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin", category: "wisdom" },
  { text: "In the end, it's not the years in your life that count. It's the life in your years.", author: "Abraham Lincoln", category: "life" },
  { text: "Many of life's failures are people who did not realize how close they were to success when they gave up.", author: "Thomas A. Edison", category: "motivation" },
  { text: "You only live once, but if you do it right, once is enough.", author: "Mae West", category: "life" },
  { text: "May the God of hope fill you with all joy and peace in believing.", author: "Romans 15:13", category: "scripture" },
  { text: "And He is with you wherever you are.", author: "Quran 57:4", category: "scripture" },
  { text: "Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.", author: "John Woods", category: "programming" },
  { text: "Software and cathedrals are much the same – first we build them, then we pray.", author: "Sam Ewing", category: "programming" },
  { text: "A user interface is like a joke. If you have to explain it, it's not that good.", author: "Martin LeBlanc", category: "programming" },
  { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt", category: "motivation" },
  { text: "The purpose of our lives is to be happy.", author: "Dalai Lama", category: "philosophy" },
];

/** Slot length in hours. */
const SLOT_HOURS = 4;

/** Returns the current 4-hour slot index for a given date+timezone. */
function slotIndexFor(d: Date, tz: string): number {
  try {
    const hour = Number(new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour: "numeric", hour12: false,
    }).format(d));
    return Math.floor(hour / SLOT_HOURS);
  } catch {
    return Math.floor(d.getUTCHours() / SLOT_HOURS);
  }
}

function dayKey(d: Date, tz: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit",
    }).format(d);
  } catch {
    return d.toISOString().slice(0, 10);
  }
}

function hashKey(s: string): number {
  // djb2
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

/** The quote for the current 4h slot. Stable inside the slot; rotates after. */
export function quoteForSlot(d: Date = new Date(), tz = "UTC"): Quote {
  const key = `${dayKey(d, tz)}-${slotIndexFor(d, tz)}`;
  return QUOTES[hashKey(key) % QUOTES.length];
}

/** Milliseconds until the next 4h slot boundary, in the given timezone. */
export function msUntilNextSlot(d: Date = new Date(), tz = "UTC"): number {
  try {
    const fmt = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hour: "numeric", minute: "numeric", second: "numeric", hour12: false,
    });
    const parts = fmt.formatToParts(d);
    const h = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
    const m = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
    const s = Number(parts.find((p) => p.type === "second")?.value ?? 0);
    const nextSlotHour = (Math.floor(h / SLOT_HOURS) + 1) * SLOT_HOURS;
    const hoursLeft = nextSlotHour - h - 1;
    const minutesLeft = 59 - m;
    const secondsLeft = 60 - s;
    return ((hoursLeft * 60 + minutesLeft) * 60 + secondsLeft) * 1000;
  } catch {
    return 60 * 60 * 1000; // 1h fallback
  }
}

/** Back-compat for any caller still importing the old name. */
export const quoteForDate = quoteForSlot;
