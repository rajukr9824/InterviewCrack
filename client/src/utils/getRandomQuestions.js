export const getRandomA2ZQuestions = (questions) => {
  const easy = questions.filter(q => q.difficulty === "Easy");
  const medium = questions.filter(q => q.difficulty === "Medium");
  const hard = questions.filter(q => q.difficulty === "Hard");

  const pick = (arr) =>
    arr[Math.floor(Math.random() * arr.length)];

  const selected = [];

  if (easy.length) selected.push(pick(easy));
  if (medium.length) selected.push(pick(medium));
  if (hard.length) selected.push(pick(hard));

  return selected;
};
