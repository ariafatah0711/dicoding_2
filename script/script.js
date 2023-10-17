// #####################################################################################################
// button
// #####################################################################################################
// search
function search() {
  let input, filter, li, h3, txtValue;
  input = document.getElementById("search");
  filter = input.value.toUpperCase();

  li = document.querySelectorAll("li");
  for (let i = 0; i < li.length; i++) {
    h3 = li[i].getElementsByTagName("h3")[0];
    txtValue = h3.textContent || h3.innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

// show form toggle
function showForm(method) {
  const main1 = document.getElementById("main1");
  const main2 = document.getElementById("main2");
  if (method === "true") {
    main1.classList.add("hidden");
    main2.classList.remove("hidden");
  } else {
    main1.classList.remove("hidden");
    main2.classList.add("hidden");
  }
}

// #####################################################################################################
// main script
// #####################################################################################################
// show data
const container1 = document.getElementById("compleateRead");
const container2 = document.getElementById("inCompleateRead");
function showData() {
  console.info(data);
  for (i in data) {
    let judul, penulis, tahun, read;
    judul = data[i].title;
    penulis = data[i].author;
    tahun = data[i].year;
    if (data[i].isComplete === true) {
      read = "read";
    } else {
      read = "";
    }

    const item = document.createElement("li");
    item.id = data[i].id;
    item.innerHTML = `
        <article>
            <h3>${judul}</h3>
            <p>penulis: ${penulis}</p>
            <p>tahun: ${tahun}</p>
        </article>
        <div class="action">
            <button class="${read}" onclick="formData('read', this)" id="action"><i class="fa-solid fa-check"></i></button>
            <button class="trash" onclick="formData('remove', this)"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    if (data[i].isComplete === false) {
      //   container1.appendChild(item);
      container1.insertAdjacentHTML("afterbegin", item.outerHTML);
    } else {
      //   container2.appendChild(item);
      container2.insertAdjacentHTML("afterbegin", item.outerHTML);
    }
  }
}

// asynch data
const key = "data-buku";
let data;
function syncData(method, value, status) {
  switch (method) {
    case "get":
      data = JSON.parse(localStorage.getItem(key));
      if (data === null) data = {};
      break;
    case "post":
      if (!localStorage.getItem(key)) {
        data = {};
      } else {
        data = JSON.parse(localStorage.getItem(key));
      }
      data[value.id] = value;
      localStorage.setItem(key, JSON.stringify(data));
      location.reload();
      break;
    case "remove":
      console.log(`menghapus ${value}`);
      delete data[value];

      localStorage.setItem(key, JSON.stringify(data));
      location.reload();
      break;
    case "change":
      if (data[value].isComplete === true) {
        data[value].isComplete = false;
      } else {
        data[value].isComplete = true;
      }
      // new id
      const newDataId = +new Date();
      console.log(`change isCompleate ${value} to ${newDataId}`);

      data[newDataId] = data[value];
      data[newDataId].id = newDataId;
      delete data[value];

      localStorage.setItem(key, JSON.stringify(data));
      location.reload();
      break;
    case "reset":
      const resetData = confirm("semua data akan terhapus! apakah anda yakin?");
      if (resetData === true) {
        localStorage.clear();
        location.reload();
      }
      break;
  }
}

// form data
function formData(method, element) {
  let parentElement;
  switch (method) {
    case "add":
      let judul, penulis, tahun, dibaca, dataItem;
      judul = document.getElementById("judul").value;
      penulis = document.getElementById("penulis").value;
      tahun = document.getElementById("tahun").value;
      dibaca = document.getElementById("dibaca").checked;

      // filter remove TAG
      judul = judul.replace(/<[^>]+>/g, "");
      penulis = penulis.replace(/<[^>]+>/g, "");
      tahun = tahun.replace(/<[^>]+>/g, "");

      dataItem = {
        id: +new Date(),
        title: judul,
        author: penulis,
        year: tahun,
        isComplete: dibaca,
      };
      syncData("post", dataItem);
      break;
    case "remove":
      parentElement = element.parentNode.parentNode.id;
      syncData("remove", parentElement);
      break;
    case "read":
      parentElement = element.parentNode.parentNode.id;
      syncData("change", parentElement);
      break;
  }
}

// form submit
const formBook = document.forms["formBook"];
formBook.onsubmit = function (event) {
  formData("add");
  formBook.reset();
  event.preventDefault();
};
window.onload = function () {
  let input = document.getElementById("search");
  input.value = "";
  formBook.reset();
};

syncData("get");
showData();
