import   axios from "axios";
import { join } from "path";
import { createReadStream } from "fs";
import   FormData from "form-data";
const xhr = new XMLHttpRequest();
xhr.open('POST', '/server/upload', true);

const HubspotAPI = axios.create({
  baseURL: "https://api.hubapi.com",
  headers: {
    Authorization: ``
  }
});

try {
  // Create and upload a new file
  const formData = new FormData();

  formData.append("file", createReadStream(join(__dirname, "../../resources/Bittrust.png")));
  formData.append("folderPath", "Bittrust");
  formData.append("options", JSON.stringify({
    access: "PUBLIC_NOT_INDEXABLE",
    overwrite: true
  }))
  
  const { data: { id: fileId } } = await HubspotAPI.post("/files/v3/files", formData)

  // Send the file to an object
  const { data: noteResponse } = await HubspotAPI.post("/engagements/v1/engagements", {
    "engagement": {
      "type": "NOTE",
    },
    "metadata": {
      "body": "Arquivo enviado pelo CMS."
    },
    "associations": {
      "contactIds": [5686102],
    },
    "attachments": [
      {
          "id": fileId
      }
  ],
  })

  console.log(noteResponse)
} catch (error) {
  console.log(error.response.data)
}

xhr.onload = function() {
    if (xhr.status === 200) {
      console.log(xhr.responseText);
    }
  };
  
xhr.send(formData);
