export type Quote = { text: string; author?: string };

/**
 * 50 quotes — short, useful, mostly public-domain aphorisms or paraphrases.
 * Selection is deterministic per UTC day, so a refresh shows the same quote.
 */
export const QUOTES: Quote[] = [
  { text: "What you do every day matters more than what you do once in a while.", author: "Gretchen Rubin" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant" },
  { text: "Discipline equals freedom.", author: "Jocko Willink" },
  { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
  { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
  { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
  { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
  { text: "You don't rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Beware the bareness of a busy life.", author: "Socrates" },
  { text: "How we spend our days is, of course, how we spend our lives.", author: "Annie Dillard" },
  { text: "Slow is smooth, smooth is fast." },
  { text: "Amateurs sit and wait for inspiration. The rest of us just get up and go to work.", author: "Stephen King" },
  { text: "The price of greatness is responsibility.", author: "Winston Churchill" },
  { text: "Compound interest is the eighth wonder of the world.", author: "attributed to Einstein" },
  { text: "It does not matter how slowly you go, as long as you do not stop.", author: "Confucius" },
  { text: "The cave you fear to enter holds the treasure you seek.", author: "Joseph Campbell" },
  { text: "Begin at once to live, and count each separate day as a separate life.", author: "Seneca" },
  { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
  { text: "He who has a why to live can bear almost any how.", author: "Nietzsche" },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing what a good person should be. Be one.", author: "Marcus Aurelius" },
  { text: "If it is not right, do not do it. If it is not true, do not say it.", author: "Marcus Aurelius" },
  { text: "You have power over your mind — not outside events.", author: "Marcus Aurelius" },
  { text: "Wealth consists not in having great possessions, but in having few wants.", author: "Epictetus" },
  { text: "First say to yourself what you would be; and then do what you have to do.", author: "Epictetus" },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  { text: "It is not the man who has too little, but the man who craves more, that is poor.", author: "Seneca" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" },
  { text: "The greatest wealth is a quiet mind." },
  { text: "Whether you think you can, or you think you can't — you're right.", author: "Henry Ford" },
  { text: "Do the best you can until you know better. Then when you know better, do better.", author: "Maya Angelou" },
  { text: "If you don't have time to do it right, when will you have time to do it over?", author: "John Wooden" },
  { text: "Small disciplines repeated with consistency every day lead to great achievements." },
  { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" },
  { text: "By failing to prepare, you are preparing to fail.", author: "Benjamin Franklin" },
  { text: "What gets measured, gets managed.", author: "Peter Drucker" },
  { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "If you can't fly, run. If you can't run, walk. If you can't walk, crawl. But keep moving.", author: "Martin Luther King Jr." },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Knowing yourself is the beginning of all wisdom.", author: "Aristotle" },
  { text: "Patience is bitter, but its fruit is sweet.", author: "Aristotle" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Rohn" },
  { text: "Either you run the day, or the day runs you.", author: "Jim Rohn" },
  { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
  { text: "The two most powerful warriors are patience and time.", author: "Tolstoy" },
];

/** Day-of-year (UTC) → quote index. Same key all day, changes at UTC midnight. */
export function quoteForDate(d: Date = new Date(), tz = "UTC"): Quote {
  // We compute a stable day key in the user's timezone.
  const key = dayKey(d, tz);
  const idx = hashKey(key) % QUOTES.length;
  return QUOTES[idx];
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
  // djb2-ish
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}
