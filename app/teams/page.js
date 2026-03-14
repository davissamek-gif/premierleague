"use client"
import { useEffect, useMemo, useState } from "react"
import { buildTeamLeaderboard, getPlayers } from "@/lib/storage"
export default function TeamsPage() {
  const [players,setPlayers]=useState([]);const [leagueFilter,setLeagueFilter]=useState("all")
  useEffect(()=>{getPlayers().then(setPlayers)},[])
  const rows=useMemo(()=>buildTeamLeaderboard(players,leagueFilter),[players,leagueFilter])
  return <main className="page-shell"><div className="glass card"><div className="row" style={{justifyContent:"space-between",marginBottom:16}}><div><span className="badge">Teams</span><h1 className="title-lg" style={{marginTop:14,marginBottom:0}}>Žebříček týmů</h1></div><select className="select" style={{maxWidth:220}} value={leagueFilter} onChange={(e)=>setLeagueFilter(e.target.value)}><option value="all">Všechny ligy</option><option value="first">1. liga</option><option value="second">2. liga</option></select></div><div className="table-wrap"><table className="table"><thead><tr><th>#</th><th>Tým</th><th>Hráči</th><th>W</th><th>OW</th><th>OL</th><th>L</th><th>OT kola</th><th>Hit</th><th>Miss</th><th>Accuracy</th></tr></thead><tbody>{rows.map((team,index)=><tr key={team.team}><td><span className={`rank ${index===0?"top":""}`}>{index+1}</span></td><td><strong>{team.team}</strong></td><td>{team.players}</td><td>{team.wins}</td><td>{team.overtimeWins}</td><td>{team.overtimeLosses}</td><td>{team.losses}</td><td>{team.overtimeRounds}</td><td>{team.hits}</td><td>{team.misses}</td><td>{team.accuracy}%</td></tr>)}</tbody></table></div></div></main>
}
