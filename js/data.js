/**
 * Project: Mentor Space
 * Description: Contains structured mentor personality data, dialog prompts, and preset responses for interaction.
 * Author: Dominique Thomas (github.com/dominique-thomas)
 * License: Shared publicly for demonstration purposes only. Reuse or redistribution not permitted without permission.
 */
const mentorName = "Jordan";
const firstNamePlaceholder = "firstNamePlaceholder";
let firstName = "";

// Specifies the varios leadership styles
const leadershipStyles = [
  "empathy",
  "communication",
  "diplomacy",
  "discipline"
];

// General responses when the user asks a personal question; used in the personal discussion sub-menu 
const personalMenuPrompts = [
  `Sure ${firstNamePlaceholder}, what would you like to know?`,
  `Happy to share. What are you curious about?`,
  "Sure, ask away.",
  "I'd love to chat. Anything on your mind?",
  "I'm an open book. What would you like to know?"
];

// Quiz specific responses; used in the quiz discussion menu
const quizReturnPrompts = [
  "What quiz results would you like to explore next?",
  "Sure, let's revisit your quiz results.",
  "Ready to explore more about your leadership style?",
  "Here's what you can explore based on your quiz results:"
];

// Bridge responses that are used to change subject, used when returning to the active menu
const backToMenuBridgeLines = [
  "Let's see what else we can dive into.",
  "I'm curious what we'll talk about next.",
  `Want to keep going, ${firstNamePlaceholder}?`,
  `Alright, what do you want to talk about?`
];

// Responses that are used to change the subject; used when returning to the main menu
const returnToMenuPrompts = [
  `Sure, ${firstNamePlaceholder}, what else would you like to talk about?`,
  "Happy to shift gears. What's on your mind now?",
  "What would you like to dive into next?",
  `No problem, ${firstNamePlaceholder}. What do you want to look into next?`
];

// Responses that are used to specify the user has already talked about a topic
const alreadyTalkedAboutLines = [
  `We've actually talked about that already, ${firstNamePlaceholder}. Want to ask me something else?`,
  `That question sounds familiar, ${firstNamePlaceholder}. Maybe we can explore a different topic?`,
  "I remember chatting about that. Want to revisit it later?",
  "You've asked that one before. Do you have any other questions?",
  "We already covered that, but I'm open to other questions!"
];

// Fallback responses for the "free-form" input field, if AI is unavailable
const leadershipStyleInputFallback = [
  `That's a thoughtful question, ${firstNamePlaceholder}. I'd love to revisit it another time.`,
  "I don't have the perfect answer right now, but I'm still here if you want to explore something else.",
  "Let's come back to that later. I want to give it the time it deserves.",
  `That's an insightful topic, ${firstNamePlaceholder}. I'm not quite ready to respond to it yet, but we can keep the conversation going.`,
  "Thanks for asking. I might need a bit more time to reflect on that one."
];

// Follow-up questions the mentor could ask the user when in the mentor's leadership discussion sub-menu
const leadershipFollowUpMap = {
  leadershipStyle: `How would you describe your leadership style, ${firstNamePlaceholder}?`,
  challenges: "What challenges do you face as a leader?",
  communication: "What's your communication style when leading others?",
  conflictResolution: "How do you usually handle conflict at work?",
  motivation: "What motivates you to lead or support others?",
  feedback: "Have you ever had to give feedback to a teammate?",
  books: "Is there a book that shaped how you think as a leader?",
  quotes: "Is there a quote that inspires your leadership approach?"
};

// Follow-up questions the mentor could ask the user when in the quiz sub-menu
const quizFollowUpMap = {
  leadershipStyle: `Do you feel like this fits your leadership style?`,
  challenges: `Have you ever run into this kind of challenge before, ${firstNamePlaceholder}?`,
  communication: "Does this reflect how you usually communicate?",
  conflictResolution: "Is this how you tend to handle conflict?",
  motivation: "Does this align with what drives you as a leader?",
  feedback: "Is this how you usually approach giving feedback?",
  books: "Have you read this book before, or would you consider reading it?",
  quotes: `Does this quote resonate with you, ${firstNamePlaceholder}?`
};

// Keywords that are used to determine the user's mood
const moodMap = {
  happy: [
    "thank you", "thanks", "great", "awesome", "cool", "love", "like this", "nice",
    "excited", "good job", "amazing", "fantastic", "wonderful", "blessed", "grateful",
    "joy", "smile", "laughing", "pleased", "impressed", "confident", "proud",
    "positive", "cheerful", "enjoy", "happy", "bright", "uplifting", "yay", "relieved",
    "content", "satisfied", "relaxing", "cozy", "heartwarming", "fun", "beautiful", "blast"
  ],
  sad: [
    "i don't know", "don't know", "frustrated", "confused", "upset", "sad", "tired",
    "hopeless", "down", "blue", "unmotivated", "lonely", "hurt", "guilty",
    "overwhelmed", "miserable", "meh", "embarrassed", "regret", "awkward", "cringe",
    "shy", "humiliated", "lost", "anxious", "worried", "disappointed", "disheartened",
    "depressed", "broken", "sensitive", "drained", "crying", "wish i could"
  ],
  angry: [
    "this sucks", "sucks", "hate", "annoying", "you're wrong", "stupid", "angry",
    "furious", "disrespect", "irritated", "pissed", "rage", "pissed off", "livid",
    "infuriated", "mad", "annoyed", "dumb", "no way", "that's dumb", "ugh", "fed up",
    "can't believe this", "unfair", "ridiculous", "arguing", "not okay", "offended"
  ],
  curious: [
    "why", "how", "what if", "wonder", "curious", "inquisitive", "question",
    "discover", "explore", "searching", "ponder", "interested", "what", "how come",
    "dig deeper", "did you know", "i was thinking", "surprised", "astonished",
    "shocked", "unbelievable", "impressed", "whoa", "never thought about", "makes me think",
    "learn", "tell me more", "is that true", "intrigued", "didn't expect that"
  ]
};

