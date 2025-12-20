const createApiKeySchema = {
  body: {
    type: "object",
    required: ["name"],
    additionalProperties: false,
    properties: {
      name: {
        type: "string",
        minLength: 3,
        maxLength: 50,
      },
      tier: {
        type: "string",
        enum: ["basic", "premium"],
        default: "basic",
      },
      scopes: {
        type: "array",
        items: {
          type: "string",
          minLength: 3,
        },
        default: ["verify:access"],
      },
      expires_in_days: {
        type: "integer",
        minimum: 1,
        maximum: 365,
        default: 365,
      },
    },
  },
};

module.exports = { createApiKeySchema };
