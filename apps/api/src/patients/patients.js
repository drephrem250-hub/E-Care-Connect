// Synthetic fixtures only. Never replace with real patient information.
const syntheticPatients = Object.freeze([
  Object.freeze({
    id: "SYN-0001",
    name: "Amina Example",
    birthDate: "1995-04-12",
    gender: "female",
    facility: "DEMO-FACILITY-01",
    recordType: "synthetic"
  }),
  Object.freeze({
    id: "SYN-0002",
    name: "Jean Example",
    birthDate: "1988-09-23",
    gender: "male",
    facility: "DEMO-FACILITY-01",
    recordType: "synthetic"
  })
]);

function listSyntheticPatients() {
  return syntheticPatients.map(patient => ({ ...patient }));
}

module.exports = { listSyntheticPatients };
