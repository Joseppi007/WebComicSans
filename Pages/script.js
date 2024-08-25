function forChildren (domElem, funcTextLeaf, funcStem) {
    funcStem(domElem);
    Array.from(domElem.childNodes).forEach((e)=>{
	if (e.nodeName == '#text') {
	    funcTextLeaf(e);
	} else {
	    forChildren(e, funcTextLeaf, funcStem);
	}
    });
}

function characteriseTextAndCopy (domElem) {
    let storage = domElem.cloneNode();
    let x = 0;
    let y = 0;
    let maxX = 0;
    let maxY = 0;
    Array.from(storage.childNodes).forEach((e)=>{e.remove();});
    Array.from(domElem.childNodes).forEach((e)=>{
	if (e.nodeName == '#text') {
	    Array.from(e.data).forEach(letter=>{
		let span = document.createElement('span');
		span.dataset['x'] = x;
		span.dataset['y'] = y;
		x++;
		if (letter == '\n') { x=0; y++; }
		if (x > maxX) { maxX = x; }
		if (y > maxY) { maxY = y; }
		span.appendChild(document.createTextNode(letter));
		storage.appendChild(span);
	    });
	} else {
	    let c = characteriseTextAndCopy(e);
	    storage.appendChild(c);
	    if (c.dataset['maxX'] > maxX) { maxX = c.dataset['maxX']; }
	    if (c.dataset['maxY'] > maxY) { maxY = c.dataset['maxY']; }
	}
    });
    storage.dataset['maxX'] = maxX;
    storage.dataset['maxY'] = maxY;
    return storage;
}

function characteriseText (domElem) {
    let processed = characteriseTextAndCopy(domElem);
    Array.from(domElem.childNodes).forEach((e)=>{e.remove();});
    Array.from(processed.childNodes).forEach((e)=>{e.remove();domElem.appendChild(e);});
    domElem.dataset['maxX'] = processed.dataset['maxX'];
    domElem.dataset['maxY'] = processed.dataset['maxY'];
}

function animationifyClass (className, animFunc /*In: x, y, text, maxX, maxY | Out: [duration, start_time]*/) {
    Array.from(document.getElementsByClassName(className)).forEach(r=>{
	characteriseText(r);
	forChildren(r, (e)=>{}, (e)=>{
	    let values = animFunc(Number(e.dataset['x']), Number(e.dataset['y']), e.innerText, r.dataset['maxX'], r.dataset['maxY']);
	    let duration = values[0];
	    let start_time = values[1];
	    e.style.animationDuration = duration+'s';
	    e.style.animationDelay = (start_time%duration-duration)+'s';
	});
    });
}

animationifyClass('rainbow', (x,y,t,mx,my)=>{
    return [4, .4*(x+y)];
});

animationifyClass('bloo', (x,y,t,mx,my)=>{
    let cx = mx / 2; // center
    let cy = my / 2;
    let d = Math.pow(Math.pow(x-cx,2)+Math.pow(y-cy,2),0.5); // dist
    return [1.5, 1.5*Math.atan2(x-(mx/2),y-(my/2))/(2*Math.PI)+d*.05];
});
