export interface BibleVerse {
  text: string;
  reference: string;
}

export const BIBLE_VERSES: BibleVerse[] = [
  { text: 'For I know the plans I have for you, plans to prosper you and not to harm you.', reference: 'Jeremiah 29:11' },
  { text: 'I can do all things through Christ who strengthens me.', reference: 'Philippians 4:13' },
  { text: 'Trust in the Lord with all your heart and lean not on your own understanding.', reference: 'Proverbs 3:5' },
  { text: 'The Lord is my shepherd; I shall not want.', reference: 'Psalm 23:1' },
  { text: 'Be strong and courageous. Do not be afraid; the Lord your God will be with you.', reference: 'Joshua 1:9' },
  { text: 'And we know that in all things God works for the good of those who love him.', reference: 'Romans 8:28' },
  { text: 'Cast all your anxiety on him because he cares for you.', reference: '1 Peter 5:7' },
  { text: 'The Lord is my light and my salvation—whom shall I fear?', reference: 'Psalm 27:1' },
  { text: 'Give thanks to the Lord, for he is good; his love endures forever.', reference: 'Psalm 107:1' },
  { text: 'Commit to the Lord whatever you do, and he will establish your plans.', reference: 'Proverbs 16:3' },
  { text: 'Do not be anxious about anything, but in every situation, by prayer and petition, present your requests to God.', reference: 'Philippians 4:6' },
  { text: 'She is clothed with strength and dignity; she can laugh at the days to come.', reference: 'Proverbs 31:25' },
  { text: 'Let everything that has breath praise the Lord.', reference: 'Psalm 150:6' },
  { text: 'The joy of the Lord is your strength.', reference: 'Nehemiah 8:10' },
  { text: 'Love is patient, love is kind. It does not envy, it does not boast.', reference: '1 Corinthians 13:4' },
  { text: 'Your word is a lamp for my feet, a light on my path.', reference: 'Psalm 119:105' },
  { text: 'Weeping may stay for the night, but rejoicing comes in the morning.', reference: 'Psalm 30:5' },
  { text: 'But those who hope in the Lord will renew their strength.', reference: 'Isaiah 40:31' },
  { text: 'The Lord will fight for you; you need only to be still.', reference: 'Exodus 14:14' },
  { text: 'Seek first the kingdom of God and his righteousness, and all these things will be added to you.', reference: 'Matthew 6:33' },
  { text: 'For God so loved the world that he gave his one and only Son.', reference: 'John 3:16' },
  { text: 'Be still, and know that I am God.', reference: 'Psalm 46:10' },
  { text: 'This is the day the Lord has made; let us rejoice and be glad in it.', reference: 'Psalm 118:24' },
  { text: 'Whatever you do, work at it with all your heart, as working for the Lord.', reference: 'Colossians 3:23' },
  { text: 'The Lord bless you and keep you; the Lord make his face shine on you.', reference: 'Numbers 6:24-25' },
  { text: 'Delight yourself in the Lord, and he will give you the desires of your heart.', reference: 'Psalm 37:4' },
  { text: 'Come to me, all you who are weary and burdened, and I will give you rest.', reference: 'Matthew 11:28' },
  { text: 'Let your light shine before others, that they may see your good deeds.', reference: 'Matthew 5:16' },
  { text: 'The name of the Lord is a fortified tower; the righteous run to it and are safe.', reference: 'Proverbs 18:10' },
  { text: 'Greater love has no one than this: to lay down one\u2019s life for one\u2019s friends.', reference: 'John 15:13' },
  { text: 'Above all else, guard your heart, for everything you do flows from it.', reference: 'Proverbs 4:23' },
];

export function getDailyVerse(date: Date = new Date()): BibleVerse {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % BIBLE_VERSES.length;
  return BIBLE_VERSES[index];
}
