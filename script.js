const isLeapYear = (year) => {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};
const updateMessage = (value) => {
	const leap = isLeapYear(value) ? "Leap" : "Not Leap";
	document.querySelector(
		"#message"
	).innerHTML = `The year <strong>${value}</strong> is <b>${leap}</b>`;
};
document.addEventListener("DOMContentLoaded", () => {
	const input = document.querySelector("#checkYear");
	input.addEventListener("change", (e) => {
		updateMessage(e.target.value);
	});
	input.value = new Date().getFullYear();
	updateMessage(input.value);
});
