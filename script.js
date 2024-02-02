// add any number of riders you want!
let ridersStore = [
	{name: 'Bungus', color: 'brown', number: 1},
	{name: 'Chungus', color: 'red', number: 2},
	{name: 'Amungus', color: 'lime', number: 3},
	{name: 'Flungus', color: 'purple', number: 4},
	{name: 'Chippewa', color: 'orange', number: 5},
	{name: 'Fleen', color: 'yellow', number: 6},
	{name: 'Awooga', color: 'gray', number: 7},
	{name: 'Lasty', color: 'beige', number: 0},
	{name: 'Carumba', color: 'goldenrod', number: 8},
	{name: 'Horse', color: 'lightblue', number: 9},
	{name: 'Horse 2 (the Sequel)', color: 'lightgreen', number: 10},
	{name: 'Mr. Ed', color: 'steelblue', number: 11},
	{name: 'Mrs. Fred', color: 'coral', number: 12},
	{name: 'Fasty', color: 'black', number: 13},
	{name: 'Broke-leg Bucky', color: 'green', number: 14},
	{name: 'Lump', color: 'darkorchid', number: 15},
	{name: `Lump's friend`, color: 'darksalmon', number: 16},
	{name: 'Stinks', color: 'khaki', number: 17},
	{name: 'Jacobim', color: 'lavender', number: 18},
	{name: 'Megan Thee Horse', color: 'hotpink', number: 19},
	{name: 'Skidaddle', color: 'lightskyblue', number: 20}
];
let numRiders = 13;
let winnerOffset = 0;
let finishOrder = [];
let maxRaceTime = 7000;
let maxRaceDiff = 2000;
let raceLength = 500;

const randInt = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

