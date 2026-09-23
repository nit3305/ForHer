export type TriviaQuestion = {
  id: string;
  prompt: string;
  answer: string;
  inputMode: "numeric" | "text";
  placeholder: string;
  hint: string;
};

export type TimelineMemory = {
  id: string;
  date?: string;
  eyebrow?: string;
  title: string;
  message: string;
  note?: string;
  images?: ReadonlyArray<{ src: string; alt: string }>;
  details?: readonly string[];
  layout: "hero" | "polaroid" | "split" | "details" | "note" | "final";
  icon: "spark" | "heart" | "flower" | "letter" | "star" | "home";
  interaction?: "drag" | "flip" | "trail" | "keepsake";
  interactionCopy?: string;
  photoBackCopy?: string;
};

export type LoveReason = {
  id: string;
  eyebrow?: string;
  title?: string;
  message: string;
  note?: string;
  tinyCaption?: string;
  image?: { src: string; alt: string };
  accent: "playful" | "soft" | "deep";
  layout: "minimal" | "envelope" | "photo-note" | "letter" | "playful" | "deep";
  reveal: "envelope" | "pull" | "scratch" | "peel" | "hold" | "flip";
};

export type LetterSection = {
  id: string;
  eyebrow?: string;
  heading?: string;
  body: string;
  emphasis?: string;
  image?: { src: string; alt: string };
  layout: "text" | "photo" | "split" | "minimal" | "final";
  continuation?: "seal" | "tab" | "fold";
  annotation?: string;
};

export type PlaylistSong = {
  id: string;
  title: string;
  artist: string;
  caption?: string;
  cover?: string;
  url?: string;
};

/**
 * The single source of truth for personal content.
 * Everything below is intentionally labelled placeholder content until the
 * couple's real details are supplied.
 */
