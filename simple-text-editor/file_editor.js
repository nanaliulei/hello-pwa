async function getNewFileHandle() {
  const options = {
    types: [
      {
        description: 'Text Files',
        accept: {
          'text/plain': ['.txt2', '.simpletext'],
        },
      },
    ],
  };
  const handle = await window.showSaveFilePicker(options);
  return handle;
}

function getFileHandle() {
  // For Chrome 86 and later...
  if ('showOpenFilePicker' in window) {
    return window.showOpenFilePicker().then((handles) => handles[0]);
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

window.addEventListener('load', () => {
  document.getElementById('sampleeditor').setAttribute('contenteditable', 'true');
  // document.getElementById('sampleeditor2').setAttribute('contenteditable', 'true');
});

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

  const file = await window.fileHandle.getFile();
  const contents = await file.text();
  document.getElementById("sampleeditor").innerHTML = contents;
}
