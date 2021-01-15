function activate_filehandler(search_param) {
  return new Promise((resolve, reject) => {
    var searchParams = new URLSearchParams(location.search);
    if (!searchParams) {
      console.log('invalid url, no search query');
      resolve(false);
      return;
    }

    const win32 = searchParams.get("win32");
    if (win32) {
      // content uri; onedrive
      let win32_el = document.createElement('div');
      win32_el.innerHTML = "win32=" + win32;
      document.getElementById('file').appendChild(win32_el);
    }

    const launch_error = searchParams.get("launch_error");
    if (launch_error) {
      // content uri; onedrive
      let launch_error_el = document.createElement('div');
      launch_error_el.innerHTML = "launch_error=" + launch_error;
      document.getElementById('file').appendChild(launch_error_el);
    }

    const not_synced_to_cloud = searchParams.get("not_synced_to_cloud");
    if (not_synced_to_cloud) {
      // content uri; onedrive
      let not_synced_to_cloud_el = document.createElement('div');
      not_synced_to_cloud_el.innerHTML = "not_synced_to_cloud=" + not_synced_to_cloud;
      document.getElementById('file').appendChild(not_synced_to_cloud_el);
    }

    const locally_synced = searchParams.get("locally_synced");
    if (locally_synced) {
      // content uri; onedrive
      let locally_synced_el = document.createElement('div');
      locally_synced_el.innerHTML = "locally_synced=" + locally_synced;
      document.getElementById('file').appendChild(locally_synced_el);
    }

    const local_file = searchParams.get("local_file");
    if (local_file) {
      // content uri; onedrive
      let local_file_el = document.createElement('div');
      local_file_el.innerHTML = "local_file=" + local_file;
      document.getElementById('file').appendChild(local_file_el);
    }

    const conflict = searchParams.get("conflict");
    if (conflict) {
      // content uri; onedrive
      let conflict_el = document.createElement('div');
      conflict_el.innerHTML = "conflict=" + conflict;
      document.getElementById('file').appendChild(conflict_el);
    }

    const last_modified = searchParams.get("last_modified");
    if (last_modified) {
      // content uri; onedrive
      let last_modified_el = document.createElement('div');
      last_modified_el.innerHTML = "last_modified=" + last_modified;
      document.getElementById('file').appendChild(last_modified_el);
    }

    const content_uri = searchParams.get("contenturi");
    if (content_uri) {
      document.getElementById('file').style.display = 'block';
      // content uri; onedrive
      let cotenturi_el = document.createElement('div');
      cotenturi_el.innerHTML = "content_uri=" + content_uri;
      document.getElementById('file').appendChild(cotenturi_el);

      // content_uri can't be mixed with local file opening below.
      let uri_open = document.createElement('button');
      uri_open.innerHTML = "window.open(" + content_uri + ")";
      uri_open.id = "content_uri_open";
      document.getElementById('file').appendChild(uri_open);
      uri_open.addEventListener('click', (e) => {
          window.open(content_uri);
      })

      resolve('contenturi');
    }

    if (!window.launchQueue) {
      console.log("launchQueue isn't supported");
      resolve(false);
    }

    if (!window.chooseFileSystemEntries){
      console.log("native file system isn't supported");
      resolve(false);
    }

    async function getContents(handle) {
      const file = await handle.getFile();
      const contents = await file.text();
      return contents;
    }

    async function writeTestContents(handle, data) {
      // Create a writer (request permission if necessary).
      const writer = await handle.createWriter();

      // truncate reserve or truncate the file size.
      writer.truncate(data.length);

      // Write the full length of the contents
      await writer.write(0, data);
      // Close the file and write the contents to disk
      await writer.close();
    }

    if (local_file) {
      console.log("before launchQueue.setConsumer");
      launchQueue.setConsumer(launchQueueParams => {
        if (!launchQueueParams.files.length) {
          console.log("launchQueue has 0 params");
          resolve(false);
        }

        console.log("launch.params has " + launchQueueParams.files.length + " counts");

        window.fileHandle = launchQueueParams.files[0];
        getContents(window.fileHandle).then((contents) => {
          document.getElementById('file').style.display = 'block';
          var element = document.getElementById('file_handler');
          element.innerHTML = contents;
          document.getElementsByClassName('filetype')[0].style.visibility = 'visible';

          // writeTestContents(window.fileHandle, ":FromApp" + contents);
          resolve('local file');
        });

        document.getElementById('file_save_click').addEventListener('click', (e) => {
          writeTestContents(window.fileHandle, document.getElementById('file_handler').innerHTML);
        })
        // Handle the file:
        // https://github.com/WICG/native-file-system/blob/master/EXPLAINER.md#example-code
      });
    }
  })
}

document.addEventListener('DOMContentLoaded', ()=> {
  if (location.href.search('simple-text-reader') != -1) {
    console.log("simple-text-reader loaded");
    activate_filehandler();
  }
});
