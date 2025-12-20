function adminAuth(request, reply) {
  const token = request.headers["x-admin-token"];

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return reply.code(401).send({
      code: "TK-401-ADMIN",
      error: "ADMIN_UNAUTHORIZED",
    });
  }
}

module.exports = { adminAuth };
