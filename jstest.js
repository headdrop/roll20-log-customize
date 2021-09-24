/*!
   * Rolling Mint
   * roll20-log-customize
   *
   * https://headdrop.github.io/roll20-log-customize/
   *
   * by headdrop
   */

var styleNew = document.styleSheets[4].cssRules;
var styleLog = document.styleSheets[3].cssRules;
const diceinput = {
  0:/("diceroll d10.+?"backing">)/gi,
  2:/("diceroll d20.+?"backing">)/gi,
  4:/("diceroll d4.+?"backing">)/gi,
  6:/("diceroll d6.+?"backing">)/gi,
  8:/("diceroll d8.+?"backing">)/gi,
  9:/("diceroll d12.+?"backing">)/gi
};

$(function () {
  // 이벤트 실행되는것 정리
  $('#rule').niceSelect();
  $("[name='glo-ck']").on("change", checkOpt);
  $("[name='glo-name']").on("change", radioOpt);
  document.querySelector(".example").addEventListener("click",hideMessageCP);
  tableColor('rgba(112, 32, 130, 1)');


  // modal 버튼
  $(".modal-content .reset, #modal-submit, .modal-close, #download-modal .reset, .modal-layer").on("click",()=>{
    modaltog(); //닫기
  });
  document.getElementById("css-modal-openbtn").addEventListener("click",()=>modaltog("#css-modal"));
  document.getElementById("css-download").addEventListener("click",()=>modaltog("#download-modal"));
  new ClipboardJS('#copy');

  // line 값 출력
  $("[name='line']").change(()=>{ // line 값 출력
    var numm = $("[name='line']:checked").val();
    $(".line-number").text(numm);
  });

  // 1. html 입력 (확인 버튼)
  function inputHTML () {
    var events = $._data($("#log-input"), inputHTML);
    console.log("실행");
    reset();
    var log = document.getElementById("log-input").value.replace(/(src="\/)/g, `src="https://app.roll20.net//`);
    log = log.replace(/\r|\n/gi,''); // 개행 제거
    log = log.replace(/(<span class="by">)\s+?/gi,'<span class="by">');
    log = log.replace(/<span class=&quot;basicdiceroll&quot;>(.+?)<\/span>/gi,'$1');
    log = log.replace(/(data-messageid=").+?"/gi,''); // data-messageid 삭제
    log = log.replace(/(?<=\<a )href.+?"(?=>)/gi,''); // a 안의 href삭제
    log = log.replace(/(<img class="sheet-brdright").+?\>/gi,''); // 인세인 엑박 삭제
    log = log.replace('roll20-colourised',''); // roll20-colourised 삭제
    log = log.replace(/(\([^\)]+?\#.+?)(<|")/gi,'$1)$2'); // 롤꾸 안깨지게 정리
    log = log.replace(/\[(.+?)\]\(#" (style.+?\))/gi,'<a $2">$1</a>'); // 잘린 a 붙이기
    for (key of Object.keys(diceinput)) {
      log = log.replace(diceinput[key],'$1'+key);
    }
    //dice
    document.getElementById("log-content").innerHTML = log;
    addID();
    nameExColor();
    imgInput();
    errCatch();
  }
  document.getElementById("log_submit").addEventListener('click', inputHTML);
  document.querySelector(".custom .reset").addEventListener('click',resetCustom);
  // html 리셋
  document.querySelector("#html-reset").addEventListener('click',()=>{
    document.querySelector("#log-input").innerText='';
    $("#log-content").empty();
  });

  // 리셋함수
  function reset () {
    console.log("reset");
    if( document.getElementById("profileImg")!=null){$("#profileImg").remove()}
    
    $(".name-select>h2").nextAll().remove();
    const charColorSet = `<select id="Name" style="visibility:hidden">
    <option disabled selected>캐릭터를 선택하세요</option>
  </select>`;
    $(".name-select>h2")[0].insertAdjacentHTML('afterend', charColorSet);
    $(".example .general").not(".global").remove();
  }
  //커스텀시트 리셋함수
  function resetCustom () {
    pond.removeFiles(); 
    document.getElementById("editing").value = '';
    document.querySelector("#highlighting code").textContent='';
  }

  function radioOpt() {
    let checkedValue = document.querySelector("input[name='glo-name']:checked").value;
    let exc = document.querySelectorAll(".example .general:not(.global)");

    exc.forEach(element => {
      var len = styleNew.length; //중복확인
      let arrSel = [];
      byId = element.id;
      if (byId.index==''|/\s/g) {} else { // id가 공백일때는 패스
      for (i of styleNew) arrSel = arrSel.concat([i.selectorText]);
      console.log(byId);
      if (arrSel.indexOf("#" + byId) == -1) {
        document.styleSheets[3].insertRule(`#${byId} {}`, len);
        arrSel.push(byId);
      }
      len = styleNew.length;
      if (checkedValue === "default") {
        if (arrSel.indexOf(`#${byId} .by`) != -1) {
          let normalColor = styleNew[5].style.color;
          for (l of styleNew) {
            if (l.selectorText === `#${byId} .by`) {
              normalColor = l.style.color;
              l.style.color = '';
            }
          }
          for (m of styleNew) {
            if (m.selectorText === `#${byId}`) {
              m.style.color = normalColor;
            }
          }
        }
      }
      }

      if (checkedValue === "indi-name") {
        if (arrSel.indexOf(`#${byId} .by`) == -1) {
          document.styleSheets[4].insertRule(`#${byId} .by {}`, len);
          arrSel.push(`#${byId} .by`);
        }
        let indiColor = styleNew[5].style.color;
        for (l of styleNew) {
          if (l.selectorText === "#" + byId) {
            indiColor = l.style.color;
            l.style.color = '';
          }
        }
        for (m of styleNew) {
          if (m.selectorText === `#${byId} .by`) {
            if (indiColor != '') {
              m.style.color = indiColor;
            }
          }
        }
      }
      // CP 업데이트
      makeCP(byId);
    });
    selectorText = [];
  } 

  //global color picker 만들기
  makeFullGlobalCp();

  //Color picker 만들기
  function makeCP(byId) {
    document.styleSheets[4].insertRule(`#${byId} {}`, styleNew.length); // 스타일 추가
    console.log(byId + "에 대한 color picker 실행 + CSS 생성");
    let checkedValue = document.querySelector("input[name='glo-name']:checked").value;
    let defaultColorText = $(`.example #${byId} .by`).css('color');
    let defaultColorBg = $(`.example #${byId}`).css('background-color');
    let byCheck = (checkedValue === "indi-name") ? " .by" : '';
    $(`#${byId} .color-text`).spectrum({
      color: defaultColorText,
      preferredFormat: "hex3",
      move: function (color) {
        cssChange(`#${byId + byCheck}`, 'color', color);
      }
    });
    $(`#${byId} .color-bg`).spectrum({
      color: defaultColorBg,
      showAlpha: true,
      preferredFormat: "hex3",
      move: function (color) {
        cssChange("#" + byId, 'background-color', color);
      }
    });
  }

  // 캐릭터별 색상 설정 name 누르면 example 부분 나타나게
  function nameExColor() {
    $("#Name").change(function () {
      var byRaw = $(this).find(":selected").text();

      let byCut = /\S+?(?=\s)/.exec(byRaw);
      if (/PC\d+?\s/gi.test(byRaw)) { // PC
        byId = byRaw.replace(/PC\d+?\s+?/gi,'').match(/\S+?(?=\s|$)/gi,'')[0];
      } else if (byCut==null) {
        byId = byRaw;
      } else {
        byId = byCut.shift();
      }
      let colorByArr = [];
      $(".example .content>div").each(function () {
        colorByArr.push($(this).attr('id'));
      });
      $("#Name").next().find(`[data-value='${$(this).val()}']`).addClass("disabled");
      // test example div message color picker update
      let testImgSrc = $(`.content span.by:contains('${byRaw}:')`).siblings(".avatar:not('.noImage')").children("img").attr("src");
      let exampleNoImage = (testImgSrc == undefined) ? "noImage" : "";
      if (byRaw==="공백") {byRaw = ""}
      let example = `<div class="message general" id=${byId}><div class="detail-button"><i class="material-icons-round">arrow_forward_ios</i></div><div class="cp-area"><i class="material-icons-round cp-close sp-replacer">close</i><input type='text' class='color-text' /><input type='text' class='color-bg' /></div><div class="spacer"></div><div class="avatar ${exampleNoImage}" aria-hidden="true"><img src="${testImgSrc}"></div><span class="tstamp" aria-hidden="true">January 15, 1234 5:66AM</span><span class="by">${byRaw}:</span>안녕하세요? test 가나다</div>`;
      $(".example .content").append(example);
      makeCP(byId);
    });

    //message color picker close 닫기    
    $(".example").on("click", ".cp-close", function () {
      const nv = this.parentElement.parentElement.id;
      console.log(nv);
      for (var index in styleNew) { //스타일 삭제
        if (styleNew[index].selectorText == `#${nv}`) {
          document.styleSheets[4].deleteRule(index);
        }
      }
      this.parentElement.parentElement.remove();
      $("#Name").next().find(`[data-value^='${nv}']`).removeClass("disabled"); // 메뉴 disable
    });

    // niceSelect 적용 --------------------------------------
    $("#Name" + ">option").not("[disabled]").remove();
      dropdownApp('#log-content .by', "#Name");  // selectbox styling
      $("#Name").niceSelect();
  }

  // 캐릭터별 색상 설정의 select 를 noImg 로 가져옴
  function imgInput() { 
    const node1 = $(".item:last")[0];
    const changeImgBox = `<div class="item" id="profileImg"><h2>프로필 이미지 수정</h2><p>음영 표시된 캐릭터는 깨진 아바타 이미지가 1개 이상 있는 캐릭터입니다. 캐릭터를 선택하고 <b>외부 이미지 주소</b>를 입력하면 일괄 변경됩니다.</p><p>변경하지 않고 그대로 두면 <b>백업시 깨진 이미지는 모두 삭제</b>됩니다.</p><div id="imgList" class="inner-box"></div>
    <div class="btn-box">
    <button class="btn reset"><i class="material-icons-round">replay</i></button>
    <button class="btn apply">적용</button>
    </div>
    </div>`
    node1.insertAdjacentHTML('afterend', changeImgBox); //.item 삽입

    const node2 = $("#profileImg>p")[1]
    const nodeList = $(".name-select>h2").nextAll();
    var copy1 = nodeList[0].cloneNode(true);
    var copy2 = nodeList[1].cloneNode(true);
    copy1.id="changeImg";
    node2.insertAdjacentElement('afterend',copy2);
    node2.insertAdjacentElement('afterend',copy1);
    
    document.querySelector("#profileImg .apply").addEventListener("click",imgChange); //이벤트 연결

    $("#log-content .avatar>img").on("error", function(){
      //console.log("로드에러");
      this.parentElement.classList.add("noImage");
      let noImgID = this.parentElement.parentElement.id;
      //console.log(noImgID);
      document.querySelectorAll(".nice-select .option").forEach(function(value) {
        if(value.textContent.split(' ')[0]===noImgID) {
          value.classList.add("noImgChar");
        }
      })
    });
  }
  

  // dropdown 클릭하면 error image input
  function errCatch() {
    $("#changeImg").change(function () {
      let imgid = this.value.split(" ")[0];
      var profileimgurl;
      if (document.querySelector(`#${imgid} .avatar img`)==null|undefined) {
        profileimgurl = '';
      } else {profileimgurl=document.querySelector(`#${imgid} .avatar img`).src ;}
      var changeImgInput =
        `<div class="changeImg-box"><div><span>${$(this).val()}의 프로필 이미지</span><i class="material-icons-round close">close</i></div><input class="input-area" type="url" placeholder="외부 이미지 링크를 입력해주세요." onfocus="this.placeholder=''" onblur="this.placeholder='외부 이미지 링크를 입력해주세요.'"><img class="beforeimg" src="${profileimgurl}"/><div class="preview-icon"><label class="material-icons-round">photo_size_select_actual<input type="checkbox"></label><img src=""></div></div>`;
      document.getElementById("imgList").insertAdjacentHTML('beforeend',changeImgInput);
      $("#changeImg").next().find(`[data-value='${$(this).val()}']`).addClass("disabled");
    });
    $("#imgList").on("mouseleave blur", ".input-area", function () {
      $(this).next().next().children("img").attr("src", $(this).val());
    });
    $("#imgList").on("change", ".preview-icon input", function() {
      console.log(this);
      this.parentElement.nextElementSibling.classList.toggle("visible");
    });
    //noImg close
    $("#profileImg").on("click", ".close", function () {
      const nv = $(this).prev("span").text();
      const nameValue = /^.+(?=(의 프로필))/.exec(nv);
      $(this).closest(".changeImg-box").remove();
      $("#noImg").next().find(`[data-value='${nameValue[0]}']`).removeClass("disabled");
    });
    // 초기화
    $("#profileImg .reset").on("click", function() {
      document.querySelectorAll("#imgList .changeImg-box span").forEach(function(sp){
        const nameV = /^.+(?=(의 프로필))/.exec(sp.innerText);
        var target = document.querySelectorAll(`#log-content #${nameV[0]} .avatar img`);
        target.forEach(function(item){
          item.src = "noimg";
        })
      })
    })
    $("#log-content .avatar>img").on("error", function(){
      //console.log("로드에러");
      this.parentElement.classList.add("noImage")});
  }
});
function makeFullGlobalCp () {
  // color picker 만듦
  let tgArr = ["desc","emote","general","you","whisper"];
  let typeArr = ["color","bg","spacer"];
  tgArr.forEach((itemtg) => {
      typeArr.forEach((itemtp) => {
          makeGlobalCP(itemtg, itemtp);
        });
    });
  $(`.cp-area>#dice-color`).spectrum({
    color: $('.formula').css('color'),
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(".dicon", "color", color);
    }
  });
}

// 드롭다운에 적용. jq에 (선택자)나 요소 넣으면 됨
function dropdownApp(jq, selectid) {
  $.each(newArr($(jq)), function (index, el) {
    if (el.slice(0, -1)!='') {
    let output = '';
    output = `<option value='${el.slice(0, -1)}'>${el.slice(0, -1)}</option>`
    $(selectid).append(output);
    }
  });
  if ($("#공백")!=null) {
    let outputBlank = `<option value='공백'>공백</option>`;
    $(selectid).append(outputBlank);
  }
}

// 중복없는 배열
function newArr(arr) {
  var arrObj = [];
  for (var i = 0; i < arr.length; i++) {
    if (arrObj.indexOf(arr[i].innerText) === -1)
      arrObj.push(arr[i].innerText);
  }
  let filtered = arrObj.filter(function (element, index, array) {
      return nameArrCheck (element);
    });
  return filtered;
}

function nameArrCheck (element) { // 있으면 true 리턴
  const reg = /^\(.+?\)/gi; // 귓속말
  const reg2 = /^\s+$/gi; // 공백1개이상
  let ifa = reg.test(element);
  let ifb = reg2.test(element);
  if (ifa==true||ifb==true) { // 귓속말이거나 공백1개이상이면 false 출력
    return false;
  } else return true;
}
//CSSOM 접근해서 css 자체를 수정하는 함수 
function cssChange(selector, declaration, value) { //dec~= tg = target
  var arrSel=[];
  for (i of styleNew) arrSel = arrSel.concat([i.selectorText]);// selecttext가져오기
  if (arrSel.indexOf(selector)==-1) { // 없으면 새로 만든다
    let insertCssText = `${selector} {${declaration} : ${value};}`;
    document.styleSheets[4].insertRule(insertCssText, arrSel.length); // 마지막에 추가
  } 
  for (i of styleNew) {
    if (i.selectorText == selector) {
      if (declaration == 'background-color') { //background-color
        i.style.backgroundColor = value;
      }
      if (declaration == 'color') { // color
        i.style.color = value;
      }
    }
  }
}

// 커스텀 css 직접 입력
function update(text) {
  let result_element = document.querySelector("#highlighting-content");
  // Update code
  result_element.innerText = text;
  // Syntax Highlight
  hljs.highlightAll(result_element);
}
function sync_scroll(element) {
  /* Scroll result to scroll coords of event - sync with textarea */
  let result_element = document.querySelector("#highlighting-content");
  // Get and set x and y
  result_element.scrollTop = element.scrollTop;
  result_element.scrollLeft = element.scrollLeft;
}
function check_tab(element, event) {
  let code = element.value;
  if (event.key == "Tab") {
    /* Tab key pressed */
    event.preventDefault(); // stop normal
    let before_tab = code.slice(0, element.selectionStart); // text before tab
    let after_tab = code.slice(element.selectionEnd, element.value.length); // text after tab
    let cursor_pos = element.selectionEnd + 2; // after tab placed, where cursor moves to - 2 for 2 spaces
    element.value = before_tab + "  " + after_tab; // add tab char - 2 spaces
    // move cursor
    element.selectionStart = cursor_pos;
    element.selectionEnd = cursor_pos;
  }
}

$(function () { // 코드 입력 창
  hljs.highlightAll();
  let addressCss = document.querySelector("#editing");
  addressCss.oninput = function () { update(this.value); sync_scroll(this); }
  addressCss.onscroll = function () { sync_scroll(this); }
  addressCss.onkeydown = function () { check_tab(this, event); }
  // code reset
  document.getElementById("modal-reset").addEventListener("click", function () {
    document.getElementById("editing").value = "";
    document.getElementById("highlighting-content").innerText = "";
  });
});

// 테이블 색 바꾸기
function tableColor (defaultTableColor) {
  $("#defaultTable").spectrum({
    color:defaultTableColor,
    showAlpha: true,
    preferredFormat: "hex",
    move: function(color) {
      for (i of styleLog) {
        if(i.selectorText === ".sheet-rolltemplate-default table") {i.style.borderColor = color}
        else if(i.selectorText === ".sheet-rolltemplate-default caption") {i.style.backgroundColor = color}
    }}
  });
  $("#defaultTable").on("change", function() {
    var colorBg = document.getElementById("defaultTable").value;
    let textColor = getTextColorByBackgroundColor(rgb2hex(colorBg));
    for (i of styleLog) {
      if(i.selectorText === ".sheet-rolltemplate-default caption") {i.style.color = textColor}}
    document.querySelector(".rule-select .sp-preview-inner").style.color=textColor;
  });
  document.querySelector(".rule-select .sp-preview-inner").innerText="표 제목";
  
}

// 텍스트 색상 바꾸기에 쓰이는 함수
function getTextColorByBackgroundColor(hexColor,opt) {
  const c = hexColor.substring(1)      // 색상 앞의 # 제거
  const rgb = parseInt(c, 16)   // rrggbb를 10진수로 변환
  const r = (rgb >> 16) & 0xff  // red 추출
  const g = (rgb >>  8) & 0xff  // green 추출
  const b = (rgb >>  0) & 0xff  // blue 추출
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // per ITU-R BT.709
  // 색상 선택
  if (opt===1) {
    var rgbNum = r+","+g+","+b;
    return rgbNum;
  }
  return luma < 127.5 ? "white" : "black" // 글자색이
}
function rgb2hex(rgb) {
  if (  rgb.search("rgb") == -1 ) {
      return rgb;
  } else {
      rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
      function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
      }
      return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
  }
}

function hideMessageCP(e) {
  let targetElement = e.target.closest(".detail-button");
  if(targetElement) {
    targetElement.nextElementSibling.classList.toggle("move");
    targetElement.firstChild.classList.toggle("move");
  }
}

function checkOpt() { // 체크박스
  if ($("#ck-nospacer").is(":checked")) { // nospacer
    styleNew[1].style.setProperty('background-color', 'transparent', 'important');
  } else { styleNew[1].style.setProperty('background-color', ''); }
  if ($("#ck-circle").is(":checked")) { // circle
    styleNew[10].style.borderRadius = "100%"; // img
    styleNew[11].style.alignItems = "center"; // .avatar
  } else {
    styleNew[10].style.borderRadius = "0%";
    styleNew[11].style.alignItems = "stretch";
  }
  if ($("#ck-noimg").is(":checked")) { // noimg
    for (var i of styleLog) {
      if (i.selectorText === '.avatar') i.style.display = 'none';
      if (i.selectorText === '.message') i.style.paddingLeft = '15px';
      if (i.selectorText === '.message .spacer') i.style.margin = '0 -5px 8px -15px';
    }
    document.getElementById("ck-circle").disabled=true;
  } else {
    for (var i of styleLog) {
      if (i.selectorText === '.avatar') i.style.display = '';
      if (i.selectorText === '.message') i.style.paddingLeft = '45px';
      if (i.selectorText === '.message .spacer') i.style.margin = '0 -5px 8px -45px';
    }
    document.getElementById("ck-circle").disabled=false;
  }

  if ($("#ck-you").is(":checked")) { // you
    for (var j of styleNew) {
      if (j.selectorText === '.message.you') j.selectorText = '.message.you-noapply';
      else if (j.selectorText === '.message.you .spacer') j.selectorText = '.message.you .spacer-noapply';
    }
  } else {
    for (var j of styleNew) {
      let sel = j.selectorText;
      if (sel !== undefined && sel.indexOf('-noapply') !== -1) {
        j.selectorText = sel.replace('-noapply', '')
      }
    }
  }
  if ($("#ck-time").is(":checked")) { //.message .tstamp
    styleNew[12].style.display="";
  } else { styleNew[12].style.display="none"}
  
  if($("#ck-dice").is(":checked")) {
    styleNew[13].style.display="inline-block";
    $(".rollresult .cp-area, .rollresult .detail-button").show();
  } else {
    styleNew[13].style.display="none";
    $(".rollresult .cp-area, .rollresult .detail-button").hide();
  }
  if($("#ck-font").is(":checked")) {
    styleNew[14].style.setProperty('font-family','"Helvetica Neue",Helvetica,Arial,sans-serif','important');
  } else {
    styleNew[14].style.setProperty('font-family','');
  }
}

// 전체에 id 달기
function addID() {
  let list = document.querySelectorAll("#log-content .by");
  for (var x of list) {
    var byRaw = x.innerText.slice(0, -1);
    var byId;
    let byCut = /\S+?(?=\s)/.exec(byRaw);
    if (/PC\d+?\s/gi.test(byRaw)) { // PC
      byId = byRaw.replace(/PC\d+?\s+?/gi,'').match(/\S+?(?=\s|$)/gi,'')[0];
    } else if (byRaw=='') {
      byId = '공백';
      console.log(byId);
    }else if (byCut==null) {
      byId = byRaw;
    } else {
      byId = byCut.shift();
    }
    if (x.parentNode.classList.value.indexOf("general")!=-1|x.parentNode.classList.value.indexOf("rollresult")!=-1) {x.parentNode.id = byId;} // only .general
  }
  // by 없는 message 에 ID 달기
  let noID = document.querySelectorAll("#log-content .message.general:not([ID]), #log-content .message.rollresult:not([ID])");
  try {
    for (var y of noID) {
      var z = y.previousElementSibling;
      while (z.id==null)  { z = z.previousElementSibling;}
      y.id=z.id; 
    }
  } catch(err) {console.log(err)};
    
  
}

// 이미지 바꾸는 함수
function imgChange () { // 이미지 바꾸는 함수
  var targetImgList = document.querySelectorAll("#imgList>.changeImg-box");
  targetImgList.forEach(function(value,index,arr){
    let changeUrl = value.childNodes[1].value;
    let changeId = value.firstChild.firstChild.innerText.replace("의 프로필 이미지",'').split(/\s/gi)[0];
    document.querySelectorAll(`#${changeId} .avatar`).forEach(function(item){ // document.querySelectorAll(`#${changeId} .avatar>img`)
      if (item.firstElementChild==null) {
        item.insertAdjacentHTML('beforeend',`<img src="${changeUrl}">`);
      } else {item.firstElementChild.src=changeUrl;}
      item.parentElement.classList.remove("noImage");
    });
  });
}

//color picker 만들기
function makeGlobalCP(type, target, option) {
  let tg =
    target == "color" ? "color" :
      target == "bg" || "spacer" ? "background-color" : "";
  let tp =
    (type == 'general') ? '.message': `.message.${type}`; // type:general 일때 blank
  if (target == "spacer") {
    tp = tp + " .spacer";
  }
  let defaultColor =$(tp).css(tg);
  // target == "spacer" ? $(tp).css(tg) : $(`${tp}`).css(tg);

  if (target == "bg") {
    $(`.cp-area>[id^=${type}][id$=${target}]`).spectrum({
      color: defaultColor,
      preferredFormat: "hex3",
      showAlpha: true,
      move: function (color) {
        cssChange(tp, tg, color);
      }
    });
  }
  else {
    $(`.cp-area>[id^=${type}][id$=${target}]`).spectrum({
      color: defaultColor,
      preferredFormat: "hex3",
      move: function (color) {
        cssChange(tp, tg, color)
      }
    });
  }
}