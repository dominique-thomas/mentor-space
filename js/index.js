/**
 * Project: Mentor Space
 * Description: Core logic for handling conversation flow, quiz routing, and fallback logic for AI-based feedback.
 * Author: Dominique Thomas (github.com/dominique-thomas)
 * License: Shared publicly for demonstration purposes only. Reuse or redistribution not permitted without permission.
 */
//----------------------------------
//  Global Variables
//----------------------------------
const appName = "Mentor Space";
const mainMenuStr = `Let's talk about something else <span class="context">(main menu)</span>`
const nextMenuStr = `I want to talk more on this topic <span class="context">(next menu)</span>`
const returnMenuStr = `Let's circle back <span class="context">(previous menu)</span>`
const unsureStr = "Hmm, I don't know what to say."
const chatTitle = document.querySelector(".chat-title");
const sections = {
  resources: document.getElementById("resources-panel"),
  about: document.getElementById("about-panel"),
  main: document.getElementById("chat-main")
};
let sessionPromptCount = 0;
const MAX_SESSION_PROMPTS = 3;
const REACTION_CHANCE = 0.4;      
const MAX_QUIZ_QUESTIONS = 5;
const DOMINANT_THRESHOLD = 2; 
const baseDelay = 500; 
const delayPerChunk = 1600;
const visitedOptions = new Set();
const userScores = {
  empathy: 0,
  communication: 0,
  diplomacy: 0,
  discipline: 0
};
let quizSession = {
  questionList: [],
  currentIndex: 0
};
let quizTaken = false;
let activeMenu = "";
let mentorLeadershipStyle = ""; 
let userLeadershipStyle = "";


//----------------------------------
// Gemini Handlers 
//----------------------------------
async function sendToGemini(prompt) {
  try {
    const response = await fetch("https://us-central1-leadership-ai-project.cloudfunctions.net/sendToGeminiV2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        token: "mentor-ai-73fe2a"
      })
    });

    // Handle non-JSON errors
    if (!response.ok) {
      const fallbackText = await response.text();
      console.error("Server returned error:", fallbackText);
      return pickRandom(leadershipStyleInputFallback);
    }

    const data = await response.json();

    if (data.text === "__AI_LIMIT_REACHED__") {
      return pickRandom(leadershipStyleInputFallback);
    }

    return data.text || pickRandom(leadershipStyleInputFallback);

  } catch (err) {
    console.error("Failed to reach Gemini:", err);
    return pickRandom(leadershipStyleInputFallback);
  }
}


//----------------------------------
// AI Prompt Handlers
//----------------------------------
// Prompt for the "free form" text input field
function generateFreeformAiPrompt(userInput, styles = []) {
  const tone = styles.length > 0 ? mentorToneMap[styles[0]] : "";

  return `
    The user has asked: "${userInput}"

    You are a virtual leadership mentor. Only respond to questions or comments related to leadership topics, such as communication, motivation, challenges, feedback, conflict, values, and team dynamics.

    If the user's message is unrelated (such as asking how you're doing), gently redirect them to leadership-related topics. You can say something like, "Let's focus on your growth as a leader" or "Happy to help you reflect on your leadership journey."

    Speak in a warm, clear, and thoughtful tone. Use first-person language (e.g., I find, I think, I believe). Respond in 2-3 sentences. Do not include a preamble.

    If the user says something you don't understand, respond by saying: ${unsureStr}

    ${tone ? `Use this tone: ${tone}` : ""}
  `;
}

// Prompt for the user's quiz results
function generateQuizResultsAiPrompt(styles) {

  const styleLabels = styles.map(s => {
    return {
      empathy: "Empathy-focused",
      communication: "Communication-focused",
      diplomacy: "Diplomacy-focused",
      discipline: "Discipline-focused"
    }[s] || s;
  });

  const allStyles = ["Empathy-focused", "Communication-focused", "Diplomacy-focused", "Discipline-focused"];
  const tone = mentorToneMap[styles[0]] || "";

  const intro = styles.length === 1
    ? `The user aligns with a ${styleLabels[0]} leadership style.`
    : `The user appears to reflect a blend of ${styleLabels.join(" and ")} leadership styles.`;

  return `
  ${intro}
  We support only four leadership styles: ${allStyles.join(", ")}.

  Based on this user's traits, please respond to each of the following categories with 1-3 sentences (except for books/quotes).

  Respond as if speaking directly to the user. Use second-person phrasing (e.g., "You may...", "You might...", "Your style is likely...").
  Avoid third-person phrasing like "This leader..." or "They would...".
  Make it feel like a reflection or gentle observation to help the user understand themselves.

  Respond in this exact JSON structure. Do not include any extra explanation or text before/after the JSON:

  {
    "leadershipStyle": "What is this user's leadership style like?",
    "challenges": "What challenges might they face?",
    "communication": "What is their communication style?",
    "conflictResolution": "How might they resolve conflict?",
    "motivation": "What motivates them as a leader?",
    "feedback": "How do they give and receive feedback?",
    "books": ["Return 2-3 titles formatted as: <span class='book'>Book Title</span>"],
    "quotes": ["Return 2 quotes wrapped in escaped double quotes like this: \\\"I'm a quote.\\\""]
  }

  Use this tone: ${tone}
  Only respond with valid JSON.
  `;
}


