document.addEventListener("DOMContentLoaded", () => {
  const jerseyTemplate = document.getElementById("jersey-template");
  const colorPicker = document.getElementById("colorPicker");
  const saveButton = document.getElementById("save-design");
  const loadButton = document.getElementById("load-design");

  // Change jersey color
  colorPicker.addEventListener("input", (event) => {
    jerseyTemplate.style.backgroundColor = event.target.value;
  });

  // Drag-and-Drop Logic
  document.querySelectorAll(".tool-item").forEach((item) => {
    item.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("type", event.target.dataset.type);
    });
  });

  jerseyTemplate.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  jerseyTemplate.addEventListener("drop", (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData("type");

    if (type === "text") {
      const textElement = document.createElement("div");
      textElement.contentEditable = true;
      textElement.textContent = "Editable Text";
      textElement.style.position = "absolute";
      textElement.style.left = `${event.offsetX}px`;
      textElement.style.top = `${event.offsetY}px`;
      textElement.style.cursor = "move";
      makeMovable(textElement);
      jerseyTemplate.appendChild(textElement);
    } else if (type === "image") {
      const img = document.createElement("img");
      img.src = "path/to/default-logo.png"; // Replace with default logo path
      img.style.width = "50px";
      img.style.position = "absolute";
      img.style.left = `${event.offsetX}px`;
      img.style.top = `${event.offsetY}px`;
      img.style.cursor = "move";
      makeMovable(img);
      jerseyTemplate.appendChild(img);
    }
  });

  // Make elements movable inside the jersey template
  function makeMovable(element) {
    element.addEventListener("mousedown", (event) => {
      const offsetX = event.offsetX;
      const offsetY = event.offsetY;

      const onMouseMove = (moveEvent) => {
        element.style.left = `${moveEvent.pageX - jerseyTemplate.offsetLeft - offsetX}px`;
        element.style.top = `${moveEvent.pageY - jerseyTemplate.offsetTop - offsetY}px`;
      };

      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", onMouseMove);
      }, { once: true });
    });
  }

  // Save Design to LocalStorage
  saveButton.addEventListener("click", () => {
    const items = Array.from(jerseyTemplate.children).map((child) => {
      return {
        type: child.tagName.toLowerCase(),
        content: child.contentEditable ? child.textContent : null,
        src: child.tagName.toLowerCase() === "img" ? child.src : null,
        style: child.style.cssText,
      };
    });
    const design = {
      backgroundColor: jerseyTemplate.style.backgroundColor,
      items,
    };
    localStorage.setItem("jerseyDesign", JSON.stringify(design));
    alert("Design saved!");
  });

  // Load Design from LocalStorage
  loadButton.addEventListener("click", () => {
    const design = JSON.parse(localStorage.getItem("jerseyDesign"));
    if (design) {
      jerseyTemplate.style.backgroundColor = design.backgroundColor;
      jerseyTemplate.innerHTML = ""; // Clear previous items
      design.items.forEach((item) => {
        const element = document.createElement(item.type);
        element.style.cssText = item.style;
        if (item.type === "div") {
          element.contentEditable = true;
          element.textContent = item.content;
        } else if (item.type === "img") {
          element.src = item.src;
        }
        makeMovable(element);
        jerseyTemplate.appendChild(element);
      });
    } else {
      alert("No design found!");
    }
  });
});
