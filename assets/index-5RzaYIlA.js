(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&s(n)}).observe(document,{childList:!0,subtree:!0});function e(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=e(a);fetch(a.href,i)}})();class L{constructor(t,e){this.layer=t,this.taskbar=e,this.windows=new Map,this.z=20}open(t){const e=this.windows.get(t.id);if(e)return e.window.classList.remove("is-minimized"),e.task.classList.add("is-active"),this.focus(e.window),e;const s=document.createElement("section");s.className=`xp-window ${t.className||""}`,s.dataset.windowId=t.id;const a=this.windows.size;s.style.width=`${t.width||720}px`,s.style.height=`${t.height||520}px`,s.style.left=`${Math.max(12,t.left??86+a*24)}px`,s.style.top=`${Math.max(12,t.top??52+a*22)}px`,s.innerHTML=`
      <header class="xp-titlebar">
        <span class="xp-titlebar__icon">${t.icon||"□"}</span>
        <strong>${y(t.title)}</strong>
        <div class="xp-titlebar__controls">
          <button data-window-action="minimize" type="button" aria-label="最小化">_</button>
          <button data-window-action="maximize" type="button" aria-label="最大化">□</button>
          <button data-window-action="close" type="button" aria-label="关闭">×</button>
        </div>
      </header>
      <div class="xp-window__content"></div>`;const i=s.querySelector(".xp-window__content");typeof t.content=="string"?i.innerHTML=t.content:t.content&&i.append(t.content);const n=document.createElement("button");n.className="task-button is-active",n.type="button",n.innerHTML=`<span>${t.icon||"□"}</span>${y(t.title)}`,this.layer.append(s),this.taskbar.append(n);const o={window:s,content:i,task:n,options:t};return this.windows.set(t.id,o),this.bindWindow(o),this.focus(s),o}bindWindow(t){const{window:e,task:s}=t;e.addEventListener("pointerdown",()=>this.focus(e)),s.addEventListener("click",()=>{e.classList.contains("is-minimized")?(e.classList.remove("is-minimized"),this.focus(e)):s.classList.contains("is-active")?(e.classList.add("is-minimized"),s.classList.remove("is-active")):this.focus(e)}),e.querySelector('[data-window-action="minimize"]').addEventListener("click",()=>{e.classList.add("is-minimized"),s.classList.remove("is-active")}),e.querySelector('[data-window-action="maximize"]').addEventListener("click",()=>{e.classList.toggle("is-maximized"),this.focus(e)}),e.querySelector('[data-window-action="close"]').addEventListener("click",()=>this.close(e.dataset.windowId)),this.makeDraggable(e,e.querySelector(".xp-titlebar"))}makeDraggable(t,e){let s=null;e.addEventListener("pointerdown",a=>{a.target.closest("button")||t.classList.contains("is-maximized")||innerWidth<720||(s={x:a.clientX,y:a.clientY,left:t.offsetLeft,top:t.offsetTop},e.setPointerCapture(a.pointerId))}),e.addEventListener("pointermove",a=>{if(!s)return;const i=Math.max(0,this.layer.clientWidth-160),n=Math.max(0,this.layer.clientHeight-80);t.style.left=`${Math.min(i,Math.max(0,s.left+a.clientX-s.x))}px`,t.style.top=`${Math.min(n,Math.max(0,s.top+a.clientY-s.y))}px`}),e.addEventListener("pointerup",()=>{s=null})}focus(t){this.z+=1,t.style.zIndex=String(this.z),this.windows.forEach(({window:e,task:s})=>{const a=e===t&&!e.classList.contains("is-minimized");e.classList.toggle("is-focused",a),s.classList.toggle("is-active",a)})}close(t){const e=this.windows.get(t);e&&(e.window.remove(),e.task.remove(),this.windows.delete(t))}}function y(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}class S{constructor({windowManager:t,snapshot:e}){this.windowManager=t,this.snapshot=e,this.routeMap=new Map(e.routes.map(s=>[p(s.url),s])),this.history=[],this.historyIndex=-1,this.record=null,this.messageHandler=s=>this.onMessage(s),window.addEventListener("message",this.messageHandler)}open(t=null){return this.record=this.windowManager.open({id:"browser",title:"Internet",icon:"e",width:960,height:650,left:128,top:36,className:"browser-window is-maximized",content:this.createUi()}),this.bindUi(),t?this.navigate(t):this.historyIndex<0&&this.navigate(this.snapshot.initialUrl),this.record}createUi(){const t=document.createElement("div");return t.className="browser-app",t.innerHTML=`
      <div class="browser-menu"><span>文件(F)</span><span>编辑(E)</span><span>查看(V)</span><span>收藏(A)</span><span>工具(T)</span><span>帮助(H)</span></div>
      <div class="browser-toolbar">
        <button type="button" data-browser="back" title="后退">←</button>
        <button type="button" data-browser="forward" title="前进">→</button>
        <button type="button" data-browser="reload" title="刷新">↻</button>
        <button type="button" data-browser="home" title="主页">⌂</button>
        <button class="browser-history-button" type="button" data-browser="history">历史</button>
        <span class="browser-address-label">地址</span>
        <form class="browser-address-form">
          <input class="browser-address" aria-label="地址" autocomplete="off" spellcheck="false" />
          <button type="submit">转到</button>
        </form>
      </div>
      <div class="browser-history-panel" hidden></div>
      <div class="browser-page-area">
        <iframe class="browser-frame" title="网页内容" sandbox="allow-scripts"></iframe>
        <div class="browser-loading" hidden>正在打开网页……</div>
      </div>
      <div class="browser-status"><span data-browser-status>完成</span><span>本地 Intranet</span></div>`,t}bindUi(){const t=this.record.content.querySelector(".browser-app");!t||t.dataset.bound||(t.dataset.bound="true",this.frame=t.querySelector(".browser-frame"),this.address=t.querySelector(".browser-address"),this.status=t.querySelector("[data-browser-status]"),this.historyPanel=t.querySelector(".browser-history-panel"),t.querySelector('[data-browser="back"]').addEventListener("click",()=>this.go(-1)),t.querySelector('[data-browser="forward"]').addEventListener("click",()=>this.go(1)),t.querySelector('[data-browser="reload"]').addEventListener("click",()=>this.load(this.history[this.historyIndex])),t.querySelector('[data-browser="home"]').addEventListener("click",()=>this.navigate(this.snapshot.browserHome)),t.querySelector('[data-browser="history"]').addEventListener("click",()=>this.toggleHistory()),t.querySelector(".browser-address-form").addEventListener("submit",e=>{e.preventDefault(),this.navigate(this.address.value)}),this.frame.addEventListener("load",()=>{this.status.textContent="完成"}))}navigate(t,e=!0){const s=p(t);e&&(this.history=this.history.slice(0,this.historyIndex+1),this.history.push(s),this.historyIndex=this.history.length-1),this.load(s)}load(t){if(!t||!this.frame)return;this.address.value=t,this.status.textContent="正在打开网页…";const e=this.routeMap.get(p(t));if(e?.status==="uncached")this.frame.removeAttribute("srcdoc"),this.frame.src=w(t,"uncached"),this.updateTitle(e.title||"该网页无法脱机使用"),this.status.textContent="网页不可用";else if(e)this.frame.removeAttribute("srcdoc"),this.frame.src=e.file,this.updateTitle(e.title||"Internet");else{const s=this.isKnownHost(t)?"uncached":"missing";this.frame.removeAttribute("srcdoc"),this.frame.src=w(t,s),this.updateTitle(s==="uncached"?"该网页无法脱机使用":"无法显示网页"),this.status.textContent="网页不可用"}this.renderHistory()}go(t){const e=this.historyIndex+t;e<0||e>=this.history.length||(this.historyIndex=e,this.load(this.history[e]))}isKnownHost(t){try{const e=new URL(t).host;return[...this.routeMap.keys()].some(s=>new URL(s).host===e)}catch{return!1}}toggleHistory(){this.historyPanel.hidden=!this.historyPanel.hidden,this.renderHistory()}renderHistory(){if(!this.historyPanel)return;const t=this.snapshot.browserHistory||[];this.historyPanel.innerHTML=`
      <strong>今天</strong>
      ${t.map(e=>`<button type="button" data-url="${x(e.url)}"><span>${m(e.time)}</span>${m(e.title)}</button>`).join("")}`,this.historyPanel.querySelectorAll("[data-url]").forEach(e=>{e.addEventListener("click",()=>{this.navigate(e.dataset.url),this.historyPanel.hidden=!0})})}onMessage(t){t.source!==this.frame?.contentWindow||t.data?.source!=="punan-web"||t.data.type==="navigate"&&t.data.url&&this.navigate(t.data.url)}updateTitle(t){const e=this.record.window.querySelector(".xp-titlebar strong");e.textContent=`${t} - Internet`}}function p(r){const t=String(r||"").trim();if(!t)return"";if(!/^https?:\/\//i.test(t))return`http://${t}`;try{const e=new URL(t);return e.hash="",e.toString()}catch{return t}}function w(r,t){return`/system_pages/browser-error.html?${new URLSearchParams({type:t,url:r}).toString()}`}function m(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function x(r=""){return m(r).replaceAll("'","&#039;")}function A(r,t){const e=r.windows.get("messenger");if(e)return r.open(e.options);const s=document.createElement("div");s.className="messenger-app",s.innerHTML=`
    <aside class="messenger-contacts">
      <div class="messenger-profile"><span>穆</span><strong>真相只有一个</strong><small>在线</small></div>
      <div class="messenger-search">查找联系人</div>
      ${t.conversations.map((n,o)=>`
        <button type="button" data-chat="${n.id}" class="${o===0?"is-active":""}">
          <span class="contact-avatar">${l(n.avatar)}</span>
          <span><strong>${l(n.title)}</strong><small>${l(n.preview)}</small></span>
        </button>`).join("")}
    </aside>
    <section class="messenger-chat"><header></header><div class="message-list"></div><div class="message-compose"><textarea disabled>网络连接不可用，消息未发送</textarea><button disabled>发送</button></div></section>`;const a=r.open({id:"messenger",title:"聊天",icon:"Q",width:760,height:520,content:s}),i=n=>{const o=t.conversations.find(c=>c.id===n);s.querySelector(".messenger-chat header").innerHTML=`<strong>${l(o.title)}</strong><small>${l(o.subtitle)}</small>`,s.querySelector(".message-list").innerHTML=o.messages.map(c=>`
      <div class="message-row ${c.sender==="穆南"?"is-self":""}">
        <span class="message-meta">${l(c.time)}　${l(c.sender)}</span>
        <p>${l(c.text)}</p>
      </div>`).join(""),s.querySelectorAll("[data-chat]").forEach(c=>c.classList.toggle("is-active",c.dataset.chat===n))};return s.querySelectorAll("[data-chat]").forEach(n=>n.addEventListener("click",()=>i(n.dataset.chat))),i(t.conversations[0].id),a}function l(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function $(r,t){const e=r.windows.get("explorer");if(e)return r.open(e.options);const s=document.createElement("div");s.className="explorer-app",s.innerHTML=`
    <div class="explorer-toolbar"><button type="button">← 后退</button><button type="button">搜索</button><button type="button">文件夹</button><span>地址　C:\\Documents and Settings\\穆南\\我的文档</span></div>
    <div class="explorer-body">
      <aside><h3>文件和文件夹任务</h3><p>查看系统信息</p><p>移动这个文件夹</p><h3>其他位置</h3><p>桌面</p><p>我的电脑</p></aside>
      <main class="file-grid"></main>
    </div>`;const a=r.open({id:"explorer",title:"我的文档",icon:"▣",width:760,height:500,content:s}),i=s.querySelector(".file-grid");return i.innerHTML=t.items.map(n=>`
    <button type="button" class="file-item" data-file="${n.id}">
      <span>${n.type==="folder"?"📁":n.type==="image"?"▧":"▤"}</span>
      <small>${b(n.name)}</small>
    </button>`).join(""),i.querySelectorAll("[data-file]").forEach(n=>n.addEventListener("dblclick",()=>{const o=t.items.find(c=>c.id===n.dataset.file);k(r,o)})),a}function k(r,t){if(t.type==="folder"){r.open({id:`folder-${t.id}`,title:t.name,icon:"📁",width:520,height:340,content:'<div class="empty-folder"><span>📁</span><p>该文件夹为空。</p></div>'});return}const e=`<article class="text-viewer"><pre>${b(t.content||"")}</pre><footer>${b(t.modified||"")}</footer></article>`;r.open({id:`file-${t.id}`,title:`${t.name} - 记事本`,icon:"▤",width:620,height:430,content:e})}function b(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}class E{constructor(t,e){this.root=t,this.snapshot=e,this.windows=null,this.browser=null,this.startMenu=null,this.clockTimer=null}async start(t){const[e,s]=await Promise.all([fetch(this.snapshot.data.messenger).then(i=>i.json()),fetch(this.snapshot.data.filesystem).then(i=>i.json())]);this.root.innerHTML=`
      <section class="pc-shell" aria-label="${q(this.snapshot.deviceLabel)}只读镜像">
        <div class="desktop-wallpaper" aria-hidden="true">
          <div class="wallpaper-haze"></div>
          <div class="wallpaper-factory"></div>
          <div class="wallpaper-trees"></div>
        </div>
        <div class="desktop-icons"></div>
        <div class="windows-layer"></div>
        <nav class="start-menu" aria-hidden="true">
          <header><span class="user-avatar">穆</span><strong>穆南</strong></header>
          <div class="start-menu__body">
            <button data-launch="browser"><span>e</span>Internet</button>
            <button data-launch="messenger"><span>Q</span>聊天</button>
            <button data-launch="explorer"><span>▣</span>我的文档</button>
          </div>
          <footer>已脱机工作</footer>
        </nav>
        <footer class="taskbar">
          <button class="start-button" type="button"><span class="start-orb">◆</span>开始</button>
          <div class="task-buttons"></div>
          <div class="system-tray"><span>离线</span><time></time></div>
        </footer>
      </section>`;const a=this.root.querySelector(".pc-shell");this.windows=new L(a.querySelector(".windows-layer"),a.querySelector(".task-buttons")),this.startMenu=a.querySelector(".start-menu"),this.browser=new S({windowManager:this.windows,snapshot:this.snapshot}),this.messengerFactory=()=>A(this.windows,e),this.explorerFactory=()=>$(this.windows,s),this.renderDesktopIcons(a.querySelector(".desktop-icons")),this.bindShell(a),this.updateClock(a.querySelector(".system-tray time")),this.browser.open(t)}renderDesktopIcons(t){const e=[{app:"explorer",glyph:"▣",label:"我的电脑"},{app:"browser",glyph:"e",label:"Internet"},{app:"messenger",glyph:"Q",label:"聊天"},{app:"recycle",glyph:"♲",label:"回收站"}];t.innerHTML=e.map(s=>`
      <button class="desktop-icon" type="button" data-launch="${s.app}">
        <span class="desktop-icon__glyph desktop-icon__glyph--${s.app}">${s.glyph}</span>
        <span>${s.label}</span>
      </button>`).join("")}bindShell(t){t.querySelector(".start-button").addEventListener("click",s=>{s.stopPropagation();const a=this.startMenu.classList.toggle("is-open");this.startMenu.setAttribute("aria-hidden",String(!a))}),t.addEventListener("click",s=>{const a=s.target.closest("[data-launch]");if(a){this.launch(a.dataset.launch),this.startMenu.classList.remove("is-open"),this.startMenu.setAttribute("aria-hidden","true");return}!s.target.closest(".start-menu")&&!s.target.closest(".start-button")&&(this.startMenu.classList.remove("is-open"),this.startMenu.setAttribute("aria-hidden","true"))})}launch(t){t==="browser"&&this.browser.open(),t==="messenger"&&this.messengerFactory(),t==="explorer"&&this.explorerFactory(),t==="recycle"&&this.windows.open({id:"recycle",title:"回收站",icon:"♲",width:480,height:320,content:'<div class="empty-folder"><span>♲</span><p>回收站是空的。</p></div>'})}updateClock(t){const e=new Date(this.snapshot.captureIso);t.textContent=e.toLocaleTimeString("zh-CN",{hour:"2-digit",minute:"2-digit",hour12:!1}),t.title=this.snapshot.captureTime}}function q(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}const f="punan.archive.access.v1";class M{constructor(t){this.root=t,this.catalog=null,this.snapshot=null,this.shell=null,this.unlocked=new Set(this.readAccess())}async start(){this.catalog=await u("/snapshots/catalog.json");const t=new URLSearchParams(location.search),e=t.get("access");let s=null;if(e&&this.catalog.releases[e]){const n=this.catalog.releases[e];n.snapshots.forEach(c=>this.unlocked.add(c)),s=n.initialUrl,this.persistAccess(),t.delete("access");const o=t.toString();history.replaceState(null,"",`${location.pathname}${o?`?${o}`:""}${location.hash}`)}if(!this.unlocked.size){this.renderEmptyArchive();return}const a=t.get("snapshot"),i=this.unlocked.has(a)?a:this.catalog.snapshots.find(n=>this.unlocked.has(n.id))?.id;await this.mount(i,s)}async mount(t,e=null){const s=this.catalog.snapshots.find(o=>o.id===t);if(!s||!this.unlocked.has(t))throw new Error("没有权限挂载该快照。");const a=await u(s.manifest),i=await Promise.all(a.routeSources.map(o=>u(o).catch(()=>({routes:[]}))));a.routes=i.flatMap(o=>o.routes||[]),this.snapshot=a,this.root.replaceChildren();const n=document.createElement("main");n.className="archive-frame",n.innerHTML=`
      <button class="archive-tab" type="button" aria-expanded="false">
        <span class="archive-tab__dot"></span>
        档案
      </button>
      <aside class="archive-drawer" aria-hidden="true">
        <div class="archive-drawer__header">
          <p class="eyebrow">PUNAN NETWORK ARCHIVE</p>
          <h1>镜像挂载器</h1>
          <button class="archive-drawer__close" type="button" aria-label="关闭">×</button>
        </div>
        <section class="capture-card">
          <span>当前来源</span>
          <strong>${d(a.deviceLabel)}</strong>
          <dl>
            <div><dt>捕获时间</dt><dd>${d(a.captureTime)}</dd></div>
            <div><dt>镜像编号</dt><dd>${d(a.id)}</dd></div>
            <div><dt>状态</dt><dd>只读 · 已校验</dd></div>
          </dl>
        </section>
        <section class="snapshot-list" aria-label="已解锁快照"></section>
        <div class="archive-drawer__actions">
          <button type="button" data-action="reset-snapshot">重置当前镜像</button>
          <button type="button" data-action="export-keyring">导出档案钥匙</button>
          <button type="button" data-action="import-keyring">导入档案钥匙</button>
        </div>
        <p class="archive-note">镜像中的改动只在本次阅览期间有效。重新挂载后将恢复到捕获时状态。</p>
      </aside>
      <div class="drawer-shade"></div>
      <section class="mount-strip">
        <span>${d(a.id)}</span>
        <span>${d(a.captureTime)}</span>
        <span>READ ONLY</span>
      </section>
      <div class="pc-mount"></div>`,this.root.append(n),this.bindArchiveControls(n,e),this.renderSnapshotList(n.querySelector(".snapshot-list")),this.shell=new E(n.querySelector(".pc-mount"),a),await this.shell.start(e||a.initialUrl)}bindArchiveControls(t){const e=t.querySelector(".archive-tab"),s=t.querySelector(".archive-drawer"),a=t.querySelector(".drawer-shade"),i=()=>{t.classList.remove("drawer-open"),e.setAttribute("aria-expanded","false"),s.setAttribute("aria-hidden","true")},n=()=>{t.classList.add("drawer-open"),e.setAttribute("aria-expanded","true"),s.setAttribute("aria-hidden","false")};e.addEventListener("click",()=>t.classList.contains("drawer-open")?i():n()),a.addEventListener("click",i),s.querySelector(".archive-drawer__close").addEventListener("click",i),s.querySelector('[data-action="reset-snapshot"]').addEventListener("click",()=>{this.mount(this.snapshot.id,this.snapshot.initialUrl)}),s.querySelector('[data-action="export-keyring"]').addEventListener("click",async o=>{const c=btoa(unescape(encodeURIComponent(JSON.stringify([...this.unlocked]))));await navigator.clipboard?.writeText(c).catch(()=>{}),o.currentTarget.textContent="钥匙已复制",setTimeout(()=>{o.currentTarget.textContent="导出档案钥匙"},1600)}),s.querySelector('[data-action="import-keyring"]').addEventListener("click",()=>{const o=prompt("粘贴档案钥匙。导入只会增加本机已经发现的镜像。");if(o)try{const c=JSON.parse(decodeURIComponent(escape(atob(o.trim())))),v=new Set(this.catalog.snapshots.map(h=>h.id));c.filter(h=>v.has(h)).forEach(h=>this.unlocked.add(h)),this.persistAccess(),location.reload()}catch{alert("无法识别这把档案钥匙。")}})}renderSnapshotList(t){const e=this.catalog.snapshots.filter(s=>this.unlocked.has(s.id));t.innerHTML=`
      <h2>已发现的镜像</h2>
      ${e.map(s=>`
        <button class="snapshot-item ${s.id===this.snapshot.id?"is-active":""}" data-snapshot="${s.id}">
          <span>${d(s.shortDate)}</span>
          <strong>${d(s.label)}</strong>
          <small>${d(s.device)}</small>
        </button>`).join("")}`,t.querySelectorAll("[data-snapshot]").forEach(s=>{s.addEventListener("click",()=>this.mount(s.dataset.snapshot))})}renderEmptyArchive(){const t=["localhost","127.0.0.1"].includes(location.hostname)?'<a class="empty-archive__preview" href="/?access=ch01-msbbs-1847">本地开发：挂载第一章镜像</a>':"";this.root.innerHTML=`
      <main class="empty-archive">
        <div class="empty-archive__mark">PN</div>
        <p class="eyebrow">PUNAN NETWORK ARCHIVE</p>
        <h1>未挂载任何介质</h1>
        <p>请从《身后的呼唤》Replay章节中出现的档案链接进入。</p>
        ${t}
      </main>`}readAccess(){try{return JSON.parse(localStorage.getItem(f)||"[]")}catch{return[]}}persistAccess(){localStorage.setItem(f,JSON.stringify([...this.unlocked]))}}async function u(r){const t=await fetch(r);if(!t.ok)throw new Error(`无法读取 ${r}`);return t.json()}function d(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")}const g=document.querySelector("#app"),H=new M(g);H.start().catch(r=>{console.error(r),g.innerHTML=`
    <main class="fatal-error">
      <h1>镜像挂载失败</h1>
      <p>${T(r?.message||String(r))}</p>
      <button onclick="location.reload()">重新尝试</button>
    </main>`});function T(r){return r.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
