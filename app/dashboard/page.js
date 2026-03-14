"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { getAccuracy, getCurrentUser, getPlayerProfileByUid } from "@/lib/storage"

export default function DashboardPage() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    async function load() {
      const user = getCurrentUser()
      if (!user) return
      setProfile(await getPlayerProfileByUid(user.uid))
    }
    load()
  }, [])

  if (!profile) return <main className="page-shell"><div className="glass card"><h1 className="title-lg">Dashboard</h1><p className="muted">Nejsi přihlášený nebo se profil ještě načítá.</p></div></main>

  return (
    <main className="page-shell">
      <div className="grid-4">
        <div className="glass card"><div className="muted">Hráč</div><div className="title-md" style={{ marginTop: 8 }}>{profile.firstName} {profile.lastName}</div><div className="row"><span className="inline-pill">{profile.team}</span><span className="inline-pill">{profile.gender === "female" ? "Žena" : "Muž"}</span></div></div>
        <div className="glass card"><div className="muted">Liga</div><div className="stat-value">{profile.league === "first" ? "1. liga" : "2. liga"}</div></div>
        <div className="glass card"><div className="muted">W / OW / OL / L</div><div className="stat-value">{profile.wins || 0} / {profile.overtimeWins || 0} / {profile.overtimeLosses || 0} / {profile.losses || 0}</div></div>
        <div className="glass card"><div className="muted">Accuracy</div><div className="stat-value">{getAccuracy(profile.hits, profile.misses)}%</div></div>
      </div>

      <div className="grid-2 section-gap">
        <div className="glass card">
          <h2 className="title-md">Moje statistiky</h2>
          <div className="stack muted">
            <div>Zápasy: <strong style={{ color: "white" }}>{profile.matches || 0}</strong></div>
            <div>Hits: <strong style={{ color: "white" }}>{profile.hits || 0}</strong></div>
            <div>Misses: <strong style={{ color: "white" }}>{profile.misses || 0}</strong></div>
            <div>Výhry po remíze: <strong style={{ color: "white" }}>{profile.overtimeWins || 0}</strong></div>
          </div>
        </div>

        <div className="glass card">
          <h2 className="title-md">Rychlé akce</h2>
          <div className="row">
            <Link href="/profile" className="button button-dark">Upravit profil</Link>
            <Link href="/create-match" className="button button-primary">Vytvořit zápas</Link>
            <Link href="/leaderboard" className="button button-gold">Žebříček hráčů</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
