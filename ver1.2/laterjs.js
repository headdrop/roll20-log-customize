/*!
   * Rolling Mint
   * roll20-log-customize
   *
   * https://headdrop.github.io/roll20-log-customize/
   *
   * by headdrop
   */

// 실행
$(function () {
  $("#rule").on("change",selectRule);
  document.getElementById("download").addEventListener("click",downloadCss);
  document.querySelector(".custom .apply").addEventListener('click',()=>{
    customCss();
    setTimeout(function() {checkOpt() }, 800);
  });
});

// 2-1. rule select
function selectRule () {
  let ruleList = document.getElementById("rule");
  let ruleName = ruleList.options[document.getElementById("rule").selectedIndex].text;
  let index = ruleList.selectedIndex;
  //rulelist
  let rule1 = ["Roll20 기본","Theme 2"]; //인세인 (r1_t1, r1_t2)
  let rule2 = ["Roll20 기본"]; // CoC (r2_t1)
  let rule = [rule1, rule2];
  document.getElementById("theme").innerHTML='';
  if (index!==0) { // 인덱스 0이아니면
    let selectedRule =  //룰 표 템플릿 추가
    // 인세인
    (index===1) ? `<div class="sheet-rolltemplate-Ninpo"><div class="sheet-bordered"><div class="sheet-vtop"><div class="sheet-blacklabel sheet-top" style="width: 80%"><span class="sheet-big">PC Roll 기본공격</span><span>(공격)</span></div><div class="sheet-resright"><span class="inlinerollresult showtip tipsy-n-right fullcrit" title="Rolling 2d6 =3+6">9</span></div></div><div class="sheet-myrow"><span class="sheet-lbl sheet-bold" data-i18n="assigned-skill-z">지정특기: </span><span class="sheet-notes sheet-inl">파괴  </span></div><div class="sheet-myrow"><span class="sheet-lbl sheet-bold" data-i18n="target-z">목표치: </span><span class="sheet-notes sheet-inl">8</span></div><div class="sheet-desc"><span class="sheet-notes">목표 1명을 선택해서 명중판정을 한다. 명중판정이 성공하고, 목표가 회피판정에 실패하면 1D6점 대미지.</span></div></div></div>`:
    // CoC
    (index===2) ? `<div class="sheet-rolltemplate-coc-1"><table><caption>SAN Roll</caption><tbody><tr><td class="sheet-template_label" data-i18n="value">기준치:</td><td class="sheet-template_value"><span class="inlinerollresult showtip tipsy-n-right" title="Rolling 50 = 50">50</span>/<span class="inlinerollresult showtip tipsy-n-right" title="Rolling floor(50/2) = floor(50/2)">25</span>/<span class="inlinerollresult showtip tipsy-n-right" title="Rolling floor(50/5) = floor(50/5)">10</span></td></tr><tr><td class="sheet-template_label" data-i18n="rolled">굴림:</td><td class="sheet-template_value"><span class="inlinerollresult showtip tipsy-n-right" title="Rolling 1d100 = (<span class=&quot;basicdiceroll&quot;>44</span>)">44</span></td></tr><tr style="background: #bebebe"><td class="sheet-template_label" data-i18n="result">판정결과:</td><td style="background: darkgreen" class="sheet-template_value" data-i18n="success">보통 성공</td></tr></tbody></table></div>
    </div><div class="message general">
    <div class="sheet-rolltemplate-coc"><table><caption>근접전(격투)</caption><tbody><tr><td class="sheet-template_label" data-i18n="value">기준치:</td><td class="sheet-template_value"><span class="inlinerollresult showtip tipsy-n-right" original-title="Rolling 25 = 25">25</span>/<span class="inlinerollresult showtip tipsy-n-right" original-title="Rolling floor(25/2) = floor(25/2)">12</span>/<span class="inlinerollresult showtip tipsy-n-right" original-title="Rolling floor(25/5) = floor(25/5)">5</span></td></tr><tr><td class="sheet-template_label" data-i18n="rolled">굴림:</td><td class="sheet-template_value"><span class="inlinerollresult showtip tipsy-n-right" original-title="<img src=&quot;/images/quantumrollwhite.png&quot; class=&quot;inlineqroll&quot;> Rolling 1d100 = (<span class=&quot;basicdiceroll&quot;>58</span>)">58</span>, <span class="inlinerollresult showtip tipsy-n-right" original-title="<img src=&quot;/images/quantumrollwhite.png&quot; class=&quot;inlineqroll&quot;> Rolling 1d100 = (<span class=&quot;basicdiceroll&quot;>21</span>)">21</span>, <span class="inlinerollresult showtip tipsy-n-right" original-title="<img src=&quot;/images/quantumrollwhite.png&quot; class=&quot;inlineqroll&quot;> Rolling 1d100 = (<span class=&quot;basicdiceroll&quot;>76</span>)">76</span></td></tr><tr style="background: #dff0d8"><td class="sheet-template_label">+2:</td><td class="sheet-template_value" data-i18n="success">보통 성공</td></tr><tr style="background: #d9edf7"><td class="sheet-template_label">+1:</td><td class="sheet-template_value" data-i18n="success">보통 성공</td></tr><tr style="background: #d3d3d3"><td class="sheet-template_label">&nbsp;&nbsp;0:</td><td class="sheet-template_value" data-i18n="fail">실패</td></tr><tr style="background: #fcf8e3"><td class="sheet-template_label">-1:</td><td class="sheet-template_value" data-i18n="fail">실패</td></tr><tr style="background: #f2dede"><td class="sheet-template_label">-2:</td><td class="sheet-template_value" data-i18n="fail">실패</td></tr></tbody></table></div>`
    : '';
    var template = `<div class="message general"><div class="spacer"></div><div class="avatar" aria-hidden="true"></div><span class="tstamp" aria-hidden="true">March 13, 2021 8:34PM</span><span class="by">룰 템플릿 미리보기</span>${selectedRule}</div>`;

    rule[index-1].forEach((element,i) => {
          let checkboxRule =`<il><input type="radio" name="${ruleName}" id="r${index}_t${i+1}"><label for="r${index}_t${i+1}">${element}</label></il> `;
        $("#theme").append(checkboxRule);
        if (i===0) {$(`#r${index}_t${i+1}`).prop("checked",true);
        }
    });
    theme();
  } else {var template=''}
  document.getElementById("ruleExample").innerHTML = template;
  $("#theme input").on("change",theme);
}
// 2-2. theme select
let link = document.createElement("link");
function theme () {
  try {document.getElementById("rule-css").remove()} catch {}
  let checkId = document.querySelector("#theme :checked").id;
  console.log(checkId);
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = `../theme/${checkId}.css`;
  link.id = "rule-css"
  document.body.appendChild(link);
}

