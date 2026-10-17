export const MAX_TOPIC_WORDS = 5;
export const MAX_TOPIC_LENGTH = 100;

export const normalizeTopic = (value) => value.trim().replace(/\s+/g, " ");

export const getTopicValidationError = (value) => {
  const topic = normalizeTopic(value || "");

  if (!topic) {
    return "Please select or enter a topic.";
  }

  if (topic.length > MAX_TOPIC_LENGTH) {
    return `Please keep the topic under ${MAX_TOPIC_LENGTH} characters.`;
  }

  if (topic.split(" ").length > MAX_TOPIC_WORDS) {
    return "Please enter a specific topic using no more than 5 words.";
  }

  return "";
};

export const getTopicWordCount = (value) => {
  const topic = normalizeTopic(value || "");
  return topic ? topic.split(" ").length : 0;
};
