const verifySchema = {
  body: {
    type: "object",
    required: ["role"],
    properties: {
      role: {
        type: "string",
        enum: ["admin", "user"],
      },
    },
    additionalProperties: false,
  },
};

module.exports = { verifySchema };