// 3. file uploader & custom sheet
const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create( inputElement );

function customCss () {
  $("style[id]").remove(); // 기존 초기화
  var regex = /(?<=\/\*\().+?(?=\)\*\/)/s;

  let editingCss = document.getElementById("editing").value;
  if (editingCss!='') { // 입력한 css 가 있을 경우 css 파일 연결 처리
    var style = document.createElement('style');
    style.type = 'text/css';
    style.id="custom-input-css";
    style.innerHTML = editingCss;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
  for (var i=0,  pending = Promise.resolve(); i<pond.getFiles().length; i++) {
    var files = pond.getFile(i).file;
    const fileid = pond.getFile(i).id;
    const pending = new Promise((resolve, reject) => { 
      var reader = new FileReader();
      reader.onload = function() {
        var text = reader.result;
        if(text.indexOf('t1n4i2m4g5n8i9l7lor')!= -1) { // 확인 id (option) 있는 css 파일이면 이 페이지에서 다운로드받은 커스텀 파일로 간주
          var optval = regex.exec(text)[0];
          var optObj =JSON.parse(optval); // 옵션 내용 객체
          let optarr = document.querySelectorAll(".glo-option input");
          for (var j=0; j<optarr.length; j++) {
            var checkval = (optObj.option.split(",")[j]==="true") ? true : false;
            optarr[j].checked=checkval;
          }
          tableColor(optObj.table); // 테이블
          for (i of styleLog) {
            if(i.selectorText === ".sheet-rolltemplate-default table") {i.style.borderColor = optObj.table}
            else if(i.selectorText === ".sheet-rolltemplate-default caption") {i.style.backgroundColor = optObj.table}
          }
          $("#rule").val(optObj.rule); // 룰
          selectRule();
          $(".nice-select .current")[0].innerText=$(`option[value=${optObj.rule}]`)[0].innerText;
          if (optObj.rule==="RULE") {} else {
          document.getElementById(optObj.theme).checked="true";
          }
          // message
          cssChange(".message","color",optObj.general.color);
          cssChange(".message","background-color",optObj.general.bg);
          cssChange(".message .spacer","background-color",optObj.general.spacer);
          // desc
          cssChange(".message.desc","color",optObj.desc.color);
          cssChange(".message.desc","background-color",optObj.desc.bg);
          cssChange(".message.desc .spacer","background-color",optObj.desc.spacer);
          // emote
          cssChange(".message.emote","color",optObj.emote.color);
          cssChange(".message.emote","background-color",optObj.emote.bg);
          cssChange(".message.emote .spacer","background-color",optObj.emote.spacer);
          // you
          cssChange(".message.you","color",optObj.you.color);
          cssChange(".message.you","background-color",optObj.you.bg);
          cssChange(".message.you .spacer","background-color",optObj.you.spacer);
          // whisper
          cssChange(".message.whisper","color",optObj.whisper.color);
          cssChange(".message.whisper","background-color",optObj.whisper.bg);
          cssChange(".message.whisper .spacer","background-color",optObj.whisper.spacer);
          // cp 새로만들기
          makeFullGlobalCp();
        }
        // stylesheet 연결
        var style = document.createElement('style');
        style.type = 'text/css';
        style.id=fileid;
        style.innerHTML = text;
        document.getElementsByTagName('head')[0].appendChild(style);
      }; 
      reader.readAsText(files);
  })
  .then((data) => {
  });
  };
}


// css 파일 다운로드
function downloadCss () {
  var gloArr = [];
  for (var i=0; i<$(".glo-option input").length; i++) {
      gloArr.push($(".glo-option input")[i].checked);
  }
  var rule = $("#rule").val();
  var thm = rule==="RULE" ? '' :document.querySelector("#theme :checked").id;
  var table = $("#defaultTable").val()==="" ? "rgb(112, 32, 130)" : $("#defaultTable").val();
  const makecss1 = `/* Rolling Mint by headdrop (@hdtrpg)
  OPTION EXISTED identification code t1n4i2m4g5n8i9l7lor
*/
  
  /*( {
  "option" : "${gloArr.join(",")}",
  "table" : "${table}",
  "rule" : "${rule}",
  "theme" : "${thm}",
  
  "general" : {"color":"${styleNew[0].style.color}", "bg":"${styleNew[0].style.backgroundColor}","spacer":"${styleNew[1].style.backgroundColor}"},
  "desc" : {"color":"${styleNew[2].style.color}", "bg":"${styleNew[2].style.backgroundColor}","spacer":"${styleNew[3].style.backgroundColor}"},
  "emote" : {"color":"${styleNew[4].style.color}", "bg":"${styleNew[4].style.backgroundColor}","spacer":"${styleNew[5].style.backgroundColor}"},
  "you" : {"color":"${styleNew[6].style.color}", "bg":"${styleNew[6].style.backgroundColor}","spacer":"${styleNew[7].style.backgroundColor}"},
  "whisper" : {"color":"${styleNew[8].style.color}", "bg":"${styleNew[8].style.backgroundColor}","spacer":"${styleNew[9].style.backgroundColor}"}
  } )*/`;
  var charStyleArr=[];
  for (var i=10; i<styleNew.length; i++) { // 캐릭터별 설정
    if (styleNew[i].cssText.search('#')!=-1) {
      charStyleArr.push(styleNew[i].cssText);
    }
  }
  const makecss2 = charStyleArr.join("\n"); 
  const filename = 'roll20 log mint custom.css';
  const data = makecss1 +"\n\r"+makecss2;
  saveToFile_Chrome(filename,data);
}
function saveToFile_Chrome(fileName, content) {
  var blob = new Blob([content], { type: 'text/css' });
  objURL = window.URL.createObjectURL(blob);
          
  // 이전에 생성된 메모리 해제
  if (window.__Xr_objURL_forCreatingFile__) {
      window.URL.revokeObjectURL(window.__Xr_objURL_forCreatingFile__);
  }
  window.__Xr_objURL_forCreatingFile__ = objURL;
  var a = document.createElement('a');
  a.download = fileName;
  a.href = objURL;
  a.click();
}


var styleLog =document.styleSheets[3].cssRules;
var styleNew =document.styleSheets[4].cssRules;
// 1) 스타일 textarea 채우기
function fillStyle () { //완료
  console.log("fillstyle");

  var styleLogText, styleNewText;
  imgChange();
  for (let item of styleLog) { // style log
    if(styleLogText==undefined) {styleLogText = item.cssText;}
    else{styleLogText= styleLogText + item.cssText}
  }
  for (let item of styleNew) { // style new
    if(styleNewText==undefined) {styleNewText = item.cssText;}
    else{styleNewText= styleNewText + item.cssText}
  }
  var styleArr = [];
  // 업로드 스타일시트 확인
  for (var i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].href==null) { // href 가 null 인 게 업로드한 css
      console.log("커스텀 스타일 있음 : document.styleSheet["+i+"]");
      for (let item of document.styleSheets[i].cssRules) {
        styleArr.push(item.cssText);
      }
    }
    if (document.styleSheets[i].ownerNode.id=='rule-css') { // ownerNode id가 rule-css  
      console.log("ownerNode: "+document.styleSheets[i].ownerNode);
      for (let item of document.styleSheets[i].cssRules) {
        styleArr.push(item.cssText);
      }
    }
  }

  var styleModify= "<style>"+styleLogText+styleNewText+styleArr.join('')+"</style>";
  styleModify = styleModify.replace(/border-image.+?(?=;)/gi,'$&!important'); //border image 보존
  document.getElementById("styledata").innerText=styleModify;
  manufacturLog();
}
// 2) Log가공--------------------------------------------
function manufacturLog (callback) { // 완료
  var num = document.querySelector("[name='line']:checked").value;
  console.log("manufact"+num);

  var logvalue = document.getElementById("log-content").innerHTML;
  //textarea 와 content 제거 ***
  const regex = /(^\s*?<div (id="textchat"\s*|class="textchatcontainer"\s*){0,2}>\s*<div class="content">|<\/div>\s*<\/div>\s*$)/gi;
  logvalue= logvalue.replace(regex,'');
  //체크 옵션 컬러입히기
  if ($("#ck-colourised").is(":checked")) { //style을 모두 삭제
    logvalue = logvalue.replace(/(style="background-color.+?")/gi,'');
  }
  // 체크 옵션 아바타 이미지 삭제
  if ($("#ck-noimg").is(":checked")) {
    logvalue = logvalue.replace(/(<div class="avatar").+?(<\/div>)/gi,'');
  }
  if (num==="all") { // line 옵션이 전체(all)이면
    document.getElementById("datatextarea").insertAdjacentHTML('beforeend',`<textarea id="inputVal-1"></textarea>`); // 1) textarea 삽입
    document.getElementById("inputVal-1").innerText = '<div class="textchatcontainer" id="textchat"><div class="content">'+logvalue+'</div></div>';
      //2) 1에서 만든 textarea에 앞뒤에 잘라냈던거 붙임
  } else { // line 옵션이 전체가 아니면 그 수대로
    try{
      const countArr = [...logvalue.matchAll(/<div class="message/gi)];
      Math.ceil(countArr.length);
      var total;
      for (var i=1;; i++) {
        var startIndex, endIndex;
        if (document.getElementById("inputVal-"+i)==null) {
        document.getElementById("datatextarea").insertAdjacentHTML('beforeend',`<textarea id="inputVal-${i}"></textarea>`);
        }
        
        startIndex = countArr[(i - 1)*num].index;
        if (countArr[i*num]==undefined) { // length 를 넘는 index 면
          document.getElementById("inputVal-"+i).innerText = '<div class="textchatcontainer" id="textchat"><div class="content">'+logvalue.substring(startIndex)+'</div></div>';
          total = i;
          document.querySelector("#copy-modal .btn-box").insertAdjacentHTML('afterbegin',`<div id='page'><span></span> / ${total}</div>`);
          break;
        }
        endIndex = countArr[i*num].index;
        document.getElementById("inputVal-"+i).innerText = '<div class="textchatcontainer" id="textchat"><div class="content">'+logvalue.substring(startIndex,endIndex)+'</div></div>';
      }
      } catch(err) { // 에러 modal 창 띄우기
        modaltog("#error-modal");
      }
  }
  
}
function nextCopy (index) {
  const endNum = document.querySelectorAll("[id^='inputVal']").length;
  console.log(index);
  if (document.getElementById("page")!=null) document.querySelector("#page span").innerText = index; // page 표시 있으면 index 표시
  
  if(index < endNum+1) {
    document.getElementById("output").innerText = document.getElementById("inputVal-"+index).value.replace(/(^<div><div>)|(<\/div><\/div>$)/gi,'');
    document.getElementById("copy-target-change").onclick = function(){nextCopy(index+1)};
  } else {
    document.getElementById("output").innerText='';
    modaltog();
    alert("완료되었습니다!");
    $("[id^='inputVal']").remove();
  }
}

function modaltog (divsel) {
  if (divsel==undefined) { // 인수 없으면 modal 창 close
    $(".modal").fadeOut(200);
    setTimeout(function(){
      $(".modal>div").attr('style','');
    },1000);
    if (document.getElementById("page")!=null) document.getElementById("page").remove(); // page 표시 혹시 있으면 지우기
  } else { // 인수 있으면 그 인수 선택자를 가진 modal 창 open
    $(".modal").fadeIn(200);
    document.querySelector(divsel).style.visibility="visible";
  }
  
}

function loadertog() {
  if (document.querySelector(".loader").style.display=="flex") {//켜져 있으면
    $(".loader").fadeOut(200);
  } else {
    $(".loader").fadeIn(200).css("display","flex");
  }
  return new Promise ((resolve,reject)=>{
    resolve();
  });
}
