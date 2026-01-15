export const getRandomA2ZQuestions = (questions) => {
  const easy = questions.filter(q => q.difficulty === "Easy");
  const medium = questions.filter(q => q.difficulty === "Medium");
  const hard = questions.filter(q => q.difficulty === "Hard");

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const selected = [];

  // 1st: Easy or Medium
  const firstPool = [...easy, ...medium];
  if (firstPool.length) selected.push(pick(firstPool));

  // 2nd: Medium
  if (medium.length) selected.push(pick(medium));

  // 3rd: Hard
  if (hard.length) selected.push(pick(hard));

  return selected;
};

