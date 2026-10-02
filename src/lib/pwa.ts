"use client";
export function registerServiceWorker(){if(typeof window==="undefined")return;if(!("serviceWorker"in navigator))return;if(!window.isSecureContext&&location.hostname!=="localhost"&&location.hostname!=="127.0.0.1")return;window.addEventListener("load",()=>{navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(()=>{})})}
let _d:any=null;
export function captureInstallPrompt(){if(typeof window==="undefined")return;window.addEventListener("beforeinstallprompt",(e)=>{e.preventDefault();_d=e;window.dispatchEvent(new CustomEvent("setu:pwa-ready"))});window.addEventListener("appinstalled",()=>{_d=null;window.dispatchEvent(new CustomEvent("setu:pwa-installed"))})}
export function canInstallPwa(){return!!_d}
export async function promptInstall():Promise<"accepted"|"dismissed"|"unavailable">{if(!_d)return"unavailable";await _d.prompt();const c=await _d.userChoice;if(c.outcome==="accepted")_d=null;return c.outcome}
export function isInstalledPwa(){if(typeof window==="undefined")return false;return window.matchMedia?.("(display-mode: standalone)").matches||(window.navigator as any).standalone===true}
export const registerSW = registerServiceWorker;
export const canInstall = canInstallPwa;
export const captureInstall = captureInstallPrompt;
export const isInstalled = isInstalledPwa;