function go() {
	let riders = ridersStore.slice(0, numRiders);
	let course = document.querySelector('#racecourse');
	let startBuilding = document.querySelectorAll('.startBuilding > path');
	let finishLinePaths = document.querySelectorAll('.finishLine > path');
	let finishLine = raceLength - 100;
	let buildingH = (riders.length * 20) + 4;
	document.querySelector('.ground').setAttribute('width', raceLength);
	document.querySelector('.goldMedal').setAttribute('transform', `scale(0.2 0.2) translate(${1170 + raceLength} -200)`);
					document.querySelector('.silverMedal').setAttribute('transform', `scale(0.2 0.2) translate(${1170 + raceLength} -200)`);
					document.querySelector('.bronzeMedal').setAttribute('transform', `scale(0.2 0.2) translate(${1170 + raceLength} -200)`);
	
	startBuilding[0].setAttribute('d', `M -10 -2 h 50 v ${buildingH} h-50`);
	startBuilding[1].setAttribute('d', `M -10 -2 l 25 ${buildingH/8} v ${buildingH - (buildingH/3)} l-25 ${buildingH/5} M 40 -2 l-25 ${buildingH/8}v ${buildingH - (buildingH/3)} l25 ${buildingH/5}`);
	course.setAttribute('viewBox', `-10 -10 ${raceLength} ${(riders.length * 20) + 20}`);
	finishLinePaths[0].setAttribute('d', `M${finishLine} -10v${(riders.length * 20) + 20}`);
	finishLinePaths[1].setAttribute('d', `M${finishLine} -2.5v${(riders.length * 20) + 5}`);
	finishLinePaths[2].setAttribute('d', `M${finishLine} -2.5v${(riders.length * 20) + 5}`);
	// reset stuff
	winnerOffset = 0;
	finishOrder = [];
	let g = document.querySelector("#playerArea");
	let gatesArea = document.querySelector("#gates");
	const winnersSVG = document.querySelector("#winnersSVG");
	// Remove existing racers
	while (g.firstChild) {
		g.removeChild(g.firstChild);
	}
	// Remove existing gates
	while (gatesArea.firstChild) {
		gatesArea.removeChild(gatesArea.firstChild);
	}
	let players = ``;
	let gates = ``;
	for (let i = 0; i < riders.length; i++) {
		// create gates
		gates += `<path d="M40 ${(i * 20)}v20" stroke="#fff" stroke-width="1">
				<animateTransform class="blocks" attributeName="transform" attributeType="XML" type="rotate" values="0 40 ${(i * 20) + 20}; 90 40 ${(i * 20) + 20}" dur="200ms" begin="indefinite" fill="freeze" />
			</path>`;
		let steps = randInt(7, 14);
		let keyTimes = `0`;
		let splines = ``;
		let vals = `10`;
		
		
		for (let j = 1; j < steps; j++) {
			keyTimes += `;${j / steps}`;
			let lowerLimit = j / steps - (1 / steps) * 0.5;
			let upperLimit = j / steps + (1 / steps) * 0.5;
			vals += `;${randInt(Math.floor((finishLine - 30) * lowerLimit), Math.floor((finishLine - 30) * upperLimit))}`;
			splines += `${randInt(10, 100) / 100} ${randInt(10, 100) / 100} ${randInt(10, 100) / 100} ${randInt(10, 100) / 100};`;
		}
		
		
		keyTimes += ";1";
		splines += `0 0 0 0`;
		vals += `;${finishLine - 30}`;
		let dur = randInt(maxRaceTime - maxRaceDiff, maxRaceTime);
		players += `<g class="racer">
				<g stroke="#111" stroke-width="0.25" class="rider" data-player="${riders[i].name}" data-color="${riders[i].color}" data-lane="${i}">
				<g>
					<text class="racerName" stroke="none" fill="#fff" font-family="monospace" font-size="6" y="${7.5 + i * 20}" x="${-30 - (riders[i].name.length * 2)}">${riders[i].name}</text>
					<animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0; -113 0" dur="${(180 / raceLength * dur)}ms" begin="raceMotion${i}.end" fill="freeze" />
				</g>
				<text class="racerFinish" fill="#ccc" stroke="#fff" font-family="monospace" font-size="7" y="${7.5 + i * 20}" x="-85" text-anchor="middle"></text>
				<ellipse class="shadow" filter="url(#blur)" cx="8" cy="${22 + i * 20}" rx="17" ry="3" fill="rgba(0,0,0,0.5)" />
				<g class="thingsThatGallop">
					<use href="#horse" transform="translate(0 ${7.5 + i * 20})"  filter="brightness(${randInt(30, 70)}%)"/>
					<path class="number" d="M 10 ${7.1 + i * 20} h ${4 + riders[i].number.toString().length} v 5 h -${4 + riders[i].number.toString().length}" fill="#fff" />
					<text font-size="4" x="11.5" y="${11 + i * 20}">${riders[i].number || i}</text>
					<animateTransform class="playerGallop" attributeName="transform" attributeType="XML" type="rotate" values="-12 10 ${7.5 + i * 20}; 12 10 ${7.5 + i * 20}; -12 10 ${7.5 + i * 20}" dur="500ms" begin="${randInt(-3000, 0)}ms" repeatCount="indefinite" />
				</g>
				<use href="#jockey" fill="${riders[i].color}" transform="translate(0 ${7.1 + i * 20})" />
				<animateTransform attributeName="transform" attributeType="XML" type="translate" values="0 0; 130 0" dur="${(180 / raceLength * dur)}ms" begin="raceMotion${i}.end" fill="freeze" keyTimes="0;1" keySplines="0.67 0.64 0.37 0.28" calcMode="spline" />
			</g>
		<animateTransform id="raceMotion${i}" class="players" attributeName="transform" attributeType="XML" type="translate" values="${vals}" dur="${dur}ms" begin="indefinite" keyTimes="${keyTimes}" keySplines="${splines}" calcMode="spline" fill="freeze" />
		</g>`;
	}
	const wrapper = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	wrapper.innerHTML = `<g>${players}</g>`;
	const doc = wrapper.firstChild;
	g.appendChild(doc);
	const wrapper2 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	wrapper2.innerHTML = `<g>${gates}</g>`;
	const doc2 = wrapper2.firstChild;
	gatesArea.appendChild(doc2);

	
	// open the gates
	document.querySelectorAll(".blocks").forEach((gate) => {
		gate.beginElement();
	});
	
	// start the race
	document.querySelectorAll(".players").forEach((player) => {
		player.beginElement();
		if (!player._hasListener) {
			player._hasListener = true;
			// Add the animationend event listener
			player.addEventListener("endEvent", (event) => {
				let rider = player.parentElement.querySelector(".rider");
				finishOrder.push([rider.getAttribute("data-player"), rider.getAttribute("data-color"), rider.getAttribute("data-lane")]);
				if (finishOrder.length === 1) {
					document.querySelector('.medals').setAttribute('transform', `translate(${raceLength - 95} 0)`);
					document.querySelector('.goldMedal').setAttribute('transform', `scale(0.2 0.2) translate(0 ${100 * finishOrder[0][2] - 24})`);
				}
				if (finishOrder.length === 2) {
					document.querySelector('.silverMedal').setAttribute('transform', `scale(0.2 0.2) translate(0 ${100 * finishOrder[1][2] - 24})`);
				}
				if (finishOrder.length === 3) {
					document.querySelector('.bronzeMedal').setAttribute('transform', `scale(0.2 0.2) translate(0 ${100 * finishOrder[2][2] - 24})`);
				}
				if (finishOrder.length === riders.length) {
					for (let o=3; o<finishOrder.length; o++) {
						document.querySelector(`[data-player="${finishOrder[o][0]}"] > .racerFinish`).textContent = o + 1;
					}
					// console.log('Race over!');
				}
			});
		}
	});
}
go();
document.querySelector(".restart").addEventListener("click", go);