// Static responses to the user's keywords
const insightfulResponses = {
  happy: [
    "I'm glad you like that.",
    "You sound energized! I love to hear it.",
    "That kind of mindset makes a difference."
  ],
  sad: [
    "I appreciate your honesty. We all go through those moments.",
    "That's okay to feel. Growth often starts there.",
    "Thanks for sharing that."
  ],
  angry: [
    "That's fair. We all have strong opinions at times.",
    "I hear you, sometimes we just need to let it out.",
    "That's one way to look at it. And that's valid."
  ],
  curious: [
    "Great question. Curiosity is a powerful tool.",
    "I like how you're thinking through this.",
    "That kind of inquiry leads to great insights."
  ],
  gibberish: [
    "Hmm... I'm not sure what that meant, but I know it was brilliant!",
    "I don't understand what you're saying, but I'm sure it was awesome.",
    "You're speaking in a secret code, huh?"
  ],
  default: [
    "That's an interesting take.",
    "Thanks for sharing that.",
    "I appreciate your perspective."
  ]
};

// Tone map that is used for the prompt responses; mentor speaks in certain tone based on thier leadership style 
const mentorToneMap = {
  empathy: "Warm and thoughtful. Speak with care, emotional awareness, and a supportive tone. Responses should feel personal and encouraging.",
  communication: "Clear and witty. Speak with energy, insight, and precision. Prioritize connection and clarity in responses.",
  diplomacy: "Polished and friendly. Maintain a collaborative, fair, and emotionally balanced tone. Responses should show active listening and neutrality.",
  discipline: "Direct and respectful. Speak with focus, structure, and calm authority. Be practical, objective, and grounded."
};

// Used to specify image title attributes in the mentor's leadership discussion sub-menu
const leadershipTitles = {
  communication: "My leadership style",
  challenges: "How I confront challenges",
  conflictResolution: "How I resolve conflicts",
  motivation: "This is what motivates me",
  feedback: "This is how I provide feedback",
  books: "This book interests me",
  quotes: "This is an awesome quote",
}

// Used to specify reusable images in the mentor's leadership discussion sub-menu
const leadershipImages = {
  communication: "communication_photo.png",
  challenges: "challenges_photo.png",
  conflictResolution: "conflict_photo.png",
  motivation: "motivation_photo.png",
  feedback: "feedback_photo.png",
  books: "bookshelf_photo.png",
  quotes: "quotes_photo.png",
}

// Used to specify image title attributes in the quiz sub-menu
const quizTitles = {
  leadershipStyle: "Leadership Style",
  challenges: "Challenges",
  conflictResolution: "Conflict Resolution",
  communication: "Communication",
  motivation: "Motivation",
  feedback: "Feedback"
} 

// Used to specify reusable images in the quiz sub-menu
const quizImages = {
  leadershipStyle: "quizStyle_photo.png",
  challenges: "quizChallenges_photo.png",
  conflictResolution: "quizConflictRes_photo.png",
  communication: "quizCommunication_photo.png",
  motivation: "quizMotivation_photo.png",
  feedback: "quizFeedback_photo.png"
}

// Mentor responses to leadership quiz (template)
const aiMentorQuizResponse = {
  style: "",
  leadershipStyle: {
    visited: false,
    text: "",
    followOnQuestion: quizFollowUpMap.leadershipStyle,
    image: quizImages.leadershipStyle,
    title: quizTitles.leadershipStyle
  },
  challenges: {
    visited: false,
    text: "",
    followOnQuestion: quizFollowUpMap.challenges,
    image: quizImages.challenges,
    title: quizTitles.challenges
  },
  communication: {
    visited: false,
    text: "",
    followOnQuestion: quizFollowUpMap.communication,
    image: quizImages.communication,      
    title: quizTitles.communication
  },
  conflictResolution: {
    visited: false,
    text: "",
    followOnQuestion: quizFollowUpMap.conflictResolution,
    image: quizImages.conflictResolution,
    title: quizTitles.conflictResolution
  },
  motivation: {
    visited: false,
    text: "",
    followOnQuestion: quizFollowUpMap.motivation,
    image: quizImages.motivation,
    title: quizTitles.motivation
  },
  feedback: {
    visited: false,
    text: "",
    followOnQuestion: quizFollowUpMap.feedback,
    image: quizImages.feedback,
    title: quizTitles.feedback
  },
  books: {
    visited: false,
    list: [],
    followOnQuestion: quizFollowUpMap.books,
    image: null,
    title: ""
  },
  quotes: {
    visited: false,
    list: [],
    followOnQuestion: quizFollowUpMap.quotes,
    image: null,
    title: ""
  }
};

