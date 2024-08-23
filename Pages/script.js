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
    Array.from(storage.childNodes).forEach((e)=>{e.remove();});
    Array.from(domElem.childNodes).forEach((e)=>{
	if (e.nodeName == '#text') {
	    Array.from(e.data).forEach(letter=>{
		let span = document.createElement('span');
		span.dataset['x'] = x;
		span.dataset['y'] = y;
		x++;
		if (letter == '\n') { x=0; y++; }
		span.appendChild(document.createTextNode(letter));
		storage.appendChild(span);
	    });
	} else {
	    storage.appendChild(characteriseTextAndCopy(e));
	}
    });
    return storage;
}

function characteriseText (domElem) {
    let processed = characteriseTextAndCopy(domElem);
    Array.from(domElem.childNodes).forEach((e)=>{e.remove();});
    Array.from(processed.childNodes).forEach((e)=>{e.remove();domElem.appendChild(e);});
}

Array.from(document.getElementsByClassName('rainbow')).forEach(r=>{
    characteriseText(r);
    forChildren(r, (e)=>{}, (e)=>{
	let d = 4;
	e.style.animationDuration = d+'s';
	e.style.animationDelay = ((((Number(e.dataset['x'])+Number(e.dataset['y']))*0.1)%1-1)*d)+'s';
    });
});
