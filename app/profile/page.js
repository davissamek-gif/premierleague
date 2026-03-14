"use client"

import { useEffect, useMemo, useState } from "react"
import TeamSuggestions from "@/components/team-suggestions"
import { getAccuracy, getExistingTeams, updatePlayerProfile } from "@/lib/storage"
import { useProfileAuth } from "@/lib/client-auth"

export default function ProfilePage() {
  const { loading, user, profile, setProfile } = useProfileAuth()
  const [team, setTeam] = useState("")
  const [league, setLeague] = useState("second")
  const [avatarName, setAvatarName] = useState("")
  const [message, setMessage] = useState("")
  const [allTeams, setAllTeams] = useState([])

  useEffect(() => {
    getExistingTeams().then(setAllTeams).catch(() => setAllTeams([]))
  }, [])

  useEffect(() => {
    if (!profile) return
    setTeam(profile.team || "")
    setLeague(profile.league || "second")
    setAvatarName(profile.avatarName || "")
  }, [profile])

  const teamSuggestions = useMemo(() => {
    const value = team.trim().toLowerCase()
    const filtered = allTeams.filter((i) => !value || i.toLowerCase().includes(value))
    if (team.trim() && !filtered.some((i) => i.toLowerCase() === team.trim().toLowerCase())) {
      return [team.trim(), ...filtered].slice(0, 12)
    }
    return filtered.slice(0, 12)
  }, [team, allTeams])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!profile) return
    const payload = { team: team.trim(), league, avatarName }
    await updatePlayerProfile(profile.id, payload)
    setProfile({ ...profile, ...payload })
    setMessage("Profil uložen. Trade hotový.")
  }

  if (loading) {
    return (
      <main className="page-shell">
        <div className="glass card">
          <div className="muted">Načítám profil...</div>
        </div>
      </main>
    )
  }

  if (!user || !profile) {
    return (
      <main className="page-shell">
        <div className="glass card">
          <div className="muted">Nejprve se přihlas.</div>
        </div>
      </main>
    )
  }

  return (
    <main className="page-shell">
      <div className="profile-grid">
        <div className="glass card">
          <span className="badge">Profil hráče</span>
          <h1 className="title-lg profile-main-name" style={{ marginTop: 14 }}>
            {profile.firstName} {profile.lastName}
          </h1>

          <div className="grid-4" style={{ marginTop: 10 }}>
            <div className="kpi">
              <div className="muted">Tým</div>
              <div className="kpi-num team-name-fit" title={profile.team}>
                {profile.team}
              </div>
            </div>

            <div className="kpi">
              <div className="muted">Liga</div>
              <div className="kpi-num">{profile.league === "first" ? "1." : "2."}</div>
            </div>

            <div className="kpi">
              <div className="muted">W / OW / OL / L</div>
              <div className="kpi-num">{profile.wins || 0} / {profile.overtimeWins || 0} / {profile.overtimeLosses || 0} / {profile.losses || 0}</div>
            </div>

            <div className="kpi">
              <div className="muted">Accuracy</div>
              <div className="kpi-num">{getAccuracy(profile.hits, profile.misses)}%</div>
            </div>
          </div>

          <div className="grid-2 section-gap">
            <div className="panel">
              <h2 className="title-md">Statistiky</h2>
              <div className="stack muted">
                <div>Zápasy: <strong style={{ color: "white" }}>{profile.matches || 0}</strong></div>
                <div>Hits: <strong style={{ color: "white" }}>{profile.hits || 0}</strong></div>
                <div>Misses: <strong style={{ color: "white" }}>{profile.misses || 0}</strong></div>
                <div>Výhry po remíze: <strong style={{ color: "white" }}>{profile.overtimeWins || 0}</strong></div>
              </div>
            </div>

            <div className="panel">
              <h2 className="title-md">Účet</h2>
              <div className="stack muted">
                <div>E-mail: <strong style={{ color: "white" }}>{profile.email}</strong></div>
                <div>Pohlaví: <strong style={{ color: "white" }}>{profile.gender === "female" ? "Žena" : "Muž"}</strong></div>
                <div>Profilovka týmu: <strong style={{ color: "white" }}>{profile.avatarName || "není vybraná"}</strong></div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass card">
          <span className="badge">Úprava profilu</span>
          <h2 className="title-lg" style={{ marginTop: 14 }}>Tým a liga</h2>

          <div className="notice" style={{ marginBottom: 18 }}>
            Jakmile začneš psát název týmu, dole se ukážou registrované týmy. Můžeš si vybrat existující nebo napsat nový.
          </div>

          <form className="stack" onSubmit={handleSubmit}>
            <div>
              <label className="label">Tým</label>
              <input
                className="input"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
                placeholder="Napiš nebo vyber registrovaný tým"
              />
            </div>

            <TeamSuggestions teams={teamSuggestions} onPick={setTeam} />

            <div>
              <label className="label">Liga</label>
              <select className="select" value={league} onChange={(e) => setLeague(e.target.value)}>
                <option value="first">1. liga</option>
                <option value="second">2. liga</option>
              </select>
            </div>

            <div>
              <label className="label">Profilovka týmu</label>
              <input
                className="input"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarName(e.target.files?.[0]?.name || "")}
              />
              {avatarName ? <div className="muted" style={{ marginTop: 8 }}>Vybraný soubor: {avatarName}</div> : null}
            </div>

            <div className="row">
              <button className="button button-primary" type="submit">Uložit změny</button>
              {message ? <div className="muted">{message}</div> : null}
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
