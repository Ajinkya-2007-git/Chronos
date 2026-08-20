/* Age & Life Dashboard: deliberately plain JavaScript so the file works from file://. */
(function () {
	'use strict';

	var elements = {
		form: document.getElementById('birthForm'), date: document.getElementById('birthDate'), time: document.getElementById('birthTime'),
		note: document.getElementById('formNote'), ageLabel: document.getElementById('ageLabel'), readout: document.getElementById('ageReadout'),
		breakdown: document.getElementById('ageBreakdown'), born: document.getElementById('bornLabel'), updated: document.getElementById('updatedLabel'),
		heartbeats: document.getElementById('heartbeats'), breaths: document.getElementById('breaths'), sleepHours: document.getElementById('sleepHours'), orbits: document.getElementById('orbits'),
		milestoneDays: document.getElementById('milestoneDays'), milestoneDate: document.getElementById('milestoneDate'), milestoneProgress: document.getElementById('milestoneProgress'), milestonePercent: document.getElementById('milestonePercent'),
		copy: document.getElementById('copyButton'), feedback: document.getElementById('copyFeedback'), theme: document.getElementById('themeToggle')
	};
	var birthDate = null;
	var lastCopyText = '';
	var numberFormat = new Intl.NumberFormat('en-US');

	function pad(number) { return String(number).padStart(2, '0'); }
	function addMonths(date, months) {
		var result = new Date(date.getTime());
		result.setMonth(result.getMonth() + months);
		return result;
	}
	// Calendar subtraction keeps birthdays correct across leap years and variable month lengths.
	function calendarAge(start, end) {
		var years = end.getFullYear() - start.getFullYear();
		var cursor = new Date(start.getTime());
		cursor.setFullYear(start.getFullYear() + years);
		if (cursor > end) { years -= 1; cursor.setFullYear(start.getFullYear() + years); }
		var months = end.getMonth() - cursor.getMonth();
		if (months < 0) months += 12;
		var monthCursor = addMonths(cursor, months);
		if (monthCursor > end) { months -= 1; monthCursor = addMonths(cursor, months); }
		var remainder = end.getTime() - monthCursor.getTime();
		var days = Math.floor(remainder / 86400000); remainder -= days * 86400000;
		var hours = Math.floor(remainder / 3600000); remainder -= hours * 3600000;
		var minutes = Math.floor(remainder / 60000); remainder -= minutes * 60000;
		var seconds = Math.floor(remainder / 1000); var milliseconds = remainder - seconds * 1000;
		return { years: years, months: months, days: days, hours: hours, minutes: minutes, seconds: seconds, milliseconds: milliseconds };
	}
	function parseBirth() {
		if (!elements.date.value) return null;
		var parts = elements.date.value.split('-').map(Number); var timeParts = (elements.time.value || '00:00:00').split(':').map(Number);
		// Constructing locally honors the user's timezone rather than treating input as UTC midnight.
		var result = new Date(parts[0], parts[1] - 1, parts[2], timeParts[0] || 0, timeParts[1] || 0, timeParts[2] || 0, 0);
		return Number.isNaN(result.getTime()) ? null : result;
	}
	function animate(target) { target.classList.remove('rolling'); void target.offsetWidth; target.classList.add('rolling'); }
	function formatDate(date) { return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }
	function updateMilestone(now, age) {
		var nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate(), birthDate.getHours(), birthDate.getMinutes(), birthDate.getSeconds());
		if (nextBirthday <= now) nextBirthday.setFullYear(now.getFullYear() + 1);
		var previousBirthday = new Date(nextBirthday.getTime()); previousBirthday.setFullYear(nextBirthday.getFullYear() - 1);
		var days = Math.ceil((nextBirthday - now) / 86400000); var progress = Math.min(100, Math.max(0, ((now - previousBirthday) / (nextBirthday - previousBirthday)) * 100));
		elements.milestoneDays.textContent = days + (days === 1 ? ' day' : ' days'); elements.milestoneDate.textContent = formatDate(nextBirthday);
		elements.milestoneProgress.style.width = progress + '%'; elements.milestonePercent.textContent = Math.round(progress) + '% through this year';
	}
	function update() {
		if (!birthDate) return;
		var now = new Date(); if (birthDate > now) return;
		var age = calendarAge(birthDate, now); var ageText = age.years + ' years';
		elements.ageLabel.textContent = 'You have been here for'; elements.readout.innerHTML = '<span class="big-number">' + age.years + '</span><span class="unit">years</span>';
		elements.breakdown.innerHTML = '<div><strong>' + age.months + '</strong><span>months</span></div><div><strong>' + age.days + '</strong><span>days</span></div><div><strong>' + age.hours + '</strong><span>hours</span></div><div><strong>' + age.minutes + '</strong><span>minutes</span></div><div><strong>' + age.seconds + '</strong><span>seconds</span></div>';
		elements.born.textContent = 'Since ' + formatDate(birthDate) + ' · ' + pad(birthDate.getHours()) + ':' + pad(birthDate.getMinutes()); elements.updated.textContent = 'Updated just now';
		var livedMinutes = (now - birthDate) / 60000; var livedDays = livedMinutes / 1440;
		elements.heartbeats.textContent = numberFormat.format(Math.round(livedMinutes * 80)); elements.breaths.textContent = numberFormat.format(Math.round(livedMinutes * 16)); elements.sleepHours.textContent = numberFormat.format(Math.round(livedDays * 8)); elements.orbits.textContent = (livedDays / 365.2425).toFixed(2);
		updateMilestone(now, age); lastCopyText = 'My Age & Life Dashboard: ' + ageText + ', ' + age.months + ' months, ' + age.days + ' days, ' + age.hours + ' hours, ' + age.minutes + ' minutes, ' + age.seconds + ' seconds. Estimated heartbeats: ' + elements.heartbeats.textContent + '. Breaths: ' + elements.breaths.textContent + '. Sleep: ' + elements.sleepHours.textContent + ' hours. Solar orbits: ' + elements.orbits.textContent + '.';
	}
	elements.form.addEventListener('submit', function (event) {
		event.preventDefault(); birthDate = parseBirth();
		if (!birthDate || birthDate > new Date()) { elements.note.textContent = 'Please choose a birth date and time in the past.'; elements.note.className = 'form-note error'; return; }
		elements.note.textContent = 'Your timeline is running live from your local time zone.'; elements.note.className = 'form-note'; elements.copy.disabled = false; animate(elements.readout); update();
	});
	elements.copy.addEventListener('click', function () {
		var done = function () { elements.feedback.textContent = 'Results copied to clipboard.'; setTimeout(function () { elements.feedback.textContent = ''; }, 2500); };
		if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(lastCopyText).then(done); else { var area = document.createElement('textarea'); area.value = lastCopyText; document.body.appendChild(area); area.select(); document.execCommand('copy'); area.remove(); done(); }
	});
	elements.theme.addEventListener('click', function () { document.body.classList.toggle('light'); elements.theme.textContent = document.body.classList.contains('light') ? '☾' : '☼'; elements.theme.setAttribute('aria-label', document.body.classList.contains('light') ? 'Toggle dark theme' : 'Toggle light theme'); });
	setInterval(update, 1000);
}());
