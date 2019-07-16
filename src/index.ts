import {Loader} from './Loader';

document.addEventListener(
  'DOMContentLoaded', 
  ()=>new Loader(document.getElementsByTagName('svg')) 
)