//----------------------------------
//  DOM Content Loaded Handler 
//----------------------------------
document.addEventListener("DOMContentLoaded", () => {

  setLeadershipStyle();
  showIntroMessage();

  //Used to show a specific menu section
  function showSection(name) {

    const chatBody = document.getElementById("chat-body");
    const sectionToShow = sections[name];

    Object.values(sections).forEach((section) => {
      section.classList.remove("active");
    });

    if (sectionToShow) {
      sectionToShow.classList.add("active");
      if (name === "main") {
        chatBody.classList.add("scrollable");
        scrollToWindowBottom();
      } else {        
        chatBody.classList.remove("scrollable");
        chatBody.scrollTop = 0;
      }
    }

    //Shows the menu name (if applicable)
    chatTitle.innerHTML = (name === "main")
      ? `${appName}`
      : `${appName} - ${name.charAt(0).toUpperCase() + name.slice(1)}`;
  }

  // Handle back button click (returning to main view)
  document.querySelectorAll(".back-to-chat").forEach((btn) => {
    btn.addEventListener("click", () => showSection("main"));
  });

  // Icon click handlers for Help, Info, Settings
  document.getElementById("icon-resources").addEventListener("click", (e) => {
    e.preventDefault();  
    showSection("resources");
  });

  document.getElementById("icon-about").addEventListener("click", (e) => {
    e.preventDefault();
    showSection("about");
  });

  // Default to chat window when title is clicked
  document.querySelector(".chat-title").addEventListener("click", () => showSection("main"));
});


//----------------------------------
//  Intro Messages
//----------------------------------
// Specifies the leadership style of the virtual mentor
function setLeadershipStyle(){
  mentorLeadershipStyle = pickRandom(leadershipStyles);
}

// Shows the mentor's intro message and shows the main menu
function showIntroMessage(){
  const message = `Welcome to ${appName}. I'm ${mentorName}, your personal leadership mentor. Here you can explore your leadership style and learn a bit about how I lead too.`;

  const data = {
    text: message,
    image: null,
    followOnQuestion: null
  };

  processMessageQueue(data, () => {

    // Ask for the user's name
    processMessageQueue({ text: "Before we begin, what should I call you?" }, () => {

      addInputField((userInput) => {        
        firstName = userInput.trim();
        addUserMessage(firstName);

        processMessageQueue({ text: `Nice to meet you, ${firstName}.` }, () => {
          processMessageQueue({ text: "By the way, if you'd like to reset our conversation, simply refresh the page. Let's get started!" }, () => {
            showMainMenu();                   
          });
        });
      });
    });

  });
}


//----------------------------------
//  Menu Handlers
//----------------------------------
// Shows the main menu 
function showMainMenu(){    
  const options = [
    { id: "personalQuestionMenu", label: `Tell me something personal about you <span class="context">(menu)</span>` },
    { id: "leadershipStyleMenu", label: `Tell me about your leadership style <span class="context">(menu)</span>` },
    { id: "quizMenu", label: `I want to know more about my leadership style <span class="context">(quiz)</span>` }
  ];

  addOptionButtons(options, handleUserChoice);
  activeMenu = "main";
}

// Shows the mentor's personal discussion sub-menu 
function showPersonalSubMenu(){
  const options = [
    { id: "personal_likes", key: "likes", label: "Tell me something you like" },
    { id: "personal_downtimeActivities", key: "downtimeActivities", label: "What do you do to unwind?" },
    { id: "personal_family", key: "family", label: "Tell me about your family" },
    { id: "personal_values", key: "values", label: "What matters most to you?" },
    { id: "personal_quirks", key: "quirks", label: "Do you have any unique habits?" },
    { id: "main", key: "main", label: mainMenuStr }
  ];

  addOptionButtons(options, handleUserChoice);
  activeMenu = "personalSubmenu";
}

// Shows the first page of the mentor's leadership discussion sub-menu (1 of 2)
function showLeadershipSubMenuPage1() {
  const options = [
    { id: "leadership_leadershipStyle", key: "leadershipStyle", label: "Tell me about your leadership style" },
    { id: "leadership_challenges", key: "challenges", label: "What challenges might you face?" },
    { id: "leadership_conflictResolution", key: "conflictResolution", label: "How do you handle conflict?" },
    { id: "leadership_motivation", key: "motivation", label: "What motivates you?" },
    { id: "leadership_communication", key: "communication", label: "How do you communicate with your team?" },
    { id: "leadership_next", key: "next", label: nextMenuStr },
    { id: "main", key: "main", label: mainMenuStr }
  ];

  addOptionButtons(options, handleUserChoice);
  activeMenu = "leadershipPage1";
}

