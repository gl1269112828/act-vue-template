import Vue from 'vue';

function hasPermission(parms) {
  const authoritys = JSON.parse(sessionStorage.getItem('authoritys')) || [];
  return parms === 'reset' ? true : authoritys.includes(String(parms));
}

Vue.directive('hasBtn', {
  inserted: (el, binding, vnode) => {
    if (!hasPermission(binding.value)) {
      el.parentNode.removeChild(el);
    }
  }
});
