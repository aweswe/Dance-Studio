-- Drop the old check constraint and add a new one that includes 'platform_leave'
ALTER TABLE leave_requests
  DROP CONSTRAINT IF EXISTS leave_requests_kind_check;

ALTER TABLE leave_requests
  ADD CONSTRAINT leave_requests_kind_check
  CHECK (kind IN ('leave', 'makeup', 'platform_leave'));
