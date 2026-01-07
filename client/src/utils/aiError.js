export const handleAIError = (error) => {
  if (error?.response?.status === 429) {
    return "Daily AI limit reached. Please try again later.";
  }

  if (error?.response?.status === 500) {
    return "AI service is temporarily unavailable.";
  }

  return "Something went wrong. Please try again.";
};
