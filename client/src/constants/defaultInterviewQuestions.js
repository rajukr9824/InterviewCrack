export const DEFAULT_INTERVIEW_QUESTIONS = {
  OOPS: [
    {
      question: "What is Object-Oriented Programming?",
      solution:
        "Object-Oriented Programming is a paradigm based on objects that contain data and methods to operate on that data.",
    },
    {
      question: "What are the four pillars of OOPS?",
      solution:
        "Encapsulation, Inheritance, Polymorphism, and Abstraction.",
    },
    {
      question: "What is encapsulation?",
      solution:
        "Encapsulation is wrapping data and methods together and restricting direct access to data.",
    },
    {
      question: "What is inheritance?",
      solution:
        "Inheritance allows one class to acquire properties and behavior of another class.",
    },
    {
      question: "What is polymorphism?",
      solution:
        "Polymorphism allows the same method to behave differently based on the object.",
    },
    {
      question: "What is abstraction?",
      solution:
        "Abstraction hides implementation details and shows only essential features.",
    },
    {
      question: "Difference between method overloading and overriding?",
      solution:
        "Overloading happens in the same class, overriding happens in subclass.",
    },
    {
      question: "What is a class?",
      solution:
        "A class is a blueprint for creating objects.",
    },
    {
      question: "What is an object?",
      solution:
        "An object is an instance of a class.",
    },
    {
      question: "What is a constructor?",
      solution:
        "A constructor initializes objects when they are created.",
    },
  ],

  "Operating System": [
    {
      question: "What is an operating system?",
      solution:
        "An OS manages hardware resources and provides services to applications.",
    },
    {
      question: "What is a process?",
      solution:
        "A process is a program under execution.",
    },
    {
      question: "What is a thread?",
      solution:
        "A thread is a lightweight process that shares memory.",
    },
    {
      question: "Difference between process and thread?",
      solution:
        "Processes are heavyweight, threads are lightweight and share memory.",
    },
    {
      question: "What is deadlock?",
      solution:
        "Deadlock is a situation where processes wait indefinitely for resources.",
    },
    {
      question: "What are the conditions for deadlock?",
      solution:
        "Mutual exclusion, hold and wait, no preemption, circular wait.",
    },
    {
      question: "What is scheduling?",
      solution:
        "Scheduling decides which process gets CPU time.",
    },
    {
      question: "What is virtual memory?",
      solution:
        "Virtual memory uses disk space as an extension of RAM.",
    },
    {
      question: "What is context switching?",
      solution:
        "Switching CPU from one process to another.",
    },
    {
      question: "What is semaphore?",
      solution:
        "A synchronization mechanism to control access to shared resources.",
    },
  ],

  DBMS: [
    {
      question: "What is DBMS?",
      solution:
        "DBMS is software used to store, retrieve, and manage data efficiently.",
    },
    {
      question: "What are ACID properties?",
      solution:
        "Atomicity, Consistency, Isolation, and Durability.",
    },
    {
      question: "What is normalization?",
      solution:
        "Normalization reduces redundancy and improves data integrity.",
    },
    {
      question: "What is a primary key?",
      solution:
        "A primary key uniquely identifies each record.",
    },
    {
      question: "What is a foreign key?",
      solution:
        "A foreign key references the primary key of another table.",
    },
    {
      question: "Difference between DELETE and TRUNCATE?",
      solution:
        "DELETE removes specific rows, TRUNCATE removes all rows instantly.",
    },
    {
      question: "What is indexing?",
      solution:
        "Indexing improves the speed of data retrieval.",
    },
    {
      question: "What is a join?",
      solution:
        "A join combines rows from multiple tables.",
    },
    {
      question: "What is a transaction?",
      solution:
        "A transaction is a logical unit of database operations.",
    },
    {
      question: "What is SQL?",
      solution:
        "SQL is used to communicate with relational databases.",
    },
  ],

  "Computer Network": [
    {
      question: "What is a computer network?",
      solution:
        "A computer network connects multiple devices to share data.",
    },
    {
      question: "Explain OSI model.",
      solution:
        "OSI has 7 layers: Physical to Application.",
    },
    {
      question: "Difference between TCP and UDP?",
      solution:
        "TCP is reliable and connection-oriented, UDP is faster and connectionless.",
    },
    {
      question: "What is IP address?",
      solution:
        "A unique identifier assigned to devices on a network.",
    },
    {
      question: "What is DNS?",
      solution:
        "DNS converts domain names to IP addresses.",
    },
    {
      question: "What is HTTP?",
      solution:
        "HTTP is a protocol for transferring web data.",
    },
    {
      question: "What is HTTPS?",
      solution:
        "HTTPS is secure HTTP using SSL/TLS.",
    },
    {
      question: "What is router?",
      solution:
        "A router forwards data between networks.",
    },
    {
      question: "What is bandwidth?",
      solution:
        "Maximum data transfer rate of a network.",
    },
    {
      question: "What is latency?",
      solution:
        "Delay in data transmission.",
    },
  ],

  DSA: [
    {
      question: "What is a data structure?",
      solution:
        "A way to organize and store data efficiently.",
    },
    {
      question: "Difference between array and linked list?",
      solution:
        "Arrays use contiguous memory, linked lists use pointers.",
    },
    {
      question: "What is stack?",
      solution:
        "A LIFO data structure.",
    },
    {
      question: "What is queue?",
      solution:
        "A FIFO data structure.",
    },
    {
      question: "What is time complexity?",
      solution:
        "It measures algorithm efficiency.",
    },
    {
      question: "What is binary search?",
      solution:
        "A searching technique with O(log n) time complexity.",
    },
    {
      question: "What is recursion?",
      solution:
        "A function calling itself.",
    },
    {
      question: "Difference between BFS and DFS?",
      solution:
        "BFS uses queue, DFS uses stack/recursion.",
    },
    {
      question: "What is hashing?",
      solution:
        "Mapping data to fixed-size values.",
    },
    {
      question: "What is sorting?",
      solution:
        "Arranging data in a particular order.",
    },
  ],

  JavaScript: [
    {
      question: "What is JavaScript?",
      solution:
        "JavaScript is a scripting language used to build interactive web applications.",
    },
    {
      question: "What is closure?",
      solution:
        "A function with access to its outer scope.",
    },
    {
      question: "What is hoisting?",
      solution:
        "Moving variable and function declarations to the top.",
    },
    {
      question: "Difference between == and ===?",
      solution:
        "== checks value, === checks value and type.",
    },
    {
      question: "What is event loop?",
      solution:
        "Handles asynchronous operations in JavaScript.",
    },
    {
      question: "What is promise?",
      solution:
        "An object representing a future value.",
    },
    {
      question: "What is async/await?",
      solution:
        "Syntax for handling promises cleanly.",
    },
    {
      question: "What is scope?",
      solution:
        "Defines where variables can be accessed.",
    },
    {
      question: "What is NaN?",
      solution:
        "Represents an invalid number.",
    },
    {
      question: "What is debounce?",
      solution:
        "Limits function execution frequency.",
    },
  ],

  "MERN Stack": [
    {
      question: "What is MERN stack?",
      solution:
        "MERN stands for MongoDB, Express, React, and Node.js.",
    },
    {
      question: "Role of MongoDB in MERN?",
      solution:
        "MongoDB stores application data as documents.",
    },
    {
      question: "What is Express?",
      solution:
        "A Node.js framework for building APIs.",
    },
    {
      question: "What is Node.js?",
      solution:
        "A JavaScript runtime built on Chrome V8 engine.",
    },
    {
      question: "What is REST API?",
      solution:
        "An API that follows REST architectural principles.",
    },
    {
      question: "How does React communicate with backend?",
      solution:
        "Using HTTP requests (Axios or Fetch).",
    },
    {
      question: "What is middleware?",
      solution:
        "Functions that execute between request and response.",
    },
    {
      question: "What is JWT?",
      solution:
        "JSON Web Token used for authentication.",
    },
    {
      question: "What is MVC architecture?",
      solution:
        "Model-View-Controller separates concerns.",
    },
    {
      question: "How do you secure MERN apps?",
      solution:
        "Using JWT, hashing passwords, and validation.",
    },
  ],
  HR: [
  {
    question: "Tell me about yourself.",
    solution:
      "Briefly explain your background, skills, and career goals.",
  },
  {
    question: "What are your strengths?",
    solution:
      "Mention strengths relevant to the job with examples.",
  },
  {
    question: "What are your weaknesses?",
    solution:
      "Share a real weakness and how you are improving it.",
  },
  {
    question: "Why should we hire you?",
    solution:
      "Explain how your skills and attitude match the role.",
  },
  {
    question: "Where do you see yourself in 5 years?",
    solution:
      "Describe realistic career growth aligned with the company.",
  },
  {
    question: "How do you handle pressure?",
    solution:
      "By prioritizing tasks and staying calm under deadlines.",
  },
  {
    question: "Why do you want to join our company?",
    solution:
      "Because of growth opportunities and company values.",
  },
  {
    question: "Describe a challenge you faced.",
    solution:
      "Explain a problem and how you solved it positively.",
  },
  {
    question: "Are you open to relocation?",
    solution:
      "Answer honestly based on your situation.",
  },
  {
    question: "Do you have any questions for us?",
    solution:
      "Ask about role expectations or growth opportunities.",
  },
],
"Mock Interview": [
  {
    question: "Explain your final year project.",
    solution:
      "Describe the problem, solution, tech stack, and impact.",
  },
  {
    question: "What is your strongest technical skill?",
    solution:
      "Mention a skill you are confident in with examples.",
  },
  {
    question: "Explain a difficult bug you fixed.",
    solution:
      "Describe the issue, debugging steps, and resolution.",
  },
  {
    question: "What is REST API?",
    solution:
      "An API that follows REST principles using HTTP methods.",
  },
  {
    question: "How do you manage deadlines?",
    solution:
      "By planning tasks and tracking progress regularly.",
  },
  {
    question: "Explain OOP concepts.",
    solution:
      "Encapsulation, inheritance, polymorphism, abstraction.",
  },
  {
    question: "How do you handle failure?",
    solution:
      "By learning from mistakes and improving continuously.",
  },
  {
    question: "What happens when you type a URL in browser?",
    solution:
      "DNS lookup, server request, response, rendering.",
  },
  {
    question: "Why should we select you over others?",
    solution:
      "Strong fundamentals, learning mindset, and consistency.",
  },
  {
    question: "Are you comfortable working in a team?",
    solution:
      "Yes, I communicate clearly and collaborate effectively.",
  },
],
"Python and AI/ML": [
  {
    question: "What is Python?",
    solution:
      "A high-level programming language used for automation and ML.",
  },
  {
    question: "Why is Python popular in AI/ML?",
    solution:
      "Simple syntax and strong library support.",
  },
  {
    question: "What is NumPy?",
    solution:
      "A library for numerical computing in Python.",
  },
  {
    question: "What is Pandas?",
    solution:
      "Used for data manipulation and analysis.",
  },
  {
    question: "What is Machine Learning?",
    solution:
      "Teaching machines to learn from data.",
  },
  {
    question: "Difference between supervised and unsupervised learning?",
    solution:
      "Supervised uses labeled data, unsupervised does not.",
  },
  {
    question: "What is overfitting?",
    solution:
      "Model performs well on training but poorly on new data.",
  },
  {
    question: "What is a feature?",
    solution:
      "An input variable used for prediction.",
  },
  {
    question: "What is train-test split?",
    solution:
      "Dividing data for training and evaluation.",
  },
  {
    question: "What is deep learning?",
    solution:
      "A subset of ML using neural networks.",
  },
],



};
