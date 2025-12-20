const rotateApiKeySchema = {
  body: {
    type: "object",
    required: ["old_api_key"],
    additionalProperties: false,
    properties: {
      old_api_key: {
        type: "string",
        minLength: 20,
      },
    },
  },
};

module.exports = { rotateApiKeySchema };
