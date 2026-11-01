// Preview forms never send data anywhere (Icelandic notice for the Þingvangur preview).
document.addEventListener('submit', event => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  let status = form.querySelector('[data-local-status]');
  if (!status) {
    status = document.createElement('p');
    status.dataset.localStatus = '';
    status.setAttribute('role', 'status');
    status.style.cssText = 'margin-top:1em;font:inherit';
    form.append(status);
  }
  status.textContent = 'Forsýning: skilaboðin hafa ekki verið send. Tengja þarf eigin vefþjón við formið áður en síðan fer í loftið.';
}, true);