// Shows the second page of the mentor's leadership discussion sub-menu (2 of 2)
function showLeadershipSubMenuPage2() {
  const options = [
    
    { id: "leadership_feedback", key: "feedback", label: "How do you give feedback?" },
    { id: "leadership_books", key: "books", label: "Do you have a favorite leadership book?" },
    { id: "leadership_quotes", key: "quotes", label: "What leadership quote inspires you?" },
    { id: "freeQuestion", label: `I have another question <span class="context">(custom input)</span>` },
    { id: "leadership_back", key: "back", label: returnMenuStr },
    { id: "main", key: "main", label: mainMenuStr }
  ];

  addOptionButtons(options, handleUserChoice);
  activeMenu = "leadershipPage2";
}

// Shows the quiz sub-menu (default entry point)
function showQuizSubMenu() {
  activeMenu = "quizPage1";

  //If the user has not taken the quiz, then they will be redirected here
  if (!quizTaken) {
    const options = [
      { id: "startQuiz", key: "startQuiz", label: `I'm ready! <span class="context">(start quiz)</span>` },
      { id: "main", key: "main", label: mainMenuStr }
    ];

    addDivider();
    processMessageQueue({ text: "Great! I'll walk you through a few short scenarios. There are no wrong answers, please answer honestly. Ready to find out what your leadership style is?"},() => {addOptionButtons(options, handleUserChoice);}
    );
    return;
  }

  // Else, if they've already taken the quiz, they will be redirected 
  showQuizSubMenuPage1()
}

// Shows the first page of quiz sub-menu, where users can ask questions concerning their leadership style (1 of 2)
function showQuizSubMenuPage1(){
  const options = [
    { id: "quiz_leadershipStyle", key: "leadershipStyle", label: "Tell me about my leadership style" },
    { id: "quiz_challenges", key: "challenges", label: "What challenges might I face?" },
    { id: "quiz_conflictResolution", key: "conflictResolution", label: "How might I handle conflict?" },
    { id: "quiz_motivation", key: "motivation", label: "What might motivate me?" },
    { id: "quiz_communication", key: "communication", label: "How might I communicate as a leader?" },    
    { id: "quiz_next", key: "next", label: nextMenuStr },
    { id: "main", key: "main", label: mainMenuStr }
  ];

  addOptionButtons(options, handleUserChoice);
  activeMenu = "quizPage1";
}

// Shows the second page of quiz sub-menu, where users can ask questions concerning their leadership style (2 of 2)
function showQuizSubMenuPage2(){
  const options = [
    { id: "quiz_feedback", key: "feedback", label: "How might I provide feedback?" },
    { id: "quiz_books", key: "books", label: "Can you recommend a book for me to read?" },
    { id: "quiz_quotes", key: "quotes", label: "What leadership quote reflects my style?" },
    { id: "quiz_retake", key: "retake", label: `I want to revisit my leadership style <span class="context">(retake quiz)</span>` },
    { id: "quiz_back", key: "back", label: returnMenuStr },
    { id: "main", key: "main", label: mainMenuStr }
  ];

  addOptionButtons(options, handleUserChoice);
  activeMenu = "quizPage2";
}

