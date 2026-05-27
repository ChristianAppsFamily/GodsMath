export interface BibleVerse {
  text: string;
  reference: string;
}

/** Verses on God's provision, faithful stewardship, and biblical math (giving/receiving). */
export const BIBLE_VERSES: BibleVerse[] = [
  {
    text: 'Give, and it will be given to you. A good measure, pressed down, shaken together and running over, will be poured into your lap.',
    reference: 'Luke 6:38',
  },
  {
    text: 'And my God will meet all your needs according to the riches of his glory in Christ Jesus.',
    reference: 'Philippians 4:19',
  },
  {
    text: 'Honor the Lord with your wealth, with the firstfruits of all your crops; then your barns will be filled to overflowing.',
    reference: 'Proverbs 3:9-10',
  },
  {
    text: 'Bring the whole tithe into the storehouse… Test me in this, and see if I will not throw open the floodgates of heaven and pour out so much blessing.',
    reference: 'Malachi 3:10',
  },
  {
    text: 'The Lord will open the heavens, the storehouse of his bounty, to send rain on your land in season and to bless all the work of your hands.',
    reference: 'Deuteronomy 28:12',
  },
  {
    text: 'Whoever can be trusted with very little can also be trusted with much, and whoever is dishonest with very little will also be dishonest with much.',
    reference: 'Luke 16:10',
  },
  {
    text: 'The plans of the diligent lead to profit as surely as haste leads to poverty.',
    reference: 'Proverbs 21:5',
  },
  {
    text: 'Precious treasure and oil are in a wise man\'s dwelling, but a foolish man devours it.',
    reference: 'Proverbs 21:20',
  },
  {
    text: 'Better a little with righteousness than much gain with injustice.',
    reference: 'Proverbs 16:8',
  },
  {
    text: 'Wealth gained hastily will dwindle, but whoever gathers little by little will increase it.',
    reference: 'Proverbs 13:11',
  },
  {
    text: 'Do not store up for yourselves treasures on earth… but store up for yourselves treasures in heaven.',
    reference: 'Matthew 6:19-20',
  },
  {
    text: 'Seek first his kingdom and his righteousness, and all these things will be added to you.',
    reference: 'Matthew 6:33',
  },
  {
    text: 'Every good and perfect gift is from above, coming down from the Father of the heavenly lights.',
    reference: 'James 1:17',
  },
  {
    text: 'The Lord is my shepherd; I lack nothing.',
    reference: 'Psalm 23:1',
  },
  {
    text: 'You open your hand and satisfy the desires of every living thing.',
    reference: 'Psalm 145:16',
  },
  {
    text: 'He who did not spare his own Son… how will he not also, along with him, graciously give us all things?',
    reference: 'Romans 8:32',
  },
  {
    text: 'Now he who supplies seed to the sower and bread for food will also supply and increase your store of seed.',
    reference: '2 Corinthians 9:10',
  },
  {
    text: 'Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.',
    reference: '2 Corinthians 9:7',
  },
  {
    text: 'Command those who are rich… to do good, to be rich in good deeds, and to be generous and willing to share.',
    reference: '1 Timothy 6:17-18',
  },
  {
    text: 'Keep your lives free from the love of money and be content with what you have, because God has said, "Never will I leave you."',
    reference: 'Hebrews 13:5',
  },
  {
    text: 'A generous person will prosper; whoever refreshes others will be refreshed.',
    reference: 'Proverbs 11:25',
  },
  {
    text: 'One person gives freely, yet gains even more; another withholds unduly, but comes to poverty.',
    reference: 'Proverbs 11:24',
  },
  {
    text: 'The blessing of the Lord brings wealth, without painful toil for it.',
    reference: 'Proverbs 10:22',
  },
  {
    text: 'In all toil there is profit, but mere talk leads only to poverty.',
    reference: 'Proverbs 14:23',
  },
  {
    text: 'For which of you, intending to build a tower, does not sit down first and count the cost?',
    reference: 'Luke 14:28',
  },
  {
    text: 'The silver is mine and the gold is mine, declares the Lord Almighty.',
    reference: 'Haggai 2:8',
  },
  {
    text: 'You may say to yourself, "My power and the strength of my hands have produced this wealth for me." But remember the Lord your God, for it is he who gives you the ability to produce wealth.',
    reference: 'Deuteronomy 8:17-18',
  },
  {
    text: 'Cast your bread upon the waters, for after many days you will find it again.',
    reference: 'Ecclesiastes 11:1',
  },
  {
    text: 'Whoever loves money never has enough; whoever loves wealth is never satisfied with their income. This too is meaningless.',
    reference: 'Ecclesiastes 5:10',
  },
  {
    text: 'And God is able to bless you abundantly, so that in all things at all times, having all that you need, you will abound in every good work.',
    reference: '2 Corinthians 9:8',
  },
];

export function getDailyVerse(date: Date = new Date()): BibleVerse {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % BIBLE_VERSES.length;
  return BIBLE_VERSES[index];
}
