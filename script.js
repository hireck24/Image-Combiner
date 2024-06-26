document.getElementById('combineButton').addEventListener('click', combineImages);

function combineImages() {
    const input = document.getElementById('imageUpload');
    const files = input.files;
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    
    if (files.length === 0) {
        alert('Please upload images first.');
        return;
    }

    const images = [];
    for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                images.push(img);
                if (images.length === files.length) {
                    drawCombinedImage(images, canvas, ctx);
                }
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(files[i]);
    }
}

function drawCombinedImage(images, canvas, ctx) {
    let totalHeight = 0;
    let maxWidth = 0;

    // Calculate the total height and max width
    images.forEach(img => {
        totalHeight += img.height;
        if (img.width > maxWidth) {
            maxWidth = img.width;
        }
    });

    // If max width exceeds 1200px, scale down
    const scale = maxWidth > 1200 ? 1200 / maxWidth : 1;

    canvas.width = maxWidth * scale;
    canvas.height = totalHeight * scale;

    // Fill canvas with white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let yOffset = 0;

    images.forEach(img => {
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const xOffset = (canvas.width - scaledWidth) / 2; // Calculate the xOffset to center the image
        ctx.drawImage(img, xOffset, yOffset, scaledWidth, scaledHeight);
        yOffset += scaledHeight;
    });

    exportAsJPEG(canvas);
}

function exportAsJPEG(canvas) {
    const jpegUrl = canvas.toDataURL('image/jpeg', 0.8); // 0.8 is the quality parameter for JPEG
    const link = document.createElement('a');
    link.href = jpegUrl;
    link.download = 'combined_image.jpg';
    link.click();
}

// Drag and Drop functionality
const dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, () => dropArea.classList.remove('highlight'), false);
});

dropArea.addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    const fileInput = document.getElementById('imageUpload');
    fileInput.files = files;

    combineImages();
}
