function arrayToTable(tableData) {
  var table = $("<table></table>");
  $(tableData).each(function (i, rowData) {
    var row = $("<tr></tr>");
    $(rowData).each(function (j, cellData) {
      row.append($("<td>" + cellData + "</td>"));
    });
    table.append(row);
  });
  return table;
}

$.ajax({
  type: "GET",
  url: "./table-data.csv",
  success: function (data) {
    $("#map-section").append(arrayToTable(Papa.parse(data).data));
  },
});

//  var states = [ "Andhra Pradesh",
//  "Arunachal Pradesh",
//  "Assam",
//  "Bihar",
//  "Chhattisgarh",
//  "Goa",
//  "Gujarat",
//  "Haryana",
//  "Himachal Pradesh",
//  "Jammu and Kashmir",
//  "Jharkhand",
//  "Karnataka",
//  "Kerala",
//  "Madhya Pradesh",
//  "Maharashtra",
//  "Manipur",
//  "Meghalaya",
//  "Mizoram",
//  "Nagaland",
//  "Odisha",
//  "Punjab",
//  "Rajasthan",
//  "Sikkim",
//  "Tamil Nadu",
//  "Telangana",
//  "Tripura",
//  "Uttarakhand",
//  "Uttar Pradesh",
//  "West Bengal",
//  "Andaman and Nicobar Islands",
//  "Chandigarh",
//  "Dadra and Nagar Haveli",
//  "Daman and Diu",
//  "Delhi",
//  "Lakshadweep",
//  "Puducherry"
// ]

var states = ["Karnataka", "Tamil Nadu"];

autocomplete(document.getElementById("myInput"), states);

function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function (e) {
    var a,
      b,
      i,
      val = this.value;
    /*close any already open lists of autocompleted values*/
    closeAllLists();
    if (!val) {
      return false;
    }
    currentFocus = -1;
    /*create a DIV element that will contain the items (values):*/
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    /*append the DIV element as a child of the autocomplete container:*/
    this.parentNode.appendChild(a);
    /*for each item in the array...*/
    for (i = 0; i < arr.length; i++) {
      /*check if the item starts with the same letters as the text field value:*/
      if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        /*create a DIV element for each matching element:*/
        b = document.createElement("DIV");
        /*make the matching letters bold:*/
        b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
        b.innerHTML += arr[i].substr(val.length);
        /*insert a input field that will hold the current array item's value:*/
        b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
        /*execute a function when someone clicks on the item value (DIV element):*/
        b.addEventListener("click", function (e) {
          /*insert the value for the autocomplete text field:*/
          const url = b.textContent.split(" ").join("").toLowerCase();
          window.location = `./${url}.html`;
          inp.value = this.getElementsByTagName("input")[0].value;
          /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
          closeAllLists();
        });
        a.appendChild(b);
      }
    }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function (e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
      currentFocus++;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 38) {
      //up
      /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
      currentFocus--;
      /*and and make the current item more visible:*/
      addActive(x);
    } else if (e.keyCode == 13) {
      /*If the ENTER key is pressed, prevent the form from being submitted,*/
      e.preventDefault();
      if (currentFocus > -1) {
        /*and simulate a click on the "active" item:*/
        if (x) x[currentFocus].click();
      }
    }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
    closeAllLists(e.target);
  });
}

const btn2017 = document.querySelector("#btn-2017");
const btn2013 = document.querySelector("#btn-2013");

function selectYear17() {
  btn2017.classList.add("selected");
  btn2013.classList.remove("selected");
  document.querySelector("#map-dist").classList.add("map-hide");
  document.querySelector("#map").classList.remove("map-hide");
  document.querySelector("#map").classList.add("map-show");
  document.querySelector("#totalStages13").style.display = "none";
  document.querySelector("#totalStages").style.display = "flex";
}

function selectYear13() {
  btn2017.classList.remove("selected");
  btn2013.classList.add("selected");
  document.querySelector("#map").classList.add("map-hide");
  document.querySelector("#map-dist").classList.remove("map-hide");
  document.querySelector("#map-dist").classList.add("map-show");
  document.querySelector("#totalStages13").style.display = "flex";
  document.querySelector("#totalStages").style.display = "none";
}
selectYear17();
btn2017.addEventListener("click", selectYear17);
btn2013.addEventListener("click", selectYear13);

