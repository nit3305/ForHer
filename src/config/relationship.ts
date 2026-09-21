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
  openingWhisper: "psst…",
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
    escapingHeart: { label: "A shy little heart", foundCopy: "You caught the shy one." },
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
    imageSrc: "/puzzle-placeholder.png",
    imageAlt: "Placeholder photograph of two coffee cups, letters, ribbon, and pressed flowers",
    rows: 4,
    columns: 4,
    snapRadiusRatio: 1.05,
    showPreview: true,
    showHints: true,
    previewLabel: "hold to peek 👀",
    hintLabel: "show me one ♡",
    hintMessage: "this one goes here ♡",
    strongerHintMessage: "keep your eye on the glowing spot ♡",
    selectionHint: "Tap a piece, then tap its glowing home—or drag it close.",
    introEyebrow: "One more little memory",
    introHeading: "Some moments come back piece by piece.",
    introText: "Pick up each little piece and let the whole picture find its way home.",
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
    contentNote: "Placeholder memories — replace these in src/config/relationship.ts",
    memories: [
      {
        id: "beginning",
        date: "The beginning",
        eyebrow: "Where it started",
        title: "The First Hello",
        message: "A placeholder for the moment our story first began to feel like ours.",
        note: "Replace this with the small detail you still remember most clearly.",
        images: [{ src: "/puzzle-placeholder.png", alt: "Placeholder still life of coffee, letters, ribbon, and flowers" }],
        layout: "hero",
        icon: "spark",
      },
      {
        id: "knowing",
        date: "A little later",
        eyebrow: "A quiet realization",
        title: "When It Felt Different",
        message: "A placeholder for the ordinary moment that quietly became something more.",
        note: "This can hold the memory of when you first knew this was special.",
        images: [{ src: "/puzzle-placeholder.png", alt: "Placeholder photograph awaiting a personal memory" }],
        layout: "polaroid",
        icon: "heart",
        interaction: "drag",
        interactionCopy: "drag me",
      },
      {
        id: "adventure",
        date: "Along the way",
        eyebrow: "Somewhere new",
        title: "Our First Adventure",
        message: "A placeholder for a day when the place mattered less than being there together.",
        images: [{ src: "/puzzle-placeholder.png", alt: "Placeholder romantic still life used until a real adventure photo is provided" }],
        layout: "polaroid",
        icon: "star",
        interaction: "flip",
        interactionCopy: "flip me ↻",
        photoBackCopy: "Placeholder: add a private note for the back of this photograph.",
      },
      {
        id: "right-now",
        date: "Right here, right now",
        eyebrow: "Still becoming",
        title: "This Moment",
        message: "A placeholder for everything you cherish about where your story is today.",
        note: "Replace this with the words you want them to carry into the next chapter.",
        images: [{ src: "/puzzle-placeholder.png", alt: "Large placeholder photograph for the final memory" }],
        layout: "final",
        icon: "home",
      },
    ] satisfies TimelineMemory[],
    completionFirstLine: "Every version of us brought me here.",
    completionSecondLine: "And there’s still so much I want to show you.",
    continueButtonLabel: "One more thing →",
    hiddenPhotoNote: "Placeholder: a small secret that only appears when the photograph moves.",
    keepsakeFound: "A tiny piece of this chapter, kept safe.",
    trailHint: "Leave a little trail across this memory.",
    photoFrontLabel: "Turn photograph to the front",
    photoBackLabel: "Turn photograph over",
  },
  loveNotes: {
    introFirstLine: "Memories are one part of why I love us.",
    introSecondLine: "But you’re the reason I love all of it.",
    introButtonLabel: "Open the first note →",
    contentNote: "Placeholder reasons — replace these in src/config/relationship.ts",
    reasons: [
      {
        id: "ordinary-magic",
        eyebrow: "A little reason",
        message: "Placeholder: I love how you can make an ordinary moment feel worth keeping.",
        note: "Replace this with a light, everyday reason that feels unmistakably like her.",
        accent: "playful",
        layout: "minimal",
        reveal: "envelope",
      },
      {
        id: "easy-laughter",
        eyebrow: "The easy kind of joy",
        title: "The way you make me smile",
        message: "Placeholder: I love the kind of laughter that arrives whenever we are simply being ourselves.",
        tinyCaption: "Add an inside joke or playful nickname here.",
        accent: "playful",
        layout: "envelope",
        reveal: "pull",
      },
      {
        id: "little-surprises",
        eyebrow: "Another small thing",
        message: "Placeholder: I love the unexpected little ways you make a day brighter.",
        note: "This is a good place for a funny habit or tiny observation.",
        accent: "playful",
        layout: "playful",
        reveal: "scratch",
      },
      {
        id: "seen",
        eyebrow: "A quieter reason",
        title: "The feeling of being understood",
        message: "Placeholder: I love the sense that I can bring my whole self into the moments we share.",
        note: "Replace this with a personal example of feeling known or understood.",
        accent: "soft",
        layout: "minimal",
        reveal: "hold",
      },
      {
        id: "your-heart",
        eyebrow: "What lives underneath it all",
        message: "Placeholder: I love the heart behind the choices you make and the person you choose to be.",
        note: "Use this space for a quality you genuinely admire.",
        accent: "soft",
        layout: "letter",
        reveal: "flip",
      },
      {
        id: "who-i-am-with-you",
        eyebrow: "The reason beneath the reasons",
        title: "Who I get to be beside you",
        message: "Placeholder: More than anything, I love the truest version of myself that I keep discovering with you.",
        note: "Save your strongest personal Stage 4 thought for this final note.",
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
      pileSecret: "Placeholder: one more reason was hiding under the whole pile.",
      pileSecretLabel: "Look beneath the notes",
    },
  },
  finalLetter: {
    intro: {
      lineOne: "This one isn’t a game.",
      lineTwo: "It’s just something I wanted you to have.",
      beginLabel: "Read my letter",
    },
    contentNote: "Placeholder letter — replace every section in src/config/relationship.ts",
    sections: [
      {
        id: "looking-back",
        eyebrow: "Before anything else",
        heading: "Looking back",
        body: "Placeholder: Write about what it feels like to look back at the path that brought the two of you here, without needing to name every moment again.",
        emphasis: "Every chapter before this was leading somewhere.",
        image: { src: "/puzzle-placeholder.png", alt: "Placeholder photograph for the opening of the final letter" },
        layout: "photo",
        continuation: "seal",
        annotation: "Placeholder: add a tiny handwritten margin note.",
      },
      {
        id: "what-you-mean",
        eyebrow: "What I want you to know",
        heading: "What you mean to me",
        body: "Placeholder: Use this section for the quiet truth at the center of the relationship—what her presence means to you and why it matters.",
        emphasis: "Some things become more meaningful the longer we hold them close.",
        layout: "text",
        continuation: "tab",
        annotation: "Placeholder: add a private aside here.",
      },
      {
        id: "everyday-love",
        eyebrow: "In the ordinary hours",
        heading: "The love that lives between moments",
        body: "Placeholder: Write about the everyday kind of love—the comfort of presence, familiar rhythms, and small moments that never need an occasion.",
        image: { src: "/puzzle-placeholder.png", alt: "Placeholder photograph for an everyday shared moment" },
        layout: "split",
        continuation: "fold",
      },
      {
        id: "looking-forward",
        eyebrow: "From here",
        heading: "Whatever comes next",
        body: "Placeholder: Share a warm, future-facing thought about continuing to grow together, without inventing plans or making promises that are not yours.",
        emphasis: "I am grateful there are still pages we have not written yet.",
        layout: "minimal",
        continuation: "seal",
        annotation: "Placeholder: add one small future-facing note.",
      },
      {
        id: "final-line",
        eyebrow: "After everything",
        body: "Placeholder: If I had to find my way here all over again, my heart would still lead me to you.",
        emphasis: "Replace this with the simplest, truest final line you want her to keep.",
        image: { src: "/puzzle-placeholder.png", alt: "Placeholder photograph reserved for the final words of the letter" },
        layout: "final",
      },
    ] satisfies LetterSection[],
    continueLabel: "Keep reading ↓",
    interactions: {
      unfoldLabel: "Unfold the letter",
      photoHint: "Pull the photograph free, then turn it over",
      photoFrontLabel: "Turn tucked photograph to the front",
      photoBackCopy: "Placeholder: write the few words you want hidden behind this photograph.",
      sealLabel: "Break the paper seal",
      tabLabel: "Pull the next paper tab",
      foldLabel: "Open the next fold",
    },
    signature: {
      prefix: "Love,",
      name: "[Your Name]",
    },
    replayLabel: "Read it again",
    restartLabel: "Start from the beginning",
    postscript: "Placeholder: p.s. I love you.",
  },
  finale: {
    introEyebrow: "The last little box",
    introHeading: "A few more things I saved for you.",
    introCopy: "Some songs, some photographs, and every second in between—then one final letter.",
    playlist: {
      eyebrow: "Our little mixtape",
      heading: "The songs that feel like us",
      introduction: "Placeholder tracks—replace these with the songs that carry your memories.",
      interactionHint: "Tap a track to read the note on the back.",
      songs: [
        { id: "track-01", title: "Placeholder song 01", artist: "Replace with artist", caption: "Placeholder: explain why this song belongs to the two of you." },
        { id: "track-02", title: "Placeholder song 02", artist: "Replace with artist", caption: "Placeholder: add the memory this song brings back." },
        { id: "track-03", title: "Placeholder song 03", artist: "Replace with artist", caption: "Placeholder: write the lyric-free thought this song holds." },
      ] satisfies PlaylistSong[],
    },
    timer: {
      relationshipSince: "YYYY-MM-DD",
      heading: "Every second with you ♡",
      subtext: "Placeholder: and somehow I still want more time with you.",
      placeholderNote: "Replace relationshipSince in src/config/relationship.ts to start the live counter.",
    },
    photoBooth: {
      enabled: true,
      eyebrow: "One tiny photo booth",
      heading: "My favorite view",
      buttonLabel: "Take the pictures ♡",
      developingLabel: "developing our little strip…",
      caption: "Placeholder: replace these with three favorite photographs.",
      images: [
        { src: "/puzzle-placeholder.png", alt: "First placeholder photograph for the photo booth strip" },
        { src: "/puzzle-placeholder.png", alt: "Second placeholder photograph for the photo booth strip" },
        { src: "/puzzle-placeholder.png", alt: "Third placeholder photograph for the photo booth strip" },
      ],
    },
  },
  stages: ["The key", "The picture", "Our story", "Little reasons", "Always"],
} as const;

export const relationshipPin = "2303";