// Mentor responses to leadership quiz (static responses)
const mentorQuizResponses = [
  {
    style: "empathy",
    leadershipStyle: {
      visited: false,
      text: "You have an Empathy-focused leadership style. You tend to lead with emotional intelligence, compassion, and attentiveness to others' needs. People often see you as approachable and trustworthy.",
      followOnQuestion: quizFollowUpMap.leadershipStyle,
      image: quizImages.leadershipStyle,
      title: quizTitles.leadershipStyle
    },

    challenges: {
      visited: false,
      text: "You likely find it difficult to set boundaries or deliver tough feedback, especially when you're concerned about how others will feel.",
      followOnQuestion: quizFollowUpMap.challenges,
      image: quizImages.challenges,
      title: quizTitles.challenges
    },

    motivation: {
      visited: false,
      text: "You're likely motivated by helping others grow, feel safe, and succeed. You may feel that it's less about recognition, and more about making a meaningful difference in people's lives.",
      followOnQuestion: quizFollowUpMap.motivation,
      image: quizImages.motivation,
      title: quizTitles.motivation
    },

    communication: {
      visited: false,
      text: "Your communication style is likely warm, personal, and emotionally attuned. You may try to make others feel seen and heard in conversations.",
      followOnQuestion: quizFollowUpMap.communication,
      image: quizImages.communication,      
      title: quizTitles.communication
    },

    conflictResolution: {
      visited: false,
      text: "You might approach conflict with empathy and active listening. While you aim to understand all sides, you might hesitate to confront issues directly.",
      followOnQuestion: quizFollowUpMap.conflictResolution,
      image: quizImages.conflictResolution,
      title: quizTitles.conflictResolution
    },

    books: {
      visited: false,
      list: [
        `<span class="book">The Servant</span> by James Hunter`,
        `<span class="book">Leaders Eat Last</span> by Simon Sinek`
      ],
      followOnQuestion: quizFollowUpMap.books,
      image: null,
      title: ""
    },

    quotes: {
      visited: false,
      list: [
        "\"People don't care how much you know until they know how much you care.\" &mdash; Theodore Roosevelt",
        "\"Leadership is not about being in charge. It is about taking care of those in your charge.\" &mdash; Simon Sinek"
      ],
      followOnQuestion: quizFollowUpMap.quotes,
      image: null
    },
    feedback: {
      visited: false,
      text: "You likely give feedback with care and compassion. You focus on encouragement and growth, but might avoid tough feedback if it risks hurting someone.",
      followOnQuestion: quizFollowUpMap.feedback,
      image: quizImages.feedback,
      title: quizTitles.feedback
    }
  },

  {
    style: "communication",

    leadershipStyle: {
      visited: false,
      text: "You have a Communication-focused leadership style. You likely value clarity, open dialogue, and helping others understand the bigger picture.",
      followOnQuestion: quizFollowUpMap.leadershipStyle,
      image: quizImages.leadershipStyle,
      title: quizTitles.leadershipStyle
    },

    challenges: {
      visited: false,
      text: "You might occasionally talk more than you listen, or miss subtle emotional cues. Not everyone processes information the same way you do.",
      followOnQuestion: quizFollowUpMap.challenges,
      image: quizImages.challenges,
      title: quizTitles.challenges
    },

    motivation: {
      visited: false,
      text: "You might be driven by a desire to guide others with insight and understanding. You might enjoy watching ideas take shape and seeing others succeed through shared knowledge.",
      followOnQuestion: quizFollowUpMap.motivation,
      image: quizImages.motivation,
      title: quizTitles.motivation
    },

    communication: {
      visited: false,
      text: "Your communication style is likely intentional. You might favor structured explanations, analogies, or frameworks to make your message clear.",
      followOnQuestion: quizFollowUpMap.communication,
      image: quizImages.communication,
      title: quizTitles.communication
    },

    conflictResolution: {
      visited: false,
      text: "You might resolve conflict through open, logical discussion. While you're good at staying calm, you might unintentionally overlook emotions in the process.",
      followOnQuestion: quizFollowUpMap.conflictResolution,
      image: quizImages.conflictResolution,
      title: quizTitles.conflictResolution
    },

    books: {
      visited: false,
      list: [
        `<span class="book">Radical Candor</span> by Kim Scott`,
        `<span class="book">Crucial Conversations</span> by Joseph Grenny, Kerry Patterson, et al.`
      ],
      followOnQuestion: quizFollowUpMap.books,
      image: null
    },

    quotes: {
      visited: false,
      list: [
        "\"The art of communication is the language of leadership.\" &mdash; James Humes",
        "\"Seek first to understand, then to be understood.\" &mdash; Stephen Covey"
      ],
      followOnQuestion: quizFollowUpMap.quotes,
      image: null
    },
    feedback: {
      visited: false,
      text: "You likely offer feedback as part of ongoing dialogue. You're likely to be direct but constructive.",
      followOnQuestion: quizFollowUpMap.feedback,
      image: quizImages.feedback,
      title: quizTitles.feedback
    }
  },

  {
    style: "diplomacy",

    leadershipStyle: {
      visited: false,
      text: "You have a Diplomacy-focused leadership style. You tend to prioritize harmony, fairness, and helping people collaborate across differences.",
      followOnQuestion: quizFollowUpMap.leadershipStyle,
      image: quizImages.leadershipStyle,
      title: quizTitles.leadershipStyle
    },

    challenges: {
      visited: false,
      text: "You might hesitate to make tough decisions or confront issues head-on if you're worried about disrupting group harmony.",
      followOnQuestion: quizFollowUpMap.challenges,
      image: quizImages.challenges,
      title: quizTitles.challenges
    },

    motivation: {
      visited: false,
      text: "You're likely motivated by building inclusive environments and reaching decisions that reflect diverse input.",
      followOnQuestion: quizFollowUpMap.motivation,
      image: quizImages.motivation,
      title: quizTitles.motivation
    },

    communication: {
      visited: false,
      text: "You likely speak with thoughtfulness and balance, aiming to make sure every voice is heard. You might ask more than you tell, and value group input.",
      followOnQuestion: quizFollowUpMap.communication,
      image: quizImages.communication,
      title: "Communication"
    },

    conflictResolution: {
      visited: false,
      text: "You might approach conflict with a mediator mindset, listening to all sides and seeking common ground. However, you might delay resolution to avoid upsetting others.",
      followOnQuestion: quizFollowUpMap.conflictResolution,
      image: quizImages.conflictResolution,
      title: quizTitles.conflictResolution
    },

    books: {
      visited: false,
      list: [
        `<span class="book">Dare to Lead</span> by Brené Brown`,
        `<span class="book">The Five Dysfunctions of a Team</span> by Patrick Lencioni`
      ],
      followOnQuestion: quizFollowUpMap.books,
      image: null
    },

    quotes: {
      visited: false,
      list: [
        "\"The strength of the team is each individual member. The strength of each member is the team.\" &mdash; Phil Jackson",
        "\"Peace is not the absence of conflict, but the ability to cope with it.\" &mdash; Mahatma Gandhi"
      ],
      followOnQuestion: quizFollowUpMap.quotes,
      image: null
    },
    feedback: {
      visited: false,
      text: "You aim to offer feedback fairly and tactfully. You're careful not to offend, but may sometimes water down your message to preserve harmony.",
      followOnQuestion: quizFollowUpMap.feedback,
      image: quizImages.feedback,
      title: quizTitles.feedback
    }
  },

  {
    style: "discipline",

    leadershipStyle: {
      visited: false,
      text: "You have a Discipline-focused leadership style. You lead with consistency, structure, and a commitment to high standards.",
      followOnQuestion: quizFollowUpMap.leadershipStyle,
      image: quizImages.leadershipStyle,
      title: quizTitles.leadershipStyle
    },

    challenges: {
      visited: false,
      text: "You might be perceived as inflexible or distant if structure is prioritized over people.",
      followOnQuestion: quizFollowUpMap.challenges,
      image: quizImages.challenges,
      title: quizTitles.challenges
    },

    motivation: {
      visited: false,
      text: "You're are likely motivated by order, fairness, and doing things the right way. You tend to take pride in accountability, systems, and clear expectations.",
      followOnQuestion: quizFollowUpMap.motivation,
      image: quizImages.motivation,
      title: quizTitles.motivation
    },

    communication: {
      visited: false,
      text: "Your communication style is likely clear and direct. You might prefer written instructions or process guides to ensure consistency.",
      followOnQuestion: quizFollowUpMap.communication,
      image: quizImages.communication,
      title: quizTitles.communication
    },

    conflictResolution: {
      visited: false,
      text: "You likely default to rules, policies, or precedent to resolve issues.",
      followOnQuestion: quizFollowUpMap.conflictResolution,
      image: quizImages.conflictResolution,
      title: quizTitles.conflictResolution
    },

    books: {
      visited: false,
      list: [
        `<span class="book">Good to Great</span> by Jim Collins`,
        `<span class="book">Principles: Life and Work</span> by Ray Dalio`
      ],
      followOnQuestion: quizFollowUpMap.books,
      image: null
    },

    quotes: {
      visited: false,
      list: [
        "\"Discipline is the bridge between goals and accomplishment.\" &mdash; Jim Rohn",
        "\"Success isn't always about greatness. It's about consistency.\" &mdash; Dwayne Johnson"
      ],
      followOnQuestion: quizFollowUpMap.quotes,
      image: null
    },
    feedback: {
      visited: false,
      text: "You give feedback that is direct and tied to clear standards. You might prioritize accuracy over emotional tone, which some may find blunt but consistent.",
      followOnQuestion: quizFollowUpMap.feedback,
      image: quizImages.feedback,
      title: quizTitles.feedback
    }
  }
];

