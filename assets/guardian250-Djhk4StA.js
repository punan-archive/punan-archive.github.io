import{i as m,l as w,h as _,c as j,r as F,o as T}from"./index-CGOILWum.js";const O=5,k=new Set(["我的文档","documentsandsettings","c:","桌面","doc","jpg","txt"]);function R(e){return Array.isArray(e)?!e.length||e[0]?.recordId?e:P(e,"hidden"):Array.isArray(e?.records)?e.records:[...P(e?.registeredMirrors||[],"registered"),...P(e?.hiddenMirrors||[],"hidden")]}function D(e,n,t=O){const s=R(e),a={name:String(n.name||n.keyword||"").trim(),date:String(n.date||"").trim(),path:String(n.path||"").trim(),type:String(n.type||"").trim()},o=U(a.name),l=W(a.path);if(a.name&&!o||a.path&&!l)return{status:"short",results:[]};if([o,!!a.date,l].filter(Boolean).length<2)return{status:"insufficient",results:[]};const y=s.filter(p=>!(p.visibility==="registered"||a.type&&p.typeLabel!==a.type||a.date&&!X(a.date,p)||o&&L(p.originalName)!==L(a.name)||l&&!J(a.path,p)));return y.length>t?{status:"too-many",results:[]}:{status:y.length?"found":"empty",results:y}}function P(e,n){return e.flatMap(t=>(t.items||[]).map(s=>({recordId:`${t.id}:${s.id}`,originalName:s.name,originalParentId:s.parentId??null,originalPath:G(t,s),recordKind:t.recordKind||(n==="registered"?"deleted":"overwritten"),originalModifiedAt:s.modified||null,capturedAt:t.label||t.match?.date||"",deletedOrOverwrittenAt:t.deletedOrOverwrittenAt||t.match?.date||t.label||"",mimeType:s.type||"file",typeLabel:Q(s.type),size:s.size||"",payload:s,searchableDirectoryParts:[...new Set([...t.sourcePaths||[],t.sourcePath,...t.match?.pathTerms||[]].filter(Boolean))],milestoneTags:Array.isArray(s.milestoneTags)?s.milestoneTags:[],visibility:n,reason:t.reason||"",legacyGroupId:t.id})))}function G(e,n){if(n.originalPath)return n.originalPath;const t=e.sourcePaths?.length?e.sourcePaths:[e.sourcePath].filter(Boolean),s=t.find(l=>l.endsWith(`\\${n.name}`));if(s)return s.slice(0,-(n.name.length+1));const a=K[n.parentId]||[];return t.find(l=>a.some(g=>$(l).includes($(g))))||t[0]||""}const K={"student-work-folder":["少年宫\\学生作业"],"registration-folder":["少年宫\\名单和表格"],"negative-scan-folder":["照片\\扫描"],"downloads-folder":["下载"],"loose-files-folder":["先放这里"]};function U(e){const n=L(e);if(n.length<4||k.has(n))return!1;const t=e.lastIndexOf(".");return t>0&&t<e.length-1}function W(e){if(!e)return!1;const n=$(e);return n.length<2||k.has(n)?!1:!["c:documentsandsettings刘江源我的文档","c:documentsandsettings穆南我的文档"].includes(n)}function X(e,n){return[n.deletedOrOverwrittenAt,n.capturedAt,n.originalModifiedAt].filter(Boolean).some(t=>String(t).slice(0,10)===e)}function J(e,n){const t=$(e);return[n.originalPath,...n.searchableDirectoryParts||[]].filter(Boolean).some(a=>$(a).includes(t))}function L(e=""){return String(e).trim().toLocaleLowerCase("zh-CN").replace(/\s+/g,"")}function $(e=""){return String(e).trim().toLocaleLowerCase("zh-CN").replace(/[\\/\s_-]+/g,"")}function Q(e){return{document:"文档",image:"图片",spreadsheet:"表格",text:"文本",webarchive:"网页",component:"程序"}[e]||"文件"}const N="guardian250";function ce(e,n,t){if(!n)return[];const s=R(n);return _(e,t,s).restorations.filter(o=>o.source==="250").map(o=>o.recordId)}function de(e){localStorage.removeItem(`punan-250-mounted:${e}`),sessionStorage.removeItem(`punan-250-ad-seen:${e}`)}function ue(e,n,t,s={}){const a=e.windows.get(N);if(a)return e.open(a.options);const o=s.snapshotId||"unknown",l=R(n),g=l.filter(r=>r.visibility==="registered"),y=l.filter(r=>r.visibility!=="registered"),p=document.createElement("section");p.className="guardian250-app",p.innerHTML=`
    <header class="g250-header">
      <span class="g250-logo"><b>250</b><small>电脑卫士</small></span>
      <span class="g250-version">${i(n.product.version)}</span>
      <span class="g250-slogan">永久免费　保护您的电脑</span>
    </header>
    <nav class="g250-modules" aria-label="功能列表">
      ${v("overview","体检","电脑体检")}
      ${v("scan","scan","木马查杀")}
      ${v("firewall","security","250防火墙")}
      ${v("repair","repair","漏洞修复")}
      ${v("cleanup","cleanup","垃圾清理")}
      ${v("software","application","软件管家")}
      ${v("protection","folder","文件保护")}
    </nav>
    <main class="g250-main" data-g250-main></main>
    <footer class="g250-footer">
      <span>云安全连接：<b class="is-offline">未连接</b></span>
      <span>文件保护服务：正在运行</span>
      <span>安装来源：${i(n.product.installSource)}</span>
    </footer>`;const M=e.open({id:N,title:"250电脑卫士",icon:m("security"),width:790,height:570,content:p}),c={activeModule:"overview",selectedRecordId:g[0]?.recordId||null,searchResults:[],restoredIds:w(o).restorations.filter(r=>r.source==="250").map(r=>r.recordId),recoveryLog:w(o).restorations},u=p.querySelector("[data-g250-main]"),B=r=>{const d=l.find(h=>h.recordId===r);if(!d)return;const b=c.restoredIds.includes(r),f=F(t,o,d);if(b&&f){T(e,t,f.id);return}c.restoredIds.includes(r)||c.restoredIds.push(r),c.recoveryLog=w(o).restorations,c.selectedRecordId=r,I(),se(u,d,f,t,()=>T(e,t,f.id)),window.dispatchEvent(new CustomEvent("punan:protection-restored",{detail:{recordId:r,item:f}}))},E=(r=u)=>{r.querySelectorAll("[data-g250-restore]").forEach(d=>d.addEventListener("click",()=>B(d.dataset.g250Restore)))},H=r=>{const d=t.items.find(b=>b._recordId===r);d&&j(e,t,{rootId:d.parentId??null,windowId:d.parentId?`folder-${d.parentId}`:"explorer"})},I=()=>{p.querySelectorAll("[data-g250-module]").forEach(r=>{r.classList.toggle("is-active",r.dataset.g250Module===c.activeModule)}),c.activeModule==="overview"?V(u,n,c,g):c.activeModule==="protection"?Z(u,n,c,g):Y(u,c.activeModule),z()},z=()=>{u.querySelector("[data-g250-check]")?.addEventListener("click",()=>q(u,"电脑体检")),u.querySelector("[data-g250-run-scan]")?.addEventListener("click",()=>q(u,oe(c.activeModule))),u.querySelectorAll("[data-g250-select-record]").forEach(r=>r.addEventListener("click",()=>{c.selectedRecordId=r.dataset.g250SelectRecord,I()})),u.querySelectorAll("[data-g250-open-location]").forEach(r=>r.addEventListener("click",()=>{H(r.dataset.g250OpenLocation)})),E(),u.querySelector("[data-g250-search-form]")?.addEventListener("submit",r=>{r.preventDefault();const d=new FormData(r.currentTarget),b={date:String(d.get("date")||"").trim(),path:String(d.get("path")||"").trim(),name:String(d.get("name")||"").trim(),type:String(d.get("type")||"").trim()},f=u.querySelector("[data-g250-search-message]"),h=D(y,b);c.searchResults=h.results,f.textContent={insufficient:"检索范围过大。请至少填写两项日期、原路径或原文件名。文件类型只用于缩小结果。",short:"原路径需要有区分度，原文件名需要完整包含扩展名。请补充检索条件。","too-many":`符合条件的保护索引超过 ${O} 组。请补充条件后重新检索。`,found:`检索结束：找到 ${h.results.length} 条未登记保护记录。`,empty:"检索结束：没有找到同时符合这些条件的保护索引。"}[h.status],f.className=`g250-search-message ${["insufficient","short","too-many"].includes(h.status)?"is-warning":h.status==="found"?"is-success":""}`,x(u,c),E(u.querySelector("[data-g250-search-results]"))})};return p.querySelectorAll("[data-g250-module]").forEach(r=>r.addEventListener("click",()=>{c.activeModule=r.dataset.g250Module,I()})),I(),ae(M.content,o),M}function V(e,n,t,s){const a=t.restoredIds.length;e.innerHTML=`
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
      <article><span>${m("security")}</span><b>木马防火墙</b><small>已开启（本地规则）</small></article>
      <article><span>${m("folder")}</span><b>文件保护</b><small>${a?`已恢复 ${a} 个文件`:`发现 ${s.length} 个可还原文件`}</small></article>
      <article><span>${m("repair")}</span><b>漏洞修复</b><small>12个补丁等待下载</small></article>
    </section>
    <p class="g250-tip">上次后台服务运行：${i(n.product.lastServiceRun)}</p>`}function Y(e,n){const t={scan:["木马查杀","全面检测内存、启动项和系统关键位置。"],firewall:["250防火墙","正在使用本地规则。云端威胁情报暂时不可用。"],repair:["漏洞修复","需要连接补丁服务器才能下载系统更新。"],cleanup:["垃圾清理","扫描缓存、日志和无效快捷方式。"],software:["软件管家","精品软件库需要连接互联网。"]}[n]||["电脑体检","检查当前系统状态。"];e.innerHTML=`
    <section class="g250-tool">
      <div class="g250-tool-icon">${m(ie(n))}</div>
      <div><h2>${t[0]}</h2><p>${t[1]}</p><button class="g250-primary" type="button" data-g250-run-scan>${n==="software"||n==="repair"?"检查更新":"开始扫描"}</button></div>
    </section>
    <section class="g250-progress-panel" data-g250-progress>
      <div><span style="width:0%"></span></div><p>等待操作。</p>
    </section>`}function Z(e,n,t,s){const a=[...s,...t.searchResults].find(l=>l.recordId===t.selectedRecordId),o=C(s,t);e.innerHTML=`
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
          ${o.map(l=>te(l,t)).join("")}
        </section>
        ${a?ne(a,t):'<div class="g250-empty">选择一条记录查看文件。</div>'}
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
        ${ee(t.recoveryLog)}
      </div>
    </section>`,x(e,t)}function ee(e=[]){return e.length?`<details class="g250-recovery-log"><summary>恢复记录（${e.length}）</summary>
    <div>${e.map(n=>`<article><b>${i(n.assignedName)}</b><small>原文件名：${i(n.originalName||n.assignedName)}</small><small>原位置：${i(n.originalPath||"不详")}</small><small>原修改：${i(n.originalModifiedAt||"不详")}　删除/覆盖：${i(n.deletedOrOverwrittenAt||"不详")}</small></article>`).join("")}</div>
  </details>`:""}function x(e,n){const t=e.querySelector("[data-g250-search-results]");t&&(t.innerHTML=C(n.searchResults,n).map(s=>{const a=S(n,s.recordId);return`
    <article class="${a?"is-restored":""}">
      <span>${m("archive")}</span>
      <div><b>${i(s.originalName)}</b><small>原位置：${i(s.originalPath)}</small><small>${a?`已恢复为：${i(a.assignedName)}`:i(s.deletedOrOverwrittenAt||s.capturedAt)}</small></div>
      <button type="button" data-g250-restore="${A(s.recordId)}">${a?"打开文件":"恢复"}</button>
    </article>`}).join(""))}function te(e,n){const t=S(n,e.recordId);return`<button type="button" class="g250-record ${n.selectedRecordId===e.recordId?"is-selected":""} ${t?"is-restored":""}" data-g250-select-record="${A(e.recordId)}">
    <span>${m("archive")}</span><span class="g250-record-copy"><b>${i(e.originalName)}</b><small>${i(e.originalModifiedAt||e.capturedAt)}</small></span>${t?`<em>已恢复为：${i(t.assignedName)}</em>`:"<em>等待恢复</em>"}
  </button>`}function ne(e,n){const t=S(n,e.recordId);return`<section class="g250-mirror-detail">
    <header><b>保护记录</b><small>原位置：${i(e.originalPath)}</small></header>
    <div class="g250-protected-file"><span>${m(e.payload?.type==="image"?"image":"word")}</span><div><b>${i(e.originalName)}</b><small>原修改时间：${i(e.originalModifiedAt||"不详")}　删除/覆盖：${i(e.deletedOrOverwrittenAt||"不详")}</small></div></div>
    ${t?`<p class="g250-restored-copy">已恢复为：<b>${i(t.assignedName)}</b></p>`:""}
    <div class="g250-detail-actions"><button class="g250-primary" type="button" data-g250-restore="${A(e.recordId)}">${t?"打开已恢复文件":"恢复文件"}</button>${t?`<button type="button" data-g250-open-location="${A(e.recordId)}">打开所在文件夹</button>`:""}</div>
  </section>`}function S(e,n){return e.recoveryLog.find(t=>t.source==="250"&&t.recordId===n)||null}function C(e,n){return[...e].sort((t,s)=>+!!S(n,t.recordId)-+!!S(n,s.recordId))}function se(e,n,t,s,a){e.querySelector(".g250-recovery-notice")?.remove();const l=`${t.name} 已恢复到“${re(s.items,t.parentId)}”。`,g=document.createElement("div");g.className="g250-recovery-notice",g.innerHTML=`<span>${m("folder")}</span><div><b>恢复完成</b><p>${i(l)}</p></div><button type="button">打开${i(t.name)}</button>`,g.querySelector("button").addEventListener("click",a),e.prepend(g)}function q(e,n){const t=e.querySelector("[data-g250-progress]")||document.createElement("section");t.isConnected||(t.className="g250-progress-panel",t.dataset.g250Progress="",t.innerHTML='<div><span style="width:0%"></span></div><p></p>',e.append(t));const s=t.querySelector("span"),a=t.querySelector("p");let o=0;a.textContent=`${n}正在扫描系统关键位置……`;const l=setInterval(()=>{o=Math.min(100,o+9+Math.floor(Math.random()*13)),s.style.width=`${o}%`,o>=100&&(clearInterval(l),a.textContent=n==="漏洞修复"||n==="软件管家"?"检查完成。网络不可用，无法获取更新列表。":"扫描完成。发现37项优化建议，未发现可自动处理的威胁。")},90)}function ae(e,n){const t=`punan-250-ad-seen:${n}`;if(sessionStorage.getItem(t))return;sessionStorage.setItem(t,"1");const s=document.createElement("div");s.className="g250-ad",s.innerHTML=`
    <section>
      <button type="button" class="g250-ad-close" aria-label="关闭">×</button>
      <span class="g250-ad-burst">装机必备</span>
      <h2>250安全全家桶</h2>
      <p>一次安装，全面提升您的上网体验！</p>
      <ul><li>250安全浏览器</li><li>250桌面助手</li><li>250极速下载</li><li>250好压</li></ul>
      <button class="g250-ad-install" type="button">一键安装（推荐）</button>
      <button class="g250-ad-decline" type="button">暂不安装（不推荐）</button>
      <small>勾选即表示您同意《250软件许可及推广组件说明》</small>
    </section>`,e.append(s);const a=()=>s.remove();s.querySelector(".g250-ad-close").addEventListener("click",a),s.querySelector(".g250-ad-decline").addEventListener("click",a),s.querySelector(".g250-ad-install").addEventListener("click",o=>{o.currentTarget.textContent="正在连接下载服务器……",o.currentTarget.disabled=!0,setTimeout(()=>{o.currentTarget.textContent="网络不可用，安装失败",setTimeout(a,900)},650)})}function re(e,n){if(!n)return"我的文档";const t=[];let s=e.find(a=>a.id===n);for(;s;)t.unshift(s.name),s=s.parentId?e.find(a=>a.id===s.parentId):null;return t.length?t.join("\\"):"我的文档"}function v(e,n,t){return`<button type="button" data-g250-module="${e}" class="${e==="overview"?"is-active":""}"><span>${m(n)}</span><small>${t}</small></button>`}function oe(e){return{scan:"木马查杀",firewall:"250防火墙",repair:"漏洞修复",cleanup:"垃圾清理",software:"软件管家"}[e]||"电脑体检"}function ie(e){return{scan:"scan",firewall:"security",repair:"repair",cleanup:"cleanup",software:"application"}[e]||"security"}function i(e=""){return String(e).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function A(e=""){return i(e).replaceAll("'","&#39;")}export{ue as createGuardian250App,ce as hydrateProtectionOverlays,de as resetProtectionProgress};