// Helper function that handles button clicks
function handleUserChoice(option) {

  const { id, key } = option;

  switch (id) {    
    
    // Main menu options
    case "personalQuestionMenu":
      addDivider();
      processMessageQueue({ text: pickRandom(personalMenuPrompts) }, () => {
        showPersonalSubMenu();
      });
    break;

    case "leadershipStyleMenu":
    case "leadership_back":
      addDivider();
      processMessageQueue({ text: pickRandom(personalMenuPrompts) }, () => {
        showLeadershipSubMenuPage1();
      });
    break;
    case "leadership_next":
      addDivider();
      processMessageQueue({ text: pickRandom(personalMenuPrompts) }, () => {
        showLeadershipSubMenuPage2();
      });
    break;

    // Personal sub-menu
    case "personal_likes":
    case "personal_downtimeActivities":
    case "personal_family":
    case "personal_values":
    case "personal_quirks":
      showRandomizedPersonalMsg(key);
    break;

    // Leadership sub-menu
    case "leadership_leadershipStyle":
    case "leadership_challenges":
    case "leadership_conflictResolution":
    case "leadership_motivation":
    case "leadership_communication":
    case "leadership_feedback":
    case "leadership_books":
    case "leadership_quotes":
      showMentorResponse(option, "leadership");
    break;
    case "freeQuestion":
      addDivider();
      handleCustomInputFromUser();
    break;
    
    //Quiz sub-menu
    case "quizMenu":    
      showQuizSubMenu();
    break;
    case "quiz_back":
        addDivider();
        processMessageQueue({ text: pickRandom(personalMenuPrompts) }, () => {
          showQuizSubMenu();
        });
    break;
    case "quiz_next":
        addDivider();
        processMessageQueue({ text: pickRandom(personalMenuPrompts) }, () => {
          showQuizSubMenuPage2();
        });
    break;
    case "startQuiz":
    case "quiz_retake":
      quizTaken = true;
      addDivider();
      processMessageQueue({ text: "Let's get started." }, () => {
        startQuiz(); 
      });      
    break;
    case "quiz_leadershipStyle":
    case "quiz_challenges":
    case "quiz_conflictResolution":
    case "quiz_motivation":
    case "quiz_communication":
    case "quiz_feedback":
    case "quiz_books":
    case "quiz_quotes":
      showMentorResponse(option, "quiz");
    break;  

    // Return to main menu
    case "main":   
      addDivider();
      processMessageQueue({ text: pickRandom(returnToMenuPrompts) }, () => {
        showMainMenu();
      });
    break;

    // Fallback
    default:
      addMentorMessage("Hmm... not sure what to do with that. Let's try something else.");
      returnToActiveMenu();
  }
}

// Helper function that returns to the currently selected (active) menu
function returnToActiveMenu() {
  switch (activeMenu) {
    case "main":       
      showMainMenu();
    break;

    case "personalSubmenu":
      showPersonalSubMenu();
    break;

    case "leadershipPage1":
      showLeadershipSubMenuPage1();
    break;

    case "leadershipPage2":
      showLeadershipSubMenuPage2();
    break;

    case "quizPage1":
      showQuizSubMenuPage1();
    break;

    case "quizPage2":
      showQuizSubMenuPage2();
    break;
  
    default:
      showMainMenu(); 
  }
}


//----------------------------------
//  Message Queue Handlers
//----------------------------------
// Handles all message queue logic
function processMessageQueue(response, onComplete, showInputIfFollowUp = false) { 

  if (!response || !response.text) return;

  const updatedResponse = updateFirstNameStr(response.text);
  response.text = updatedResponse;

  const chunks = splitDialogIntoChunks(response);
  let hasFollowUp = false;

  // Used to determine if the mentor will ask a follow-on question
  if (response.followOnQuestion && Math.random() < 0.6) {

    const updatedFollowOn = updateFirstNameStr(response.followOnQuestion);
    response.followOnQuestion = updatedFollowOn;

    chunks.push({ text: response.followOnQuestion, image: null, title: "" });
    hasFollowUp = true;
  }

  // Reads data that has been split into smaller "chunks" and displays them one at a time with some delay
  chunks.forEach(({ text, image, title }, i) => {

    setTimeout(() => {
      addMentorMessage(text, image, title);

      if (i === chunks.length - 1) {

        // Handles calling a function
        if (typeof onComplete === "function") {
          onComplete();          
        } 
        // Handles the mentor asking a follow-up question
        else if (hasFollowUp && showInputIfFollowUp) {
           setTimeout(() => {
            handleInputWithMentorReply();
          }, 1200);
        } 
        // Fallback option that return to menu with "bridge" dialog 
        else {                 
          setTimeout(() => {
            const bridge = pickRandom(backToMenuBridgeLines);
            addDivider();
            processMessageQueue({ text: bridge }, () => {
              returnToActiveMenu();
            });
          }, 800); // Delay to allow fade-in of last message
        }
      }
    },  baseDelay + i * delayPerChunk);
  });
}

// Helper function that splits the mentor's dialog into smaller chunks (every 3 or so sentences)
function splitDialogIntoChunks(entry) {
  if (!entry || typeof entry.text !== "string") {
    console.warn("Invalid entry.text in splitDialogIntoChunks:", entry);
    return [];
  }

  // Handle intentional double line breaks
  const paragraphs = entry.text.split(/\n{2,}/g);

  const chunks = paragraphs.map((para, index) => ({
    text: para.trim(),
    image: index === paragraphs.length - 1 ? entry.image || null : null,
    title: entry.title || ""
  }));

  // If no intentional breaks, fallback to sentence grouping
  if (chunks.length === 1) {
    const safeAbbreviations = /\b(?:Mr|Ms|Mrs|Dr|Jr|Sr|St|J\.K|e\.g|i\.e)\./gi;
    const placeholder = "<<<DOT>>>";
    const safeText = entry.text.replace(safeAbbreviations, (match) =>
      match.replace(/\./g, placeholder)
    );

    const rawSentences = safeText.split(/(?<=[.?!])\s+(?=[A-Z])/);
    const fixedSentences = rawSentences.map(s =>
      s.replace(new RegExp(placeholder, "g"), ".").trim()
    );

    const grouped = [];
    for (let i = 0; i < fixedSentences.length; i += 2) {
      const group = fixedSentences.slice(i, i + 2).join(" ").trim();
      grouped.push({
        text: group,
        image: null,
        title: entry.title || ""
      });
    }

    if (entry.image && grouped.length > 0) {
      grouped[grouped.length - 1].image = entry.image;
    }
    return grouped;
  }
  return chunks;
}