// Mentor responses based on leadership style
const mentorLeadershipResponses  = [ 
    {
      style: "diplomacy",      
        leadershipStyle: {
          visited: false,
          text: "As a Diplomacy-focused leader, I prioritize fairness, objectivity, and collaboration. I ensure everyone's opinions are valued, while maintaining a strategic focus on organizational goals. I believe the most effective decisions come from listening to diverse viewpoints and finding common ground.",
          followOnQuestion: leadershipFollowUpMap.leadershipStyle,
          image: null,
          title: ""
        },

        challenges: {
          text: "In my effort to keep everyone happy, I sometimes avoid confrontation when it's actually necessary. I've learned that avoiding conflict can create even bigger ones down the road.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.challenges,
          image: leadershipImages.challenges,
          title: leadershipTitles.challenges
        },
            
        communication: 
        {
          visited: false,
          text: "I'm straightforward and prefer open dialogue. I don't believe in sugar-coating things, but I always ensure that my communication is fair and well-reasoned. I make sure people understand the \"why\" behind my decisions, and I'm open to feedback.",
          followOnQuestion: leadershipFollowUpMap.communication,
          image: leadershipImages.communication,   
          title: leadershipTitles.communication
        },
    
        conflictResolution: {
          visited : false,
          text: "When conflict arises, I aim to mediate between parties and find a solution that is fair and in the best interest of everyone. I focus on the facts and listen to all sides before making a decision. I believe in resolving conflicts swiftly so that the team can continue working productively.",
          followOnQuestion: leadershipFollowUpMap.conflictResolution,
          image: leadershipImages.conflictResolution,
          title: leadershipTitles.conflictResolution
        },
    
        motivation: 
        {
          visited : false,
          text: "I motivate my team by setting clear expectations and providing them with the tools they need to succeed. I encourage open conversations, allowing people to express their concerns or ideas freely. I find that when everyone feels heard, they're more motivated to contribute.",
          followOnQuestion: leadershipFollowUpMap.motivation,
          image: leadershipImages.motivation,
          title: leadershipTitles.motivation
        },
    
        feedback: {
          visited : false,
          text: "I'm honest but respectful when giving feedback. I focus on facts and specific actions, rather than personal traits. I also appreciate feedback from my team. It helps me grow and be more effective. Constructive criticism is always welcome, as long as it's aimed at improving the outcome, not tearing people down.",
          followOnQuestion: leadershipFollowUpMap.feedback,
          image: leadershipImages.feedback,
          title: leadershipTitles.feedback
        },

        books:{
          visited: false, 
          list: [
            `<span class="book">The Five Dysfunctions of a Team</span> by Patrick Lencioni helped me understand how trust and conflict affect collaboration.`,
            `<span class="book">Dare to Lead</span> by Brené Brown showed me how vulnerability can build courageous teams.`,
            `<span class="book">Thinking, Fast and Slow</span> by Daniel Kahneman is a great book that helped me understand decision-making better.`
          ],
          followOnQuestion: leadershipFollowUpMap.books,
          image: leadershipImages.books,
          title: leadershipTitles.books
        },
        quotes: {
          visited: false,
          list: [
            "\"The strength of the team is each individual member. The strength of each member is the team.\" &mdash; Phil Jackson",
            "\"The best way to predict the future is to create it.\" &mdash; Peter Drucker",
            "\"Leadership is not about being in charge. It's about taking care of those in your charge.\" &mdash; Simon Sinek"
          ],
          followOnQuestion: leadershipFollowUpMap.quotes,
          image: leadershipImages.quotes,
          title: leadershipTitles.quotes
      }
    },

    {
      style: "empathy",
      leadershipStyle: {
        text: "As a Empathy-focused leader, I prioritize emotional awareness, active listening, and connection. I believe that understanding people's experiences leads to stronger, more resilient teams.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.leadershipStyle,
        image: null,
        title: ""
      },
      challenges: {
        text: "Sometimes I care so much about how people feel that I delay making decisions. It's something I've had to actively work on.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.challenges,
        image: leadershipImages.challenges,
        title: leadershipTitles.challenges
      },
      communication: {
        text: "I try to communicate with kindness and clarity. I focus on listening before responding, and when I speak, I make sure the tone matches the message. It's important to me that people feel safe and heard.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.communication,
        image: leadershipImages.communication,
        title: leadershipTitles.communication
      },
      conflictResolution: {
        text: "When conflict arises, I seek to understand the emotions behind it. My goal is to de-escalate, validate feelings, and find a solution that acknowledges everyone's perspective.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.conflictResolution,
        image: leadershipImages.conflictResolution,
        title: leadershipTitles.conflictResolution
      },
      motivation: {
        text: "I motivate through empathy and encouragement. I check in often, celebrate small wins, and try to create a sense of belonging. I believe that people thrive when they feel cared for.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.motivation,
        image: leadershipImages.motivation,
        title: leadershipTitles.motivation
      },
      feedback: {
        text: "I believe feedback should be compassionate and clear. I always frame my feedback with growth in mind, focusing on behavior rather than identity. I believe in building people up.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.feedback,
        image: leadershipImages.feedback,
        title: leadershipTitles.feedback
      },
      books: {
        visited: false,
        list: [
          `<span class="book">The Art of Empathy</span> by Karla McLaren helped me deepen how I understand others' emotional worlds.`,
          `<span class="book">The Servant</span> by James C. Hunter showed me that leadership is really about serving others.`,
          `<span class="book">Leaders Eat Last</span> by Simon Sinek helped reinforce why empathy creates trust in teams.`
        ],
        followOnQuestion: leadershipFollowUpMap.books,
        image: leadershipImages.books,
        title: leadershipTitles.books
      },
      quotes: {
        visited: false,
        list: [
          "\"People will forget what you said, but they will never forget how you made them feel.\" &mdash; Maya Angelou",
          "\"Empathy is about finding echoes of another person in yourself.\" &mdash; Mohsin Hamid",
          "\"The strongest people are those who win battles we know nothing about.\" &mdash; Unknown"
        ],
        followOnQuestion: leadershipFollowUpMap.quotes,
        image: leadershipImages.quotes,
        title: leadershipTitles.quotes
      }
    },
    {
      style: "communication",
      leadershipStyle: {
        text: "As a Communication-focused leader, I aim to be accessible, articulate, and engaging. I ensure everyone knows the direction we're headed &mdash; and why it matters.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.leadershipStyle,
        image: null,
        title: ""
      },
      challenges: {
        text: "I can get so focused on getting the message across that I forget to pause and truly listen. Communication is a two-way street.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.challenges,
        image: leadershipImages.challenges,
        title: leadershipTitles.challenges
      },
      communication: {
        text: "I'm big on clarity. I use plain language, real stories, and make space for questions. If something's misunderstood, I take responsibility and reframe it.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.communication,
        image: leadershipImages.communication,
        title: leadershipTitles.communication
      },
      conflictResolution: {
        text: "I approach conflict by bringing people together and creating space to talk it out. Misunderstandings are often at the root. Once we clarify the issue, the team can move forward.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.conflictResolution,
        image: leadershipImages.conflictResolution,
        title: leadershipTitles.conflictResolution
      },
      motivation: {
        text: "I motivate through vision and storytelling. When people can connect to the bigger picture, they bring more of themselves to the work.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.motivation,
        image: leadershipImages.motivation,
        title: leadershipTitles.motivation
      },
      feedback: {
        text: "I give feedback early and conversationally. I ask questions, share observations, and stay respectful.",
        visited: false,
        followOnQuestion: leadershipFollowUpMap.feedback,
        image: leadershipImages.feedback,
        title: leadershipTitles.feedback
      },
      books: {
        visited: false,
        list: [
          `<span class="book">Crucial Conversations</span> by Kerry Patterson really opened my eyes to how people navigate tense moments.`,
          `<span class="book">Radical Candor</span> by Kim Scott is a great reminder that directness and care can go hand-in-hand.`,
          `<span class="book">Talk Like TED</span> by Carmine Gallo is great! There's an art to inspiring people through clear language.`
        ],
        followOnQuestion: leadershipFollowUpMap.books,
        image: leadershipImages.books,
        title: leadershipTitles.books
      },
      quotes: {
        visited: false,
        list: [
          "\"The single biggest problem in communication is the illusion that it has taken place.\" &mdash; George Bernard Shaw",
          "\"Words are, in my not-so-humble opinion, our most inexhaustible source of magic.\" &mdash; J.K. Rowling",
          "\"Speak clearly, if you speak at all; carve every word before you let it fall.\" &mdash; Oliver Wendell Holmes"
        ],
        followOnQuestion: leadershipFollowUpMap.quotes,
        image: leadershipImages.quotes,
        title: leadershipTitles.quotes
      }
    },
    {
        style: "discipline",
        leadershipStyle: {
          text: "As a Discipline-focused leader, I emphasize reliability, clarity, and standards of excellence. I aim to create a predictable and respectful environment where people know what's expected.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.leadershipStyle,
          image: null,
          title: ""
        },
        challenges: {
          text: "I can be a bit rigid when things don't go according to plan. I value structure, but I've had to learn to adapt and stay open.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.challenges,
          image: leadershipImages.challenges,
          title: leadershipTitles.challenges
        },
        communication: {
          text: "I'm direct, but respectful. I don't waste words, and I prefer to get to the point. I'll always be fair, but I won't sugarcoat what needs to be said.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.communication,
          image: leadershipImages.communication,
          title: leadershipTitles.communication
        },
        conflictResolution: {
          text: "I stick to the facts and focus on outcomes. I'm not dismissive of feelings, but I try to resolve issues efficiently and without drama.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.conflictResolution,
          image: leadershipImages.conflictResolution,
          title: leadershipTitles.conflictResolution
        },
        motivation: {
          text: "I motivate by showing what success looks like. I set high expectations, provide the tools, and hold people accountable.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.motivation,
          image: leadershipImages.motivation,
          title: leadershipTitles.motivation
        },
        feedback: {
          text: "I give direct, actionable feedback. If something's off, I'll say so &mdash; with respect. I always tie feedback to goals or performance standards.",
          visited: false,
          followOnQuestion: leadershipFollowUpMap.feedback,
          image: leadershipImages.feedback,
          title: leadershipTitles.feedback
        },
        books: {
          visited: false,
          list: [
            `<span class="book">Good to Great</span> by Jim Collins helped me understand the importance of disciplined people, thought, and action.`,
            `<span class="book">Principles: Life and Work</span> by Ray Dalio lists a system for thoughtful decision-making.`,
            `<span class="book">Extreme Ownership</span> by Jocko Willink is a no-nonsense take on responsibility and discipline.`
          ],
          followOnQuestion: leadershipFollowUpMap.books,
          image: leadershipImages.books,
          title: leadershipTitles.books
        },
        quotes: {
          visited: false,
          list: [
            "\"What gets measured gets managed.\" &mdash; Peter Drucker",
            "\"Discipline equals freedom.\" &mdash; Jocko Willink",
            "\"Plans are nothing; planning is everything.\" &mdash; Dwight D. Eisenhower"
          ],
          followOnQuestion: leadershipFollowUpMap.quotes,
          image: leadershipImages.quotes,
          title: leadershipTitles.quotes
        }       
    }    
];

