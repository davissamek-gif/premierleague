"use client"

export default function TeamSuggestions({ teams, onPick }) {
  if (!teams.length) {
    return (
      <div className="notice">
        Zatím se nenačetly žádné registrované týmy. Když píšeš nový tým, můžeš ho normálně založit ručně.
      </div>
    )
  }

  return (
    <div className="notice">
      <div style={{ marginBottom: 10, fontWeight: 800 }}>Registrované týmy:</div>
      <div className="team-pill-wrap">
        {teams.map((team) => (
          <div key={team} className="team-suggestion-chip">
            <button
              type="button"
              className="button button-dark"
              onClick={() => onPick(team)}
              title={team}
            >
              {team}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
