const test = require("node:test");
const assert = require("node:assert/strict");
const { listSyntheticPatients } = require("../src/patients/patients");

test("demo patient fixtures are explicitly synthetic", () => {
  const patients = listSyntheticPatients();
  assert.equal(patients.length, 2);
  assert.ok(patients.every(patient => patient.recordType === "synthetic"));
  assert.ok(patients.every(patient => patient.id.startsWith("SYN-")));
});

test("fixture results are copied so callers cannot mutate the source", () => {
  const first = listSyntheticPatients();
  first[0].name = "Changed";
  assert.notEqual(listSyntheticPatients()[0].name, "Changed");
});