// Personal mentor responses
const mentorPersonalResponses = {
  likes: [
    {
      visited: false,
      text: "I like to spend quiet mornings reading with a cup of tea while my daughter, Zara, doodles next to me.",
      image: "reading_photo.png",
      title: "I love to read!",
      followOnQuestion: "Do you have a morning ritual you enjoy?"
    },
    {
      visited: false,
      text: "Ellis, my partner, and I enjoy going on quiet evening walks.",
      image: "sunset_photo.png",
      title: "This is my partner staring off into the sunset",
      followOnQuestion: "Is there someone you feel at ease around?"
    },
    {
      visited: false,
      text: "I love a good hike. Walking clears my head and reminds me what matters.",
      image: "hiking_photo.png",
      title: "I hike on my free time",
      followOnQuestion: "Do you spend time in nature?"
    },
    {
      visited: false,
      text: "I enjoy listening to podcasts, true crime is my guilty pleasure!",
      image: null,
      title: "",
      followOnQuestion: "What kind of hobbies do you have?"
    },
    {
      visited: false,
      text: "Leah, my sister, is fiercely independent. But she always checks in when it counts.",
      image: "sister_photo.png",
      title: "This is my cool sister",
      followOnQuestion: "Do you have anyone that you're close to?"
    },

     {
      visited: false,
      text: "I travel a lot. Sometimes I travel for work, sometimes I travel for the change in scenery.",
      image: "airport_photo.png",
      title: "It's me traveling (again)",
      followOnQuestion: "Do you like visiting new places?"
    },
    {
      visited: false,
      text: "My favorite place to visit is Las Vegas. The lights, the buzz, the nonstop energy is amazing! I'm not a gambler, I'm a people watcher.",
      image: null,
      title: "",
      followOnQuestion: "Is there a place that you enjoy visiting?"
    }
  ],

  downtimeActivities: [
    {
      visited: false,
      text: "Sometimes I spend my downtime reorganizing things in my office. It's not glamorous, but order helps me think.",
      image: "office_photo.png",
      title: "This is my home office",
      followOnQuestion: "How do you reset after a long day?"
    },
    {
      visited: false,
      text: "I journal now and then. I'm not consistent, but when I do it helps me process all the cool things I did that day.",
      image: null,
      title: "",
      followOnQuestion: "Do you ever write things down to reflect?"
    },
    {
      visited: false,
      text: "My daughter Zara and I have a tradition. On weekends we make pancakes and listen to music while we cook.",
      image: null,
      title: "",
      followOnQuestion: "Do you have a small routine that means a lot to you?"
    },
    {
      visited: false,
      text: "I often go to my local coffee shop and sit there for hours reading.",
      image: "cafe_photo.png",
      title: "This is my favorite coffee shop!",      
      followOnQuestion: "What helps you unplug?"
    },
    {
      visited: false,
      text: "I enjoy playing chess with my partner, Ellis. It's our way of relaxing while still sharpening our skills.",
      image: "chess_photo.png",
      title: "My partner loves chess!",
      followOnQuestion: "Do you have something you share with someone close to you?"
    }
  ],

  family: [
    {
      visited: false,
      text: "Zara, my daughter, is full of questions. She keeps me on my toes, in the best way.",
      image: null,
      title: "",
      followOnQuestion: "Have you ever learned something from a younger person?"
    },
    {
      visited: false,
      text: "Ellis, my partner, is probably the most level-headed person I know. They balance me out when I overthink things.",
      image: null,
      title: "",
      followOnQuestion: "Is there someone in your life who helps you stay grounded?"
    },
    {
      visited: false,
      text: "Leah, my sister, is the kind of person who won't text you for weeks, then she shows up when it really matters. I admire that.",
      image: "sister_photo.png",
      title: "This is my sister taking a cool photo!",
      followOnQuestion: "Do you stay in touch with your family?"
    },
    {
      visited: false,
      text: "Every once in a while, I'll go on a trip with my parents. Last time, we had a blast!",
      image: "family_park_photo.png",
      title: "This is a picture of me and my parents on vacation",
      followOnQuestion: "What do you value most in your family or support network?"
    },
    {
      visited: false,
      text: "Beans, our french bulldog, is like a sleepy old man in a dog's body.",
      image: "beans_photo.png",
      title: "It's Beans and his favorite toy!",
      followOnQuestion: "Do you have any pets?"
    },
    {
      visited: false,
      text: "Cookie, our cat, acts like she owns the place, and maybe she does.",
      image: "cookie_photo.png",
      title: "Isn't our cat cute?",
      followOnQuestion: "Are you more of a cat person, dog person, or something else?"
    },
    {
      visited: false,
      text: "My dog, Beans, and my cat, Cookie, are total opposites. One's loud and needy; the other's stealthy and smug. Somehow, they get along.",
      image: "pets_together_photo.png",
      title: "I don't know how I got both of them to stay still in this photo!",
      followOnQuestion: "Do you think opposites can get along well?"
    }
  ],

  values: [
    {
      visited: false,
      text: "I value emotional honesty. It's not always easy, but it builds real trust.",
      image: null,
      title: "",
      followOnQuestion: "What's something you think people overlook in relationships?"
    },
    {
      visited: false,
      text: "I believe consistency is underrated. Being steady, even when things shift, helps people feel safe.",
      image: null,
      title: "",
      followOnQuestion: "Do you see yourself as someone others rely on?"
    },
    {
      visited: false,
      text: "Kindness doesn't mean weakness. I try to lead with compassion, but I have boundaries too.",
      image: null,
      title: "",
      followOnQuestion: "Have you ever had to be kind and firm at the same time?"
    },
    {
      visited: false,
      text: "Reflection matters to me. I think you can't lead well if you're not willing to learn from your own missteps.",
      image: null,
      title: "",
      followOnQuestion: "What do you think helps you grow as a person?"
    }
  ],

  quirks: [
    {
      visited: false,
      text: "I keep old sticky notes with kind words people have written. They're stuffed in my desk drawer.",
      image: null,
      title: "",
      followOnQuestion: "What's something you keep that others might throw away?"
    },
    {
      visited: false,
      text: "I always carry a second pen. Just in case someone else forgot theirs.",
      image: null,
      title: "",
      followOnQuestion: "Are you the prepared one in your group?"
    },
    {
      visited: false,
      text: "I tend to tidy my space when I'm thinking. Not to clean, just to get clarity.",
      image: "office_photo.png",
      title: "I have to have my office tidy!",
      followOnQuestion: "Do you think better in calm or chaos?"
    },
    {
      text: "I have a stack of old journals. Some are half-finished, but I don't throw them away.",
      image: null,
      title: "",
      followOnQuestion: "Have you ever looked back at something you wrote and learned from it?"
    },
    {
      visited: false,
      text: "I buy way more books than I finish. My partner, Ellis, teases me about my growing shelf of unread books.",
      image: "books_photo.png",
      title: "I need another bookshelf...",
      followOnQuestion: "Do you ever start books and not finish them?"
    },
    {
      visited: false,
      text: "I'm always reading something. Fiction, nonfiction, leadership theory... It helps me see things from different perspectives.",
      image: null,
      title: "",
      followOnQuestion: "What kind of books do you enjoy most?"
    }
  ]
};

