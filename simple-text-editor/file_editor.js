async function getNewFileHandle() {
  const save_options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.simpletext'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(save_options);
  return handle;
}

function getFileHandle() {
  // For Chrome 86 and later...
  if ('showOpenFilePicker' in window) {
    const open_options = {
      types: [
        {
          description: 'simple text',
          accept: {
            'text/plain': ['.simpletext']
          }
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false
    };
    return window.showOpenFilePicker(open_options).then((handles) => handles[0]);
  }
  // For Chrome 85 and earlier...
  return window.chooseFileSystemEntries();
}

async function writeFile(fileHandle, contents) {
  // Create a FileSystemWritableFileStream to write to.
  const writable = await fileHandle.createWritable();
  // Write the contents of the file to the stream.
  await writable.write(contents);
  // Close the file and write the contents to disk.
  await writable.close();
}

function format(command, value) {
  document.execCommand(command, false, value);
}

async function saveFileAs() {
  if (!window.fileHandle) {
    try {
      window.fileHandle = await getNewFileHandle()
    } catch (e) {
      if ("AbortError" === e.name)
          return;
      console.log("Error: getFileHandle, " + e.name);
    }
  }
  if (!window.fileHandle)
    return;

  try {
    const contents = document.getElementById("sampleeditor");
    await writeFile(window.fileHandle, contents.innerHTML);
  } catch (e) {
    console.log("Error: saveFile, " + e.name);
    alert("Unable to save file.");
  }
}

async function openFile() {
  try {
    window.fileHandle = await getFileHandle();
  } catch(e) {
    console.log("Error: openFile, " + e.name);
    alert("Unable to open file.");
  }

  readFile();
}

async function readFile() {
  if (!window.fileHandle)
    return;

  const file = await window.fileHandle.getFile();
  const contents = await file.text();
  document.getElementById("sampleeditor").innerHTML = contents;
}


function registerFileActivation() {
  if (!window.launchQueue)
    return;

  launchQueue.setConsumer(launchQueueParams => {
    if (!launchQueueParams.files.length) {
      console.log("launchQueue has 0 params");
      resolve(false);
    }

    console.log("launch.params has " + launchQueueParams.files.length + " counts");

    window.fileHandle = launchQueueParams.files[0];
    readFile();

    // Handle the file:
    // https://github.com/WICG/native-file-system/blob/master/EXPLAINER.md#example-code
  });
}

window.addEventListener('load', () => {
  document.getElementById('sampleeditor').setAttribute('contenteditable', 'true');
  registerFileActivation();
  // document.getElementById('sampleeditor2').setAttribute('contenteditable', 'true');
});

