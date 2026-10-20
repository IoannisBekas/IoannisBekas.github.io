function createAppointmentMailto(email, fields) {
  const dateParts = fields.date ? fields.date.split('-') : [];
  const preferredDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : 'Δεν έχει οριστεί';
  const body = [
    'Καλησπέρα σας,',
    '',
    'Θα ήθελα να κλείσω ένα ραντεβού.',
    '',
    `Ονοματεπώνυμο: ${fields.name.trim()}`,
    `Τηλέφωνο: ${fields.phone.trim()}`,
    `Email: ${fields.email.trim() || 'Δεν έχει δοθεί'}`,
    `Τύπος επίσκεψης: ${fields.visit}`,
    `Προτιμώμενη ημερομηνία: ${preferredDate}`,
    `Προτιμώμενη ώρα (ώρα Ελλάδας): ${fields.time || 'Δεν έχει οριστεί'}`,
    ...(fields.note.trim() ? ['', `Σημείωση: ${fields.note.trim()}`] : []),
    '',
    'Αναμένω επικοινωνία για την επιβεβαίωση του ραντεβού.',
    '',
    'Ευχαριστώ.'
  ].join('\r\n');
  const subject = `Αίτημα για ραντεβού — ${fields.name.trim()}`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const appointmentForm = document.getElementById('appointment-form');
if (appointmentForm) {
  const practiceEmail = appointmentForm.dataset.email;
  const nameInput = document.getElementById('request-name');
  nameInput.addEventListener('input', () => {
    nameInput.setCustomValidity(nameInput.value.trim() ? '' : 'Συμπληρώστε το ονοματεπώνυμό σας.');
  });
  const phoneInput = document.getElementById('request-phone');
  phoneInput.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '');
    phoneInput.setCustomValidity(digits.length >= 10 ? '' : 'Συμπληρώστε ένα τηλέφωνο επικοινωνίας με τουλάχιστον 10 ψηφία.');
  });
  const dateInput = document.getElementById('request-date');
  dateInput.min = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Athens', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(new Date());

  appointmentForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(appointmentForm);
    const fields = Object.fromEntries(formData.entries());
    document.getElementById('request-status').textContent = `Ολοκληρώστε την αποστολή στην εφαρμογή email σας. Αν δεν άνοιξε, καλέστε στο 211 420 8010 ή γράψτε στο ${practiceEmail}.`;
    window.location.href = createAppointmentMailto(practiceEmail, fields);
  });
}
