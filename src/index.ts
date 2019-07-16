import {Loader} from './Loader';

document.addEventListener('DOMContentLoaded', function() {
  const elements = document.getElementsByTagName('svg')
  console.log('elements', elements)
  new Loader(elements)
})
