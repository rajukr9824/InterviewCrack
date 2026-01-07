export const DEFAULT_CODING_PROBLEMS = {
  "Part 1: Array, Sliding Window, Binary Search, Greedy": [
    {
      title: "Maximum Subarray Sum",
      difficulty: "Easy",
      description:
        "Given an integer array, find the contiguous subarray with the maximum sum.",
      example: "Input: [-2,1,-3,4,-1,2,1,-5,4]\nOutput: 6",
      constraints: "1 ≤ n ≤ 10^5",
      approach:
        "Use Kadane’s algorithm to maintain current and maximum sum.",
    },
    {
      title: "Minimum Window Substring",
      difficulty: "Medium",
      description:
        "Given two strings s and t, return the minimum window in s which contains all characters of t.",
      example: 'Input: s="ADOBECODEBANC", t="ABC"\nOutput: "BANC"',
      constraints: "1 ≤ s.length ≤ 10^5",
      approach:
        "Use sliding window with frequency map and two pointers.",
    },
    {
      title: "Job Sequencing Problem",
      difficulty: "Hard",
      description:
        "Given jobs with deadlines and profits, schedule jobs to maximize total profit.",
      example: "Input: Jobs = [(d=2,p=100),(d=1,p=19),(d=2,p=27)]",
      constraints: "1 ≤ n ≤ 10^5",
      approach:
        "Sort jobs by profit and use greedy scheduling with slots.",
    },
  ],

  "Part 2: Linked List, Stack, Queue": [
    {
      title: "Reverse a Linked List",
      difficulty: "Easy",
      description:
        "Reverse a singly linked list.",
      example: "Input: 1→2→3→4\nOutput: 4→3→2→1",
      constraints: "O(n) time, O(1) space",
      approach:
        "Iterate and reverse pointers using three variables.",
    },
    {
      title: "Valid Parentheses",
      difficulty: "Medium",
      description:
        "Check if the input string of brackets is valid.",
      example: 'Input: "()[]{}"\nOutput: true',
      constraints: "1 ≤ n ≤ 10^4",
      approach:
        "Use stack to match opening and closing brackets.",
    },
    {
      title: "LRU Cache",
      difficulty: "Hard",
      description:
        "Design an LRU cache with O(1) get and put operations.",
      example: "Input: put(1,1), get(1)\nOutput: 1",
      constraints: "Use hashmap + doubly linked list",
      approach:
        "Maintain order using DLL and map for fast access.",
    },
  ],
};
