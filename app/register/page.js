"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import TeamSuggestions from "@/components/team-suggestions"
import { getExistingTeams, registerPlayer } from "@/lib/storage"

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [gender, setGender] = useState("male")
  const [league, setLeague] = useState("second")
  const [team, setTeam] = useState("")
  const [message, setMessage] = useState("")
  const [allTeams, setAllTeams] = useState([])

  useEffect(() => {
    getExistingTeams().then(setAllTeams).catch(() => setAllTeams([]))
  }, [])

  const teamSuggestions = useMemo(() => {
    const value = team.trim().toLowerCase()
    const filtered = allTeams.filter((i) => !value || i.toLowerCase().includes(value))
    if (team.trim() && !filtered.some((i) => i.toLowerCase() === team.trim().toLowerCase())) {
      return [team.trim(), ...filtered].slice(0, 10)
    }
    return filtered.slice(0, 10)
  }, [team, allTeams])

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage("")
    try {
      if (!firstName || !lastName || !email || !password || !team.trim()) {
        throw new Error("Vyplň všechna pole.")
      }
      await registerPlayer({
        firstName,
        lastName,
        email,
        password,
        gender,
        league,
        team: team.trim(),
      })
      router.push("/profile")
    } catch (error) {
      setMessage(error.message || "Registrace se nepovedla.")
    }
  }

  return (
    <main className="page-shell">
      <div className="glass card center-wrap">
        <span className="badge">Registrace</span>
        <h1 className="title-lg" style={{ marginTop: 14 }}>Přidat hráče do ligy</h1>

        <div className="notice" style={{ marginBottom: 18 }}>
          Jakmile začneš psát název týmu, dole se ukážou registrované týmy. Když tam není, normálně ho napiš.
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <div>
            <label className="label">Jméno</label>
            <input className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>

          <div>
            <label className="label">Příjmení</label>
            <input className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>

          <div>
            <label className="label">E-mail</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div>
            <label className="label">Heslo</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div>
            <label className="label">Pohlaví</label>
            <select className="select" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="male">Muž</option>
              <option value="female">Žena</option>
            </select>
          </div>

          <div>
            <label className="label">Liga</label>
            <select className="select" value={league} onChange={(e) => setLeague(e.target.value)}>
              <option value="first">1. liga</option>
              <option value="second">2. liga</option>
            </select>
          </div>

          <div className="full">
            <label className="label">Tým</label>
            <input
              className="input"
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              placeholder="Napiš nebo vyber registrovaný tým"
            />
          </div>

          <div className="full">
            <TeamSuggestions teams={teamSuggestions} onPick={setTeam} />
          </div>

          <div className="full row">
            <button className="button button-primary" type="submit">Registrovat hráče</button>
            {message ? <div className="muted">{message}</div> : null}
          </div>
        </form>
      </div>
    </main>
  )
}
