import{i as d,l as F,s as R}from"./index-dOvddscA.js";function z(r,H,{snapshotId:o=""}={}){const L=r.windows.get("mail");if(L)return r.open(L.options);const s=structuredClone(H),f=s.terminalSupplement||null;let $=s.folders?.[0]?.id||"inbox",v=null;const E=()=>{if(!f?.message||!o)return!1;const e=F(o);if(!e.flags.terminalMailDelivered)return!1;let t=s.messages.find(a=>a.id===f.message.id);return t||(t=structuredClone(f.message),s.messages.unshift(t)),t.unread=!e.flags.terminalMailOpened,!0};E();const i=document.createElement("div");i.className="mail-app",i.innerHTML=`
    <nav class="mail-menubar" aria-hidden="true"><span>文件(F)</span><span>编辑(E)</span><span>查看(V)</span><span>工具(T)</span><span>邮件(M)</span><span>帮助(H)</span></nav>
    <div class="mail-toolbar">
      <button>${d("mail")}<span>新邮件</span></button>
      <button type="button" data-mail-reply disabled>${d("reply")}<span>答复</span></button>
      <button>${d("forward")}<span>转发</span></button>
      <i></i><button>${d("print")}<span>打印</span></button>
      <button>${d("recycle")}<span>删除</span></button>
      <i></i><button>${d("mailReceive")}<span>发送/接收</span></button>
    </div>
    <div class="mail-layout">
      <aside class="mail-folders">
        <h2>文件夹</h2>
        <div class="mail-account">${d("mail")}<strong>${n(s.account?.label||"本地文件夹")}</strong></div>
        ${(s.folders||[]).map((e,t)=>`
          <button type="button" data-mail-folder="${u(e.id)}" class="${t===0?"is-active":""}">
            ${d(e.icon||"mailFolder")}<span>${n(e.label)}</span><small>${e.unread?`(${e.unread})`:""}</small>
          </button>`).join("")}
      </aside>
      <section class="mail-main">
        <header class="mail-list-head"><span>发件人</span><span>主题</span><span>接收时间</span></header>
        <div class="mail-list" role="list"></div>
        <article class="mail-preview"><div class="mail-empty">请选择一封邮件以便阅读。</div></article>
      </section>
    </div>
    <footer class="mail-status"><span>脱机工作</span><span>${n(s.account?.address||"")}</span></footer>`;const w=e=>{e.detail?.snapshotId!==o||!E()||(b($,!1),r.requestAttention("mail"))},q=e=>{e.detail?.snapshotId===o&&g()},B=()=>{m&&window.clearTimeout(m),window.removeEventListener("punan:terminal-mail-delivered",w),window.removeEventListener("punan:terminal-reply-sent",q)};r.open({id:"mail",title:"Outlook Express",icon:d("mail"),width:870,height:680,left:Math.max(18,Math.floor((r.layer.clientWidth-870)/2)),top:48,content:i,onClose:B});const A=i.querySelector(".mail-list"),h=i.querySelector(".mail-preview"),j=i.querySelector(".mail-list-head"),c=i.querySelector("[data-mail-reply]"),M=i.querySelector(".mail-status"),C=M.querySelector("span:first-child");let m=null;const k=()=>{const e=s.folders.find(a=>a.id===$),t=s.messages.filter(a=>a.folderId===$).length;return`${e?.label||""}：${t} 封邮件`},g=()=>{const e=!!(o&&F(o).flags.terminalMailReplySent),t=!!(v?.terminalSupplement&&f?.reply&&!e);c.disabled=!t,c.title=t?"答复这封邮件":"",c.classList.toggle("is-reply-ready",t),M.classList.toggle("is-reply-ready",t),C.textContent=t?"可以答复这封邮件。":k(),m&&(window.clearTimeout(m),m=null),c.classList.remove("is-reply-attention"),t&&(c.offsetWidth,c.classList.add("is-reply-attention"),m=window.setTimeout(()=>{c.classList.remove("is-reply-attention"),m=null},5200))},T=()=>{i.querySelectorAll("[data-mail-folder]").forEach(e=>{const t=s.messages.filter(a=>a.folderId===e.dataset.mailFolder&&a.unread).length;e.querySelector("small").textContent=t?`(${t})`:""})},x=e=>{v=e,e.terminalSupplement&&o&&(e.unread=!1,R(o,{terminalMailOpened:!0}),window.dispatchEvent(new CustomEvent("punan:terminal-mail-opened",{detail:{snapshotId:o,messageId:e.id}}))),i.classList.toggle("has-terminal-message",!!e.terminalSupplement),i.querySelectorAll("[data-mail-message]").forEach(t=>t.classList.toggle("is-active",t.dataset.mailMessage===e.id)),i.querySelector(`[data-mail-message="${D(e.id)}"]`)?.classList.remove("is-unread"),h.innerHTML=`
      <header>
        <h1>${n(e.subject)}</h1>
        <dl>
          <div><dt>发件人:</dt><dd>${n(e.from)}</dd></div>
          <div><dt>收件人:</dt><dd>${n(e.to)}</dd></div>
          <div><dt>发送时间:</dt><dd>${n(e.date)}</dd></div>
        </dl>
        ${e.state==="draft"?'<strong class="mail-draft-flag">此邮件尚未发送。</strong>':""}
        ${e.relatedMessageId?'<button type="button" class="mail-related" data-mail-related>查找相关邮件</button>':""}
      </header>
      ${e.attachments?.length?`<div class="mail-attachments"><span>附件:</span>${e.attachments.map(t=>`<button type="button" data-mail-attachment="${u(t.id)}">${d("image")}<b>${n(t.name)}</b><small>${n(t.size||"")}</small></button>`).join("")}</div>`:""}
      <div class="mail-body">${String(e.body||"").split(`
`).map(t=>t?`<p>${n(t)}</p>`:"<br>").join("")}</div>`,T(),g(),h.querySelector("[data-mail-related]")?.addEventListener("click",()=>{const t=s.messages.find(a=>a.id===e.relatedMessageId);t&&(b(t.folderId),x(t))}),h.querySelectorAll("[data-mail-attachment]").forEach(t=>t.addEventListener("click",()=>{const a=e.attachments.find(S=>S.id===t.dataset.mailAttachment);if(!a?.src)return;const p=document.createElement("article"),y=a.presentation==="occluded-print";p.className=`image-viewer${y?" image-viewer--occluded":""}`,p.innerHTML=`${y?`<div class="occluded-photo-stage"><div class="occluded-photo-wrap"><img src="${u(a.src)}" alt="${u(a.name)}"><span class="occluding-print" aria-hidden="true"></span></div></div>`:`<div><img src="${u(a.src)}" alt="${u(a.name)}"></div>`}<footer><span>${n(a.caption||"")}</span><small>${n(a.size||"")}</small></footer>`,r.open({id:`mail-attachment-${a.id}`,title:`${a.name} - 图片和传真查看器`,icon:d("image"),width:760,height:560,content:p})}))},b=(e,t=!0)=>{$=e;const a=s.folders.find(l=>l.id===e),p=(s.messages||[]).filter(l=>l.folderId===e),y=e==="sent",S=j.querySelectorAll("span");S[0].textContent=y?"收件人":"发件人",i.querySelectorAll("[data-mail-folder]").forEach(l=>l.classList.toggle("is-active",l.dataset.mailFolder===e)),A.innerHTML=p.length?p.map(l=>`
      <button type="button" class="mail-row ${l.unread?"is-unread":""}" data-mail-message="${u(l.id)}" role="listitem">
        <span>${l.attachments?.length?d("paperclip"):""}${n(y?l.toLabel||l.to:l.fromLabel||l.from)}</span>
        <span>${l.state==="draft"?"<em>[草稿]</em> ":""}${n(l.subject)}</span>
        <time>${n(l.listDate||l.date)}</time>
      </button>`).join(""):`<div class="mail-empty mail-empty--folder">${n(a?.emptyNotice||"此文件夹中没有邮件。")}</div>`,t&&(v=null,i.classList.remove("has-terminal-message"),h.innerHTML=p.length?'<div class="mail-empty">请选择一封邮件以便阅读。</div>':`<div class="mail-empty mail-empty--folder">${n(a?.emptyNotice||"此文件夹中没有邮件。")}</div>`,g()),A.querySelectorAll("[data-mail-message]").forEach(l=>l.addEventListener("click",()=>x(p.find(N=>N.id===l.dataset.mailMessage)))),C.textContent=`${a?.label||""}：${p.length} 封邮件`,T()};i.querySelectorAll("[data-mail-folder]").forEach(e=>e.addEventListener("click",()=>b(e.dataset.mailFolder))),c.addEventListener("click",()=>{c.disabled||!v?.terminalSupplement||!f?.reply||window.dispatchEvent(new CustomEvent("punan:external-reply-request",{detail:{snapshotId:o,messageId:v.id,reply:structuredClone(f.reply)}}))}),window.addEventListener("punan:terminal-mail-delivered",w),window.addEventListener("punan:terminal-reply-sent",q),b(s.folders?.[0]?.id)}function n(r=""){return String(r).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function u(r=""){return n(r).replaceAll("'","&#39;")}function D(r=""){return globalThis.CSS?.escape?CSS.escape(String(r)):String(r).replaceAll('"','\\"')}export{z as createMailApp};
