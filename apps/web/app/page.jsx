export default function Home() {
  return (
    <main style={{ maxWidth: 880, margin: "4rem auto", padding: "0 1.5rem", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ color: "#087e78", fontWeight: 700, letterSpacing: ".12em" }}>RWANDA · DIGITAL HEALTH INFRASTRUCTURE</p>
      <h1>E-Care Connect</h1>
      <p>A secure, interoperable health information exchange foundation.</p>
      <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20, marginTop: 28 }}>
        <h2>Development environment</h2>
        <p>Foundation stage. Demonstrations must use synthetic data only.</p>
        <p>Core capabilities under development: identity, patient matching, FHIR R4 exchange, referrals, laboratory results, consent and audit.</p>
      </section>
    </main>
  );
}
