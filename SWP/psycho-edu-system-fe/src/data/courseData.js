export const courseCatalogData = [
  { id: 1, name: "Story And Shared", count: 15 },
  { id: 2, name: "Mental Science", count: 12 },
  { id: 3, name: "Health Development", count: 8 },
  { id: 4, name: "Life Chance", count: 10 },
  { id: 5, name: "Strength Intelligence", count: 7 },
];

export const courseListData = [
  {
    id: 1,
    title: "1 minutes R U OK",
    category: "Story And Shared",
    duration: "6 Topic",
    counselor: "Prof.Thinh",
    type: "Emotional",
    description: "How to check if you are feeling ok today",
    image:
      "https://img.freepik.com/free-photo/expressive-woman-posing-indoor_344912-1878.jpg",
  },
  {
    id: 2,
    title: "4 Perpective On Bullying And Harassment",
    category: "Mental Science",
    duration: "5 Topic",
    counselor: "Dr.Jesyca",
    type: "Physic",
    description: "Learn to manantaince your mind",
    image:
      "https://img.freepik.com/free-photo/expressive-woman-posing-indoor_344912-1878.jpg",
  },
  {
    id: 3,
    title: "Building Mental Resilience",
    category: "Mental Science",
    duration: "8 Topic",
    counselor: "Dr.Emily",
    type: "Online",
    description: "Develop strategies to cope with stress and adversity",
    image:
      "https://img.freepik.com/free-photo/expressive-woman-posing-indoor_344912-1878.jpg",
  },
  {
    id: 4,
    title: "Healthy Lifestyle Habits",
    category: "Health Development",
    duration: "7 Topic",
    counselor: "Prof.Thinh",
    type: "Hybrid",
    description: "Create and maintain healthy daily routines",
    image:
      "https://img.freepik.com/free-photo/expressive-woman-posing-indoor_344912-1878.jpg",
  },
  {
    id: 5,
    title: "Career Path Discovery",
    category: "Life Chance",
    duration: "6 Topic",
    counselor: "Dr.Jesyca",
    type: "In-Person",
    description: "Find your ideal career path through self-discovery",
    image:
      "https://img.freepik.com/free-photo/expressive-woman-posing-indoor_344912-1878.jpg",
  },
];

export const courseTopicsData = {
  1: {
    // courseId
    topics: [
      {
        id: 1,
        title: "Understanding Your Emotions",
        steps: [
          {
            id: 1,
            title: "Identifying Different Emotions",
            content: "Learn to recognize and name various emotional states",
            duration: "15 mins",
          },
          {
            id: 2,
            title: "Emotion Tracking Exercise",
            content: "Daily practice of monitoring your emotional states",
            duration: "10 mins",
          },
        ],
      },
      {
        id: 2,
        title: "Self-Check Techniques",
        steps: [
          {
            id: 1,
            title: "Quick Mental Health Check",
            content: "Simple steps to assess your current mental state",
            duration: "5 mins",
          },
          {
            id: 2,
            title: "Daily Mood Journal",
            content: "Recording and reflecting on daily emotions",
            duration: "10 mins",
          },
        ],
      },
    ],
  },
  2: {
    // courseId
    topics: [
      {
        id: 1,
        title: "Understanding Bullying",
        steps: [
          {
            id: 1,
            title: "Types of Bullying",
            content: "Identifying different forms of bullying behavior",
            duration: "20 mins",
          },
          {
            id: 2,
            title: "Impact Assessment",
            content: "Understanding the effects of bullying on mental health",
            duration: "15 mins",
          },
        ],
      },
      {
        id: 2,
        title: "Prevention Strategies",
        steps: [
          {
            id: 1,
            title: "Building Support Systems",
            content: "Creating networks for prevention and support",
            duration: "25 mins",
          },
          {
            id: 2,
            title: "Intervention Techniques",
            content: "Learning when and how to intervene safely",
            duration: "30 mins",
          },
        ],
      },
    ],
  },
};
