/**
 * SELAH RHYTHM - Data Constants
 * v0.9.45
 * 
 * Core application data structures and configuration
 */

// Timer presets
export const PRESETS = [
  { l: "5m", s: 300 },
  { l: "10m", s: 600 },
  { l: "15m", s: 900 },
  { l: "25m", s: 1500 },
  { l: "50m", s: 3000 }
];

// Default task categories
export const DEFAULT_CATS = [
  { id: "none", n: "None", color: "#8A8078" },
  { id: "admin", n: "Admin", color: "#C4704B" },
  { id: "meetings", n: "Meetings", color: "#7A9A7E" },
  { id: "personal", n: "Personal", color: "#C9A227" },
  { id: "creative", n: "Creative Work", color: "#6B4A6B" },
  { id: "communication", n: "Communication", color: "#D4846A" },
  { id: "research", n: "Research", color: "#8FAD93" }
];

// Time estimate options
export const TIMES = ["", "5m", "15m", "30m", "1h", "2h", "3h+"];

// Task list types
export const LISTS = ["primary", "today", "thisWeek", "later"];

// Schedule hour height constant
export const HOUR_HEIGHT = 64;

// Scripture categories and verses
export const SCRIPTURE = {
  faithfulness: [
    { t: "If you are faithful in little things, you will be faithful in large ones.", r: "Luke 16:10" },
    { t: "Well done, my good and faithful servant.", r: "Matthew 25:21" },
    { t: "Let us not grow weary while doing good.", r: "Galatians 6:9" },
    { t: "Be faithful until death, and I will give you the crown of life.", r: "Revelation 2:10" },
    { t: "A faithful person will be richly blessed.", r: "Proverbs 28:20" }
  ],
  rest: [
    { t: "Come to me, all of you who are weary, and I will give you rest.", r: "Matthew 11:28" },
    { t: "Be still, and know that I am God.", r: "Psalm 46:10" },
    { t: "In peace I will lie down and sleep, for you alone keep me safe.", r: "Psalm 4:8" },
    { t: "The Lord is my shepherd; I have all that I need.", r: "Psalm 23:1" },
    { t: "Only in returning to me and resting in me will you be saved.", r: "Isaiah 30:15" }
  ],
  stewardship: [
    { t: "Commit your actions to the Lord, and your plans will succeed.", r: "Proverbs 16:3" },
    { t: "Work willingly at whatever you do, as working for the Lord.", r: "Colossians 3:23" },
    { t: "Whatever you do, do it all for the glory of God.", r: "1 Corinthians 10:31" },
    { t: "God has given each of you a gift. Use it to serve one another.", r: "1 Peter 4:10" },
    { t: "Each of you should use whatever gift you have received.", r: "1 Peter 4:10" }
  ],
  discipline: [
    { t: "No discipline is enjoyable—but afterward there will be a peaceful harvest.", r: "Hebrews 12:11" },
    { t: "I discipline my body like an athlete, training it to do what it should.", r: "1 Corinthians 9:27" },
    { t: "God has not given us a spirit of fear, but of power and self-discipline.", r: "2 Timothy 1:7" },
    { t: "A person without self-control is like a city with broken-down walls.", r: "Proverbs 25:28" },
    { t: "Joyful are those you discipline, Lord.", r: "Psalm 94:12" }
  ],
  patience: [
    { t: "Be still in the presence of the Lord, and wait patiently for him.", r: "Psalm 37:7" },
    { t: "Patient endurance is what you need now.", r: "Hebrews 10:36" },
    { t: "Those who trust in the Lord will find new strength.", r: "Isaiah 40:31" },
    { t: "The Lord is good to those who depend on him.", r: "Lamentations 3:25" },
    { t: "Let patience have its perfect work.", r: "James 1:4" }
  ],
  wisdom: [
    { t: "If you need wisdom, ask God, and he will give it to you.", r: "James 1:5" },
    { t: "Fear of the Lord is the foundation of true wisdom.", r: "Proverbs 9:10" },
    { t: "The Lord grants wisdom! From his mouth come knowledge and understanding.", r: "Proverbs 2:6" },
    { t: "Wisdom is more precious than rubies.", r: "Proverbs 3:15" },
    { t: "Get wisdom; develop good judgment.", r: "Proverbs 4:5" }
  ],
  courage: [
    { t: "Be strong and courageous! The Lord your God is with you.", r: "Joshua 1:9" },
    { t: "Do not be afraid, for I am with you.", r: "Isaiah 41:10" },
    { t: "The Lord is my light and my salvation—why should I be afraid?", r: "Psalm 27:1" },
    { t: "When I am afraid, I will put my trust in you.", r: "Psalm 56:3" },
    { t: "I can do everything through Christ, who gives me strength.", r: "Philippians 4:13" }
  ]
};

