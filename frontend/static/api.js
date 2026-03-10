async function loadNotes() {
    const response = await fetch("/notes");
    const notes = await response.json();

    const list = document.getElementById("notes");
    list.innerHTML = "";

    notes.forEach(note => {
        const li = document.createElement("li");
        li.innerHTML = `
            <b>${note.title}</b>: ${note.content}
            <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        list.appendChild(li);
    });
}

async function addNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    await fetch("/notes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title, content })
    });

    loadNotes();
}

async function deleteNote(id) {
    await fetch(`/notes/${id}`, {
        method: "DELETE"
    });

    loadNotes();
}

window.onload = loadNotes;
