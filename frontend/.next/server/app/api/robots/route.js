"use strict";(()=>{var e={};e.id=45,e.ids=[45],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},9693:(e,t,a)=>{a.r(t),a.d(t,{originalPathname:()=>m,patchFetch:()=>x,requestAsyncStorage:()=>u,routeModule:()=>l,serverHooks:()=>c,staticGenerationAsyncStorage:()=>d});var r={};a.r(r),a.d(r,{GET:()=>p});var o=a(9303),s=a(8716),n=a(670),i=a(7070);async function p(){let e=`User-agent: *
Allow: /

# Sitemap
Sitemap: ${process.env.NEXTAUTH_URL||"http://localhost:3000"}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow public content
Allow: /posts/
Allow: /rss.xml

# Crawl delay (optional)
Crawl-delay: 1`;return new i.NextResponse(e,{headers:{"Content-Type":"text/plain","Cache-Control":"public, max-age=3600, s-maxage=3600"}})}let l=new o.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/robots/route",pathname:"/api/robots",filename:"route",bundlePath:"app/api/robots/route"},resolvedPagePath:"C:\\Users\\aakar\\OneDrive\\Desktop\\delete\\second\\app\\api\\robots\\route.ts",nextConfigOutput:"",userland:r}),{requestAsyncStorage:u,staticGenerationAsyncStorage:d,serverHooks:c}=l,m="/api/robots/route";function x(){return(0,n.patchFetch)({serverHooks:c,staticGenerationAsyncStorage:d})}}};var t=require("../../../webpack-runtime.js");t.C(e);var a=e=>t(t.s=e),r=t.X(0,[276,972],()=>a(9693));module.exports=r})();