// Tainted.js

let csrfToken = '{{ csrf_token }}';
export class Tainted {
    constructor(name, value) {
        this.name = name;
        this.value = value;
        this.changes = [];
        this.logChange(value);
    }

    setValue(newValue) {
        this.value = newValue;
        this.logChange(newValue);
    }

    getValue() {
        return this.value;
    }

    logChange(newValue) {
        const timestamp = new Date().toISOString();
        this.changes.push({ timestamp, value: newValue });
    }
}

window.likePost = async function(event, postId) {
    event.preventDefault(); // Prevent the default link behavior

    try {
        // Make an AJAX request to the original "like-post" view
        const response = await fetch(`/like-post?post_id=${postId}`, {
            method: 'GET', // Or 'POST', depending on how your Django view is set up
            headers: {
                'X-CSRFToken': csrfToken // Include CSRF token if needed
            }
        });

        if (response.ok) {
            // Handle successful like operation
            // For example, update the like button UI
        } else {
            // Handle errors
        }
    } catch (error) {
        console.error('Error liking post:', error);
    }

    // Optionally, track the like event and send to your Django tainting view
    let likeEvent = new Tainted('likeEvent', { postId: postId, timestamp: new Date().toISOString() });
    sendTaintedDataToServer([likeEvent], '/receive-js-data/', csrfToken);
}

// Ensure CSRF token and other necessary variables are correctly set
