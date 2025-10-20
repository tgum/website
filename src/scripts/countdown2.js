//countdown by tgum
(d=>{setInterval(T=>{for(d of Array.from(document.querySelectorAll`.countdown`)){let f=Math.floor,t=(new Date(d.dataset.timestamp)-Date.now())/1000,e="",U=[86400,3600,60,1],F=(u,p)=>f(u/U[p])>0?T=f(u%(p>0?U[p-1]:u+1)/U[p])+" "+"Day0Hour0Minute0Second".split(0)[p]+(T^1?"s":e)+(p<3?", ":e):e;d.innerText=t<1?d.dataset.message:F(t,0)+F(t,1)+F(t,2)+F(t,3)}},1000)})()
