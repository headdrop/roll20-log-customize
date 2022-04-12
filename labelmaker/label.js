$(function(){
  function currentColor(selNum,declaration) {
    var res = document.styleSheets[0].cssRules[selNum].style[declaration];
    return res;
  }
  document.getElementById("btn-apply").addEventListener("click",()=>{
    showOutput();
  })
  // 배경
  $(`#sc-title .item:nth-child(2) .color`).spectrum({
    color: currentColor(0,'backgroundColor'),
    showAlpha: true,
    preferredFormat: "hex3",
    move: function (color) {
      cssChange(0, 'backgroundColor', color);
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

//CSSOM 접근해서 css 자체를 수정하는 함수 
function cssChange(selNum, declaration, value) { //dec~= tg = target
  document.styleSheets[0].cssRules[selNum].style[declaration]=value;
}

function showOutput () {
  var output = {
    t1: ":"+$("#sc-title .item:nth-child(2) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'), // 타이틀 배경
    t2 :$("#sc-title .item:nth-child(3) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'), // 타이틀 ~번째 사이클
    t3 :$("#sc-title .item:nth-child(4) .color").spectrum("get").toHexString(),
    b1: $("#sc-bottom .item:nth-child(1) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;'),
    b2: $("#sc-bottom .item:nth-child(2) .color").spectrum("get").toHexString(),
    b3: $("#sc-bottom .item:nth-child(3) .color").spectrum("get").toRgbString().replace(/\)/gi, '&#41;')
  };
  if ($('#gradient')[0].checked==true) {
    output.t1 = "-image: "+$('#gradient').next()[0].value.replace(/\)/gi,
    '&#41;');
    console.log(output.t1);
  }
  var text;
  text = `[?{사이클|}사이클 ?{순서|}번째](#" style="text-decoration: none; color: ${output.t2}; display:block; border-top-left-radius:5px; border-top-right-radius:5px; padding:5px 5px 2px 5px;  text-align:center; font-size:11px; font-style: normal; background${output.t1})[⋆⁺ ?{장면 플레이어|}의 장면 ₊⋆](#" style="text-decoration: none; color: ${output.t3}; display:block;  padding:5px; text-align:center; font-weight: bold; font-size:14px; font-style: normal; background${output.t1})[등장: ?{등장인물|}](#" style="text-decoration: none; color: ${output.b2}; font-size: 12px; display:block; padding:5px; background: ${output.b1}; font-style: normal; border-bottom: 1px dashed ${output.b3})<div style="font-size: 12px; font-weight: normal!important; text-decoration: none; display:block; padding:5px; background: ${output.b1};) [📽️](# " style="font-size:20px;)*[[1t[장면표]]]*`

  document.getElementById("output").value = text;

}