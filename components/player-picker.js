"use client"
export default function PlayerPicker({ players, selectedIds, onAdd }) {
  return (
    <div className="glass card">
      <h2 className="title-md">Vyber hráče</h2>
      <div className="search-list">
        {players.map((player) => {
          const disabled = selectedIds.includes(player.id)
          return (
            <button key={player.id} type="button" className="player-button" disabled={disabled} onClick={() => onAdd(player)}>
              <strong>{player.firstName} {player.lastName}</strong><br />
              <span className="muted">{player.team} • {player.league === "first" ? "1. liga" : "2. liga"} • {player.gender === "female" ? "Žena" : "Muž"}</span>
            </button>
          )
        })}
        {!players.length ? <div className="empty">V této lize zatím nejsou hráči.</div> : null}
      </div>
    </div>
  )
}
