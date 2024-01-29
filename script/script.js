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
  caption = document.getElementById("caption-farmBook").textContent =
    "Tambahkan Buku Baru";
  submit = document.getElementById("editSubmit").value = "tambahkan data";
  document.forms["formBook"].reset();
  if (method === "true") {
    main1.classList.add("hidden");
    main2.classList.remove("hidden");
  } else {
    main1.classList.remove("hidden");
    main2.classList.add("hidden");
  }
}

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
            <button onclick="formData('edit', this)" id="btn-edit"><i class="fa-solid fa-edit"></i></button>
            <button class="${read}" onclick="formData('read', this)" id="btn-change"><i class="fa-solid fa-check"></i></button>
            <button class="trash" onclick="formData('remove', this)" id="btn-remove"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
    if (data[i].isComplete === false) {
      container1.insertAdjacentHTML("afterbegin", item.outerHTML);
    } else {
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
    case "edit":
      showForm("true");
      // ubah form
      document.getElementById("judul").value = data[value].title;
      document.getElementById("penulis").value = data[value].author;
      document.getElementById("tahun").value = data[value].year;
      document.getElementById("dibaca").checked = data[value].isComplete;
      document.getElementById("editSubmit").value = "ubah data";
      document.getElementById(
        "caption-farmBook"
      ).textContent = `Ubah Data ${data[value].title}`;
      // kirim data
      document.forms["formBook"].onsubmit = function (e) {
        let judul, penulis, tahun, dibaca, dataItem;
        judul = document.getElementById("judul").value;
        penulis = document.getElementById("penulis").value;
        tahun = document.getElementById("tahun").value;
        dibaca = document.getElementById("dibaca").checked;

        // filter remove TAG
        judul = judul.replace(/<[^>]+>/g, "");
        penulis = penulis.replace(/<[^>]+>/g, "");
        tahun = tahun.replace(/<[^>]+>/g, "");
        tahun = parseInt(tahun);

        dataItem = {
          id: value,
          title: judul,
          author: penulis,
          year: tahun,
          isComplete: dibaca,
        };

        swal({
          title: "buku telah diperbarui",
          text: "buku anda telah berhasil diperbarui",
          icon: "success",
          button: "ok",
        }).then(() => {
          syncData("post", dataItem);
        });
        e.preventDefault();
      };
      break;
    case "reset":
      swal({
        title: "Are you sure?",
        text: "semua data akan terhapus! apakah anda yakin?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          localStorage.clear();
          location.reload();
        }
      });
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
      tahun = parseInt(tahun);

      dataItem = {
        id: +new Date(),
        title: judul,
        author: penulis,
        year: tahun,
        isComplete: dibaca,
      };

      swal({
        title: "buku telah ditambahkan",
        text: "buku anda telah berhasil ditambahkan!",
        icon: "success",
        button: "ok",
      }).then(() => {
        syncData("post", dataItem);
      });

      break;
    case "remove":
      swal({
        title: "Are you sure?",
        text: `apakah anda yakin ingin menghapus buku ini?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }).then((willDelete) => {
        if (willDelete) {
          parentElement = element.parentNode.parentNode.id;
          syncData("remove", parentElement);
        }
      });
      break;
    case "read":
      parentElement = element.parentNode.parentNode.id;
      syncData("change", parentElement);
      break;
    case "edit":
      parentElement = element.parentNode.parentNode.id;
      parentElement = parseInt(parentElement);
      syncData("edit", parentElement);
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
