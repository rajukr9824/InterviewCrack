const MAX_TOPIC_WORDS = 5;
const MAX_TOPIC_LENGTH = 100;

const normalizeTopic = (value) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ") : "";

const validateTopic = (value) => {
  const topic = normalizeTopic(value);

  if (!topic) {
    return { topic: "", error: "Please select or enter a topic." };
  }

  if (topic.length > MAX_TOPIC_LENGTH) {
    return {
      topic,
      error: `Please keep the topic under ${MAX_TOPIC_LENGTH} characters.`,
    };
  }

  if (topic.split(" ").length > MAX_TOPIC_WORDS) {
    return {
      topic,
      error: "Please enter a specific topic using no more than 5 words.",
    };
  }

  return { topic, error: null };
};

module.exports = {
  MAX_TOPIC_WORDS,
  MAX_TOPIC_LENGTH,
  normalizeTopic,
  validateTopic,
};
