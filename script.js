const positiveWords = [
  "好用",
  "很好",
  "不错",
  "满意",
  "喜欢",
  "推荐",
  "流畅",
  "方便",
  "快速",
  "很快",
  "清晰",
  "稳定",
  "漂亮",
  "优秀",
  "惊喜",
  "及时",
  "耐心",
  "实用",
  "准确",
  "简洁",
  "顺畅",
  "高效",
  "值得",
  "友好",
  "舒服",
  "完整",
  "解决",
  "接受",
  "赞",
  "棒"
const negativeWords = [
  "不好",
  "差",
  "失望",
  "卡顿",
  "崩溃",
  "闪退",
  "太慢",
  "慢",
  "贵",
  "错误",
  "失败",
  "复杂",
  "难用",
  "麻烦",
  "问题",
  "投诉",
  "退款",
  "延迟",
  "不准",
  "看不懂",
  "不方便",
  "不满意",
  "糟糕",
  "缺少",
  "没有",
  "无法",
  "排队",
  "太长",
  "影响正常使用",
  "没有反应",
  "重复点击",
  "bug"
];
const topics={"产品功能":["功能","按钮","搜索","登录","注册","页面","系统","软件","版本","更新"],"性能稳定":["卡顿","崩溃","闪退","加载","速度","慢","流畅","稳定","延迟"],"价格权益":["价格","贵","便宜","优惠","会员","收费","退款","学生价","权益"],"客服服务":["客服","服务","回复","态度","处理","售后","人工","沟通"],"物流交付":["物流","快递","发货","送达","包装","配送","到货"],"界面体验":["界面","设计","颜色","布局","字体","美观","简洁","清晰"],"内容质量":["内容","答案","结果","准确","错误","信息","推荐","资料"]};
const sample=["页面设计很简洁，搜索功能也很好用。","更新后经常卡顿，打开详情页要等很久。","客服回复很耐心，问题当天就解决了。","会员价格太贵，希望增加学生优惠。","推荐结果比较准确，节省了很多时间。","登录按钮偶尔没有反应，需要重复点击。","物流速度很快，包装也很完整。","功能不少，但第一次使用有点看不懂。","退款流程太复杂，客服回复也比较慢。","界面颜色舒服，整体操作很流畅。","内容质量不错，不过部分答案存在错误。","希望增加历史记录导出功能。","新版经常闪退，已经影响正常使用。","人工客服态度很好，但排队时间太长。","学生会员很实用，价格也可以接受。"];
const $=s=>document.querySelector(s);let results=[];
function scoreText(text) {
  let score = 0;
  let cleanedText = text.toLowerCase();

  const negativePhrases = [
    "不好用",
    "不方便",
    "不满意",
    "不稳定",
    "不准确",
    "没有反应",
    "无法使用",
    "影响正常使用"
  ];

  negativePhrases.forEach((phrase) => {
    if (cleanedText.includes(phrase)) {
      score -= 2;
      cleanedText = cleanedText.replaceAll(phrase, "");
    }
  });

  positiveWords.forEach((word) => {
    if (cleanedText.includes(word.toLowerCase())) {
      score += 1;
    }
  });

  negativeWords.forEach((word) => {
    if (cleanedText.includes(word.toLowerCase())) {
      score -= 1;
    }
  });

  // “问题已经解决”不应判断为纯负向
  if (/问题.{0,8}(解决|处理|修复)/.test(text)) {
    score += 2;
  }

  // 更重视“但是、不过”之后的内容
  const parts = text.split(/但是|不过|然而|但/);

  if (parts.length > 1) {
    const ending = parts[parts.length - 1];

    positiveWords.forEach((word) => {
      if (ending.includes(word)) score += 1;
    });

    negativeWords.forEach((word) => {
      if (ending.includes(word)) score -= 1;
    });
  }

  return score;
}
function getTopics(text){const arr=Object.entries(topics).map(([name,words])=>[name,words.filter(w=>text.includes(w)).length]).filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>x[0]);return arr.length?arr:["其他反馈"]}
function analyzeItem(text,i){const score=scoreText(text);return{id:i+1,text,score,sentiment:score>0?"positive":score<0?"negative":"neutral",topics:getTopics(text)}}
function countsBy(key){return results.reduce((a,x)=>{const k=x[key];a[k]=(a[k]||0)+1;return a},{})}
function topicCounts(list=results){return list.reduce((a,x)=>{x.topics.forEach(t=>a[t]=(a[t]||0)+1);return a},{})}
function pct(n,total){return total?Math.round(n/total*100):0}
function renderBars(el, entries, total, useSentimentColor = false) {
  el.className = "chart";

  el.innerHTML = entries.length
    ? entries
        .map(([name, value, colorClass = ""]) => `
          <div class="bar">
            <span>${name}</span>
            <div class="track">
              <div
                class="fill ${useSentimentColor ? colorClass : ""}"
                style="width:${Math.max(4, pct(value, total))}%"
              ></div>
            </div>
            <b>${value}</b>
          </div>
        `)
        .join("")
    : "暂无数据";
}
function render(){let analysisTime = localStorage.getItem("trendlens-analysis-time") || "";
    const c=countsBy("sentiment"),tc=Object.entries(topicCounts()).sort((a,b)=>b[1]-a[1]);$("#totalMetric").textContent=results.length;$("#positiveMetric").textContent=pct(c.positive||0,results.length)+"%";$("#negativeMetric").textContent=pct(c.negative||0,results.length)+"%";$("#topicMetric").textContent=tc[0]?.[0]||"—";$("#analysisTime").textContent = analysisTime
  ? `分析于 ${analysisTime}`
  : "尚未分析";renderBars(
  $("#sentimentChart"),
  [
    ["正向", c.positive || 0, "positive"],
    ["中性", c.neutral || 0, "neutral"],
    ["负向", c.negative || 0, "negative"]
  ],
  Math.max(results.length, 1),
  true
);renderBars($("#topicChart"),tc.slice(0,5),Math.max(tc.reduce((s,x)=>s+x[1],0),1));renderInsights();applyFilters();localStorage.setItem("trendlens-results",JSON.stringify(results));localStorage.setItem("trendlens-input",$("#feedbackInput").value)}
function renderInsights(){const c=countsBy("sentiment"),tc=Object.entries(topicCounts()).sort((a,b)=>b[1]-a[1]),neg=results.filter(x=>x.sentiment==="negative"),nt=Object.entries(topicCounts(neg)).sort((a,b)=>b[1]-a[1]);const cards=[];if(tc[0])cards.push(["FOCUS TOPIC",`${tc[0][0]}是当前反馈焦点`,`共出现 ${tc[0][1]} 次，建议优先整理该主题下的典型反馈并形成需求清单。`]);if(nt[0])cards.push(["RISK ALERT",`${nt[0][0]}负向反馈最集中`,`建议对相关反馈进行人工复核，按影响范围和修复成本建立问题优先级。`]);const nr=pct(c.negative||0,results.length),pr=pct(c.positive||0,results.length);cards.push([nr>=35?"PRIORITY":pr>=55?"ADVANTAGE":"BALANCE",nr>=35?`负向反馈达到 ${nr}%`:pr>=55?`正向反馈达到 ${pr}%`:"用户态度较为分散",nr>=35?"先处理阻断性问题，再处理体验类建议，并在下一版本复测。":pr>=55?"把高频正向关键词转化为产品卖点，同时持续监控负向主题。":"建议按用户类型和使用场景继续拆分，避免只看总体平均值。"]);$("#insights").innerHTML=cards.slice(0,3).map(x=>`<div class="insight"><small>${x[0]}</small><h3>${x[1]}</h3><p>${x[2]}</p></div>`).join("")}
function sentimentName(s){return{positive:"正向",neutral:"中性",negative:"负向"}[s]}
function applyFilters(){const sf=$("#sentimentFilter").value,q=$("#searchInput").value.trim().toLowerCase();const list=results.filter(x=>(sf==="all"||x.sentiment===sf)&&(!q||x.text.toLowerCase().includes(q)||x.topics.some(t=>t.includes(q))));$("#resultBody").innerHTML=list.length?list.map(x=>`<tr><td>${x.id}</td><td>${escapeHtml(x.text)}</td><td><span class="badge ${x.sentiment}">${sentimentName(x.sentiment)}</span></td><td>${x.topics.map(t=>`<span class="topic">${t}</span>`).join("")}</td><td>${x.score>0?"+":""}${x.score}</td></tr>`).join(""):'<tr><td colspan="5" class="empty-cell">没有符合条件的反馈</td></tr>'}
function escapeHtml(s){return s.replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function run(){const items=$("#feedbackInput").value.split(/\n+/).map(x=>x.trim()).filter(x=>x.length>1);if(!items.length){$("#message").className="message error";$("#message").textContent="请先输入至少一条反馈。";return}results = items.map(analyzeItem);

analysisTime = new Date().toLocaleString("zh-CN", {
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});

localStorage.setItem("trendlens-analysis-time", analysisTime);$("#message").className="message";$("#message").textContent=`分析完成：共处理 ${results.length} 条反馈。`;render()}
function parseCSV(text){const lines=text.replace(/^\uFEFF/,"").split(/\r?\n/).filter(Boolean),rows=lines.map(line=>{const out=[];let cur="",quote=false;for(let i=0;i<line.length;i++){const ch=line[i];if(ch==='"'&&quote&&line[i+1]==='"'){cur+='"';i++}else if(ch==='"')quote=!quote;else if(ch===","&&!quote){out.push(cur);cur=""}else cur+=ch}out.push(cur);return out.map(x=>x.trim())});const headers=(rows[0]||[]).map(x=>x.toLowerCase()),allowed=["feedback","comment","content","text","反馈","评论","内容"],idx=headers.findIndex(x=>allowed.includes(x));return(idx>=0?rows.slice(1).map(r=>r[idx]):rows.map(r=>r[0])).filter(Boolean)}
function exportCSV(){if(!results.length)return alert("暂无可导出的结果");const rows=[["id","feedback","sentiment","topics","score"],...results.map(x=>[x.id,x.text,sentimentName(x.sentiment),x.topics.join("|"),x.score])];const csv="\uFEFF"+rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv"})),a=document.createElement("a");a.href=url;a.download="trendlens-analysis.csv";a.click();URL.revokeObjectURL(url)}
$("#analyzeBtn").onclick=run;$("#sampleBtn").onclick=()=>{$("#feedbackInput").value=sample.join("\n");run()};$("#clearBtn").onclick = () => {
  const confirmed = confirm("确定要清空当前分析结果吗？");

  if (!confirmed) return;

  localStorage.removeItem("trendlens-results");
  localStorage.removeItem("trendlens-input");
  localStorage.removeItem("trendlens-analysis-time");

  location.reload();
};;$("#sentimentFilter").onchange=applyFilters;$("#searchInput").oninput=applyFilters;$("#exportBtn").onclick=exportCSV;$("#themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("trendlens-theme",document.body.classList.contains("dark")?"dark":"light")};$("#csvInput").onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const items=parseCSV(r.result);$("#feedbackInput").value=items.join("\n");$("#message").textContent=`已导入 ${items.length} 条反馈。`};r.readAsText(f,"UTF-8")};if(localStorage.getItem("trendlens-theme")==="dark")document.body.classList.add("dark");try{const saved=JSON.parse(localStorage.getItem("trendlens-results")||"[]");if(saved.length){results=saved;$("#feedbackInput").value=localStorage.getItem("trendlens-input")||"";render()}}catch(e){}