// Helper function that replaces the user's placeholder firstname text with their actual firstname
function updateFirstNameStr(str) {
  return str.replaceAll(firstNamePlaceholder, firstName);
}


//----------------------------------
//  Mentor Chat Handlers
//----------------------------------
// Used to dynamically create a new mentor message
function addMentorMessage(text, image, title, mood){

  const chatMain = document.getElementById("chat-main");
  const wrapper = document.createElement("div");
  const validMoods = ["default", "happy", "curious", "angry", "sad"];
  const messageBlock = document.createElement("div");
  const message = document.createElement("div");

  wrapper.classList.add("message-wrapper", "mentor"); 
  message.classList.add("mentor-message", "mentor");

  // If mood isn't set by the user's response, 
  // check for a mood based on the mentor's dialog
  if(mood === undefined){
    mood = detectMentorMood(text);
  }

  chatMain.appendChild(wrapper);  
  messageBlock.classList.add("message-block");

  if (text) {
    message.innerHTML = text;
    messageBlock.appendChild(message);
  }    
  if (image) {

    const imageElement = document.createElement("img");
    imageElement.src = `images/${image}`;
    imageElement.alt = title || "Mentor Image";
    imageElement.title = title || "Mentor Image";
    imageElement.classList.add("inline-image");
    messageBlock.appendChild(imageElement); 

    imageElement.onload = () => {
      scrollToWindowBottom();
    };       
    
    //Add emoji bar for images only
    const emojiBar = createEmojiBar(); 
    messageBlock.appendChild(emojiBar); 

  }else{
    scrollToWindowBottom();
  }
  
  wrapper.appendChild(messageBlock);

  const avatar = document.createElement("img");
  avatar.src = validMoods.includes(mood)
    ? `images/${mood}.png`
    : "images/default.png";
  avatar.alt = `${mentorName}`;
  avatar.classList.add("avatar");

  wrapper.insertBefore(avatar, messageBlock);
  scrollToWindowBottom();
}

// Shows a randomized personal message based on the topic of interest
function showRandomizedPersonalMsg(topic) {
  const responses = mentorPersonalResponses[topic];
  const anyVisited = responses.some(r => r.visited);

  if (anyVisited) {
    showAlreadyVisitedMsg();
    return;
  }

  const randObj = pickRandom(responses);
  randObj.visited = true;

  processMessageQueue(randObj, null, true);
}

// Used to show the mentor's response 
function showMentorResponse(option, source) {
  
  const key = option.key;
  const isQuiz = source === "quiz";

  // Determine response set (AI or static)
  const responseSet = getActiveQuizResponseSet();
  const data = responseSet[key];

  // Fallback for static responses only (for mentor or backup)
  const styleKey = isQuiz ? userLeadershipStyle[0] : mentorLeadershipStyle;
  const responses = isQuiz ? mentorQuizResponses : mentorLeadershipResponses;
  const entry = responses.find(m => m.style === styleKey);

  // If we don't have data from either set...
  if (!data && (!entry || !entry[key])) {
    addDivider();
    addMentorMessage(unsureStr);
    returnToActiveMenu();
    return;
  }

  const topic = data || entry[key];

  if (Array.isArray(topic.list)) {
    const anyVisited = topic.list.some(item => item.visited);
    if (anyVisited) {
      showAlreadyVisitedMsg();
      return;
    }

    const randItem = pickRandom(topic.list);
    topic.visited = true;

    // Handles quiz responses for books & quotes
    if (isQuiz) {
      const intro =
        key === "books"
          ? "I think you might like this book:<br>"
          : key === "quotes"
          ? "Here's a quote that might reflect your style:<br>"
          : "";

      processMessageQueue({ text: intro + randItem }, null, true);
    } else {
      processMessageQueue({ text: randItem }, null, true);
    }
    return;
  }

  // Let users to select a topic again, but don't repeat message
  if (topic.visited) {
    showAlreadyVisitedMsg();
    return;
  }

  topic.visited = true;
  processMessageQueue(topic, null, true);
}