// Selah prompts for reflection
export const SELAH_PROMPTS = {
  faithfulness: "What small act of faithfulness can you commit to today?",
  rest: "Where in your life do you need to pause and receive rest?",
  stewardship: "What has been entrusted to you that needs attention?",
  discipline: "What practice would help you grow if done consistently?",
  patience: "What are you waiting for that requires trust in God's timing?",
  wisdom: "What decision before you needs God's wisdom?",
  courage: "What fear do you need to surrender to step forward in faith?"
};

// Encouragement messages with name placeholder support
export const ENCOURAGEMENTS = [
  "Good work, {name}. One step at a time.",
  "Stay with the next right task, {name}.",
  "You don't need to do everything today—just the important things.",
  "Keep going, {name}. Consistency beats intensity.",
  "If you feel behind, pick one task and finish it.",
  "Take a breath, {name}. Then take the next small step.",
  "It's okay to move slower and do it well.",
  "Start where you are, {name}. Don't overthink the first move.",
  "A short, focused block is enough to make progress.",
  "Protect your attention, {name}. One thing at a time.",
  "If you're tired, rest on purpose—without guilt.",
  "You can reset right now, {name}. No need to restart the whole day.",
  "Finish one thing before starting another.",
  "Small obedience matters, {name}. Keep it simple.",
  "Choose clarity over pressure today.",
  "You're allowed to say no to distractions, {name}.",
  "Do the task in front of you, then stop.",
  "Progress counts even when it's quiet, {name}.",
  "Take your break and come back steady.",
  "You're not failing, {name}. You're learning your rhythm."
];

// Mercies verses for rotation
export const MERCIES_VERSES = [
  { t: "His mercies are new every morning.", r: "Lamentations 3:22-23" },
  { t: "Great is Your faithfulness.", r: "Lamentations 3:23" },
  { t: "The steadfast love of the Lord never ceases.", r: "Lamentations 3:22" }
];

// Selah verses
export const SELAH_VERSES = [
  { t: "Do not worry about tomorrow, for tomorrow will worry about itself.", r: "Matthew 6:34" },
  { t: "Be still, and know that I am God.", r: "Psalm 46:10" },
  { t: "In returning and rest you shall be saved.", r: "Isaiah 30:15" }
];

// Celebration messages
export const CELEBS = [
  { title: "Well done!", msg: "Faithful in the small things" },
  { title: "Good work!", msg: "Press on toward the goal" },
  { title: "Progress!", msg: "One step at a time" }
];

