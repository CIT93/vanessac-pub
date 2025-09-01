document.addEventListener("DOMContentLoaded", function() {              // Link to index.html
    const formElement = document.getElementById("greetForm");   
    const nameInput = document.getElementById("nameInput");
    const messageElement = document.getElementById("messageElement");

    formElement.addEventListener("submit", function(event) {            // Listens for "submit"               
        event.preventDefault();                                         // Event handler
        const name = nameInput.value;                                   // Reads text input

        if (name) {                                                     
            messageElement.textContent = `Hi ${name}, Have a good day!`;   // New string
        } else {
            messageElement.textContent = "Please enter a name";

            form.reset();                                               // Reset input
        }
    });
}); 

// Reviewed code along videos and VSC
// Gemini helped find and explain why code isn't working
// Re-researched which commands were for what