// Helper function that is used to determine which array object to pull from when the mentor is responding to the user
function getActiveQuizResponseSet() {
   const isBlended = Array.isArray(userLeadershipStyle) && userLeadershipStyle.length > 1;
  return isBlended ? aiMentorQuizResponse : mentorQuizResponses;
}

// Helper function that is used to show the mentor's facial expression, which is based on certain keywords
function detectMentorMood(message) {

  if(message === null) return "default";
  const normalized = message.toLowerCase();  

  for (const [mood, keywords] of Object.entries(moodMap)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
      if (regex.test(normalized)) {
        return mood;
      }
    }
  }  
  return "default";
}

// Helper funciton that's used to escape special characters in keywords
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Helper function that specifies the user has already talked about a particular topic
function showAlreadyVisitedMsg(){

    const msg = pickRandom(alreadyTalkedAboutLines);

    addDivider();
    processMessageQueue({ text: msg }, () => {
      returnToActiveMenu();
    });    
}

// Mentor will randomly respond to the user's input with an emoji, based on certain keywords they respond with
function maybeReactToUserMessage(userInput) {

  const input = userInput.toLowerCase();
  const keywords = [...moodMap.happy, ...moodMap.curious];

  if (keywords.some(word => input.includes(word)) && Math.random() < REACTION_CHANCE) {

    const emojis = ["❤️", "👍", "✨"];
    const emoji = pickRandom(emojis);
    const chatMain = document.getElementById("chat-main");
    const messages = chatMain.querySelectorAll(".message.user");
    const lastMsg = messages[messages.length - 1];

    if (lastMsg) {
      const messageBlock = lastMsg.closest(".message-block"); 
      const reaction = document.createElement("span");

      reaction.classList.add("mentor-emoji-reaction");
      reaction.textContent = emoji;

      if (messageBlock) {
        messageBlock.appendChild(reaction); 
      }
    }
  }
}

//----------------------------------
//  User Chat Message Handlers
//----------------------------------
// Used to dynamically create a new user message
function addUserMessage(text) {

  const chatMain = document.getElementById("chat-main");
  const wrapper = document.createElement("div");
  const messageBlock = document.createElement("div");
  const message = document.createElement("div");

  wrapper.classList.add("message-wrapper-user", "user");  
  messageBlock.classList.add("message-block");

  message.classList.add("message", "user");
  message.innerHTML = text;

  messageBlock.appendChild(message);
  wrapper.appendChild(messageBlock);
  chatMain.appendChild(wrapper);

  scrollToWindowBottom();
}

//----------------------------------
//  Button Option Handlers
//----------------------------------
// Dynamically generates buttons
function addOptionButtons(options, onClick, isQuiz = false) {

  const wrapper = document.createElement("div");
  wrapper.classList.add("chat-options");

  options.forEach(option => {

    const btn = document.createElement("button");
    btn.classList.add("chat-btn");
    btn.innerHTML = option.label;

    const plainTextTitle = option.label.replace(/<\/?[^>]+(>|$)/g, "");
    btn.title = plainTextTitle;

    // Show buttons have been visited (excluding the objects in the array below)
    const showVisitedIcon = !isQuiz && visitedOptions.has(option.id)
      && !["main", "quiz_quit", "quiz_retake", "leadership_back", 
           "leadership_next", "quiz_next", "quiz_back",
           "personalQuestionMenu", "leadershipStyleMenu", "quizMenu",
           "startQuiz", "freeQuestion"
          ].includes(option.id);

    if (showVisitedIcon) {
      const eye = document.createElement("i");
      eye.classList.add("fa-regular", "fa-eye", "visited-eye");
      btn.appendChild(eye);
    }

    // Disable the buttons upon clicking any button
    btn.addEventListener("click", () => {
      const allButtons = wrapper.querySelectorAll("button");
      allButtons.forEach(b => {
        b.disabled = true;
        b.classList.add("disabled");
      });

      addUserMessage(option.label);
      visitedOptions.add(option.id);

      if (typeof onClick === "function") {
        onClick(option);
      }
    });

    wrapper.appendChild(btn);
  });

  document.getElementById("chat-main").appendChild(wrapper);

  requestAnimationFrame(() => {
    wrapper.classList.add("visible");
    void wrapper.offsetHeight;
  });

  setTimeout(() => {
    scrollToWindowBottom();
  }, 2100);
}