// Daily Wisdom - Proverbs Library (NLT)
export const PROVERBS_LIBRARY = {
  "Proverbs 3:5-6": "Trust in the Lord with all your heart;\ndo not depend on your own understanding.\nSeek his will in all you do,\nand he will show you which path to take.",
  "Proverbs 4:23": "Guard your heart above all else,\nfor it determines the course of your life.",
  "Proverbs 16:3": "Commit your actions to the Lord,\nand your plans will succeed.",
  "Proverbs 22:6": "Direct your children onto the right path,\nand when they are older, they will not leave it.",
  "Proverbs 27:17": "As iron sharpens iron,\nso a friend sharpens a friend.",
  "Proverbs 31:25": "She is clothed with strength and dignity,\nand she laughs without fear of the future.",
  "Proverbs 1:7": "Fear of the Lord is the foundation of true knowledge,\nbut fools despise wisdom and discipline.",
  "Proverbs 2:6": "For the Lord grants wisdom!\nFrom his mouth come knowledge and understanding.",
  "Proverbs 10:9": "People with integrity walk safely,\nbut those who follow crooked paths will be exposed.",
  "Proverbs 11:25": "The generous will prosper;\nthose who refresh others will themselves be refreshed.",
  "Proverbs 12:15": "Fools think their own way is right,\nbut the wise listen to others.",
  "Proverbs 13:20": "Walk with the wise and become wise;\nassociate with fools and get in trouble.",
  "Proverbs 14:12": "There is a path before each person that seems right,\nbut it ends in death.",
  "Proverbs 15:1": "A gentle answer deflects anger,\nbut harsh words make tempers flare.",
  "Proverbs 17:17": "A friend is always loyal,\nand a brother is born to help in time of need.",
  "Proverbs 18:10": "The name of the Lord is a strong fortress;\nthe godly run to him and are safe.",
  "Proverbs 19:21": "You can make many plans,\nbut the Lord's purpose will prevail.",
  "Proverbs 20:1": "Wine produces mockers; alcohol leads to brawls.\nThose led astray by drink cannot be wise.",
  "Proverbs 21:2": "People may think they are doing what is right,\nbut the Lord examines the heart.",
  "Proverbs 22:1": "Choose a good reputation over great riches;\nbeing held in high esteem is better than silver or gold.",
  "Proverbs 23:12": "Commit yourself to instruction;\nlisten carefully to words of knowledge.",
  "Proverbs 24:16": "The godly may fall seven times,\nbut they will get up again.\nBut one disaster is enough to overthrow the wicked.",
  "Proverbs 25:11": "Timely advice is lovely,\nlike golden apples in a silver basket.",
  "Proverbs 26:12": "There is more hope for fools\nthan for people who think they are wise.",
  "Proverbs 27:1": "Don't brag about tomorrow,\nsince you don't know what the day will bring.",
  "Proverbs 28:13": "People who conceal their sins will not prosper,\nbut if they confess and turn from them, they will receive mercy.",
  "Proverbs 29:18": "When people do not accept divine guidance, they run wild.\nBut whoever obeys the law is joyful.",
  "Proverbs 30:5": "Every word of God proves true.\nHe is a shield to all who come to him for protection.",
  "Proverbs 31:30": "Charm is deceptive, and beauty does not last;\nbut a woman who fears the Lord will be greatly praised.",
  "Proverbs 3:11-12": "My child, don't reject the Lord's discipline,\nand don't be upset when he corrects you.\nFor the Lord corrects those he loves,\njust as a father corrects a child in whom he delights."
};

