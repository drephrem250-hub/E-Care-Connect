function requireOrganizationMembership(allowedRoles = []) {
  return function authorize(req, res, next) {
    const organizationId = req.headers["x-organization-id"];
    if (!organizationId || !req.auth) return res.status(403).json({ error: "organization_context_required" });
    const membership = req.auth.memberships.find(item => item.organizationId === organizationId);
    if (!membership) return res.status(403).json({ error: "organization_access_denied" });
    if (allowedRoles.length && !allowedRoles.includes(membership.role)) {
      return res.status(403).json({ error: "insufficient_role" });
    }
    req.organization = membership;
    return next();
  };
}

module.exports = { requireOrganizationMembership };
