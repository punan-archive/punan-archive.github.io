import{t as R,i as f,l as P,h as D,c as G,r as K,o as q}from"./index-DFBB4X22.js";import{r as E,a as U}from"./notifications-ChVni9qY.js";const x=5,B=new Set(["我的文档","documentsandsettings","c:","桌面","doc","jpg","txt"]);function T(e){return Array.isArray(e)?!e.length||e[0]?.recordId?e:N(e,"hidden"):Array.isArray(e?.records)?e.records:[...N(e?.registeredMirrors||[],"registered"),...N(e?.hiddenMirrors||[],"hidden")]}function V(e,n,t=x){const s=T(e),r={name:String(n.name||n.keyword||"").trim(),date:String(n.date||"").trim(),path:String(n.path||"").trim(),type:String(n.type||"").trim()},a=Q(r.name),l=Y(r.path);if(r.name&&!a||r.path&&!l)return{status:"short",results:[]};if([a,!!r.date,l].filter(Boolean).length<2)return{status:"insufficient",results:[]};const m=s.filter(h=>!(h.visibility==="registered"||r.type&&h.typeLabel!==r.type||r.date&&!Z(r.date,h)||a&&M(h.originalName)!==M(r.name)||l&&!ee(r.path,h)));return m.length>t?{status:"too-many",results:[]}:{status:m.length?"found":"empty",results:m}}function N(e,n){return e.flatMap(t=>(t.items||[]).map(s=>({recordId:`${t.id}:${s.id}`,originalName:s.name,originalParentId:s.parentId??null,originalPath:X(t,s),recordKind:t.recordKind||(n==="registered"?"deleted":"overwritten"),originalModifiedAt:s.modified||null,capturedAt:t.label||t.match?.date||"",deletedOrOverwrittenAt:t.deletedOrOverwrittenAt||t.match?.date||t.label||"",mimeType:s.type||"file",typeLabel:te(s.type),size:s.size||"",payload:s,searchableDirectoryParts:[...new Set([...t.sourcePaths||[],t.sourcePath,...t.match?.pathTerms||[]].filter(Boolean))],milestoneTags:Array.isArray(s.milestoneTags)?s.milestoneTags:[],visibility:n,reason:t.reason||"",legacyGroupId:t.id})))}function X(e,n){if(n.originalPath)return n.originalPath;const t=e.sourcePaths?.length?e.sourcePaths:[e.sourcePath].filter(Boolean),s=t.find(l=>l.endsWith(`\\${n.name}`));if(s)return s.slice(0,-(n.name.length+1));const r=J[n.parentId]||[];return t.find(l=>r.some(c=>I(l).includes(I(c))))||t[0]||""}const J={"student-work-folder":["少年宫\\学生作业"],"registration-folder":["少年宫\\名单和表格"],"negative-scan-folder":["照片\\扫描"],"september-photo-folder":["照片\\2010年\\9月杂片"],"photo-folder":["我的文档\\照片"],"downloads-folder":["下载"],"loose-files-folder":["先放这里"]};function Q(e){const n=M(e);if(n.length<4||B.has(n))return!1;const t=e.lastIndexOf(".");return t>0&&t<e.length-1}function Y(e){if(!e)return!1;const n=I(e);return n.length<2||B.has(n)?!1:!["c:documentsandsettings刘江源我的文档","c:documentsandsettings穆南我的文档"].includes(n)}function Z(e,n){return[n.deletedOrOverwrittenAt,n.capturedAt,n.originalModifiedAt].filter(Boolean).some(t=>String(t).slice(0,10)===e)}function ee(e,n){const t=I(e);return[n.originalPath,...n.searchableDirectoryParts||[]].filter(Boolean).some(r=>I(r).includes(t))}function M(e=""){return String(e).trim().toLocaleLowerCase("zh-CN").replace(/\s+/g,"")}function I(e=""){return String(e).trim().toLocaleLowerCase("zh-CN").replace(/[\\/\s_-]+/g,"")}function te(e){return{document:"文档",image:"图片",spreadsheet:"表格",text:"文本",webarchive:"网页",component:"程序"}[e]||"文件"}const O="guardian250";function ye(e,n,t){if(!n)return[];const s=T(n);return D(e,t,s).restorations.filter(a=>a.source==="250").map(a=>a.recordId)}function be(e){localStorage.removeItem(`punan-250-mounted:${e}`),sessionStorage.removeItem(`punan-250-ad-seen:${e}`)}function ve(e,n,t,s={}){const r=e.windows.get(O);if(r)return e.open(r.options);const a=s.snapshotId||"unknown",l=s.analyticsMilestones||{};R(l.guardianOpen);const c=T(n),m=c.filter(o=>o.visibility==="registered"),h=c.filter(o=>o.visibility!=="registered"),p=document.createElement("section");p.className="guardian250-app",p.innerHTML=`
    <header class="g250-header">
      <span class="g250-logo"><b>250</b><small>电脑卫士</small></span>
      <span class="g250-version">${i(n.product.version)}</span>
      <span class="g250-slogan">永久免费　保护您的电脑</span>
    </header>
    <nav class="g250-modules" aria-label="功能列表">
      ${$("overview","体检","电脑体检")}
      ${$("scan","scan","木马查杀")}
      ${$("firewall","security","250防火墙")}
      ${$("repair","repair","漏洞修复")}
      ${$("cleanup","cleanup","垃圾清理")}
      ${$("software","application","软件管家")}
      ${$("protection","folder","文件保护")}
    </nav>
    <main class="g250-main" data-g250-main></main>
    <footer class="g250-footer">
      <span>云安全连接：<b class="is-offline">未连接</b></span>
      <span>文件保护服务：正在运行</span>
      <span>安装来源：${i(n.product.installSource)}</span>
    </footer>`;const b=e.open({id:O,title:"250电脑卫士",icon:f("security"),width:790,height:570,content:p}),d={activeModule:"overview",selectedRecordId:m[0]?.recordId||null,searchResults:[],restoredIds:P(a).restorations.filter(o=>o.source==="250").map(o=>o.recordId),recoveryLog:P(a).restorations};d.restoredIds.length&&R(l.guardianRestore);const g=p.querySelector("[data-g250-main]"),F=o=>{const u=c.find(v=>v.recordId===o);if(!u)return;const S=d.restoredIds.includes(o),y=K(t,a,u);if(S&&y){q(e,t,y.id);return}d.restoredIds.includes(o)||d.restoredIds.push(o),R(l.guardianRestore),d.recoveryLog=P(a).restorations,d.selectedRecordId=o,A(),le(g,u,y,t,()=>q(e,t,y.id)),ce(e,t,y),window.dispatchEvent(new CustomEvent("punan:protection-restored",{detail:{recordId:o,item:y}}))},k=(o=g)=>{o.querySelectorAll("[data-g250-restore]").forEach(u=>u.addEventListener("click",()=>F(u.dataset.g250Restore)))},W=o=>{const u=t.items.find(S=>S._recordId===o);u&&G(e,t,{rootId:u.parentId??null,windowId:u.parentId?`folder-${u.parentId}`:"explorer"})},A=()=>{p.querySelectorAll("[data-g250-module]").forEach(o=>{o.classList.toggle("is-active",o.dataset.g250Module===d.activeModule)}),d.activeModule==="overview"?ne(g,n,d,m):d.activeModule==="protection"?re(g,n,d,m):se(g,d.activeModule),j()},j=()=>{g.querySelector("[data-g250-check]")?.addEventListener("click",()=>_(g,"电脑体检")),g.querySelector("[data-g250-run-scan]")?.addEventListener("click",()=>_(g,ge(d.activeModule))),g.querySelectorAll("[data-g250-select-record]").forEach(o=>o.addEventListener("click",()=>{d.selectedRecordId=o.dataset.g250SelectRecord,A()})),g.querySelectorAll("[data-g250-open-location]").forEach(o=>o.addEventListener("click",()=>{W(o.dataset.g250OpenLocation)})),k(),g.querySelector("[data-g250-search-form]")?.addEventListener("submit",o=>{o.preventDefault();const u=new FormData(o.currentTarget),S={date:String(u.get("date")||"").trim(),path:String(u.get("path")||"").trim(),name:String(u.get("name")||"").trim(),type:String(u.get("type")||"").trim()},y=g.querySelector("[data-g250-search-message]"),v=V(h,S);d.searchResults=v.results,y.textContent={insufficient:"检索范围过大。请至少填写两项日期、原路径或原文件名。文件类型只用于缩小结果。",short:"原路径需要有区分度，原文件名需要完整包含扩展名。请补充检索条件。","too-many":`符合条件的保护索引超过 ${x} 组。请补充条件后重新检索。`,found:`检索结束：找到 ${v.results.length} 条未登记保护记录。`,empty:"检索结束：没有找到同时符合这些条件的保护索引。"}[v.status],y.className=`g250-search-message ${["insufficient","short","too-many"].includes(v.status)?"is-warning":v.status==="found"?"is-success":""}`,H(g,d),k(g.querySelector("[data-g250-search-results]"))})};return p.querySelectorAll("[data-g250-module]").forEach(o=>o.addEventListener("click",()=>{d.activeModule=o.dataset.g250Module,A()})),A(),ue(b.content,a),b}function ne(e,n,t,s){const r=t.restoredIds.length;e.innerHTML=`
    <section class="g250-overview">
      <div class="g250-score"><span>${n.product.healthScore}</span><small>电脑健康分</small></div>
      <div class="g250-overview-copy">
        <h2>您的电脑处于亚健康状态</h2>
        <p>本机击败了全国 <strong>25.0%</strong> 的电脑。</p>
        <button class="g250-primary" type="button" data-g250-check>立即体检</button>
      </div>
      <aside><b>37</b><span>项优化建议</span><small>离线状态下部分项目不可用</small></aside>
    </section>
    <section class="g250-status-grid">
      <article><span>${f("security")}</span><b>木马防火墙</b><small>已开启（本地规则）</small></article>
      <article><span>${f("folder")}</span><b>文件保护</b><small>${r?`已恢复 ${r} 个文件`:`发现 ${s.length} 个可还原文件`}</small></article>
      <article><span>${f("repair")}</span><b>漏洞修复</b><small>12个补丁等待下载</small></article>
    </section>
    <p class="g250-tip">上次后台服务运行：${i(n.product.lastServiceRun)}</p>`}function se(e,n){const t={scan:["木马查杀","全面检测内存、启动项和系统关键位置。"],firewall:["250防火墙","正在使用本地规则。云端威胁情报暂时不可用。"],repair:["漏洞修复","需要连接补丁服务器才能下载系统更新。"],cleanup:["垃圾清理","扫描缓存、日志和无效快捷方式。"],software:["软件管家","精品软件库需要连接互联网。"]}[n]||["电脑体检","检查当前系统状态。"];e.innerHTML=`
    <section class="g250-tool">
      <div class="g250-tool-icon">${f(fe(n))}</div>
      <div><h2>${t[0]}</h2><p>${t[1]}</p><button class="g250-primary" type="button" data-g250-run-scan>${n==="software"||n==="repair"?"检查更新":"开始扫描"}</button></div>
    </section>
    <section class="g250-progress-panel" data-g250-progress>
      <div><span style="width:0%"></span></div><p>等待操作。</p>
    </section>`}function re(e,n,t,s){const r=[...s,...t.searchResults].find(l=>l.recordId===t.selectedRecordId),a=z(s,t);e.innerHTML=`
    <section class="g250-protection">
      <div class="g250-protection-sidebar">
        <h2>文件保护</h2>
        <p>文件被覆盖或删除时，保护服务可能保留一份临时镜像。</p>
        <button type="button" class="is-active">保护记录</button>
        <button type="button" disabled>排除列表</button>
        <button type="button" disabled>保护设置</button>
      </div>
      <div class="g250-protection-body">
        <section class="g250-records">
          <header><b>已登记保护记录</b><small>共 ${s.length} 条</small></header>
          ${a.map(l=>oe(l,t)).join("")}
        </section>
        ${r?ie(r,t):'<div class="g250-empty">选择一条记录查看文件。</div>'}
        <details class="g250-advanced" ${t.searchResults.length?"open":""}>
          <summary>高级：检索未登记保护索引</summary>
          <form data-g250-search-form>
            <label>保护日期<input name="date" type="date" min="2010-01-01" max="2010-11-12"></label>
            <label>原路径包含<input name="path" type="text" autocomplete="off" placeholder="例如：学生作业"></label>
            <label>原文件名<input name="name" type="text" autocomplete="off" placeholder="需要完整文件名及扩展名"></label>
            <label>文件类型<select name="type"><option value="">全部</option><option>文档</option><option>图片</option><option>表格</option><option>文本</option></select></label>
            <button class="g250-primary" type="submit">检索保护索引</button>
          </form>
          <p class="g250-search-message" data-g250-search-message>旧版本索引可能没有登记在保护记录中。</p>
          <div class="g250-search-results" data-g250-search-results></div>
        </details>
        ${ae(t.recoveryLog)}
      </div>
    </section>`,H(e,t)}function ae(e=[]){return e.length?`<details class="g250-recovery-log"><summary>恢复记录（${e.length}）</summary>
    <div>${e.map(n=>`<article><b>${i(n.assignedName)}</b><small>原文件名：${i(n.originalName||n.assignedName)}</small><small>原位置：${i(n.originalPath||"不详")}</small><small>原修改：${i(n.originalModifiedAt||"不详")}　删除/覆盖：${i(n.deletedOrOverwrittenAt||"不详")}</small></article>`).join("")}</div>
  </details>`:""}function H(e,n){const t=e.querySelector("[data-g250-search-results]");t&&(t.innerHTML=z(n.searchResults,n).map(s=>{const r=w(n,s.recordId);return`
    <article class="${r?"is-restored":""}">
      <span>${f("archive")}</span>
      <div><b>${i(s.originalName)}</b><small>原位置：${i(s.originalPath)}</small><small>${r?`已恢复为：${i(r.assignedName)}`:i(s.deletedOrOverwrittenAt||s.capturedAt)}</small></div>
      <button type="button" data-g250-restore="${L(s.recordId)}">${r?"打开文件":"恢复"}</button>
    </article>`}).join(""))}function oe(e,n){const t=w(n,e.recordId);return`<button type="button" class="g250-record ${n.selectedRecordId===e.recordId?"is-selected":""} ${t?"is-restored":""}" data-g250-select-record="${L(e.recordId)}">
    <span>${f("archive")}</span><span class="g250-record-copy"><b>${i(e.originalName)}</b><small>${i(e.originalModifiedAt||e.capturedAt)}</small></span>${t?`<em>已恢复为：${i(t.assignedName)}</em>`:"<em>等待恢复</em>"}
  </button>`}function ie(e,n){const t=w(n,e.recordId);return`<section class="g250-mirror-detail">
    <header><b>保护记录</b><small>原位置：${i(e.originalPath)}</small></header>
    <div class="g250-protected-file"><span>${f(e.payload?.type==="image"?"image":"word")}</span><div><b>${i(e.originalName)}</b><small>原修改时间：${i(e.originalModifiedAt||"不详")}　删除/覆盖：${i(e.deletedOrOverwrittenAt||"不详")}</small></div></div>
    ${t?`<p class="g250-restored-copy">已恢复为：<b>${i(t.assignedName)}</b></p>`:""}
    <div class="g250-detail-actions"><button class="g250-primary" type="button" data-g250-restore="${L(e.recordId)}">${t?"打开已恢复文件":"恢复文件"}</button>${t?`<button type="button" data-g250-open-location="${L(e.recordId)}">打开所在文件夹</button>`:""}</div>
  </section>`}function w(e,n){return e.recoveryLog.find(t=>t.source==="250"&&t.recordId===n)||null}function z(e,n){return[...e].sort((t,s)=>+!!w(n,t.recordId)-+!!w(n,s.recordId))}function le(e,n,t,s,r){e.querySelector(".g250-recovery-notice")?.remove();const l=`${t.name} 已恢复到“${pe(s.items,t.parentId)}”。`,c=document.createElement("div");c.className="g250-recovery-notice",c.innerHTML=`<span>${f("folder")}</span><div><b>恢复完成</b><p>${i(l)}</p></div><button type="button">打开${i(t.name)}</button>`,c.querySelector("button").addEventListener("click",r),e.prepend(c)}function ce(e,n,t){const s=de(n,t);if(!s.length)return;s.forEach(p=>{const b=`file-${p.document.id}`,d=e.windows.get(b);d&&(C(d.window,p.refIds,!1),e.requestAttention(b))});const r=e.layer.closest(".pc-shell");if(!r)return;E(r.querySelector("[data-file-link-notification]"));const a=s.find(p=>e.windows.has(`file-${p.document.id}`))||s[0],l=s.reduce((p,b)=>p+b.refIds.length,0),c=document.createElement("aside");c.className="system-notification",c.dataset.fileLinkNotification="";const m=s.length===1?`“${a.document.name}”中的${l>1?`${l}处引用`:"一处引用"}现在可以打开。`:`恢复的文件被${s.length}份Word文档引用，${l}处引用现在可以打开。`;c.innerHTML=`<button type="button" class="system-notification__open"><span>${f("word")}</span><span><b>250文件恢复</b><small>${i(m)}</small><em>单击此处查看文档。</em></span></button><button type="button" class="system-notification__close" aria-label="关闭通知">×</button>`;const h=()=>{q(e,n,a.document.id),requestAnimationFrame(()=>{const p=e.windows.get(`file-${a.document.id}`);C(p?.window,a.refIds,!0)}),E(c)};c.querySelector(".system-notification__open").addEventListener("click",h),c.querySelector(".system-notification__close").addEventListener("click",()=>E(c)),r.append(c),U(r)}function de(e,n){const t=new Set([n.id,n._originalItemId].filter(Boolean));return(e.items||[]).flatMap(s=>{if(s.type!=="document"||!Array.isArray(s.blocks))return[];const r=[...new Set(s.blocks.filter(a=>["attachment","missing-image","resolved-image"].includes(a.type)&&t.has(a.refId)).map(a=>a.refId))];return r.length?[{document:s,refIds:r}]:[]})}function C(e,n,t){if(!e)return;const s=[...e.querySelectorAll("[data-word-ref]")].filter(r=>n.includes(r.dataset.wordRef));s.forEach(r=>{r.classList.remove("is-newly-restored"),r.offsetWidth,r.classList.add("is-newly-restored")}),t&&s[0]?.scrollIntoView({block:"center",behavior:"smooth"})}function _(e,n){const t=e.querySelector("[data-g250-progress]")||document.createElement("section");t.isConnected||(t.className="g250-progress-panel",t.dataset.g250Progress="",t.innerHTML='<div><span style="width:0%"></span></div><p></p>',e.append(t));const s=t.querySelector("span"),r=t.querySelector("p");let a=0;r.textContent=`${n}正在扫描系统关键位置……`;const l=setInterval(()=>{a=Math.min(100,a+9+Math.floor(Math.random()*13)),s.style.width=`${a}%`,a>=100&&(clearInterval(l),r.textContent=n==="漏洞修复"||n==="软件管家"?"检查完成。网络不可用，无法获取更新列表。":"扫描完成。发现37项优化建议，未发现可自动处理的威胁。")},90)}function ue(e,n){const t=`punan-250-ad-seen:${n}`;if(sessionStorage.getItem(t))return;sessionStorage.setItem(t,"1");const s=document.createElement("div");s.className="g250-ad",s.innerHTML=`
    <section>
      <button type="button" class="g250-ad-close" aria-label="关闭">×</button>
      <span class="g250-ad-burst">装机必备</span>
      <h2>250安全全家桶</h2>
      <p>一次安装，全面提升您的上网体验！</p>
      <ul><li>250安全浏览器</li><li>250桌面助手</li><li>250极速下载</li><li>250好压</li></ul>
      <button class="g250-ad-install" type="button">一键安装（推荐）</button>
      <button class="g250-ad-decline" type="button">暂不安装（不推荐）</button>
      <small>勾选即表示您同意《250软件许可及推广组件说明》</small>
    </section>`,e.append(s);const r=()=>s.remove();s.querySelector(".g250-ad-close").addEventListener("click",r),s.querySelector(".g250-ad-decline").addEventListener("click",r),s.querySelector(".g250-ad-install").addEventListener("click",a=>{a.currentTarget.textContent="正在连接下载服务器……",a.currentTarget.disabled=!0,setTimeout(()=>{a.currentTarget.textContent="网络不可用，安装失败",setTimeout(r,900)},650)})}function pe(e,n){if(!n)return"我的文档";const t=[];let s=e.find(r=>r.id===n);for(;s;)t.unshift(s.name),s=s.parentId?e.find(r=>r.id===s.parentId):null;return t.length?t.join("\\"):"我的文档"}function $(e,n,t){return`<button type="button" data-g250-module="${e}" class="${e==="overview"?"is-active":""}"><span>${f(n)}</span><small>${t}</small></button>`}function ge(e){return{scan:"木马查杀",firewall:"250防火墙",repair:"漏洞修复",cleanup:"垃圾清理",software:"软件管家"}[e]||"电脑体检"}function fe(e){return{scan:"scan",firewall:"security",repair:"repair",cleanup:"cleanup",software:"application"}[e]||"security"}function i(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function L(e=""){return i(e).replaceAll("'","&#39;")}export{ve as createGuardian250App,ye as hydrateProtectionOverlays,be as resetProtectionProgress};