// Daily Wisdom - Psalms Library (NLT)
export const PSALMS_LIBRARY = {
  "Psalm 23:1": "The Lord is my shepherd;\nI have all that I need.",
  "Psalm 46:10": "Be still, and know that I am God!\nI will be honored by every nation.\nI will be honored throughout the world.",
  "Psalm 37:4": "Take delight in the Lord,\nand he will give you your heart's desires.",
  "Psalm 91:1-2": "Those who live in the shelter of the Most High\nwill find rest in the shadow of the Almighty.\nThis I declare about the Lord:\nHe alone is my refuge, my place of safety;\nhe is my God, and I trust him.",
  "Psalm 119:105": "Your word is a lamp to guide my feet\nand a light for my path.",
  "Psalm 139:14": "Thank you for making me so wonderfully complex!\nYour workmanship is marvelous—how well I know it.",
  "Psalm 27:1": "The Lord is my light and my salvation—\nso why should I be afraid?\nThe Lord is my fortress, protecting me from danger,\nso why should I tremble?",
  "Psalm 34:8": "Taste and see that the Lord is good.\nOh, the joys of those who take refuge in him!",
  "Psalm 40:1-2": "I waited patiently for the Lord to help me,\nand he turned to me and heard my cry.\nHe lifted me out of the pit of despair,\nout of the mud and the mire.\nHe set my feet on solid ground\nand steadied me as I walked along.",
  "Psalm 42:1-2": "As the deer longs for streams of water,\nso I long for you, O God.\nI thirst for God, the living God.\nWhen can I go and stand before him?",
  "Psalm 51:10": "Create in me a clean heart, O God.\nRenew a loyal spirit within me.",
  "Psalm 55:22": "Give your burdens to the Lord,\nand he will take care of you.\nHe will not permit the godly to slip and fall.",
  "Psalm 62:1-2": "I wait quietly before God,\nfor my victory comes from him.\nHe alone is my rock and my salvation,\nmy fortress where I will never be shaken.",
  "Psalm 73:26": "My health may fail, and my spirit may grow weak,\nbut God remains the strength of my heart;\nhe is mine forever.",
  "Psalm 84:11": "For the Lord God is our sun and our shield.\nHe gives us grace and glory.\nThe Lord will withhold no good thing\nfrom those who do what is right.",
  "Psalm 103:1-2": "Let all that I am praise the Lord;\nwith my whole heart, I will praise his holy name.\nLet all that I am praise the Lord;\nmay I never forget the good things he does for me.",
  "Psalm 107:1": "Give thanks to the Lord, for he is good!\nHis faithful love endures forever.",
  "Psalm 118:24": "This is the day the Lord has made.\nWe will rejoice and be glad in it.",
  "Psalm 121:1-2": "I look up to the mountains—\ndoes my help come from there?\nMy help comes from the Lord,\nwho made heaven and earth!",
  "Psalm 127:1": "Unless the Lord builds a house,\nthe work of the builders is wasted.\nUnless the Lord protects a city,\nguarding it with sentries will do no good.",
  "Psalm 130:5-6": "I am counting on the Lord;\nyes, I am counting on him.\nI have put my hope in his word.\nI long for the Lord\nmore than sentries long for the dawn,\nyes, more than sentries long for the dawn.",
  "Psalm 139:23-24": "Search me, O God, and know my heart;\ntest me and know my anxious thoughts.\nPoint out anything in me that offends you,\nand lead me along the path of everlasting life.",
  "Psalm 143:8": "Let me hear of your unfailing love each morning,\nfor I am trusting you.\nShow me where to walk,\nfor I give myself to you.",
  "Psalm 145:18": "The Lord is close to all who call on him,\nyes, to all who call on him in truth.",
  "Psalm 147:3": "He heals the brokenhearted\nand bandages their wounds.",
  "Psalm 1:1-2": "Oh, the joys of those who do not\nfollow the advice of the wicked,\nor stand around with sinners,\nor join in with mockers.\nBut they delight in the law of the Lord,\nmeditating on it day and night.",
  "Psalm 4:8": "In peace I will lie down and sleep,\nfor you alone, O Lord, will keep me safe.",
  "Psalm 16:11": "You will show me the way of life,\ngranting me the joy of your presence\nand the pleasures of living with you forever.",
  "Psalm 19:1": "The heavens proclaim the glory of God.\nThe skies display his craftsmanship.",
  "Psalm 25:4-5": "Show me the right path, O Lord;\npoint out the road for me to follow.\nLead me by your truth and teach me,\nfor you are the God who saves me.\nAll day long I put my hope in you."
};

// Reference arrays for daily rotation
export const PROVERBS_REFERENCES = Object.keys(PROVERBS_LIBRARY);
export const PSALMS_REFERENCES = Object.keys(PSALMS_LIBRARY);

// Version history and changelog
export const VERSION_HISTORY = [
  {
    version: "v0.9.44",
    date: "Jan 20, 2026",
    changes: [
      "Rest Tab: Changed to 3-column layout with Prayer & Reflection stacked in right column",
      "Prayer Card: Fixed Gratitude button text alignment - now properly centered",
      "Prayer Card Icon: Fixed stacking order - ochre heart at bottom-left, visible above green icon",
      "Removed Encouragement Bar: Floating quote element removed from bottom-right",
      "Focus Tab Tasks: Redesigned Today's Tasks card to match design mockup with proper dividers",
      "Primary Task Labels: Moved star + PRIMARY label to correct position with dot indicator",
      "Task Count: Added completed/total count in Today's Tasks header",
      "Text Sizes: Increased global text sizes for better readability"
    ]
  },
  {
    version: "v0.9.43",
    date: "Jan 20, 2026",
    changes: [
      "Prayer & Gratitude Card: New combined spiritual feature in Rest tab with toggle between Prayer list and Gratitude journal",
      "Prayer List: Track prayer requests with Active, Answered (with gratitude notes), and Releasing statuses",
      "Prayer Categories: Organize prayers by Personal, Family, Work, or Others",
      "Gratitude Journal: Multi-entry gratitude tracking with streak display",
      "Spiritual Connection: Answered prayers naturally prompt gratitude notes, connecting prayer and thankfulness",
      "Rest Tab Layout: Now 4 columns on desktop (Scripture, Be Still, Prayer/Gratitude, Reflection)"
    ]
  }
  // Additional version history truncated for brevity
];
