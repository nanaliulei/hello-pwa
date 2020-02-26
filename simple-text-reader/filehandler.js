function activate_filehandler(search_param) {
  return new Promise( (resolve, reject) => {
    var searchParams = new URLSearchParams(location.search);
    if (!searchParams) {
      console.log('invalid url, no search query');
      resolve(false);
      return;
    }

    const win32 = searchParams.get("win32");
    if (win32) {
        // content uri; onedrive
        let cotenturi = document.createElement('div');
        cotenturi.innerHTML = "win32=" + win32;
        document.getElementById('file').appendChild(win32);
    }

    const conflict = searchParams.get("conflict");
    if (conflict) {
        // content uri; onedrive
        let cotenturi = document.createElement('div');
        cotenturi.innerHTML = "content_uri=" + conflict;
        document.getElementById('file').appendChild(conflict);
    }

    const content_uri = searchParams.get("contenturi");
    if (content_uri) {
        // content uri; onedrive
        let cotenturi = document.createElement('div');
        cotenturi.innerHTML = "content_uri=" + content_uri;
        document.getElementById('file').appendChild(cotenturi);

        // content_uri can't be mixed with local file opening below.
        let uri_open = document.createElement('button');
        uri_open.innerHTML = "window.open(" + content_uri + ")";
        uri_open.id = "content_uri_open";
        document.getElementById('file').appendChild(uri_open);
        uri_open.addEventListener('click', (e) => {
            window.open(content_uri);
        })

        resolve(false);
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

    console.log("before launchQueue.setConsumer");
    launchQueue.setConsumer(launchQueueParams => {
        if (!launchQueueParams.files.length) {
            console.log("launchQueue has 0 params");
            resolve(false);
        }

        console.log("launch.params has " + launchQueueParams.files.length + " counts");

        const fileHandle = launchQueueParams.files[0];
        getContents(fileHandle).then((contents) => {
            var element = document.getElementById('file_handler');
            element.innerHTML = contents;
            document.getElementsByClassName('filetype')[0].style.visibility = 'visible';

            show_activaton_type('file');
            // writeTestContents(fileHandle, ":FromApp" + contents);
            resolve(true);
        });

        document.getElementById('file_save_click').addEventListener('click', (e) => {
            writeTestContents(fileHandle, document.getElementById('file_handler').innerHTML);
        })
        // Handle the file:
        // https://github.com/WICG/native-file-system/blob/master/EXPLAINER.md#example-code
    });
  })
}

document.addEventListener('DOMContentLoaded', ()=> {
  if (location.href != "https://ie-snap/scratchtests/sunggch/hello-pwa/?utm_source=app") {
    console.log("simple-text-reader loaded");
    activate_filehandler();
  }
});
