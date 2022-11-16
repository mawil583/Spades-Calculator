let canHover = !(matchMedia('(hover: none)').matches);
if (canHover) {
  document.body.classList.add('can-hover');
}