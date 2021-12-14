$(function(){
  function currentColor(selNum,declaration) {
    var res = document.styleSheets[0].cssRules[selNum].style[declaration];
    return res;
  }
  document.getElementById("btn-apply").addEventListener("click",showOutput);
  document.getElementById("btn-copy").addEventListener("click",copy)
  document.getElementById("gradient").addEventListener("change",(event)=>{
    if (event.target.checked) {
      $(`#sc-title .item:nth-child(2) .color~.sp-replacer`).css("visibility","hidden");
      gradientPreview();
    } else {
      $(`#sc-title .item:nth-child(2) .color~.sp-replacer`).css("visibility","visible");
      gradientPreview('off')
    }
  });
  document.getElementById("gradVal").addEventListener("blur",gradientPreview);
  document.getElementById("emo").addEventListener("change",(val)=>{
    var changeVal = val.target.value;
    document.querySelector("#preview span.emo").textContent = changeVal;
  });
  
  // 배경
  $(`#sc-title .item:nth-child(2) .color`).spectrum({
    color: currentColor(0,'background'),
    showAlpha: true,
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(0, 'background', color);
    }
  });
  $(`#sc-title .item:nth-child(3) .color`).spectrum({
    color: currentColor(1,'color'),
    showAlpha: true,
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(1, 'color', color);
    }
  });
  $(`#sc-title .item:nth-child(4) .color`).spectrum({
    color: currentColor(0,'color'),
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(0, 'color', color);
    }
  });
  // 아래쪽
  $(`#sc-bottom .item:nth-child(1) .color`).spectrum({
    color: currentColor(2,'backgroundColor'),
    showAlpha: true,
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(2, 'backgroundColor', color);
    }
  });
  $(`#sc-bottom .item:nth-child(2) .color`).spectrum({
    color: currentColor(2,'color'),
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(2, 'color', color);
    }
  });
  $(`#sc-bottom .item:nth-child(3) .color`).spectrum({
    color: currentColor(2,'borderBottomColor'),
    preferredFormat: "hex3",
    showAlpha: true,
    move: function (color) {
      cssChange(2, 'borderBottomColor', color);
    }
  });
})
// 그래디언트 미리보기
function gradientPreview (tog) {
  if (tog==='off') {
    var no = $("#sc-title .item:nth-child(2) .color").spectrum("get").toRgbString();
    cssChange(0,'backgroundImage','');
    cssChange(0,'background',no);
  } else {
    var val = document.getElementById("gradVal").value;
    cssChange(0, 'background',val)
  }
}

//CSSOM 접근해서 css 자체를 수정하는 함수 
function cssChange(selNum, declaration, value) { //dec~= tg = target
  document.styleSheets[0].cssRules[selNum].style[declaration]=value;
}

function showOutput () {
  var output = {
    t1: ":"+$("#sc-title .item:nth-child(2) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'), // 타이틀 배경
    t2: $("#sc-title .item:nth-child(3) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'), // 타이틀 ~번째 사이클
    t3: $("#sc-title .item:nth-child(4) .color").spectrum("get").toHexString(),
    b1: $("#sc-bottom .item:nth-child(1) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'),
    b2: $("#sc-bottom .item:nth-child(2) .color").spectrum("get").toHexString(),
    b3: $("#sc-bottom .item:nth-child(3) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'), 
    rt: document.getElementById("rolltable").value,
    re: document.getElementById("emo").value
  };
  if ($('#gradient')[0].checked==true) {
    output.t1 = "-image: "+$('#gradient').next()[0].value.replace(/\)/gi,
    '&#41;');
    console.log(output.t1);
  }
  var text;
  text = `[?{사이클|}사이클 ?{순서|}번째](#" style="text-decoration: none; color: ${output.t2}; display:block; border-top-left-radius:5px; border-top-right-radius:5px; padding:5px 5px 2px 5px;  text-align:center; font-size:11px; font-style: normal; background${output.t1})[⋆⁺ ?{장면 플레이어|}의 장면 ₊⋆](#" style="text-decoration: none; color: ${output.t3}; display:block;  padding:5px; text-align:center; font-weight: bold; font-size:14px; font-style: normal; background${output.t1})[등장: ?{등장인물|}](#" style="text-decoration: none; color: ${output.b2}; font-size: 12px; display:block; padding:5px; background: ${output.b1}; font-style: normal; border-bottom: 1px dashed ${output.b3})<div style="font-size: 12px; font-weight: normal!important; text-decoration: none; display:block; padding:5px; background: ${output.b1};) [${output.re}](# " style="font-size:20px;)*[[1t[${output.rt}]]]*`

  document.getElementById("output").value = text;
}

function copy () {
  document.getElementById("output").select();
  document.getElementById("output").setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.getElementById("output").setSelectionRange(0, 0);
  alert("복사가 완료되었습니다. 매크로 창에 붙여넣기하세요.");
}

function selectRange(obj) {
  if (window.getSelection) {
      var selected = window.getSelection();
          selected.selectAllChildren(obj);
  } else if (document.body.createTextRange) {
      var range = document.body.createTextRange();
          range.moveToElementText(obj);
          range.select();
  }
};