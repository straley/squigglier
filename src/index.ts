import { Loader } from './Loader';

document.addEventListener(
  'DOMContentLoaded', 
  ()=>Loader.compile(document.getElementsByTagName('svg')) 
)
