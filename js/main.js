const $=s=>document.querySelector(s);
const mk=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e};
const link=(txt,href)=>{const a=mk('a','btn',txt);a.href=href;if(/^https?:/.test(href)){a.target='_blank';a.rel='noopener'}return a};
// theme + menu
const root=document.documentElement;
$('#theme').onclick=()=>{const t=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=t;try{localStorage.setItem('theme',t)}catch(e){}};
const burger=$('#burger'),menu=$('#menu');
burger.onclick=()=>{const o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o)};
menu.querySelectorAll('a').forEach(a=>a.onclick=()=>{menu.classList.remove('open');burger.setAttribute('aria-expanded',false)});
$('#yr').textContent=new Date().getFullYear();
// skills
SKILLS.forEach(([t,l])=>{const c=mk('article','card skill');c.append(mk('h3','',t));const u=mk('ul');l.forEach(i=>u.append(mk('li','',i)));c.append(u);$('#skills').append(c)});
// certs
CERTS.forEach(([t,i,u])=>{const c=mk('article','card');c.append(mk('h3','',t),mk('p','',i));const a=link('View credential',u);c.append(a);$('#certgrid').append(c)});
// projects + filters
function renderProjects(f){const g=$('#pgrid');g.innerHTML='';
PROJECTS.filter(p=>f==='All'||p.cat===f).forEach(p=>{
const c=mk('article','card'+(p.star?' star':''));
c.append(mk('div','meta mono',p.year+' · '+p.cat),mk('h3','',p.title),mk('p','',p.desc));
const t=mk('ul','tags');p.tech.forEach(x=>t.append(mk('li','',x)));c.append(t);
const a=mk('p');a.innerHTML='<b>Contribution:</b> ';a.append(p.contrib);const o=mk('p');o.innerHTML='<b>Outcome:</b> ';o.append(p.outcome);c.append(a,o);
const l=mk('div','links');p.links.forEach(([x,h],i)=>{const b=link(x,h);if(i===0)b.classList.add('primary');l.append(b)});c.append(l);g.append(c)})}
const cats=['All',...new Set(PROJECTS.map(p=>p.cat))];
cats.forEach((c,i)=>{const b=mk('button','',c);b.setAttribute('aria-pressed',i===0);b.onclick=()=>{document.querySelectorAll('#filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));renderProjects(c)};$('#filters').append(b)});
renderProjects('All');
// articles (data/articles.json: [{title,url,summary}])
fetch('data/articles.json').then(r=>r.json()).then(list=>{const g=$('#artgrid');
if(!list.length){const c=mk('article','card');c.append(mk('h3','','OpenHPC, Warewulf, Slurm and Lustre series'),mk('p','','My multi-episode OpenHPC cluster build and other HPC write-ups are published on Medium.'),link('Read Articles','https://medium.com/@ahmedmejri5'));g.append(c);return}
list.forEach(a=>{const c=mk('article','card');c.append(mk('h3','',a.title),mk('p','',a.summary||''),link('Read Article',a.url));g.append(c)})}).catch(()=>{$('#artgrid').append(link('Read Articles','https://medium.com/@ahmedmejri5'))});
// active nav
const secs=[...menu.querySelectorAll('a')];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)secs.forEach(a=>a.classList.toggle('on',a.hash==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main section').forEach(s=>io.observe(s));
// terminal
const out=$('#out'),inp=$('#in');
const say=(t,cls)=>{const d=mk('div',cls,t);out.append(d);out.scrollTop=out.scrollHeight};
const go=id=>{const s=document.getElementById(id);if(s)s.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})};
const CMD={
help:()=>say('Commands: help  about  skills  projects  experience  github  contact  clear'),
about:()=>{say('Ahmed Mejri · HPC Systems Engineer\nFocus: HPC operations, GPU infrastructure, Kubernetes, AI inference, Linux, monitoring');go('about')},
skills:()=>{say('→ Slurm, PBS Professional, OpenHPC, Warewulf\n→ NVIDIA GPU / MIG, vLLM, Kubernetes\n→ Lustre, BeeGFS, NFS, GPFS\n→ InfiniBand, Linux, Python, Bash');go('expertise')},
projects:()=>{say('Scrolling to projects…');go('projects')},
experience:()=>{say('Scrolling to experience…');go('experience')},
github:()=>{say('Scrolling to GitHub section…');go('github')},
contact:()=>{say('ahmedmejri5@gmail.com');go('contact')},
whoami:()=>say('Ahmed Mejri\nRole: HPC Systems Engineer\nFocus: HPC Operations → GPU Infrastructure → Kubernetes → AI Inference → Linux → Monitoring'),
clear:()=>{out.innerHTML=''}};
say('$ whoami','hl');CMD.whoami();say('\nType "help" for commands.');
inp.addEventListener('keydown',e=>{if(e.key!=='Enter')return;const v=inp.value.trim().toLowerCase();inp.value='';if(!v)return;say('$ '+v,'hl');(CMD[v]||(()=>say('command not found: '+v+'. Try "help".')))()});
