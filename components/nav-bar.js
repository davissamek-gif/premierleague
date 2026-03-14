"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { logoutUser, subscribeAuth } from "@/lib/storage"
export default function NavBar(){const pathname=usePathname(); const router=useRouter(); const [user,setUser]=useState(null); useEffect(()=>subscribeAuth(setUser),[]); const item=(href,label)=><Link href={href} className={`nav-link ${pathname===href?"active":""}`}>{label}</Link>; return <div className="topbar"><div className="topbar-inner"><div><Link href="/" className="brand">Beerpong Premier League</Link><div className="brand-sub">hotfix finální verze</div></div><div className="nav-links">{item("/","Domů")}{user?item("/profile","Profil"):null}{user?item("/create-match","Vytvořit zápas"):null}{user?item("/matches","Zápasy"):null}{item("/leaderboard","Žebříček")}{!user?item("/register","Registrace"):null}{!user?item("/login","Přihlášení"):null}{user?<button type="button" className="nav-link" onClick={async()=>{await logoutUser();router.push("/login")}}>Odhlásit</button>:null}</div></div></div>}
