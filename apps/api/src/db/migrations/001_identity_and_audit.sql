CREATE TABLE organizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  organization_type text NOT NULL CHECK (organization_type IN ('ministry','district','facility','laboratory','insurer','other')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','closed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oidc_issuer text NOT NULL,
  oidc_subject text NOT NULL,
  email text,
  display_name text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','disabled')),
  last_authenticated_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (oidc_issuer, oidc_subject)
);

CREATE TABLE organization_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_users(id),
  organization_id uuid NOT NULL REFERENCES organizations(id),
  role text NOT NULL CHECK (role IN ('platform_admin','organization_admin','clinician','laboratory_user','referral_coordinator','read_only')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','suspended','revoked')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, organization_id, role)
);

CREATE INDEX organization_memberships_user_idx ON organization_memberships(user_id, status);
CREATE INDEX organization_memberships_org_idx ON organization_memberships(organization_id, status);

CREATE TABLE audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES app_users(id),
  organization_id uuid REFERENCES organizations(id),
  event_type text NOT NULL,
  outcome text NOT NULL CHECK (outcome IN ('success','denied','failure')),
  resource_type text,
  resource_id text,
  request_id text,
  source_ip inet,
  user_agent text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX audit_events_occurred_at_idx ON audit_events(occurred_at DESC);
CREATE INDEX audit_events_actor_idx ON audit_events(actor_user_id, occurred_at DESC);
CREATE INDEX audit_events_org_idx ON audit_events(organization_id, occurred_at DESC);

-- Audit records are append-only for the application role. Database owners can still alter data;
-- production deployments must additionally use restricted DB roles and external immutable storage.
CREATE OR REPLACE FUNCTION prevent_audit_event_mutation()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'audit_events are append-only';
END;
$$;

CREATE TRIGGER audit_events_no_update
BEFORE UPDATE OR DELETE ON audit_events
FOR EACH ROW EXECUTE FUNCTION prevent_audit_event_mutation();