// knob settings
let settings = {
	visible: 0,
	knobs: [
		{
      label: 'Racers',
			labelTitle: 'Changes the number of horses in the race',
      type: "range",
			value: 12,
			min: 2,
			max: ridersStore.length,
      onChange: (e) => {
				numRiders = e.target.value * 1;
      }
    },
    {
      label: 'Racer Type',
			labelTitle: 'Which animal is racing',
      render: `
        <button type='button' class='horses'>Horses</button>
        <button type='button' class='crabs'>Crabs</button>
        <button type='button' class='ducks'>Ducks</button>
        <button type='button' class='snails'>Snails</button>
      `,
      script(knobs, name){
        knobs.getKnobElm(name).addEventListener("click", e => {
          if( e.target.tagName == 'BUTTON' ) {
					const racer = document.querySelector('#horse');
					switch(e.target.textContent) {
							case 'Horses':
								racer.setAttribute('d', 'M 10 0 c 1.7 0.1 4.6 -1 5.5 -1.6 c -0.7 -0.2 -1.1 -0.2 -1 -0.3 c 1.2 -0.1 1.4 -0.1 1.5 -0.1 c 0 0 0.2 0 0.2 -0.1 c 0 0 -0.2 0 -0.2 0 c -0.2 -0.1 -0.5 -0.2 -0.6 -0.2 c 0 0 -0.2 0 -0.2 0 c 0 -0.1 0.2 -0.1 0.2 -0.1 c 0.3 0 0.5 -0.1 0.8 -0.1 c 0.1 0 0.4 0 0.4 0 c 0 -0.1 -0.3 -0.1 -0.5 -0.2 c -0.1 -0.1 0.6 -0.2 0.8 -0.1 c 0 0 0.3 0.1 0.3 0 c 0 -0.1 -0.7 -0.3 -0.7 -0.4 c 0.2 -0.1 0.5 0 0.9 0.1 c 0.2 0 0.7 0.2 0.7 0.1 c 0.1 -0.2 -0.5 -0.3 -0.4 -0.4 c 0 -0.2 0.5 -0.1 0.8 0 c 0.4 0.1 0.6 0 0.5 -0.1 c -0.5 -0.3 0 -0.2 0.1 -0.2 c 0.3 0 0.6 0.1 0.8 0.2 c 0.2 0.1 -0.1 -0.3 0 -0.4 c 0 -0.1 0.5 0.1 0.7 0.2 c 0.1 0 0.2 0 0.3 -0.1 c 0.1 -0.1 0.2 -0.3 0.2 -0.4 c 0 -0.1 0.2 -0.2 0.3 -0.4 c 0.1 -0.1 0.1 -0.4 0.2 -0.4 c 0.1 0 0.4 0.4 0.4 0.5 c 0.1 0.2 0.2 0.5 0.3 0.7 c 0.1 0.1 0 0.4 0 0.5 c 0 0 0 0 0 0 c 0.2 0.2 0.3 0.5 0.5 0.6 c 0.3 0.4 1.1 1.8 1.3 2.1 c 0.2 0.3 0.8 1 0.8 1.1 c 0 0.2 0.1 0.4 0.2 0.5 c 0.2 0.2 0.1 0.5 0 0.7 c -0.1 0.2 -0.4 0.3 -0.5 0.3 c -0.1 0.1 -0.4 0.2 -0.5 0.1 c -0.2 0 -0.2 -0.2 -0.5 -0.5 c -0.4 -0.3 -0.7 -0.8 -1 -1.1 c -0.4 -0.1 -0.8 -0.3 -1.1 -0.3 c -0.2 -0.1 -0.6 -0.2 -0.8 -0.4 c -0.3 0.4 -2.5 2.3 -2.8 2.5 c -0.1 1.1 -0.1 2.1 -0.2 2.4 c -0.2 0.3 -0.3 0.6 -0.1 0.9 c 0.6 1.1 1.5 2.6 1.6 2.8 c 0.2 0.3 0.3 0.2 0.5 0.5 c 0.1 0.3 0.8 1.7 1.4 2.2 c 0.5 0.4 1.1 1.2 1.4 1.4 c 0.2 0.3 0.7 0.5 0.9 0.7 c 0.1 0.3 0.5 0.8 0.5 0.9 c -0.1 0.1 -1.4 0 -1.4 -0.2 c -0.1 -0.3 -0.2 -0.5 -0.1 -0.7 c -0.2 -0.1 -0.5 -0.5 -0.9 -0.5 c -0.3 -0.1 -1.5 -2.1 -1.7 -2.4 c -0.3 -0.3 -0.4 -0.1 -0.7 -0.5 c -0.4 -0.4 -0.5 -0.8 -1 -1.1 c -0.4 -0.2 -1.3 -1.5 -1.9 -2.2 c -0.5 0.1 -0.8 0.2 -1.3 0.2 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c -0.1 0 -0.1 0 -0.1 0 c -0.6 0.1 -1.5 0.8 -1.8 1.2 c -0.4 0.4 -1 0.8 -1.4 1.4 c -0.3 0.4 -0.7 1.1 -1.2 1.7 c -0.3 0.4 -0.6 0.7 -0.6 0.8 c 0.1 0.3 -0.5 0.9 -0.6 1 c -0.1 0.2 0 0.4 0.1 0.6 c 0.2 0.3 0 1 -0.1 1.1 c -0.1 0.2 -1.3 -0.7 -1.1 -1 c 0.1 -0.2 0.5 -0.5 0.5 -0.6 c 0 -0.2 0.2 -0.6 0.3 -0.9 c 0.2 -0.2 1.1 -1.3 1.2 -1.5 c 0.1 -0.3 0.5 -1.4 0.6 -1.6 c 0.1 -0.4 0.6 -0.8 0.9 -1.3 c 0.1 -0.1 0.2 -0.3 0.3 -0.5 c -1.1 -0.2 -2.3 -0.6 -3.1 -0.9 c -1 -0.3 -3.4 -1.4 -4 -1.4 c -0.9 0.1 -1.4 0.4 -2.2 0.6 c -1 0.4 -1.6 1.2 -1.9 1.3 c -0.5 0.1 -1.2 1.5 -1.4 1.8 c -0.4 0.3 -1.4 1.2 -1.5 1.4 c -0.1 0.2 -0.2 0.3 -0.4 0.4 c -0.4 0.2 -1.3 1.3 -1.4 1.7 c -0.1 0.5 -0.3 0.7 -0.5 0.8 c -0.3 0.2 -0.5 0.1 -0.7 0.5 c -0.1 0.3 -0.5 1.2 -1.1 1.4 c -0.5 0.1 -0.4 -0.3 -0.4 -0.6 c 0 -0.4 0.2 -1 0.5 -1 c 0.3 -0.1 0.5 0 0.6 -0.2 c 0.2 -0.2 0.1 -0.4 0.3 -0.6 c 0.2 -0.2 0.8 -0.5 0.9 -0.9 c 0.2 -0.4 0.8 -1.4 0.8 -1.8 c 0.1 -0.4 0.9 -1.2 1.2 -1.6 c -0.7 0.5 -2.4 1.5 -2.7 1.7 c -0.3 0.3 -0.7 1.1 -0.9 1.2 c -0.3 0.2 -0.7 0.4 -1 0.5 c -0.3 0.1 -0.6 0.2 -1 0.4 c -0.5 0.1 -0.7 0.1 -0.8 0.1 c -0.2 -0.1 -0.1 -1.1 0.5 -1.4 c 0.5 0 0.7 0.2 1 0.1 c 0.3 -0.1 0.2 -0.4 0.4 -0.5 c 0.2 -0.1 0.8 -0.2 0.9 -0.4 c 0.2 -0.2 1.4 -1.4 1.6 -1.7 c 0.3 -0.4 0.7 -1.2 0.9 -1.4 c 0.3 -0.2 0.9 -0.3 1.3 -0.5 c 0.4 -0.2 0.9 -0.6 1.2 -1.1 c -0.2 -0.9 0 -2.2 -0.1 -2.8 c 0 -0.5 0.2 -1 0.4 -1.4 c 0 -0.1 0 -0.1 -0.1 -0.1 c -0.4 -0.1 -0.9 0.4 -1.2 0.5 c -1.1 0.3 -0.9 0.2 -0.6 0 c -1.3 0.2 -1.8 0.6 -1.8 0.6 c 0.1 -0.1 0.2 -0.2 0.3 -0.3 c -0.2 0 -0.6 0.4 -0.9 0.5 c -0.6 0.1 -0.8 0.1 -0.9 0.2 c -0.1 0 -0.2 0 -0.2 0 c 0 0 0.2 -0.1 0.2 -0.1 c 0.1 0 0.3 -0.1 0.4 -0.2 c 0.1 -0.1 0.1 -0.1 0.1 -0.1 c -0.1 -0.1 -0.3 0 -0.4 0 c -0.2 0 -0.4 0.2 -0.5 0.2 c -1.1 0.2 -1.6 0.3 -1.6 0.3 c 0.6 -0.3 1 -0.3 1.1 -0.4 c -2 0.1 -2.2 0.2 -2.5 0.3 c 0 -0.1 0.6 -0.4 1.3 -0.5 c -0.2 -0.1 -1.6 -0.1 -1.8 0 c 0.1 -0.1 0.1 -0.1 0.4 -0.2 c 1.6 -0.3 1.8 -0.4 1.9 -0.4 c 0 0 -0.1 0 -0.1 0 l -0.5 0 c -0.4 0 -0.7 -0.2 -1.1 -0.2 c -0.8 0 0.2 -0.1 0.2 -0.1 c 0.1 0 0.1 0 0.3 -0.1 c -0.2 -0.1 -0.7 -0.1 -0.9 0 c -0.2 0.1 -0.3 0.2 -0.4 0.2 c 0.2 -0.3 0.5 -0.4 0.7 -0.4 c 0.5 0 1.3 -0.1 1.7 -0.1 c 0.6 0.1 0.7 0 0.7 0 c 0 0 0.4 -0.1 0.5 -0.1 c 0.5 0 1.2 0.3 1.7 0.2 c 0.3 0 0.5 0 0.7 -0.1 c -0.2 -0.1 -0.3 -0.1 -0.3 -0.2 c 0.1 0 0.5 0.1 0.6 0.1 c 0.8 0 1.1 0 1.4 -0.1 c 2.1 -0.2 2.2 -0.2 2.3 -0.3 c 0.5 -0.3 2.6 -0.7 3.6 -0.8 c 1.1 0 2.7 0.5 3.2 0.5 c 0.5 0 1.9 0.6 3.1 0.4 z');
						racer.setAttribute('fill', 'tan');
							break;
						case 'Crabs':
							racer.setAttribute('d', 'M 13.6 -1.2 l -0.3 0 a 3.4 3.4 90 0 0 -2 0 l -0.3 0 a 5.4 5.4 90 0 1 0 -0.8 a 0.8 0.8 90 1 0 -0.6 -0.2 a 3.5 3.5 90 0 0 -0.1 1 q -0.6 0 -1.2 0.2 l -2 -1.4 c 0.4 -0.5 0.4 -1.3 0.2 -2.2 c 1.5 -0.6 3.1 -2.5 2.4 -4.4 a 5.6 5.6 90 0 1 -2.6 2.8 c -0.1 -1 0.3 -2.3 1 -3.8 a 6.1 6.1 90 0 0 -3 3.3 c -0.4 1.2 -0.6 3.8 0.7 4.5 a 7.1 7.1 90 0 0 1.3 2 a 3.8 3.8 90 0 0 -1.6 2.3 a 2.7 2.7 90 0 1 -0.9 -1.4 l -0.3 0 a 3.1 3.1 90 0 0 -0.6 -2.6 l -0.2 0.1 a 7.2 7.2 90 0 1 -0.5 -3.3 q 0 -0.3 -0.2 -0.1 a 3.7 3.7 90 0 0 -0.3 3.7 l -0.2 0.1 a 5.9 5.9 90 0 1 1 2.8 l -0.2 0.3 a 4.5 4.5 90 0 0 2.4 1.6 a 3.5 3.5 90 0 0 0.2 0.7 q -1.7 -1 -1.7 -0.3 a 2.1 2.1 90 0 1 -1.5 -1.5 l -0.5 0 a 3.9 3.9 90 0 1 -1.7 -2.6 q -0.1 -0.4 -0.2 -0.1 a 3.8 3.8 90 0 0 1.2 3.8 l -0.2 0.2 a 4.6 4.6 90 0 0 2.8 1.1 l 0.1 0.5 a 4.7 4.7 90 0 0 2.1 -0.3 a 5.2 5.2 90 0 0 0.4 0.5 a 5.2 5.2 90 0 1 -2.3 0.5 v 0.4 a 1.9 1.9 90 0 0 -1.3 1.7 c -0.3 0.3 -0.5 0.9 -0.5 1.5 a 3.1 3.1 90 0 0 0.6 1.7 q 0.2 0.2 0.2 0 a 3.6 3.6 90 0 1 0.2 -2.7 l 0.4 -0.1 a 2.4 2.4 90 0 1 0.8 -1.4 a 2.6 2.6 90 0 0 2.4 -1 c 3.2 2.4 7.2 2.2 10.5 0 q 0.9 1.4 2.5 1 a 2.1 2.1 90 0 1 0.9 1.5 l 0.3 0 a 12.5 12.5 90 0 1 0.2 2.7 a 0.1 0.1 90 0 0 0 0 q 0 0.3 0.2 0 c 0.9 -2.1 0.4 -2.9 0.1 -3.2 a 1.6 1.6 90 0 0 -1.3 -1.8 v -0.3 a 2.8 2.8 90 0 1 -2.4 -0.5 a 4.3 4.3 90 0 0 0.4 -0.5 a 5.8 5.8 90 0 0 2.2 0.2 l 0 -0.4 a 3.6 3.6 90 0 0 2.7 -1.3 l -0.2 -0.1 a 3.6 3.6 90 0 0 1.4 -3.7 q -0.1 -0.3 -0.2 0 a 5.7 5.7 90 0 1 -1.8 2.7 l -0.3 0 a 2.5 2.5 90 0 1 -1.6 1.5 l 0 -0.4 q -1.1 0.9 -1.8 0.7 a 7 7 90 0 0 0.2 -0.7 a 4.8 4.8 90 0 0 2.4 -1.5 a 3.9 3.9 90 0 1 0.9 -3.1 l -0.3 -0.2 a 3.1 3.1 90 0 0 -0.3 -3.6 q -0.1 -0.1 -0.1 0 a 7.2 7.2 90 0 1 -0.5 3.2 l -0.2 -0.1 a 3.2 3.2 90 0 0 -0.6 2.7 a 2.7 2.7 90 0 1 -0.3 -0.1 a 2.2 2.2 90 0 1 -0.9 1.6 a 3.1 3.1 90 0 0 -1.5 -2.4 a 7.4 7.4 90 0 0 1.2 -1.9 c 1.3 -0.7 1.1 -3.4 0.7 -4.5 a 6.1 6.1 90 0 0 -3.1 -3.4 c 0.8 1.5 1.1 2.8 1.1 3.8 a 5.6 5.6 90 0 1 -2.6 -2.8 c -0.7 1.9 0.8 3.8 2.4 4.4 c -0.2 0.9 -0.2 1.7 0.2 2.2 l -2.1 1.4 q -0.6 -0.1 -1.1 -0.1 a 3.5 3.5 90 0 0 -0.1 -1.1 a 0.8 0.8 90 1 0 -0.6 0.2 a 5.3 5.3 90 0 1 0 0.8 z');
							racer.setAttribute('fill', '#f00');
							break;
						case 'Ducks':
							racer.setAttribute('d', 'M 17.2 -11.6 c -0.5 0.1 -0.8 0.2 -1.2 0.6 c -1.4 1.4 -1.4 3.6 -1.2 5.4 c 0.4 2.2 0.4 2.8 -0.1 3.5 c -2.5 -0.5 -3.5 -0.4 -4.7 0.1 c -6 3 -6 3 -6 3 c -0.2 0 -0.2 0 -0.4 -0.2 c -0.6 -0.2 -1 -0.2 -1 -0.2 c -0.2 0 -0.4 0 -0.4 0.4 c 0 0 0 0.2 0 0.2 c -0.4 -0.4 -0.8 -0.4 -1.1 -0.3 c -0.2 0.1 0 0.5 0.1 0.9 c -0.3 0 -0.5 0.1 -0.2 0.4 c 0.2 0.4 -0.1 0.8 -0.4 0.6 c -0.3 -0.2 -0.4 -0.2 -0.4 -0.1 c 0 0.3 0 0.3 0.2 0.5 c 0.2 0.2 0.4 0.2 0.4 0.2 c -0.5 0.3 -0.6 0.4 -0.2 0.6 c 0.7 0.3 2.2 1.3 3 1.4 c 0.1 1.2 4.4 3.2 5.7 3.4 c 0.1 0.8 0.3 1.2 0.3 1.6 c 0 1.6 -0.2 0.8 0 1.8 c 0 0.4 0.3 1.3 1 1.3 c 4 0.1 4 0.1 4 -0.1 c 0 0 -0.2 0 -0.4 -0.2 c 0.2 -0.3 -0.3 -1.1 -0.9 -1.2 c -1.9 0 -1.9 -0.2 -2.1 -0.2 c -0.2 -0.2 -0.2 -0.2 -0.2 -0.2 c 0 -0.2 0 -0.4 -0.2 -0.6 c 0 0 0 0 0 -0.2 c 0 0 0 -0.2 -0.2 -0.4 c -0.2 -0.4 0 -0.4 -0.2 -0.8 c 0 -0.8 0 -0.8 0 -0.8 c 0.4 0.2 0.8 0.2 3 0.3 c -0.7 1.8 -0.4 2.1 -0.4 2.1 c 0.1 0.1 0.3 -0.4 0.4 -0.3 c 0 0.5 0 0.5 0 0.5 c 0 0.4 0.8 1 1 1 c 0.6 0 0.8 0.2 0.8 -0.2 c 2.4 -0.2 2.3 0 2.4 -0.2 c 0.1 -0.2 0 -0.3 -0.5 -0.4 c 0.4 -0.4 0.4 -0.9 0.7 -0.8 c 0.1 0 0.2 -0.1 0 -0.2 c -0.8 -0.4 -1 -0.4 -1.6 -0.2 c -0.4 0.2 -0.6 0.2 -0.8 0.2 c -0.6 0 -0.6 0 -0.6 0 c 0 -0.2 0 -0.2 -0.2 -0.2 c -0.1 -0.9 -0.3 -0.9 -0.2 -1.4 c 0 0 0 0 0 0 c 0 0 0 0 0 0 c 11.8 -0.4 7 -9.2 6 -10.4 c -0.8 -1.4 -1.6 -3 -1.8 -3.8 c -0.2 -0.4 -0.2 -1 -0.2 -1.2 c 0 0 0 0 0.2 0 c 0 0 0 0 0.2 0.2 c 0.2 0.2 0.4 0.4 0.8 0.6 c 0.4 0.4 0.8 0.4 1.2 0.4 c 0.4 0.2 0.8 0.2 1 0.4 c 0.6 0 0.8 0 0.8 -0.2 c 0.2 -0.2 0.2 -0.4 0.2 -0.6 c 0 -0.4 -0.2 -0.6 -0.6 -0.8 c -0.4 0 -0.8 -0.4 -1.2 -0.8 c -0.4 -0.4 -0.6 -0.6 -0.6 -0.8 c -0.2 0 -0.2 -0.6 -0.2 -0.6 c 0 0 0 -0.2 -0.2 -0.2 c 0 0 0 0 0 -0.2 c 0.2 -1.6 -0.7 -2.9 -2.8 -2.6 z');
							racer.setAttribute('fill', '#ff0');
							break;
						case 'Snails':
							racer.setAttribute('d', 'M 24.1 -0.4 c -0.7 0 -1.1 0.5 -1.1 1.1 c 0 0.3 0 0.5 0.2 0.7 l -1.6 2.7 c -0.2 0 -0.4 0 -0.6 0 v -2.4 c 0.4 -0.1 0.6 -0.5 0.6 -1 c 0 -0.6 -0.4 -1.1 -1 -1.1 c -0.7 0 -1.2 0.5 -1.2 1.1 c 0 0.5 0.3 0.9 0.7 1 v 2.6 c -1 0.4 -2.5 1.1 -4.7 2.6 c 0.3 -0.5 1.1 -2.1 -1.4 -2.5 c -0.6 -3.6 -3.7 -6.3 -7.4 -6.3 c -4.1 0 -7.5 3.4 -7.5 7.5 c 0 0.2 0 0.5 0.1 0.7 l 0 0 c 0 0 -3.4 1.5 -0.7 3 c -1.2 0.6 -3.5 2.2 -3.5 2.2 s -2.6 1.6 0.6 1.6 h 19.9 c 0 0 2 0 3.9 -2.8 c 2 -2.9 4.8 -3.2 4.8 -4.5 c 0 -0.9 -0.8 -1.4 -1.7 -1.6 l 1.4 -2.4 c 0.1 0 0.1 0 0.2 0 c 0.6 0 1.1 -0.5 1.1 -1.1 c 0 -0.6 -0.5 -1.1 -1.1 -1.1 z');
							racer.setAttribute('fill', '#0ff');
							break;
					}
				}
        });
      },
    },
		{
			label: "Race Length",
			labelTitle: 'Slowest horse will only be able to go this slow.',
			type: "range",
			value: 500,
			min: 300,
			max: 1500,
			onChange: (e) => {
				raceLength = e.target.value * 1;
			}
		},
		{
			label: "Max Time Apart (ms)",
			labelTitle: 'Maximum possible distance between first and last place.',
			type: "range",
			value: 1500,
			min: 200,
			max: 3000,
			onChange: (e) => {
				maxRaceDiff = e.target.value * 1;
			}
		},
		{
			label: "Max Race Time (ms)",
			labelTitle: 'Slowest horse will only be able to go this slow.',
			type: "range",
			value: 7000,
			min: 3000,
			max: 20000,
			onChange: (e) => {
				maxRaceTime = e.target.value * 1;
			}
		},
		{
      label: 'Ground Texture',
			labelTitle: 'Use the mud texture on the ground.',
      type: 'checkbox',
      value: true,
      onChange: (e) => {
				e.target.checked ? document.querySelector('.ground').setAttribute('filter', 'url(#mud)') : document.querySelector('.ground').setAttribute('filter', '');
			}
    }
	]
};

const myKnobs = new Knobs(settings);