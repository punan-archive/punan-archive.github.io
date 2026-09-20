import{i as n}from"./index-qeGUSnd0.js";function g(d,c){const $=d.windows.get("mail");if($)return d.open($.options);const s=document.createElement("div");s.className="mail-app",s.innerHTML=`
    <nav class="mail-menubar" aria-hidden="true"><span>文件(F)</span><span>编辑(E)</span><span>查看(V)</span><span>工具(T)</span><span>邮件(M)</span><span>帮助(H)</span></nav>
    <div class="mail-toolbar" aria-hidden="true">
      <button>${n("mail")}<span>新邮件</span></button>
      <button>${n("reply")}<span>答复</span></button>
      <button>${n("forward")}<span>转发</span></button>
      <i></i><button>${n("print")}<span>打印</span></button>
      <button>${n("recycle")}<span>删除</span></button>
      <i></i><button>${n("mailReceive")}<span>发送/接收</span></button>
    </div>
    <div class="mail-layout">
      <aside class="mail-folders">
        <h2>文件夹</h2>
        <div class="mail-account">${n("mail")}<strong>${l(c.account?.label||"本地文件夹")}</strong></div>
        ${(c.folders||[]).map((t,e)=>`
          <button type="button" data-mail-folder="${r(t.id)}" class="${e===0?"is-active":""}">
            ${n(t.icon||"mailFolder")}<span>${l(t.label)}</span><small>${t.unread?`(${t.unread})`:""}</small>
          </button>`).join("")}
      </aside>
      <section class="mail-main">
        <header class="mail-list-head"><span>发件人</span><span>主题</span><span>接收时间</span></header>
        <div class="mail-list" role="list"></div>
        <article class="mail-preview"><div class="mail-empty">请选择一封邮件以便阅读。</div></article>
      </section>
    </div>
    <footer class="mail-status"><span>脱机工作</span><span>${l(c.account?.address||"")}</span></footer>`,d.open({id:"mail",title:"Outlook Express",icon:n("mail"),width:870,height:590,content:s});const v=s.querySelector(".mail-list"),p=s.querySelector(".mail-preview"),b=s.querySelector(".mail-list-head"),h=t=>{s.querySelectorAll("[data-mail-message]").forEach(e=>e.classList.toggle("is-active",e.dataset.mailMessage===t.id)),p.innerHTML=`
      <header>
        <h1>${l(t.subject)}</h1>
        <dl>
          <div><dt>发件人:</dt><dd>${l(t.from)}</dd></div>
          <div><dt>收件人:</dt><dd>${l(t.to)}</dd></div>
          <div><dt>发送时间:</dt><dd>${l(t.date)}</dd></div>
        </dl>
        ${t.state==="draft"?'<strong class="mail-draft-flag">此邮件尚未发送。</strong>':""}
        ${t.relatedMessageId?'<button type="button" class="mail-related" data-mail-related>查找相关邮件</button>':""}
      </header>
      ${t.attachments?.length?`<div class="mail-attachments"><span>附件:</span>${t.attachments.map(e=>`<button type="button" data-mail-attachment="${r(e.id)}">${n("image")}<b>${l(e.name)}</b><small>${l(e.size||"")}</small></button>`).join("")}</div>`:""}
      <div class="mail-body">${String(t.body||"").split(`
`).map(e=>e?`<p>${l(e)}</p>`:"<br>").join("")}</div>`,p.querySelector("[data-mail-related]")?.addEventListener("click",()=>{const e=c.messages.find(i=>i.id===t.relatedMessageId);e&&(u(e.folderId),h(e))}),p.querySelectorAll("[data-mail-attachment]").forEach(e=>e.addEventListener("click",()=>{const i=t.attachments.find(a=>a.id===e.dataset.mailAttachment);if(!i?.src)return;const o=document.createElement("article"),m=i.presentation==="occluded-print";o.className=`image-viewer${m?" image-viewer--occluded":""}`,o.innerHTML=`${m?`<div class="occluded-photo-stage"><div class="occluded-photo-wrap"><img src="${r(i.src)}" alt="${r(i.name)}"><span class="occluding-print" aria-hidden="true"></span></div></div>`:`<div><img src="${r(i.src)}" alt="${r(i.name)}"></div>`}<footer><span>${l(i.caption||"")}</span><small>${l(i.size||"")}</small></footer>`,d.open({id:`mail-attachment-${i.id}`,title:`${i.name} - 图片和传真查看器`,icon:n("image"),width:760,height:560,content:o})}))},u=t=>{const e=c.folders.find(a=>a.id===t),i=(c.messages||[]).filter(a=>a.folderId===t),o=t==="sent",m=b.querySelectorAll("span");m[0].textContent=o?"收件人":"发件人",s.querySelectorAll("[data-mail-folder]").forEach(a=>a.classList.toggle("is-active",a.dataset.mailFolder===t)),v.innerHTML=i.length?i.map(a=>`
      <button type="button" class="mail-row ${a.unread?"is-unread":""}" data-mail-message="${r(a.id)}" role="listitem">
        <span>${a.attachments?.length?n("paperclip"):""}${l(o?a.toLabel||a.to:a.fromLabel||a.from)}</span>
        <span>${a.state==="draft"?"<em>[草稿]</em> ":""}${l(a.subject)}</span>
        <time>${l(a.listDate||a.date)}</time>
      </button>`).join(""):`<div class="mail-empty mail-empty--folder">${l(e?.emptyNotice||"此文件夹中没有邮件。")}</div>`,p.innerHTML=i.length?'<div class="mail-empty">请选择一封邮件以便阅读。</div>':`<div class="mail-empty mail-empty--folder">${l(e?.emptyNotice||"此文件夹中没有邮件。")}</div>`,v.querySelectorAll("[data-mail-message]").forEach(a=>a.addEventListener("click",()=>h(i.find(f=>f.id===a.dataset.mailMessage)))),s.querySelector(".mail-status span:first-child").textContent=`${e?.label||""}：${i.length} 封邮件`};s.querySelectorAll("[data-mail-folder]").forEach(t=>t.addEventListener("click",()=>u(t.dataset.mailFolder))),u(c.folders?.[0]?.id)}function l(d=""){return String(d).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}function r(d=""){return l(d).replaceAll("'","&#39;")}export{g as createMailApp};
