// api.js - frontend microservice talking to Flask backend

// Base URL of your backend microservice
const BASE_URL = "http://flask-service:5000";

// Load all notes from backend
async function loadNotes() {
    try {
        const response = await fetch(`${BASE_URL}/notes`);
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
    } catch (error) {
        console.error("Error loading notes:", error);
    }
}

// Add a new note
async function addNote() {
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;

    try {
        await fetch(`${BASE_URL}/notes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content })
        });

        // Clear input fields
        document.getElementById("title").value = "";
        document.getElementById("content").value = "";

        loadNotes();
    } catch (error) {
        console.error("Error adding note:", error);
    }
}

// Delete a note by ID
async function deleteNote(id) {
    try {
        await fetch(`${BASE_URL}/notes/${id}`, {
            method: "DELETE"
        });

        loadNotes();
    } catch (error) {
        console.error("Error deleting note:", error);
    }
}

// Load notes on page load
window.onload = loadNotes;
