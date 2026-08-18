import { describe, expect, it } from "vitest";

import { adminRole, editorRole, ownerRole, salesRole } from "./permissions.js";

describe("organization access-control roles", () => {
  it("lets owner update/delete/manage billing on their own org", () => {
    expect(ownerRole.authorize({ organization: ["update"] }).success).toBe(
      true
    );
    expect(ownerRole.authorize({ organization: ["delete"] }).success).toBe(
      true
    );
    expect(ownerRole.authorize({ organization: ["billing"] }).success).toBe(
      true
    );
  });

  it("lets admin update but not delete the org", () => {
    expect(adminRole.authorize({ organization: ["update"] }).success).toBe(
      true
    );
    expect(adminRole.authorize({ organization: ["delete"] }).success).toBe(
      false
    );
  });

  it("denies org-level actions for roles without org grants", () => {
    expect(editorRole.authorize({ organization: ["update"] }).success).toBe(
      false
    );
    expect(salesRole.authorize({ organization: ["update"] }).success).toBe(
      false
    );
  });
});
