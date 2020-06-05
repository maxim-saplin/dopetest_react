import React, { useState } from 'react';
import rand from './rand';

let labels = [];
let funcG;
let startedG = false;

window.addEventListener("message", () => {
  funcG();
}, true);

function App() {

  const [started, setStarted] = useState(false);
  const [startedOnce, setStartedOnce] = useState(false);
  const [maxId, setMaxId] = useState(-1);
  const [dopes, setDopes] = useState("Warming up..");

  let startTest = () => {
    rand.init(0);
    //alert(rand.next());
    setStarted(true);
    setStartedOnce(true);
    setDopes("Warming up..");
    startedG = true;

    let width =  window.innerWidth;
    let height = window.outerHeight;
    let i = 0;
    let max = 600;
    let prevUpdate = null;
    let prevCount = 0;
    
    let accum = 0;
    let accumN = 0;

    labels = [];

    let func = () => {
      let label = {};

      let top = Math.round(rand.next()*height);
      let left = Math.round(rand.next()*width);
      let angle  = Math.round(rand.next()*width);
      let color = "rgb(" + 
        Math.round(rand.next()*255) + ","+  
        Math.round(rand.next()*255) + "," +
        Math.round(rand.next()*255) + ")";

      label.top = top+"px";
      label.left = left+"px";
      label.transform = "rotate("+angle+"deg)";
      label.color = color;
      label.id = i;

      labels.push(label);

      if (i > max){
        labels.splice(0,1);

        if (!prevUpdate) {
           prevUpdate = Date.now();
           prevCount = i;
        }
        
        let diff = Date.now() - prevUpdate;
        
        if (diff >= 500) {
           let val = ((i - prevCount) / diff * 1000);
           accum += val;
           accumN++;
           setDopes(val.toFixed(2)  + " Dopes/s");
           prevUpdate = Date.now();
           prevCount = i;
        }
      }

      if (startedG) {
        window.postMessage("z", "*");
        setMaxId(i);
      }
      else {
        setDopes((accum/accumN).toFixed(2)  + " Dopes/s (AVG)");
      }

      i++; 
    }
   
    funcG = func;
    setTimeout(func, 0);
  }

  return (
    <>
      <span id="dopes" hidden={!startedOnce} >{dopes}</span>
      <button id="start" hidden={started} onClick={() => startTest()}>@ Start</button>
      <button id="stop" hidden={!started} onClick={() => {setStarted(false); startedG = false}}>@ Break</button>
      {labels.map(l => 
        <span key={l.id} style={{position: "absolute", top: l.top, left: l.left, color: l.color, transform: l.transform}}>Dope</span>
        )}
    </>
  );
}

export default App;
