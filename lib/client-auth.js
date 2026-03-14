"use client"
import { useEffect, useState } from "react"
import { getPlayerProfileByUid, subscribeAuth } from "@/lib/storage"
export function useProfileAuth(){
 const [loading,setLoading]=useState(true), [user,setUser]=useState(null), [profile,setProfile]=useState(null)
 useEffect(()=>{const unsub=subscribeAuth(async(authUser)=>{setUser(authUser||null); if(!authUser){setProfile(null); setLoading(false); return} const p=await getPlayerProfileByUid(authUser.uid); setProfile(p); setLoading(false)}); return ()=>unsub&&unsub()},[])
 return {loading,user,profile,setProfile}
}
