const addItems = document.querySelector(".add_items");
const html = document.querySelector("#table_body");
const totalmoney = document.querySelector("#total-money");
const remMony = document.querySelector("#rem-money");
const searchInput = document.querySelector("#search-items");

// Helper function to calculate and display total pending amount
const calculateTotalPending = () => {
  const rows = document.querySelectorAll("#table_body tr");
  let total = 0;

  rows.forEach((row) => {
    const pendingValue = row.querySelector(".pending_input").value;
    total += parseFloat(pendingValue) || 0; // Convert to float and handle empty or invalid values
  });

  totalmoney.innerText = `Total Pending Amount: ₹${(total.toLocaleString())}.00`; // Display total pending
};

// Helper function to calculate and display remaining money
const remTotalPending = () => {
  const rows = document.querySelectorAll("#table_body tr");
  let total2 = 0;

  rows.forEach((row) => {
    const newAmountValue = row.querySelector(".pending_input2").value;
    total2 += parseFloat(newAmountValue) || 0; // Convert to float and handle empty or invalid values
  });

  remMony.innerText = `Total Paid Amount: ₹${(total2.toLocaleString())}.00`; // Display total paid
};

// Function to filter and display search results based on user name
const searchData = () => {
  const searchValue = searchInput.value.toLowerCase(); // Get the input value and convert to lowercase for case-insensitive search
  const storedData = JSON.parse(localStorage.getItem("userData")) || [];

  // Clear the table before displaying search results
  html.innerHTML = "";

  // Filter the stored data based on the search input value (search by name)
  const filteredData = storedData.filter(data => data.userName.toLowerCase().includes(searchValue));

  // Render only the filtered data
  filteredData.forEach((data, index) => {
    Html(data.userName, data.userCity, data.userMobile, data.userDate, data.userLastDate, data.userPending, data.userPending2, index + 1);
  });

  calculateTotalPending();
  remTotalPending(); // Recalculate the total pending amount based on filtered results
};

// Retrieve stored data from localStorage and populate the table
const loadStoredData = () => {
  const storedData = JSON.parse(localStorage.getItem("userData")) || [];
  storedData.forEach((data, index) => {
    Html(data.userName, data.userCity, data.userMobile, data.userDate, data.userLastDate, data.userPending, data.userPending2, index + 1);
  });
  calculateTotalPending();
  remTotalPending();
};

// Save the table data to localStorage
const saveData = () => {
  const rows = document.querySelectorAll("#table_body tr");
  const data = [];

  rows.forEach((row) => {
    const userName = row.querySelector(".name_input").value || "Null";
    const userCity = row.querySelector(".city_input").value || "Null";
    const userMobile = row.querySelector(".mobile_input").value || "Null";
    const userDate = row.querySelector(".date_input").value || "Null";
    const userLastDate = row.querySelector(".lastdate_input").value || "Null";
    const userPending = row.querySelector(".pending_input").value || "0";
    const userPending2 = row.querySelector(".pending_input2").value || "0";

    data.push({
      userName,
      userCity,
      userMobile,
      userDate,
      userLastDate,
      userPending,
      userPending2,
    });
  });

  localStorage.setItem("userData", JSON.stringify(data));
  calculateTotalPending();
  remTotalPending(); // Recalculate total pending whenever data is saved
};

