// Results page — full build coming next session
// Receives submission ID from /api/diagnostics/submit via ?id= query param
// Will: fetch submission from Payload → call Claude API → render report → offer PDF download

type Props = {
  searchParams: Promise<{ id?: string }>
}

export default async function DiagnosticsResultsPage({ searchParams }: Props) {
  const { id } = await searchParams

  return (
    <main style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
      <h1>Your Lead Flow Breakdown</h1>
      {id ? (
        <p>Submission <strong>{id}</strong> received — report generation coming soon.</p>
      ) : (
        <p>No submission found. Please complete the diagnostic form first.</p>
      )}
      <a href="/diagnostics" style={{ color: '#ff9100' }}>← Back to the form</a>
    </main>
  )
}
