/*
  Name: GameLog
  Author: David Deighan
  Publish date: 01/23/2022
  Description: A simple application designed to keep track of two things:
      video games that you own, but haven't played yet (backlog), and
      video games that you want to get at some point (wishlist). It also
      provides the user the ability to save their lists in local storage
      for later access in a returning session.
    It utilizes Vue to streamline the process of storing data and dynamically
      rendering each list item, while using JavaScript for more direct control
      over data manipulation.
  Made with: HTML, CSS, JavaScript, VueJS (CDN)
*/

// about screen
const about = document.querySelector('.about');
const aboutBtn = document.querySelector('.abt-btn');

aboutBtn.addEventListener('click', () => {
  about.style.visibility = 'visible';
});

about.addEventListener('click', () => {
  about.style.visibility = 'hidden';
});

// list
const list = Vue.createApp({
  data(){
    return {
      backlog: [],
      wishlist: [],

      backRender: true,
      wishRender: false
    }
  },
});

list.component('list-item', {
  props: ['datas'],
  template: `
    <div class='list-item' v-for='(data, index) in datas'>
      <h2>{{ data.name }}</h2>
      <table>
        <tr>
          <td>Genre: </td>
          <td>{{ data.genre }}</td>
          <td>Platform</td>
          <td>{{ data.plat }}</td>
        </tr>
        <tr>
          <td>Developer: </td>
          <td>{{ data.dev }}</td>
          <td>Publisher: </td>
          <td>{{ data.pub }}</td>
        </tr>
      </table>
      <button class='delete' @click="datas.splice(datas.indexOf(data), 1)">Delete</button>
    </div>
  `
});

const vm = list.mount('.list-area');

// Sidebar references

const backBtn = document.querySelector('.backlog-btn');
const wishBtn = document.querySelector('.wishlist-btn');
const addBtn = document.querySelector('.add-btn');

const nameField = document.querySelector('#name');
const genreField = document.querySelector('#genre');
const platField = document.querySelector('#platform');
const devField = document.querySelector('#dev');
const pubField = document.querySelector('#pub');

// Swap between backlog and wishlist

/*
  Checks to see if value associated with other list is FALSE, if true,
  change it
*/

function swapRender(e){
  switch(e.target.textContent.toLowerCase()){
    case ('backlog'):
      if (vm.$data.backRender === false){
        activeStyle('back');
        vm.$data.backRender = true;
        vm.$data.wishRender = false;
        break;
      } else {
        break;
      }
    case ('wishlist'):
      if (vm.$data.wishRender === false){
        activeStyle('wish');
        vm.$data.wishRender = true;
        vm.$data.backRender = false;
        break;
      } else {
        break;
      }
    default:
      break;
  }
}

function activeStyle(mode){
  switch(mode){
    case('back'):
      backBtn.style.border = '3px solid rgba(130,200,130,1)';
      backBtn.style.backgroundColor = 'rgba(130,200,130,1)';
      backBtn.id = 'active';

      wishBtn.style.border = '3px solid rgba(160,160,160,1)';
      wishBtn.style.backgroundColor = 'white';
      wishBtn.id = 'inactive';
      break;

    case('wish'):
      wishBtn.style.border = '3px solid rgba(130,200,130,1)';
      wishBtn.style.backgroundColor = 'rgba(130,200,130,1)';
      wishBtn.id = 'active';

      backBtn.style.border = '3px solid rgba(160,160,160,1)';
      backBtn.style.backgroundColor = 'white';
      backBtn.id = 'inactive';
      break;

    default:
      break;
  }
}

backBtn.onmouseover = (() => {
  if (backBtn.id === 'inactive'){
    backBtn.style.backgroundColor = 'rgba(200,200,200,1)';
  }
});

backBtn.onmouseout = (() => {
  if (backBtn.id === 'inactive'){
    backBtn.style.backgroundColor = 'white';
  }
});

wishBtn.onmouseover = (() => {
  if (wishBtn.id === 'inactive'){
    wishBtn.style.backgroundColor = 'rgba(200,200,200,1)';
  }
});

wishBtn.onmouseout = (() => {
  if (wishBtn.id === 'inactive'){
    wishBtn.style.backgroundColor = 'white';
  }
});

activeStyle('back');

backBtn.addEventListener('click', swapRender);
wishBtn.addEventListener('click', swapRender);

// Add and remove games

function addGame(){
  switch(vm.$data.backRender){

    // if on Backlog
    case (true):
      compileFields();
      clearFields();
      if (fieldObj.name){
        vm.$data.backlog.push(fieldObj);
      }
      fieldObj = {};
      break;

    // if on Wishlist
    case (false):
      compileFields();
      clearFields();
      if (fieldObj.name){
        vm.$data.wishlist.push(fieldObj);
      }
      fieldObj = {};
      break;
    default:
      break;
  }
}

let fieldObj = {};

function compileFields(){
  if (nameField.value !== ''){
    fieldObj = {
      name: nameField.value,
      genre: genreField.value,
      plat: platField.value,
      dev: devField.value,
      pub: pubField.value
    }
  } else {
    console.log('Error: A name is needed at the bare minimum.');
  }
}

function clearFields(){
  nameField.value = '';
  genreField.value = '';
  platField.value = '';
  devField.value = '';
  pubField.value = '';
}

addBtn.addEventListener('click', addGame);

// Local storage & User data

const saveBtn = document.querySelector('.save-btn');
const clearBtn = document.querySelector('.clear-btn');

/*
  Using WebStorage API:
    obj => JSON.stringify() => Local Storage
    Local Storage => JSON.parse() => obj
*/

let storageObj = {
  backlog: [],
  wishlist: []
};

let storageStr = '';

function saveData(){
  // fill storage object
  storageObj.backlog = vm.$data.backlog;
  storageObj.wishlist = vm.$data.wishlist;

  // obj => JSON string
  storageStr = JSON.stringify(storageObj);

  // JSON => local storage(userdata)
  localStorage.setItem('userdata', storageStr);
}

function loadData(){
  if (localStorage.getItem('userdata')){
    // JSON str => obj
    storageStr = localStorage.getItem('userdata');
    storageObj = JSON.parse(storageStr);
    vm.$data.backlog = storageObj.backlog;
    vm.$data.wishlist = storageObj.wishlist;
  } else {
    console.log('Data not present.');
  }
}

function clearData(){
  if (localStorage.getItem('userdata')){
    localStorage.removeItem('userdata');
    console.log('Data cleared.');
  } else {
    console.log('Data not present.');
  }
}

saveBtn.addEventListener('click', saveData);
clearBtn.addEventListener('click', clearData);
loadData();
