window.onload = function () { 
  document.getElementById("addRow").addEventListener("click",function(){
  var cloneNode = document.querySelector("#insane+.tabCon tbody.cont tr").cloneNode(true);
  document.querySelector("#insane+.tabCon tbody.cont").append(cloneNode);
  var newNode = document.querySelector("#insane+.tabCon tbody.cont tr:last-of-type");
  newNode.querySelectorAll("td").forEach(function(value,index){
  if (index>0) value.textContent="";
  });
  var rowbtn = document.createElement("span");
  rowbtn.innerText = "X";
  newNode.querySelector("td").append(rowbtn);
  newNode.querySelector("td span").addEventListener("click",function(){
  this.parentNode.parentNode.remove();
  step();
  },{ once: true });
  step();
  });
  //function
  function step () {
  var stepRows = document.querySelectorAll("#insane+.tabCon tbody.cont tr");
  stepRows.forEach(function(value,index,arr) {
  if (index+1 > 2) {
  value.querySelector("td").childNodes[0].textContent=index+1;// = index+1;
  }
  });
  }
  document.getElementById("down").onclick = function(){
  var target = document.querySelector('input[name="tabmenu"]:checked+.tabCon .content');
  var fileName = document.querySelector('input[name="tabmenu"]:checked').value+"_"+document.querySelector('input[name="tabmenu"]:checked+.tabCon .inputbox').innerHTML;
  domtoimage.toBlob(target)
  .then(function (blob) {
  window.saveAs(blob, fileName+'.png');
  });
  }
  //에디터로 복사
  document.querySelector("#copy").addEventListener('click',()=>{
  document.querySelectorAll("td>span").forEach(function(val){
  val.display="none";
  })
  var target = document.querySelector('input[name="tabmenu"]:checked+.tabCon .content');
  selectRange(target);
  document.execCommand("copy");
  alert("복사가 완료되었습니다. roll20 핸드아웃 편집 창에 붙여넣기하세요.\\n복사한 표는 이 페이지에 적용된 글꼴이 적용되지 않습니다.")
  });
  // 복사 (2)
  function sync (newNode) { // 내용 입력 싱크
    if (newNode==undefined) {newNode=document}
    newNode.querySelectorAll("#insaneHO+.tabCon .item input, #insaneHO+.tabCon .item textarea").forEach((val,ind)=>{
      val.addEventListener('change',(e)=>{
        switch(val.className) {
          case 'front-1' :
            val.parentNode.children[5].querySelector(".ho-box>span:nth-child(2)").textContent = val.value;
            break;
          case 'front-2' :
            val.parentNode.children[5].querySelector(".ho-box-content").innerText = val.value;
            break;
          case 'back-1' :
            val.parentNode.children[6].querySelector(".ho-box>span:nth-child(2)").textContent = val.value;
            break;
          case 'back-2' :
            val.parentNode.children[6].querySelector(".ho-box-content").innerText = val.value;
            break;
        }
      })
    })
    newNode.querySelectorAll(".copy").forEach(val=>{
      val.addEventListener('click',(e)=>{
        var page = e.target.classList[2].replace("c-",'');
        var tg = e.target.parentNode.parentNode.getElementsByClassName(page);
        selectRange(tg[0]);
        document.execCommand("copy");
        alert("복사가 완료되었습니다. roll20 핸드아웃 편집 창에 붙여넣기하세요.")
      });
    })
  }
  
  document.getElementsByName('hoWidth').forEach((val,ind)=>{
    val.addEventListener('change',(e)=>{
      var a = val.value;
      document.styleSheets[1].cssRules[0].style.width=a;
    })
  })
  
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

  document.getElementById("addHo").addEventListener("click",function(){
    var cloneNode = document.querySelector("#insaneHO+.tabCon .item").cloneNode(true);
    document.querySelector("#insaneHO+.tabCon .content").append(cloneNode);
    var newNode = document.querySelector("#insaneHO+.tabCon .item:last-child");
    newNode.children[0].value="";
    newNode.children[1].value="앞면내용";
    newNode.children[2].value="";
    newNode.children[3].value="뒷면내용";
    newNode.querySelector(".remove").addEventListener("click",function(){
      this.parentNode.parentNode.remove();
    },{ once: true });
    sync(newNode);
  });
  sync();
}