import { checkboxUncheckedIcon, checkboxCheckedIcon } from './icons.js';

export function setupCheckboxIcons(context = document) {
  context.querySelectorAll('.custom-checkbox').forEach(wrapper => {
    const checkbox = wrapper.querySelector('.check-off');
    const iconSpan = wrapper.querySelector('.checkbox-icon');

    // Set initial icon
    iconSpan.innerHTML = checkbox.checked ? checkboxCheckedIcon : checkboxUncheckedIcon;

    // Listen for changes
    checkbox.addEventListener('change', () => {
      iconSpan.innerHTML = checkbox.checked ? checkboxCheckedIcon : checkboxUncheckedIcon;
    });
  });
}