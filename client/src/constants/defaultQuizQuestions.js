export const DEFAULT_QUIZ_QUESTIONS = {
  OOPS: [
    {
      question: "Which OOP principle supports code reusability?",
      options: ["Encapsulation", "Inheritance", "Abstraction", "Polymorphism"],
      correct: 1,
    },
    {
      question: "What is encapsulation?",
      options: [
        "Wrapping data and methods together",
        "Multiple inheritance",
        "Method overloading",
        "Code optimization",
      ],
      correct: 0,
    },
    {
      question: "Which feature allows same function name with different behavior?",
      options: ["Inheritance", "Encapsulation", "Polymorphism", "Abstraction"],
      correct: 2,
    },
    {
      question: "Which OOP concept hides implementation details?",
      options: ["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"],
      correct: 1,
    },
    {
      question: "What is inheritance?",
      options: [
        "Reusing properties of an existing class",
        "Hiding data",
        "Binding methods",
        "Overloading methods",
      ],
      correct: 0,
    },
    {
      question: "Which keyword is used to achieve inheritance in Java?",
      options: ["this", "super", "extends", "implements"],
      correct: 2,
    },
    {
      question: "Method overloading is an example of?",
      options: ["Encapsulation", "Inheritance", "Compile-time polymorphism", "Runtime polymorphism"],
      correct: 2,
    },
    {
      question: "Method overriding is related to?",
      options: ["Abstraction", "Runtime polymorphism", "Encapsulation", "Overloading"],
      correct: 1,
    },
    {
      question: "Which access modifier allows access only within the class?",
      options: ["public", "protected", "default", "private"],
      correct: 3,
    },
    {
      question: "What is an object?",
      options: [
        "Instance of a class",
        "Blueprint",
        "Method",
        "Variable",
      ],
      correct: 0,
    },
  ],

  "Operating System": [
    {
      question: "What is an operating system?",
      options: [
        "Manages hardware and software resources",
        "A compiler",
        "A database",
        "An application",
      ],
      correct: 0,
    },
    {
      question: "What is a process?",
      options: [
        "A program in execution",
        "A compiler",
        "A thread",
        "A CPU register",
      ],
      correct: 0,
    },
    {
      question: "What is a thread?",
      options: [
        "Lightweight process",
        "Heavy process",
        "CPU core",
        "Scheduler",
      ],
      correct: 0,
    },
    {
      question: "Which scheduling algorithm is preemptive?",
      options: ["FCFS", "SJF", "Round Robin", "FIFO"],
      correct: 2,
    },
    {
      question: "What is deadlock?",
      options: [
        "Infinite waiting for resources",
        "CPU overload",
        "Memory leak",
        "Disk failure",
      ],
      correct: 0,
    },
    {
      question: "Which condition is necessary for deadlock?",
      options: [
        "Mutual exclusion",
        "Preemption",
        "Starvation",
        "Paging",
      ],
      correct: 0,
    },
    {
      question: "What is context switching?",
      options: [
        "Switching CPU between processes",
        "Switching memory",
        "Switching users",
        "Switching files",
      ],
      correct: 0,
    },
    {
      question: "What is virtual memory?",
      options: [
        "Uses disk as RAM extension",
        "Cache memory",
        "ROM memory",
        "Register memory",
      ],
      correct: 0,
    },
    {
      question: "Which OS is open source?",
      options: ["Windows", "Linux", "macOS", "DOS"],
      correct: 1,
    },
    {
      question: "What is a semaphore?",
      options: [
        "Synchronization tool",
        "Scheduling algorithm",
        "Memory unit",
        "File system",
      ],
      correct: 0,
    },
  ],

  DBMS: [
    {
      question: "What is DBMS?",
      options: [
        "System to manage databases",
        "Programming language",
        "Compiler",
        "Operating system",
      ],
      correct: 0,
    },
    {
      question: "What does ACID stand for?",
      options: [
        "Atomicity, Consistency, Isolation, Durability",
        "Accuracy, Clarity, Integrity, Durability",
        "Atomicity, Complexity, Isolation, Data",
        "None",
      ],
      correct: 0,
    },
    {
      question: "Which key uniquely identifies a record?",
      options: ["Foreign Key", "Primary Key", "Candidate Key", "Composite Key"],
      correct: 1,
    },
    {
      question: "What is normalization?",
      options: [
        "Reducing data redundancy",
        "Increasing data duplication",
        "Encrypting data",
        "Indexing data",
      ],
      correct: 0,
    },
    {
      question: "Which normal form removes partial dependency?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correct: 1,
    },
    {
      question: "What is a foreign key?",
      options: [
        "Key referencing another table",
        "Primary identifier",
        "Unique key",
        "Composite key",
      ],
      correct: 0,
    },
    {
      question: "Which SQL command removes all rows but keeps structure?",
      options: ["DELETE", "DROP", "TRUNCATE", "REMOVE"],
      correct: 2,
    },
    {
      question: "Which index improves query performance?",
      options: ["Primary index", "Secondary index", "Both", "None"],
      correct: 2,
    },
    {
      question: "Which SQL clause filters rows?",
      options: ["WHERE", "GROUP BY", "ORDER BY", "HAVING"],
      correct: 0,
    },
    {
      question: "Which join returns matching records only?",
      options: ["Left Join", "Right Join", "Inner Join", "Full Join"],
      correct: 2,
    },
  ],

  "Computer Networks": [
    {
      question: "What is a computer network?",
      options: [
        "Interconnection of devices",
        "Single computer",
        "Server only",
        "Router only",
      ],
      correct: 0,
    },
    {
      question: "How many layers are in OSI model?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
    {
      question: "Which layer handles routing?",
      options: ["Transport", "Network", "Data Link", "Session"],
      correct: 1,
    },
    {
      question: "TCP is?",
      options: ["Reliable", "Unreliable", "Connectionless", "Stateless"],
      correct: 0,
    },
    {
      question: "UDP is?",
      options: ["Reliable", "Connection-oriented", "Fast and unreliable", "Encrypted"],
      correct: 2,
    },
    {
      question: "What is IP address?",
      options: [
        "Unique identifier for devices",
        "MAC address",
        "Domain name",
        "Port number",
      ],
      correct: 0,
    },
    {
      question: "DNS converts?",
      options: [
        "Domain to IP",
        "IP to MAC",
        "MAC to IP",
        "Port to service",
      ],
      correct: 0,
    },
    {
      question: "Which device connects networks?",
      options: ["Switch", "Hub", "Router", "Repeater"],
      correct: 2,
    },
    {
      question: "Which protocol is used for email?",
      options: ["HTTP", "SMTP", "FTP", "SNMP"],
      correct: 1,
    },
    {
      question: "HTTPS uses which protocol?",
      options: ["SSL/TLS", "FTP", "UDP", "SMTP"],
      correct: 0,
    },
  ],

  "Data Structures & Algorithms": [
    {
      question: "What is a data structure?",
      options: [
        "Way to organize data",
        "Algorithm",
        "Program",
        "Function",
      ],
      correct: 0,
    },
    {
      question: "Which data structure uses FIFO?",
      options: ["Stack", "Queue", "Tree", "Graph"],
      correct: 1,
    },
    {
      question: "Which data structure uses LIFO?",
      options: ["Queue", "Stack", "Array", "Linked List"],
      correct: 1,
    },
    {
      question: "Time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
      correct: 1,
    },
    {
      question: "Which algorithm uses divide and conquer?",
      options: ["Bubble sort", "Merge sort", "Insertion sort", "Selection sort"],
      correct: 1,
    },
    {
      question: "Which traversal is DFS?",
      options: ["Stack-based", "Queue-based", "Level-order", "Greedy"],
      correct: 0,
    },
    {
      question: "Which traversal is BFS?",
      options: ["Stack-based", "Queue-based", "Recursive", "Greedy"],
      correct: 1,
    },
    {
      question: "Worst case of quicksort?",
      options: ["O(n)", "O(n log n)", "O(log n)", "O(n²)"],
      correct: 3,
    },
    {
      question: "What is recursion?",
      options: [
        "Function calling itself",
        "Looping",
        "Iteration",
        "Condition",
      ],
      correct: 0,
    },
    {
      question: "Which DS is used for recursion?",
      options: ["Queue", "Stack", "Array", "Graph"],
      correct: 1,
    },
  ],

  React: [
    {
      question: "What is React?",
      options: [
        "JavaScript library for UI",
        "Framework",
        "Database",
        "Language",
      ],
      correct: 0,
    },
    {
      question: "What is JSX?",
      options: [
        "JavaScript XML",
        "JSON syntax",
        "HTML file",
        "React compiler",
      ],
      correct: 0,
    },
    {
      question: "Which hook manages state?",
      options: ["useEffect", "useState", "useRef", "useMemo"],
      correct: 1,
    },
    {
      question: "Which hook runs side effects?",
      options: ["useState", "useEffect", "useMemo", "useRef"],
      correct: 1,
    },
    {
      question: "Props are?",
      options: [
        "Component inputs",
        "Internal state",
        "Hooks",
        "Methods",
      ],
      correct: 0,
    },
    {
      question: "State in React is?",
      options: [
        "Mutable data",
        "Immutable data",
        "Static data",
        "Props",
      ],
      correct: 0,
    },
    {
      question: "Virtual DOM is?",
      options: [
        "Copy of real DOM",
        "Database",
        "Compiler",
        "Server",
      ],
      correct: 0,
    },
    {
      question: "Which improves performance?",
      options: ["Virtual DOM", "Direct DOM", "Manual updates", "Reload"],
      correct: 0,
    },
    {
      question: "Keys are used for?",
      options: [
        "Identifying list items",
        "Styling",
        "Routing",
        "State",
      ],
      correct: 0,
    },
    {
      question: "Which hook memoizes values?",
      options: ["useEffect", "useMemo", "useState", "useRef"],
      correct: 1,
    },
  ],

  JavaScript: [
    {
      question: "What is JavaScript?",
      options: [
        "Scripting language",
        "Markup language",
        "Database",
        "Compiler",
      ],
      correct: 0,
    },
    {
      question: "Which keyword declares block-scoped variable?",
      options: ["var", "let", "const", "static"],
      correct: 1,
    },
    {
      question: "What is closure?",
      options: [
        "Access to outer scope",
        "Function inside function",
        "Memory leak",
        "Async callback",
      ],
      correct: 0,
    },
    {
      question: "What is hoisting?",
      options: [
        "Moving declarations to top",
        "Deleting variables",
        "Looping",
        "Scoping",
      ],
      correct: 0,
    },
    {
      question: "== vs ===?",
      options: [
        "Loose vs strict equality",
        "Assignment",
        "Comparison",
        "Reference check",
      ],
      correct: 0,
    },
    {
      question: "Which is falsy?",
      options: ["0", "{}", "[]", "function"],
      correct: 0,
    },
    {
      question: "What is event loop?",
      options: [
        "Handles async operations",
        "Loop statement",
        "Thread",
        "API",
      ],
      correct: 0,
    },
    {
      question: "Promise represents?",
      options: [
        "Future value",
        "Function",
        "Loop",
        "Object only",
      ],
      correct: 0,
    },
    {
      question: "Which method converts JSON to object?",
      options: ["JSON.parse", "JSON.stringify", "parseInt", "toString"],
      correct: 0,
    },
    {
      question: "Which keyword stops execution?",
      options: ["break", "stop", "exit", "return"],
      correct: 0,
    },
  ],
  Python: [
  {
    question: "What is Python?",
    options: [
      "High-level programming language",
      "Markup language",
      "Database",
      "Compiler",
    ],
    correct: 0,
  },
  {
    question: "Which keyword is used to define a function?",
    options: ["func", "define", "def", "function"],
    correct: 2,
  },
  {
    question: "Which data type is immutable?",
    options: ["List", "Dictionary", "Set", "Tuple"],
    correct: 3,
  },
  {
    question: "What does PEP stand for?",
    options: [
      "Python Execution Program",
      "Python Enhancement Proposal",
      "Program Error Process",
      "Python Easy Practice",
    ],
    correct: 1,
  },
  {
    question: "Which keyword is used for inheritance?",
    options: ["extends", "inherits", "super", "class"],
    correct: 3,
  },
  {
    question: "What is used to handle exceptions?",
    options: ["if-else", "try-except", "loop", "error"],
    correct: 1,
  },
  {
    question: "Which library is used for arrays?",
    options: ["Pandas", "NumPy", "Matplotlib", "Seaborn"],
    correct: 1,
  },
  {
    question: "Which symbol is used for comments?",
    options: ["//", "#", "/* */", "<!-- -->"],
    correct: 1,
  },
  {
    question: "What is list comprehension?",
    options: [
      "Short syntax for lists",
      "Sorting method",
      "Loop",
      "Iterator",
    ],
    correct: 0,
  },
  {
    question: "What does len() do?",
    options: [
      "Returns length",
      "Sorts list",
      "Deletes element",
      "Adds element",
    ],
    correct: 0,
  },
],
Java: [
  {
    question: "What is Java?",
    options: [
      "Object-oriented language",
      "Markup language",
      "Database",
      "Script only",
    ],
    correct: 0,
  },
  {
    question: "Which keyword is used to inherit a class?",
    options: ["this", "extends", "implements", "super"],
    correct: 1,
  },
  {
    question: "Which method is entry point of Java program?",
    options: ["start()", "run()", "main()", "init()"],
    correct: 2,
  },
  {
    question: "What is JVM?",
    options: [
      "Java Variable Manager",
      "Java Virtual Machine",
      "Java Visual Model",
      "Java Version Manager",
    ],
    correct: 1,
  },
  {
    question: "Which is not OOP concept?",
    options: ["Encapsulation", "Polymorphism", "Inheritance", "Compilation"],
    correct: 3,
  },
  {
    question: "Which access modifier is most restrictive?",
    options: ["public", "protected", "default", "private"],
    correct: 3,
  },
  {
    question: "Which keyword creates object?",
    options: ["class", "new", "object", "this"],
    correct: 1,
  },
  {
    question: "What is method overloading?",
    options: [
      "Same method name, different parameters",
      "Same return type",
      "Runtime binding",
      "Inheritance",
    ],
    correct: 0,
  },
  {
    question: "Which collection allows duplicates?",
    options: ["Set", "Map", "List", "None"],
    correct: 2,
  },
  {
    question: "What is exception?",
    options: [
      "Compile-time error",
      "Runtime error",
      "Syntax error",
      "Warning",
    ],
    correct: 1,
  },
],
"MERN Stack": [
  {
    question: "MERN stands for?",
    options: [
      "MongoDB, Express, React, Node",
      "MySQL, Express, React, Node",
      "MongoDB, Event, React, Node",
      "MongoDB, Express, Redux, Node",
    ],
    correct: 0,
  },
  {
    question: "Which is frontend library?",
    options: ["Node.js", "MongoDB", "React", "Express"],
    correct: 2,
  },
  {
    question: "Which database is used in MERN?",
    options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
    correct: 2,
  },
  {
    question: "What is Express?",
    options: [
      "Database",
      "Frontend framework",
      "Backend framework",
      "Compiler",
    ],
    correct: 2,
  },
  {
    question: "What is Node.js?",
    options: [
      "Browser",
      "JS runtime",
      "Library",
      "Database",
    ],
    correct: 1,
  },
  {
    question: "What does REST API use?",
    options: ["TCP", "HTTP", "FTP", "SMTP"],
    correct: 1,
  },
  {
    question: "Which is used for authentication?",
    options: ["JWT", "HTML", "CSS", "DOM"],
    correct: 0,
  },
  {
    question: "Which hook manages state?",
    options: ["useRef", "useEffect", "useState", "useMemo"],
    correct: 2,
  },
  {
    question: "Which HTTP method updates data?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correct: 2,
  },
  {
    question: "What is middleware?",
    options: [
      "UI layer",
      "Function between req & res",
      "Database",
      "Frontend logic",
    ],
    correct: 1,
  },
],
"AI/ML": [
  {
    question: "What is Artificial Intelligence?",
    options: [
      "Human intelligence",
      "Machine mimicking human intelligence",
      "Hardware",
      "Database",
    ],
    correct: 1,
  },
  {
    question: "What is Machine Learning?",
    options: [
      "Rule-based programming",
      "Learning from data",
      "Manual coding",
      "Automation only",
    ],
    correct: 1,
  },
  {
    question: "Which is supervised learning?",
    options: ["Clustering", "Regression", "PCA", "Association"],
    correct: 1,
  },
  {
    question: "What is overfitting?",
    options: [
      "Good accuracy",
      "Poor training",
      "Model fits noise",
      "Under training",
    ],
    correct: 2,
  },
  {
    question: "Which algorithm is used for classification?",
    options: [
      "Linear Regression",
      "K-Means",
      "Logistic Regression",
      "PCA",
    ],
    correct: 2,
  },
  {
    question: "What is feature?",
    options: [
      "Input variable",
      "Output variable",
      "Error",
      "Algorithm",
    ],
    correct: 0,
  },
  {
    question: "Which library is used for ML?",
    options: ["React", "Flask", "Scikit-learn", "Bootstrap"],
    correct: 2,
  },
  {
    question: "What is train-test split?",
    options: [
      "Model deployment",
      "Data division",
      "Feature scaling",
      "Optimization",
    ],
    correct: 1,
  },
  {
    question: "What is deep learning?",
    options: [
      "Rule-based system",
      "Subset of ML using neural networks",
      "Statistics only",
      "Database technique",
    ],
    correct: 1,
  },
  {
    question: "Which is activation function?",
    options: ["ReLU", "Mean", "Variance", "Gradient"],
    correct: 0,
  },
]


};
