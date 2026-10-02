"use client";
export function registerSW(){if(typeof window==="undefined")return;if(!("serviceWorker"in navigator))return;if(!window.isSecureContext&&location.hostname!=="localhost"&&location.hostname!=="127.0.0.1")return;window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(()=>{})})}
let dp:any=null;
export function captureInstall(){if(typeof window==="undefined")return;window.addEventListener("beforeinstallprompt",(e)=>{e.preventDefault();dp=e;window.dispatchEvent(new CustomEvent("setu:pwa-ready"))});window.addEventListener("appinstalled",()=>{dp=null;window.dispatchEvent(new CustomEvent("setu:pwa-installed"))})}
export function canInstall(){return!!dp}
export async function promptInstall():Promise<"accepted"|"dismissed"|"unavailable">{if(!dp)return"unavailable";await dp.prompt();const c=await dp.userChoice;if(c.outcome==="accepted")dp=null;return c.outcome}
export function isInstalled(){if(typeof window==="undefined")return false;return window.matchMedia?.("(display-mode: standalone)").matches||(window.navigator as any).standalone===true}
