window.onload = addListeners;
var css;
var parentPos;

function addListeners(){
  var circle = document.getElementById('circle');
  var square = document.getElementById('square');
  var triangle = document.getElementById('triangle');
  circle.addEventListener('mousedown', addElement);
  square.addEventListener('mousedown', addElement);
  triangle.addEventListener('mousedown', addElement);
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

function generateCSS(){
  /* gradient approach */
  parentPos = document.getElementById('canvas').getBoundingClientRect();

  css = hereDoc(function(){/*!
    position: relative;
    display: inline-block;
    float: left;
    width: 400px;
    height: 400px;
    box-shadow: inset 0 0 1px black;

  */});

  if ($('#canvas').children()[0]) {
    css +=  "  background: ";
  }

  var cssGradient = "";

  $('#canvas').children().each(function(index, element){
    var childrenPos = element.getBoundingClientRect();
    var top = childrenPos.top - parentPos.top;
    var left = childrenPos.left - parentPos.left;
    var gradient;

    if (element.className == 'circle') {
      gradient = "\n      radial-gradient(circle, #F012BE 70%, transparent 70%)";
      gradient += "\n      " + left + "px " + top + "px";
    } else if (element.className == 'square') {
      gradient = "\n      linear-gradient(#B10DC9 0%, #B10DC9 100%)";
      gradient += "\n      " + left + "px " + top + "px";
    } else if (element.className == 'triangle') {
      gradient = "\n      linear-gradient(-63deg, #85144b 30%, transparent 30%)";
      left -= 20;
      gradient += "\n      " + left + "px " + top + "px,";
      gradient += "\n      linear-gradient(63deg, #85144b 30%, transparent 30%)";
      left += 40;
      gradient += "\n      " + left + "px " + top + "px";
    }

    if (index > 0) {
      gradient += ","
    }

    cssGradient = gradient + cssGradient;
  });

  css += cssGradient + ";\n";

  css += hereDoc(function(){/*
    background-size: 10% 10%;
    background-repeat: no-repeat;
  */});

  cssToShow = ".drawing {" + css + "}";

  var div = document.getElementById('gen-code');
  div.innerHTML = cssToShow;
}

function testCSS() {
  document.getElementById('test-canvas').style = css;
}
