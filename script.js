document.addEventListener("DOMContentLoaded", function () {
    const uploadButton = document.querySelector(".upload-button");
    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/*";
    imageInput.style.display = "none";
    document.body.appendChild(imageInput);

    uploadButton.addEventListener("click", () => imageInput.click());

   imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (file) {
            processImage(file);
        }
    });

    function processImage(file) {
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("size", "auto");

        uploadButton.innerText = "Processing...";
        uploadButton.disabled = true;

        fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "JbqALAAwcUdm61fLPjguRHwb" 
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) throw new Error("Failed to process image. Please try again.");
            return response.blob();
        })
        .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            displayResult(imageUrl);
        })
        .catch(error => {
            console.error("Error:", error);
            alert(error.message);
        })
        .finally(() => {
            uploadButton.innerText = "Upload Image";
            uploadButton.disabled = false;
        });
    }

    function displayResult(imageUrl) {
        let resultContainer = document.querySelector(".right-section");
        
        let oldResult = document.querySelector(".result-container");
        if (oldResult) oldResult.remove();

        let resultDiv = document.createElement("div");
        resultDiv.classList.add("result-container");

        let imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.classList.add("processed-image");
        imgElement.alt = "Processed Image";

        let downloadButton = document.createElement("a");
        downloadButton.href = imageUrl;
        downloadButton.download = "background_removed.png";
        downloadButton.classList.add("download-button");
        downloadButton.innerText = "Download Image";

        resultDiv.appendChild(imgElement);
        resultDiv.appendChild(downloadButton);
        resultContainer.appendChild(resultDiv);
    }
});
