import { auth, db } from "./firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { collection, addDoc, getDocs, query, orderBy, doc, updateDoc, where, deleteDoc, getDoc } from "firebase/firestore"

export async function registerPlayer(data){const userCred=await createUserWithEmailAndPassword(auth,data.email,data.password);await addDoc(collection(db,"players"),{uid:userCred.user.uid,firstName:data.firstName,lastName:data.lastName,email:data.email,team:data.team,league:data.league,gender:data.gender,avatarName:"",hits:0,misses:0,matches:0,wins:0,losses:0,overtimeWins:0,overtimeLosses:0,pointsFor:0,pointsAgainst:0,overtimeRounds:0,createdAt:new Date().toISOString()})}
export async function loginUser(email,password){await signInWithEmailAndPassword(auth,email,password)}
export async function logoutUser(){await signOut(auth)}
export function subscribeAuth(cb){return onAuthStateChanged(auth,cb)}
export async function getPlayers(){const snap=await getDocs(query(collection(db,"players"),orderBy("firstName")));return snap.docs.map((d)=>({id:d.id,...d.data()}))}
export async function getExistingTeams(){const players=await getPlayers();return Array.from(new Set(players.map((p)=>p.team).filter(Boolean))).sort((a,b)=>a.localeCompare(b))}
export async function getPlayersByTeam(team,league){let players=await getPlayers(); if(league) players=players.filter((p)=>p.league===league); return players.filter((p)=>p.team===team)}
export async function getPlayerProfileByUid(uid){const snap=await getDocs(query(collection(db,"players"),where("uid","==",uid)));const first=snap.docs[0];return first?{id:first.id,...first.data()}:null}
export async function updatePlayerProfile(id,payload){await updateDoc(doc(db,"players",id),payload)}
export async function createMatch(payload){const ref=await addDoc(collection(db,"matches"),{...payload,status:"live",winnerTeam:"",wentToOvertime:false,overtimeRounds:0,createdAt:new Date().toISOString()});return ref.id}
export async function getMatches(){const snap=await getDocs(query(collection(db,"matches"),orderBy("createdAt","desc")));return snap.docs.map((d)=>({id:d.id,...d.data()}))}
export async function getMatchById(id){const snap=await getDoc(doc(db,"matches",id));return snap.exists()?{id:snap.id,...snap.data()}:null}
export async function recordMatchEvent(matchId,playerId,type){await addDoc(collection(db,"matchEvents"),{matchId,playerId,type,createdAt:new Date().toISOString()})}
export async function getMatchEvents(matchId){const snap=await getDocs(query(collection(db,"matchEvents"),where("matchId","==",matchId)));return snap.docs.map((d)=>({id:d.id,...d.data()}))}
export async function deleteMatchEvent(eventId){await deleteDoc(doc(db,"matchEvents",eventId))}
export async function finishMatch(match,options){
 const events=await getMatchEvents(match.id); const playerTotals=new Map()
 for(const event of events){const current=playerTotals.get(event.playerId)||{hits:0,misses:0}; if(event.type==="hit") current.hits+=1; if(event.type==="miss") current.misses+=1; playerTotals.set(event.playerId,current)}
 const players=await getPlayers(); const involvedA=match.teamA.map((p)=>p.id); const involvedB=match.teamB.map((p)=>p.id)
 for(const player of players){
   const isA=involvedA.includes(player.id), isB=involvedB.includes(player.id); if(!isA && !isB) continue
   const found=playerTotals.get(player.id)||{hits:0,misses:0}
   let wins=player.wins||0, losses=player.losses||0, overtimeWins=player.overtimeWins||0, overtimeLosses=player.overtimeLosses||0
   if(options.winnerTeam==="A"){ if(isA) options.wentToOvertime?overtimeWins++:wins++; if(isB) options.wentToOvertime?overtimeLosses++:losses++ }
   if(options.winnerTeam==="B"){ if(isB) options.wentToOvertime?overtimeWins++:wins++; if(isA) options.wentToOvertime?overtimeLosses++:losses++ }
   await updateDoc(doc(db,"players",player.id),{hits:(player.hits||0)+found.hits,misses:(player.misses||0)+found.misses,matches:(player.matches||0)+1,wins,losses,overtimeWins,overtimeLosses,overtimeRounds:(player.overtimeRounds||0)+(options.wentToOvertime?1:0),pointsFor:(player.pointsFor||0)+(isA?(options.winnerTeam==="A"?1:0):(options.winnerTeam==="B"?1:0)),pointsAgainst:(player.pointsAgainst||0)+(isA?(options.winnerTeam==="B"?1:0):(options.winnerTeam==="A"?1:0))})
 }
 await updateDoc(doc(db,"matches",match.id),{status:"finished",winnerTeam:options.winnerTeam,wentToOvertime:options.wentToOvertime,overtimeRounds:options.wentToOvertime?1:0})
}
export function getAccuracy(hits,misses){const total=(hits||0)+(misses||0); return total?Math.round(((hits||0)/total)*100):0}
export function buildTeamStats(players){const teams=new Map(); for(const p of players){const cur=teams.get(p.team)||{team:p.team,wins:0,overtimeWins:0,hits:0,misses:0}; cur.wins+=p.wins||0; cur.overtimeWins+=p.overtimeWins||0; cur.hits+=p.hits||0; cur.misses+=p.misses||0; teams.set(p.team,cur)} const out={}; for(const [team,value] of teams.entries()){out[team]={totalWins:(value.wins||0)+(value.overtimeWins||0),accuracy:getAccuracy(value.hits,value.misses)}} return out}