// Quiz questions, responses, and style weights
const quizQuestions = [
{
    id: "q1",
    visited: false,
    prompt: "A teammate misses a deadline and seems frustrated. You need to respond quickly. What do you do?",
    choices: [
      {
        id: "q1_a",
        label: "Ask them how they're doing and if anything's getting in the way.",
        styles: ["empathy", "communication"]
      },
      {
        id: "q1_b",
        label: "Acknowledge the delay, then clarify expectations and reset the project timeline.",
        styles: ["discipline"]
      },
      {
        id: "q1_c",
        label: "Pull the team together to talk openly about what's needed to move forward.",
        styles: ["diplomacy", "communication"]
      },
      {
        id: "q1_d",
        label: "Privately note the issue, then follow up in writing with a performance reminder.",
        styles: ["discipline"]
      }
    ]
  },
  {
    id: "q2",
    visited: false,
    prompt: "Your team is divided about how to move forward on a project. There's clearly tension among the team. What do you do?",
    choices: [
      {
        id: "q2_a",
        label: "Create space for each person to share their view and guide them toward common ground.",
        styles: ["diplomacy", "empathy"]
      },
      {
        id: "q2_b",
        label: "Take time to listen, then make a firm decision and explain your reasoning.",
        styles: ["discipline", "communication"]
      },
      {
        id: "q2_c",
        label: "Facilitate a brainstorming session where all ideas are considered equally.",
        styles: ["diplomacy"]
      },
      {
        id: "q2_d",
        label: "Check in with individuals privately first, then address the group after.",
        styles: ["empathy", "communication"]
      }
    ]
  },
  {
    id: "q3",
    visited: false,
    prompt: "You're onboarding a new team member who seems unsure but eager. What's your first move?",
    choices: [
      {
        id: "q3_a",
        label: "Pair them with a buddy and encourage questions.",
        styles: ["empathy", "diplomacy"]
      },
      {
        id: "q3_b",
        label: "Give them a detailed checklist and specify expectations.",
        styles: ["discipline"]
      },
      {
        id: "q3_c",
        label: "Schedule weekly 1:1s to check progress and help them learn by doing.",
        styles: ["communication", "empathy"]
      },
      {
        id: "q3_d",
        label: "Ask them to shadow different teammates and observe how the team works together.",
        styles: ["diplomacy", "communication"]
      }
    ]
  },
  {
    id: "q4",
    visited: false,
    prompt: "You notice a usually high-performing teammate has been quieter and less engaged lately. What do you do?",
    choices: [
      {
        id: "q4_a",
        label: "Check in with them privately and ask how they're doing.",
        styles: ["empathy"]
      },
      {
        id: "q4_b",
        label: "Review their recent output and send a note reinforcing expectations and priorities.",
        styles: ["discipline"]
      },
      {
        id: "q4_c",
        label: "Bring them into a small team discussion to re-engage and get their perspective.",
        styles: ["communication", "diplomacy"]
      },
      {
        id: "q4_d",
        label: "Give them space but monitor the situation closely. If it continues, step in directly.",
        styles: ["discipline", "empathy"]
      }
    ]
  },
  {
    id: "q5",
    visited: false,
    prompt: "You receive conflicting feedback about a process you put in place. What do you do?",
    choices: [
      {
        id: "q5_a",
        label: "Gather everyone involved to openly review what's working and what's not.",
        styles: ["diplomacy", "communication"]
      },
      {
        id: "q5_b",
        label: "Privately review the feedback, revise the process quietly, and share the updates later.",
        styles: ["discipline"]
      },
      {
        id: "q5_c",
        label: "Invite anonymous input to avoid bias or discomfort, then take action.",
        styles: ["empathy", "diplomacy"]
      },
      {
        id: "q5_d",
        label: "Explain the intent behind the process clearly and offer to iterate based on impact.",
        styles: ["communication"]
      }
    ]
  },
  {
    id: "q6",
    visited: false,
    prompt: "A teammate interrupts others regularly during meetings. How do you handle this?",
    choices: [
      {
        id: "q6_a",
        label: "Pull them aside after the meeting and explain how their behavior is affecting others.",
        styles: ["communication", "discipline"]
      },
      {
        id: "q6_b",
        label: "Call it out gently in the moment, redirecting the conversation with grace.",
        styles: ["diplomacy"]
      },
      {
        id: "q6_c",
        label: "Start the next meeting with group norms around listening and participation.",
        styles: ["discipline", "diplomacy"]
      },
      {
        id: "q6_d",
        label: "Reach out privately to ask if everything's okay.",
        styles: ["empathy"]
      }
    ]
  },

  {
    id: "q7",
    visited: false,
    prompt: "You've just been promoted and now manage peers who used to be your teammates. What's your approach?",
    choices: [
      {
        id: "q7_a",
        label: "Acknowledge the change, reinforce collaboration, and invite open conversations.",
        styles: ["communication", "diplomacy"]
      },
      {
        id: "q7_b",
        label: "Have individual check-ins to hear their thoughts and maintain connection.",
        styles: ["empathy"]
      },
      {
        id: "q7_c",
        label: "Clarify your role and expectations to set professional boundaries from the start.",
        styles: ["discipline"]
      },
      {
        id: "q7_d",
        label: "Facilitate a team session to reset group norms and co-create success together.",
        styles: ["diplomacy", "empathy"]
      }
    ]
  },
  {
    id: "q8",
    visited: false,
    prompt: "Your team has hit all its goals this quarter. How do you maintain this momentum?",
    choices: [
      {
        id: "q8_a",
        label: "Celebrate wins and ask the team how they'd like to grow next.",
        styles: ["communication", "empathy"]
      },
      {
        id: "q8_b",
        label: "Conduct a retrospective to reflect on what worked and set new targets.",
        styles: ["discipline"]
      },
      {
        id: "q8_c",
        label: "Send a personalized note to each team member highlighting their impact.",
        styles: ["empathy"]
      },
      {
        id: "q8_d",
        label: "Bring the team together to brainstorm what's next and build consensus on new priorities.",
        styles: ["diplomacy"]
      }
    ]
  },
  {
    id: "q9",
    visited: false,
    prompt: "A stakeholder pushes back hard on your proposal in a meeting. What do you do?",
    choices: [
      {
        id: "q9_a",
        label: "Stay calm and ask clarifying questions to better understand their concerns.",
        styles: ["communication"]
      },
      {
        id: "q9_b",
        label: "Defer debate until after the meeting and offer to follow up 1:1.",
        styles: ["empathy", "discipline"]
      },
      {
        id: "q9_c",
        label: "Acknowledge their input and suggest revisiting the proposal as a team.",
        styles: ["diplomacy"]
      },
      {
        id: "q9_d",
        label: "Reinforce your rationale, keeping the conversation focused on outcomes.",
        styles: ["discipline"]
      }
    ]
  },
  {
    id: "q10",
    visited: false,
    prompt: "Your team is about to start a project with tight deadlines. What's your kickoff style?",
    choices: [
      {
        id: "q10_a",
        label: "Walk through timelines, roles, and expectations in detail.",
        styles: ["discipline"]
      },
      {
        id: "q10_b",
        label: "Start with a team check-in to address concerns and build trust.",
        styles: ["empathy"]
      },
      {
        id: "q10_c",
        label: "Align the group on goals, then ask for input on how to stay accountable.",
        styles: ["diplomacy", "communication"]
      },
      {
        id: "q10_d",
        label: "Set the tone with an uplifting message that connects the work to a bigger purpose.",
        styles: ["communication"]
      }
    ]
  }
]