window.onload = addListeners;
var css, cssBefore, cssAfter;
var parentPos;


function addListeners(){
  var circle = document.getElementById('circle');
  var square = document.getElementById('square');
  var eye = document.getElementById('eye');
  circle.addEventListener('mousedown', addElement);
  square.addEventListener('mousedown', addElement);
  eye.addEventListener('mousedown', addElement);
}

function addElement(e){
  var name = e.target.id;
  var div = document.createElement("div");
  var seedPos = document.getElementById(name).getBoundingClientRect();
  div.style.position = "absolute";
  div.className += name;
  div.style.left = -20;
  div.style.top = seedPos.top;
  document.getElementById("canvas").appendChild(div);
  div.addEventListener('mousedown', handle_mousedown);
}

/* https://stackoverflow.com/questions/2424191/how-do-i-make-an-element-draggable-in-jquery */
function handle_mousedown(e){
  window.my_dragging = {};
  my_dragging.pageX0 = e.pageX;
  my_dragging.pageY0 = e.pageY;
  my_dragging.elem = this;
  my_dragging.offset0 = $(this).offset();
  function handle_dragging(e){
    var left = my_dragging.offset0.left + (e.pageX - my_dragging.pageX0);
    var top = my_dragging.offset0.top + (e.pageY - my_dragging.pageY0);
    $(my_dragging.elem)
    .offset({top: top, left: left});
  }
  function handle_mouseup(e){
    $('body')
      .off('mousemove', handle_dragging)
      .off('mouseup', handle_mouseup);
  }
  $('body')
    .on('mouseup', handle_mouseup)
    .on('mousemove', handle_dragging);
}

function hereDoc(f) {
  return f.toString().
    replace(/^[^\/]+\/\*!?/, '').
    replace(/\*\/[^\/]+$/, '');
}

function getCSS(name) {
  var cssString = "";
  var elements = document.getElementsByClassName(name);
  if (elements.item(0)) {
    cssString +=  "    box-shadow: ";
  }
  for (var i = 0; i < elements.length; i++) {
    var element = elements.item(i);
    var childrenPos = element.getBoundingClientRect();
    var top = childrenPos.top - parentPos.top + 40;
    var left = childrenPos.left - parentPos.left;
    if (i > 0) {
      cssString += "           ";
    }
    cssString += left + "px " + top + "px " + "0 currentColor";
    if (i < elements.length - 1) {
      cssString += ",\n"
    } else {
      cssString += ";\n"
    }
  }
  return cssString;
}

/*filters are additive and it doesn't work well, as it duplicates shapes*/
// function getCSSfilter(name) {
//   var cssString = "";
//   var elements = document.getElementsByClassName(name);
//   if (elements.item(0)) {
//     cssString +=  "    filter: ";
//   }
//   for (var i = 0; i < elements.length; i++) {
//     var element = elements.item(i);
//     var childrenPos = element.getBoundingClientRect();
//     var top = childrenPos.top - parentPos.top + 40;
//     var left = childrenPos.left - parentPos.left;
//     if (i > 0) {
//       cssString += "      ";
//     }
//     cssString += "drop-shadow(" + left + "px " + top + "px " + "0 currentColor";
//     if (i >= elements.length - 1) {
//       cssString += ");\n"
//     } else {
//       cssString += ")\n";
//     }
//   }
//   return cssString;
// }

function generateCSS(){
  /* naive approach
    circle is the main div
    square is the before
    eye is the after
  */
  parentPos = document.getElementById('canvas').getBoundingClientRect();

  css = hereDoc(function(){/*!
      position: relative;
      width: 40px;
      height: 40px;
      top: -40px;
      background-color: transparent;

      border-radius: 50%;

      color: #F012BE;
  */});

  cssBefore = hereDoc(function(){/*!
      position: absolute;
      content: "";
      width: 40px;
      height: 40px;

      color: #B10DC9;
  */});

  cssAfter = hereDoc(function(){/*!
      position: absolute;
      content: "";
      width: 40px;
      height: 40px;
      border-radius: 5% 140% 5% 120%;

      color: #85144b;
  */});

  css += getCSS('circle');
  cssBefore += getCSS('square');
  cssAfter += getCSS('eye');
  console.log(cssAfter);

  cssToShow = ".drawing {" + css + "}";
  cssToShow += "\n\n.drawing:before {" + cssBefore + "}";
  cssToShow += "\n\n.drawing:after {" + cssAfter + "}";

  /*This is an offset for the purpose of testing with JS*/
  cssBefore += "top: -80px; position: relative;";
  cssAfter += "top: -120px; position: relative;";

  var div = document.getElementById('gen-code');
  div.innerHTML = cssToShow;
}

function testCSS() {
  document.getElementById('test-circle').style = css;
  document.getElementById('test-square').style = cssBefore;
  document.getElementById('test-eye').style = cssAfter;
}
