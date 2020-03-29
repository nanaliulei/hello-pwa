
// populate the related_appliations from the manifest.json.
function populateRelatedApps(apps) {
  let list = document.getElementById('gIRA_list');
  let table = document.createElement('table');
  list.appendChild(table);

  createHead(table);
  populateTable(table, apps);
}

function createHead(table) {
  let thead = document.createElement('thead');
  table.appendChild(thead);
  let thread_tr = document.createElement('tr');
  thead.appendChild(thread_tr);
  addHeadName('index', thread_tr);
  addHeadName('platform', thread_tr);
  addHeadName('id', thread_tr);
}
function addHeadName(name, row) {
  let th = document.createElement('th');
  let text = document.createTextNode(name);
  th.appendChild(text);
  row.appendChild(th);
}

function populateTable(table, apps)  {
  let i = 0;
  for (let app of apps) {
    let row = table.insertRow();

    let cell = row.insertCell();
    cell.innerHTML = i++;

    cell = row.insertCell();
    cell.innerHTML = app.platform;

    cell = row.insertCell();
    cell.innerHTML = app.id;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // it list the related apps in the manifest.json file
  fetch('manifest.json').then(response => {
    return response.json()
  }).then(json_content => {
    apps = json_content.related_applications;
    populateRelatedApps(apps);
  });

  document.getElementById('gira_button').addEventListener('click', e => {
    navigator.getInstalledRelatedApps().then(filtered => {
      document.getElementById('filtered_app').innerHTML = "<b>installed apps:<b> <br>"
      if (filtered.length > 0) {
        filtered.forEach(app => {
          document.getElementById('filtered_app').innerHTML += app.id + "<br>";
        });
      } else {
        document.getElementById('filtered_app').innerHTML += "no related apps in the machine";
        // There is no related apps installed in this machine. Ask notification.
        if (Notification.permission != 'granted') {
          Notification.requestPermission().then(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
              var notification = new Notification("Hi there!");
            }
          });
        }
      }
    })
  })
});
