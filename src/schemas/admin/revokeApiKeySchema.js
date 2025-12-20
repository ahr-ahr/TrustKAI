const revokeApiKeySchema = {
  body: {
    type: "object",
    required: ["api_key"],
    additionalProperties: false,
    properties: {
      api_key: {
        type: "string",
        minLength: 20,
      },
    },
  },
};

module.exports = { revokeApiKeySchema };