export const relationshipConfig = {
  recipientName: "My Love",

  /** Placeholder ceremonial password. Replace before publishing. */
  password: "140224",

  eyebrow: "A little something, just for you",
  welcomeTitle: "I made something for you ♡",
  welcomeCopy: "A tiny private gift is waiting behind this little heart lock.",

  scrapbook: {
    collectionLabel: "a tiny box of us",
    handwrittenArrow: "open this way",
    footerLeft: "made by hand (mostly)",
    footerRight: "with a ridiculous amount of love ♡",
  },

  playfulness: {
    cursorLabel: "A tiny heart following along",

    escapingHeart: {
      label: "A shy little heart",
      foundCopy: "You caught the shy one.",
    },

    triviaCorrect: "A little memory found its way home.",
    triviaIncorrect: "That one slipped away. Try another memory.",
    pinSuccess: "The hearts recognize you.",
  },

  trivia: [
    {
      id: "special-day",
      prompt: "Placeholder: What day of the month is our special date?",
      answer: "14",
      inputMode: "numeric",
      placeholder: "e.g. 14",
      hint: "Replace this question and answer in src/config/relationship.ts",
    },
    {
      id: "special-month",
      prompt: "Placeholder: What number is our special month?",
      answer: "02",
      inputMode: "numeric",
      placeholder: "e.g. 02",
      hint: "Use two digits for a single-digit month.",
    },
    {
      id: "special-year",
      prompt: "Placeholder: What are the last two digits of our special year?",
      answer: "24",
      inputMode: "numeric",
      placeholder: "e.g. 24",
      hint: "Only the final two digits.",
    },
  ] satisfies TriviaQuestion[],

  pinTitle: "The password, please ♡",
  successTitle: "okay, you can come in ♡",
  successCopy: "The little heart unlocked. Your first gift is just ahead.",

  puzzle: {
    imageSrc: "/puzzle.jpg",
    imageAlt: "A candid photograph of us together",
    rows: 4,
    columns: 4,
    snapRadiusRatio: 1.05,
    showPreview: true,
    showHints: true,
    previewLabel: "hold to peek 👀",
    hintLabel: "show me one ♡",
    hintMessage: "this one goes here ♡",
    strongerHintMessage: "keep your eye on the glowing spot ♡",
    selectionHint:
      "Tap a piece, then tap its glowing home—or drag it close.",
    introEyebrow: "One more little memory",
    introHeading: "Some moments come back piece by piece.",
    introText:
      "Pick up each little piece and let the whole picture find its way home.",
    startButtonLabel: "Put the memory together",
    successMessage: "Every piece found where it belongs.",
    continueButtonLabel: "Continue to our story",
  },

  timeline: {
    introFirstLine: "Some memories are too important to leave in pieces.",
    introSecondLine: "So let’s put ours in order.",
    introButtonLabel: "Walk through our story →",

    previousLabel: "← last memory",
    nextLabel: "next memory ♡",

    heading: "The moments that made us.",
    introduction: "Four little chapters, waiting to be opened in order.",


    memories: [
      {
        id: "beginning",
        date: "The beginning",
        eyebrow: "Where it started",
        title: "our first photo",
        message:
          "Our first photo together.\n\nI know I upset you that day, and honestly, that's something I've thought about. But somehow, looking back at this picture, I'm still really grateful that this became our first little snapshot together.\n\nWe didn't know all the memories that were waiting for us yet. ♡",
        note: "The first one of us ♡",
        images: [
          {
            src: "/memory-1.jpg",
            alt: "Our first photo together",
          },
        ],
        layout: "polaroid",
        icon: "spark",
        interaction: "flip",
        interactionCopy: "flip me ↻",
        photoBackCopy:
          "Our first photo together. The first little snapshot of us. ♡",
      },

      {
        id: "knowing",
        date: "A little later",
        title: "the “pixie cut” ♡",
        message:
          "You called this a pixie cut, so obviously that's what we're calling it now.\n\nLooking back at this picture, I still can't decide what's funnier — the haircut or the fact that you somehow made me feel like I pulled it off. ♡",
        note: "Apparently this is a pixie cut.",
        images: [
          {
            src: "/memory-2.jpg",
            alt: "The pixie cut photo",
          },
        ],
        layout: "polaroid",
        icon: "heart",
        interaction: "drag",
        interactionCopy: "drag me",
        photoBackCopy:
          "You called this a pixie cut, so obviously that's what we're calling it now. ♡",
      },

      {
        id: "adventure",
        title: "our first unofficial date ♡",
        message:
          "Our first unofficial date.\n\nWe may not have called it a date back then, but looking at this picture, it definitely feels like one.\n\nI love that this was one of the little moments that became part of our story without us even realizing how much it would mean later. ♡",
        images: [
          {
            src: "/memory-3.jpg",
            alt: "Our first unofficial date",
          },
        ],
        layout: "polaroid",
        icon: "star",
        interaction: "flip",
        interactionCopy: "flip me ↻",
        photoBackCopy:
          "Not officially a date… but definitely a date. ♡",
      },

      {
        id: "right-now",
        date: "The night of the concert",
        title: "our first kiss ♡",
        message:
          "The night of the concert.\n\nSomewhere between the music, the lights, and everything happening around us, I kissed you for the first time.\n\nI don't think I could've known then how many more memories we'd end up making together. But I'm really glad this was one of them. ♡",
        note: "Our first kiss.",
        images: [
          {
            src: "/memory-4.jpg",
            alt: "Our first kiss",
          },
        ],
        layout: "final",
        icon: "home",
      },
    ] satisfies TimelineMemory[],

    completionFirstLine: "Every version of us brought me here.",
    completionSecondLine:
      "And there’s still so much I want to show you.",
    continueButtonLabel: "One more thing →",

    hiddenPhotoNote:
      "Placeholder: a small secret that only appears when the photograph moves.",

    keepsakeFound:
      "A tiny piece of this chapter, kept safe.",

    trailHint:
      "Leave a little trail across this memory.",

    photoFrontLabel:
      "Turn photograph to the front",

    photoBackLabel:
      "Turn photograph over",
  },

  loveNotes: {
    introFirstLine: "Memories are one part of why I love us.",
    introSecondLine: "But you’re the reason I love all of it.",
    introButtonLabel: "Open the first note →",

    reasons: [
      {
        id: "ordinary-magic",
        title: "the little things ♡",
        message:
          "I love how caring you are.\n\nYou notice the little things — the things I might not even realize I'm doing, the tiny details that most people would probably miss. And somehow, you always make me feel like those little things matter.\n\nI think that's one of the things I love most about you. ♡",
        note:
          "How caring she is and how she notices the little details.",
        accent: "playful",
        layout: "minimal",
        reveal: "envelope",
      },

      {
        id: "easy-laughter",
        title: "your eyes ♡",
        message:
          "I love your eyes.\n\nThey're so pretty that somehow, every time I look into them, I fall for you a little harder.\n\nI don't think I'll ever get tired of looking at you. ♡",
        tinyCaption:
          "Every time I look into them, I fall a little harder.",
        accent: "playful",
        layout: "envelope",
        reveal: "pull",
      },

      {
        id: "little-surprises",
        title: "you make everything better ♡",
        message:
          "Somehow, you make my day a hundred times better just by meeting me.\n\nI could have the most tiring or annoying day, and then I see you and suddenly none of it feels as bad anymore.\n\nI don't know how you do it. You just make everything better by being there. ♡",
        note:
          "She makes your day a hundred times better just by meeting you.",
        accent: "playful",
        layout: "playful",
        reveal: "scratch",
      },

      {
        id: "seen",
        title: "that little flutter ♡",
        message:
          "You're so pretty.\n\nEvery time I go to pick you up, I somehow end up with the biggest smile on my face before I've even seen you. And then the second I do, my heart still manages to flutter like it's the first time.\n\nI don't think I'll ever get used to how pretty you are. ♡",
        note:
          "That little flutter and smile every time you go to pick her up.",
        accent: "soft",
        layout: "minimal",
        reveal: "hold",
      },

      {
        id: "your-heart",
        title: "being myself ♡",
        message:
          "I love how comfortable you make me feel around you.\n\nI can just be myself with you — I don't have to overthink how I look, what I say, or whether I'm being enough. Somehow, being around you makes me feel more confident in myself too.\n\nI think that's one of the best feelings you've given me: feeling completely comfortable being me, while somehow making me want to be an even better version of myself. ♡",
        note:
          "She makes you comfortable being yourself and more confident.",
        accent: "soft",
        layout: "letter",
        reveal: "flip",
      },

      {
        id: "who-i-am-with-you",
        title: "my favorite person ♡",
        message:
          "Somewhere along the way, you became my favorite person.\n\nYou're the person I want to tell things to, laugh with, annoy, and make memories with. And honestly, I don't just want more memories with you right now — I want to keep making them with you for the rest of my life.\n\nI don't know what all those memories will look like yet, but I know I want you there for them. ♡",
        note:
          "She has become your favorite person and you want to keep making memories together for the rest of your life.",
        accent: "deep",
        layout: "deep",
        reveal: "envelope",
      },
    ] satisfies LoveReason[],

    closingFirstLine: "There are a thousand little reasons.",
    closingSecondLine: "I could probably keep going forever.",
    closingThirdLine: "But there’s one thing I’ve been saving.",
    continueButtonLabel: "For you →",

    interactions: {
      pullHint: "Pull the note upward",
      pullFallback: "Open without dragging",
      scratchHint: "scratch here hehe ♡",
      scratchUnderlay: "A little reason is waiting underneath.",
      scratchFallback: "Reveal without scratching",
      peelHint: "Peel the sticker away",
      holdHint: "hold my heart for a sec",
      holdActive: "Keep holding…",
      holdReleased: "Almost—the heart is still here.",
      holdFallback: "Reveal this reason",
      flipHint: "Turn the note over",
    },
  },

  finalLetter: {
    intro: {
      lineOne: "This one isn’t a game.",
      lineTwo: "It’s just something I wanted you to have.",
      beginLabel: "Read my letter",
    },

    sections: [
      {

        body:
          "I still think I was really lucky to have you sit beside me during classes. Honestly, with how difficult it was for us to even end up sitting beside each other, sometimes I feel like it had to be fate. Maybe we were always going to find our way to each other somehow.\n\nI wanted to talk to you so badly, but you were so damn pretty that I couldn't even bring myself to approach you. You were my crush, so obviously my brain decided that talking to you was suddenly the hardest thing in the world. I just wanted to be around you all the time.\n\nI still remember Krishi and Foram making that joke about us because I was wearing yellow and you were wearing pink — “bundi ka laddu.” 😂 I don't think I could've guessed back then how funny it would be to look back at those little moments and realize they were part of the beginning of us.\n\nAnd somehow, from something as simple as sitting beside each other in class, we ended up here. I really do think we were meant to meet somehow. ♡",

        layout: "text",
        continuation: "seal",
      },

      {


        body:
          "Having you in my life is probably the most important thing to me. You're so precious to me, and you're so close to my heart that sometimes I don't even know how to properly put it into words.\n\nYou're the person I feel like I can tell everything to. I can talk to you about the smallest, most random things, or the things that actually matter, and somehow it always feels right. Your kindness and the way you care about me make it so easy for me to be comfortable around you and just be myself.\n\nI think you make me feel complete in a way I didn't really know I was looking for. It's hard to explain exactly why it's you. I just know that when I think about the person I want beside me, the person I want to tell things to, laugh with, annoy, and make memories with, it's always you.\n\nI might never find the perfect words for why you specifically mean so much to me. Maybe I don't need to. I just know that having you in my life is something I'll always be incredibly grateful for. ♡",

        layout: "text",
        continuation: "tab",
      },

      {


        body:
          "I think some of my favorite parts of loving you are the little moments that probably don't seem like much to anyone else.\n\nEven when you get all angry at me, I can't lie, sometimes it's kinda cute. Sometimes. Don't get too confident though. 😂\n\nYour smile is something I genuinely don't think I'll ever get tired of. I swear, I'd do anything just to see you smile.\n\nAnd whenever you have your head on my shoulder and sneakily look up at me, I notice it every single time. I've told you that before, but I still love it every time you do it. ♡\n\nSometimes when you're talking to me, I just get completely lost in your eyes. I'll be listening, but part of me is just thinking about how pretty you are and wishing I could pause that exact moment and stay there forever.\n\nI think that's what I love most about us. It's not always some huge moment. Sometimes it's just you sitting next to me, talking about something completely random, your head on my shoulder, and me quietly wishing time would slow down a little. ♡",

        layout: "text",
        continuation: "fold",
      },

      {


        body:
          "I don't know what the future looks like, but I want you in it.\n\nI really want to go on a trip with you someday. Whether it's just us or we're surrounded by people we love, I want to experience somewhere new with you and make tons of memories along the way. I want the random pictures, the stupid jokes, the unexpected moments, and all the little stories we'll eventually look back on and laugh about.\n\nAnd honestly, I can't wait for Navratri either. I can't wait to be there with you, get dressed up, do garba together, and just enjoy those nights with you. I already know I'll probably spend half the time looking at you instead of actually paying attention to the garba. 😂\n\nI don't know exactly where life is going to take us, but I know I want to keep experiencing it with you. I want more days, more adventures, more memories, more pictures, more laughs, and just more of us.\n\nThere are still so many things we haven't done and so many memories we haven't made yet.\n\nAnd honestly, I can't wait to make them with you. ♡",

        layout: "minimal",
        continuation: "seal",
      },

      {

        body:
          "Even if we hadn't ended up sitting beside each other, I still think somehow, someway, we would've found each other. I think we were meant to meet, and somehow, no matter what, we'd still end up here together.\n\nMaybe that's what makes everything feel even more special to me. ♡\n\nNo matter how our story started, I think I'd always find my way back to you. ♡",

        layout: "final",
      },
    ],

    continueLabel: "Keep reading ↓",

    interactions: {
      unfoldLabel: "Unfold the letter",

      photoHint: "Pull the photograph free, then turn it over",

      photoFrontLabel: "Turn tucked photograph to the front",

      photoBackCopy:
        "A little reminder of everything we've already shared. ♡",

      sealLabel: "Break the paper seal",

      tabLabel: "Pull the next paper tab",

      foldLabel: "Open the next fold",
    },

    signature: {
      prefix: "Love,",
      name: "Niju",
    },

    replayLabel: "Read it again",

    restartLabel: "Start from the beginning",

    postscript: " I love you TONSSSSSSSSS chiku ♡",
  },

  finale: {
    introEyebrow: "The last little box",
    introHeading: "A few more things I saved for you.",
    introCopy:
      "Some photographs, some time together, and then one final letter.",

    timer: {
      relationshipSince: "2025-09-17T17:35:00",
      heading: "Every second with you ♡",
      subtext:
        "And somehow I still want more time with you.",
      placeholderNote:
        "The timer starts from the moment I first texted you.",
    },

    photoBooth: {
      enabled: true,
      eyebrow: "One tiny photo booth",
      heading: "My favorite view",
      buttonLabel: "Take the pictures ♡",
      developingLabel: "developing our little strip…",
      caption:
        "Three little snapshots from our story.",

      images: [
        {
          src: "/photobooth-1.png",
          alt: "An illustrated photo of us together",
        },
        {
          src: "/photobooth-2.png",
          alt: "An illustrated moment between us",
        },
        {
          src: "/photobooth-3.png",
          alt: "An illustrated photo booth moment",
        },
      ],
    },
  },

  stages: [
    "The key",
    "The picture",
    "Our story",
    "Little reasons",
    "Always",
  ],
} as const;

export const relationshipPin = "2303";