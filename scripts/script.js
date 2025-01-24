function toggleDropdown(id) {
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');

    if (id === 'dropdown1') {
        // Toggle first dropdown
        if (dropdown1.classList.contains('expanded')) {
            dropdown1.classList.remove('expanded');
        } else {
            dropdown1.classList.add('expanded');
            dropdown2.classList.remove('expanded'); // Collapse second dropdown
        }
    } else if (id === 'dropdown2') {
        // Toggle second dropdown
        if (dropdown2.classList.contains('expanded')) {
            dropdown2.classList.remove('expanded');
        } else {
            dropdown2.classList.add('expanded');
            dropdown1.classList.remove('expanded'); // Collapse first dropdown
        }
    }
}

function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(e) {
    if (!e.target.matches('.dropbtn')) {
    var myDropdown = document.getElementById("myDropdown");
      if (myDropdown.classList.contains('show')) {
        myDropdown.classList.remove('show');
      }
    }
  }


  // script.js
// Function to fetch data from the API
async function fetchData(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      populateTable(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  // Function to populate the table
  function populateTable(data) {
    const tableHeaders = document.getElementById('tableHeaders');
    const tableBody = document.getElementById('tableBody');
  
    if (data.length > 0) {
      const headers = Object.keys(data[0]);
  
      // Add existing headers
      headers.forEach(header => {
        const th = document.createElement('th');
  
        // Add filter input
        const filterInput = document.createElement('input');
        filterInput.type = 'text';
        filterInput.placeholder = `Filter ${header}`;
        filterInput.addEventListener('keyup', () => filterTable(header, filterInput.value, data));
        th.textContent = header;
        th.appendChild(document.createElement('br'));
        th.appendChild(filterInput);
  
        tableHeaders.appendChild(th);
      });
  
      // Add extra columns for buttons
      const thAction1 = document.createElement('th');
      thAction1.textContent = 'Details';
      tableHeaders.appendChild(thAction1);
  
      const thAction2 = document.createElement('th');
      thAction2.textContent = 'Download';
      tableHeaders.appendChild(thAction2);
  
      // Render rows with data and buttons
      renderRows(data, headers, tableBody);
    } else {
      tableBody.innerHTML = '<tr><td colspan="100%">No Data Available</td></tr>';
    }
  }
  
  // Function to render rows with "View More Details" and "Download" buttons
  function renderRows(data, headers, tableBody) {
    tableBody.innerHTML = ''; // Clear existing rows
  
    data.forEach(item => {
      const tr = document.createElement('tr');
  
      // Add data cells
      headers.forEach(header => {
        const td = document.createElement('td');
        td.textContent = item[header];
        tr.appendChild(td);
      });
  
      // Add "View More Details" button
      const tdAction1 = document.createElement('td');
      const viewButton = document.createElement('button');
      viewButton.textContent = 'View More Details';
      viewButton.className = 'view-btn';
      viewButton.addEventListener('click', (event) => openChildTab(event, item));
      tdAction1.appendChild(viewButton);
      tr.appendChild(tdAction1);
  
      // Add "Download" button
      const tdAction2 = document.createElement('td');
      const downloadButton = document.createElement('button');
      downloadButton.textContent = 'Download';
      downloadButton.className = 'download-btn';
      downloadButton.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(item, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `details-${item.id}.json`; // Change file name as needed
        a.click();
        URL.revokeObjectURL(url);
      });
      tdAction2.appendChild(downloadButton);
      tr.appendChild(tdAction2);
  
      tableBody.appendChild(tr);
    });
  }
  
  // Function to open a child tab with details
  function openChildTab(event, item) {
    closeChildTab(); // Ensure any existing tab is closed
  
    // Disable parent controls
    document.body.classList.add('disable-controls');
  
    // Create the child tab
    const childTab = document.createElement('div');
    childTab.className = 'child-tab';
    childTab.innerHTML = `
      <div class="child-content">
        <h3>Details</h3>
        <pre>${JSON.stringify(item, null, 2)}</pre>
        <button class="close-btn">Close</button>
      </div>
    `;
    document.body.appendChild(childTab);
  
    // Close button functionality
    childTab.querySelector('.close-btn').addEventListener('click', closeChildTab);
  
    // Event listener for closing on outside click
    const handleOutsideClick = (e) => {
      if (!childTab.contains(e.target)) {
        closeChildTab();
        document.removeEventListener('click', handleOutsideClick); // Remove listener
      }
    };
  
    // Delay attaching the listener to avoid it being triggered by the current click
    setTimeout(() => document.addEventListener('click', handleOutsideClick), 0);
  }
  
  // Function to close the child tab
  function closeChildTab() {
    const existingTab = document.querySelector('.child-tab');
    if (existingTab) {
      existingTab.remove();
    }
    // Enable parent controls
    document.body.classList.remove('disable-controls');
  }
  
  // Function to filter the table
  function filterTable(header, filterValue, data) {
    const filteredData = data.filter(row =>
      row[header].toString().toLowerCase().includes(filterValue.toLowerCase())
    );
    const headers = Object.keys(data[0]);
    const tableBody = document.getElementById('tableBody');
    renderRows(filteredData, headers, tableBody);
  }
  
  // API URL (replace with your actual API URL)
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
  
  // Fetch and display data
  fetchData(apiUrl);
  