//----------------------------------
//  User Input Field Handlers
//----------------------------------
// Creates an input field where the user can enter a message; defaults to satic responses
function addInputField(onSubmit) {

  // Remove any existing input fields
  document.querySelectorAll(".chat-input-container").forEach(el => el.remove());

  const container = document.createElement("div");
  container.classList.add("chat-input-container");

  const textarea = document.createElement("textarea");
  textarea.classList.add("chat-input");
  textarea.maxLength = 300;
  textarea.placeholder = "Type your response...";

  const button = document.createElement("button");
  button.classList.add("chat-submit");
  button.title = "Submit";
  button.innerHTML = '<i class="fas fa-paper-plane"></i>';

  button.addEventListener("click", () => {
    const userInput = textarea.value.trim();

    if (userInput) {
      container.remove(); // Remove the container after submit

      if (typeof onSubmit === "function") {
        onSubmit(userInput); 
        maybeReactToUserMessage(userInput);
      }
    }
  });

  container.appendChild(textarea);
  container.appendChild(button);
  document.getElementById("chat-main").appendChild(container);
  scrollToWindowBottom();
  textarea.focus();
}

// Used to provide responses to a "free-form" question asked by the user; response will be either AI or static
async function handleCustomInputFromUser() {

  const bridge = pickRandom(backToMenuBridgeLines);

  processMessageQueue({ text: pickRandom(personalMenuPrompts) }, () => {

    addInputField(async (userInput) => {
      addUserMessage(userInput);

      // Attempt to show an AI response
      if (sessionPromptCount < MAX_SESSION_PROMPTS) {
        const prompt = generateFreeformAiPrompt(userInput, mentorLeadershipStyle);
        const aiResponse = await sendToGemini(prompt);
        sessionPromptCount++;

        processMessageQueue({ text: aiResponse }, () => {
          addDivider();
          setTimeout(() => {
            processMessageQueue({ text: bridge }, () => {
              returnToActiveMenu();
            });
          }, 1000);
        });
      }      
    });
  });
}

// Helper function that provides a static response when the user answers the mentor's question
function handleInputWithMentorReply() {

  addInputField((userInput) => {
    addUserMessage(userInput);

    const reply = getInsightfulResponse(userInput);

    processMessageQueue({ text: reply }, () => {
      addDivider();

      setTimeout(()=>{
        const bridge = pickRandom(backToMenuBridgeLines);
          processMessageQueue({ text: bridge }, () => {
            returnToActiveMenu();
          });
      }, 1000);
 
    });
  });
}

// Used to help determine a static mentor response to the user's response 
function getInsightfulResponse(userInput) {
  const input = userInput.toLowerCase().trim();

  if (isGibberish(input)) return pickRandom(insightfulResponses.gibberish);

  const mood = detectMentorMood(input, moodMap); 
  return pickRandom(insightfulResponses[mood] || insightfulResponses.default);
}

// Used to determine if the user is speaking 'gibberish'
function isGibberish(text) {

  const vowelCount = (text.match(/[aeiou]/gi) || []).length;
  const letterCount = (text.match(/[a-z]/gi) || []).length;

  // If almost no vowels, very short, or mostly symbols, it's likely gibberish
  return (
    text.length < 3 ||
    vowelCount < 1 ||
    /[^\w\s]/g.test(text) && letterCount < 4
  );
}


//----------------------------------
//  Quiz Handlers
//----------------------------------
// Quiz entry point
function startQuiz() {

  const available = [...quizQuestions];
  const selected = [];

  // Reset visited flag on all questions
  quizQuestions.forEach(q => q.visited = false);

  // Randomize the quiz questions and save to the 'selected' array
  while (selected.length < MAX_QUIZ_QUESTIONS && available.length > 0) {
    const randIndex = Math.floor(Math.random() * available.length);
    const question = available.splice(randIndex, 1)[0];
    selected.push(question);
  }

  // Reset the quiz session each time
  quizSession = {
    questionList: selected,
    currentIndex: 0
  };

  // Reset the user's score each time
  Object.keys(userScores).forEach(key => {
    userScores[key] = 0;
  });

  // Reset the visited button options at the start of the quiz
  resetQuizVisitedOptions();

  presentQuizQuestion();
}

// Used to display the quiz question and responses
function presentQuizQuestion() {

  const { questionList, currentIndex } = quizSession;

  if (!questionList || currentIndex >= questionList.length) {
    finishQuiz();
    return;
  }

  const q = questionList[currentIndex];
  const questionNum = currentIndex + 1;

  // Mark the question as visited
  q.visited = true;

  const options = q.choices.map(choice => ({
    id: choice.id,
    key: q.id,
    label: choice.label
  }));

  options.push({
    id: "quiz_quit",
    key: "main",
    label: mainMenuStr
  });

  processMessageQueue(
    { text: `(Question ${questionNum} of ${MAX_QUIZ_QUESTIONS})<br>${q.prompt}` },
    () => {
      addOptionButtons(options, handleQuizChoice, true);
    }
  );
}

