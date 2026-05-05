document.addEventListener("DOMContentLoaded", () => {

const upload = document.getElementById("upload");
const gallery = document.getElementById("gallery");
const search = document.getElementById("search");
const toggleMode = document.getElementById("toggleMode");
const category = document.getElementById("category");
const categoryFilter = document.getElementById("categoryFilter");
const clearAll = document.getElementById("clearAll");
const count = document.getElementById("count");

const preview = document.getElementById("preview");
const previewImg = document.getElementById("previewImg");
const closeBtn = document.getElementById("close");

let images = JSON.parse(localStorage.getItem("images")) || [];

// Display images
function displayImages() {
    gallery.innerHTML = "";

    const filterText = search.value.toLowerCase();
    const filterCategory = categoryFilter.value;

    const filtered = images.filter(img => {
        const matchesSearch = img.name.toLowerCase().includes(filterText);
        const imgCategory = img.category || "Nature";

        const matchesCategory =
            filterCategory === "All" || imgCategory === filterCategory;

        return matchesSearch && matchesCategory;
    });

    count.innerText = "Total Images: " + filtered.length;

    filtered.forEach((imgObj) => {

        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = imgObj.src;

        // Preview
        img.onclick = () => {
            preview.classList.remove("hidden");
            previewImg.src = imgObj.src;
        };

        // Category label
        const cat = document.createElement("p");
        cat.className = "category-tag";
        cat.innerText = imgObj.category || "Nature";

        const buttons = document.createElement("div");
        buttons.className = "buttons";

        // LIKE TOGGLE
        const likeBtn = document.createElement("button");
        likeBtn.innerText = imgObj.liked ? "❤️ Liked" : "🤍 Like";

        likeBtn.onclick = () => {
            imgObj.liked = !imgObj.liked;
            save();
        };

        // Delete
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";

        deleteBtn.onclick = () => {
            if (confirm("Delete this image?")) {
                images = images.filter(i => i !== imgObj);
                save();
            }
        };

        // Download
        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download";

        downloadBtn.onclick = () => {
            const a = document.createElement("a");
            a.href = imgObj.src;
            a.download = imgObj.name;
            a.click();
        };

        buttons.append(likeBtn, deleteBtn, downloadBtn);
        card.append(img, cat, buttons);
        gallery.appendChild(card);
    });
}

// Save
function save() {
    localStorage.setItem("images", JSON.stringify(images));
    displayImages();
}

// Upload
upload.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
        images.push({
            src: reader.result,
            name: file.name,
            category: category.value,
            liked: false
        });
        alert("Uploaded!");
        save();
    };

    reader.readAsDataURL(file);
});

// Events
search.oninput = displayImages;
categoryFilter.onchange = displayImages;

toggleMode.onclick = () => {
    document.body.classList.toggle("dark");
};

clearAll.onclick = () => {
    if (confirm("Delete all images?")) {
        images = [];
        save();
    }
};

closeBtn.onclick = () => {
    preview.classList.add("hidden");
};

// Init
displayImages();

});