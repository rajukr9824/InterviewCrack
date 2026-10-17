const assert = require("node:assert/strict");
const test = require("node:test");

const { normalizeTopic, validateTopic } = require("../utils/topicValidation");

test("normalizes whitespace and accepts five-word topics", () => {
  assert.equal(normalizeTopic("  SQL   Window Functions  "), "SQL Window Functions");
  assert.equal(validateTopic("SQL Window Functions Query Plans").error, null);
});

test("rejects empty and overlong topics", () => {
  assert.equal(validateTopic("   ").error, "Please select or enter a topic.");
  assert.equal(
    validateTopic("JavaScript frontend performance optimization strategies for browsers").error,
    "Please enter a specific topic using no more than 5 words.",
  );
});

test("preserves technical punctuation", () => {
  assert.equal(validateTopic("C++ Templates").topic, "C++ Templates");
  assert.equal(validateTopic("CI/CD Pipelines").topic, "CI/CD Pipelines");
  assert.equal(validateTopic("Node.js Event Loop").topic, "Node.js Event Loop");
});