// Used to handle the user's quiz selection choice
function handleQuizChoice(option) {

  const { id } = option;

  if (id === "quiz_quit") {
    quizTaken = false;

    //Reset the quiz responses array
    resetQuizResponseVisits();

    processMessageQueue({ text: `No problem, ${firstName}, we can come back to this anytime.` }, () => {
      addDivider();
      showMainMenu();
    });
    return;
  }

  const currentQuestion = quizSession.questionList[quizSession.currentIndex];
  const selectedChoice = currentQuestion.choices.find(c => c.id === id);

  // Update the user's leadership scores
  selectedChoice.styles.forEach(style => {
    if (userScores.hasOwnProperty(style)) {
      userScores[style]++;
    }
  });

  quizSession.currentIndex++;

  if (quizSession.currentIndex >= quizSession.questionList.length) {
    finishQuiz();
  } else {
    presentQuizQuestion();
  }
}

// Used to determine the user's leadership style and sets the mentor's response type (built-in feedback or AI feedback)
async function finishQuiz() {
  const result = determineLeadershipStyle(userScores);
  const { style, method } = result;

  userLeadershipStyle = style;

  const message = method === "static"
    ? "Based on your responses, I have a good sense of your leadership style. Is there anything you'd like to talk about?"
    : "Based on your responses, you show a blend of leadership traits. Is there anything you'd like to talk about?";

  addDivider();

  processMessageQueue({ text: `Your responses are really interesting, ${firstName}! ` + message }, async () => {
     
    if (method === "ai" && sessionPromptCount < MAX_SESSION_PROMPTS) {
      const prompt = generateQuizResultsAiPrompt(style);
      const response = await sendToGemini(prompt);
      sessionPromptCount++;

      try {
        const cleaned = cleanGeminiJsonResponse(response);
        const parsed = JSON.parse(cleaned);

        for (let key in parsed) {
          if (aiMentorQuizResponse[key]) {
            if (Array.isArray(parsed[key])) {
              aiMentorQuizResponse[key].list = parsed[key];
            } else {
              aiMentorQuizResponse[key].text = parsed[key];
            }
          }
        }
      } catch (err) {
        console.warn("Failed to parse AI response:", err);
      }
    }
    returnToActiveMenu();
  });
}

// Helper function that resets the quiz response visits which is needed when users retake the quiz
function resetQuizResponseVisits() {
  [mentorQuizResponses, aiMentorQuizResponse].forEach(responseSet => {
    for (const key in responseSet) {
      const topic = responseSet[key];

      if (topic && typeof topic === "object" && "visited" in topic) {
        topic.visited = false;
      }
    }
  });
}

// Resets 'visited' icon on the buttons when the quiz is reset
function resetQuizVisitedOptions() {
  const quizIdsToReset = [
    "quiz_leadershipStyle",
    "quiz_challenges",
    "quiz_conflictResolution",
    "quiz_motivation",
    "quiz_communication",
    "quiz_feedback",
    "quiz_books",
    "quiz_quotes"
  ];

  quizIdsToReset.forEach(id => visitedOptions.delete(id));
}

// Helper function that is used to determine the user's leadership style
function determineLeadershipStyle(scores) {

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [topStyle, topScore] = sorted[0];
  const [secondStyle, secondScore] = sorted[1];
  const isClearWinner = topScore - secondScore >= DOMINANT_THRESHOLD;

  // If there's one clear style, specify we want to use built-in (static) responses
  if (isClearWinner) {
    return {
      style: [topStyle],
      method: "static"
    };
  } 
  // Else, if the user has a blended leadership style, use AI responses
  else {
    return {
      style: [topStyle, secondStyle],
      method: "ai"
    };
  }
}

// Helper method used to clean a JSON response that has been returned from Gemini
// Removes starting and trailing ```
function cleanGeminiJsonResponse(text) {
  return text
    .replace(/```json\s*/i, "")
    .replace(/```$/, "")        
    .trim();
}


//----------------------------------
//  Misc. Helper Functions
//----------------------------------
// Helper function used to pick a random element from an array 
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function that scrolls to the bottom of the chat log
function scrollToWindowBottom(){
  const chatBody = document.getElementById("chat-body");
  chatBody.scrollTop = chatBody.scrollHeight;    
}

// Adds a visual divider
function addDivider() {
  const divider = document.createElement("hr");
  divider.classList.add("divider");
  document.getElementById("chat-main").appendChild(divider);
}

// Used to create an emoji bar 
function createEmojiBar(){

  const emojiBar = document.createElement("div");
  emojiBar.classList.add("emoji-bar");

  ["👍", "❤️", "😂", "😮", "😢"].forEach(emoji => {
    const btn = document.createElement("button");
    btn.innerHTML = emoji;

    btn.addEventListener("click", () => {
      emojiBar.classList.add("disabled");

      const reaction = document.createElement("div");
      reaction.classList.add("emoji-reaction");
      reaction.innerHTML = emoji;
    
      emojiBar.parentElement.appendChild(reaction);
    });

    emojiBar.appendChild(btn);
  });

  return emojiBar;
}