// Function to create a new row with editable content
const Html = (userName = "", userCity = "", userMobile = "", userDate = "", userLastDate = "", userPending = "", userPending2 = "", rowId) => {
  const note = document.createElement("tr");

  // Calculate the new amount (Pending - Paid)
  const newAmountValue = parseFloat(userPending) - parseFloat(userPending2) || 0;

  const inHtml = `
      <td class="min-id">${rowId || 1}</td>
      <td>
        <span class="name_span ${userName ? "" : "hidden"}">Name : ${userName}</span>
        <input id="user_name" class="name_input ${userName ? "hidden" : ""}" type="text" value="${userName}" placeholder = "Name">
      </td>
      <td>
        <span class="city_span ${userCity ? "" : "hidden"}">City : ${userCity}</span>
        <input id="user_city" class="city_input ${userCity ? "hidden" : ""}" type="text" value="${userCity}" placeholder="City">
      </td>
      <td>
        <span class="mobile_span ${userMobile ? "" : "hidden"}">Mobile : ${userMobile}</span>
        <input id="user_mobile" class="mobile_input ${userMobile ? "hidden" : ""}" type="text" value="${userMobile}" placeholder="Mobile Number">
      </td>
      <td>
        <span class="date_span ${userDate ? "" : "hidden"}">Date : ${toDDMMYY(userDate)}</span>
        <input id="user_date" class="date_input ${userDate ? "hidden" : ""}" type="date" value="${userDate}" placeholder="Date">
      </td>
      <td>
        <span class="lastdate_span ${userLastDate ? "" : "hidden"}">LastDate : ${toDDMMYY(userLastDate)}</span>
        <input id="user_lastdate" class="lastdate_input ${userLastDate ? "hidden" : ""}" type="date" value="${userLastDate}" placeholder="LastDate">
      </td>
      <td>
        <span class="pending_span ${userPending ? "" : "hidden"}"> Amount : ${userPending}</span>
        <input id="user_pending" class="pending_input ${userPending ? "hidden" : ""}" type="text" value="${userPending}" placeholder="Amount">
      </td>
      <td>
        <span class="pending_span2 ${userPending2 ? "" : "hidden"}"> Paid Amount : ${userPending2}</span>
        <input id="user_pending2" class="pending_input2 ${userPending2 ? "hidden" : ""}" type="text" value="${userPending2}" placeholder="Paid Amount">
      </td>
      <td>
        <span class="new_amount"> Remaining: ₹${newAmountValue.toFixed(2)}</span>
      </td>
      <td class="btn_tr">
        <button class="cooman-button editButton"><i class="fa-regular fa-pen-to-square"></i></button>
        <button class="cooman-button delButton"><i class="fa-regular fa-trash-can"></i></button>
      </td>
  `;

  note.insertAdjacentHTML("afterbegin", inHtml);

  const delButton = note.querySelector(".delButton");
  const editButton = note.querySelector(".editButton");

  // Delete Row
  delButton.addEventListener("click", () => {
    const rowIndex = Array.from(html.children).indexOf(note);
    note.remove();

    const updateData = () => {
      const storedData = JSON.parse(localStorage.getItem('userData')) || [];
      if (rowIndex > -1) {
        storedData.splice(rowIndex, 1);
      }
      localStorage.setItem('userData', JSON.stringify(storedData));
    };

    updateData();
    renumberRows();
    calculateTotalPending();
    remTotalPending();
  });

  // Toggle edit mode
  editButton.addEventListener("click", () => {
    const nameSpan = note.querySelector(".name_span");
    const nameInput = note.querySelector(".name_input");
    const citySpan = note.querySelector(".city_span");
    const cityInput = note.querySelector(".city_input");
    const mobileSpan = note.querySelector(".mobile_span");
    const mobileInput = note.querySelector(".mobile_input");
    const dateSpan = note.querySelector(".date_span");
    const dateInput = note.querySelector(".date_input");
    const lastdateSpan = note.querySelector(".lastdate_span");
    const lastdateInput = note.querySelector(".lastdate_input");
    const pendingSpan = note.querySelector(".pending_span");
    const pendingInput = note.querySelector(".pending_input");
    const pendingSpan2 = note.querySelector(".pending_span2");
    const pendingInput2 = note.querySelector(".pending_input2") || 0;
    const newAmountSpan = note.querySelector(".new_amount");

    // Update spans with current input values
    nameSpan.innerText = `Name: ${nameInput.value}`;
    citySpan.innerText = `City: ${cityInput.value}`;
    mobileSpan.innerText = `Mobile: ${mobileInput.value}`;
    dateSpan.innerText = `Date: ${dateInput.value}`;
    lastdateSpan.innerText = `LastDate: ${lastdateInput.value}`;
    pendingSpan.innerText = `Amount: ${pendingInput.value}`;
    pendingSpan2.innerText = `Paid Amount: ${pendingInput2.value}`;

    // Update the new amount after editing
    const updatedAmountValue = parseFloat(pendingInput.value) - parseFloat(pendingInput2.value) || 0;
    newAmountSpan.innerText = `Remaining: ₹${updatedAmountValue.toFixed(2)}`;

    // Show/hide inputs and spans
    nameSpan.classList.toggle("hidden");
    nameInput.classList.toggle("hidden");
    citySpan.classList.toggle("hidden");
    cityInput.classList.toggle("hidden");
    mobileSpan.classList.toggle("hidden");
    mobileInput.classList.toggle("hidden");
    dateSpan.classList.toggle("hidden");
    dateInput.classList.toggle("hidden");
    lastdateSpan.classList.toggle("hidden");
    lastdateInput.classList.toggle("hidden");
    pendingSpan.classList.toggle("hidden");
    pendingInput.classList.toggle("hidden");
    pendingSpan2.classList.toggle("hidden");
    pendingInput2.classList.toggle("hidden");

    saveData(); // Save the changes to localStorage

  });

  html.appendChild(note);
};

// Helper function to convert date to DD/MM/YYYY format
const toDDMMYY = (date) => {
  const myDate = new Date(date);
  const day = String(myDate.getDate()).padStart(2, '0');
  const month = String(myDate.getMonth() + 1).padStart(2, '0');
  const year = myDate.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to renumber the row IDs after deletion
const renumberRows = () => {
  const rows = document.querySelectorAll("#table_body tr");
  rows.forEach((row, index) => {
    const rowId = row.querySelector(".min-id");
    rowId.innerText = index + 1;
  });
  // loadStoredData()

};

// Event listener for adding new items to the table
addItems.addEventListener("click", () => {
  Html();
  saveData();
});

// Event listener for searching user name on input
searchInput.addEventListener("input", searchData);

// Initial load of stored data
loadStoredData();
