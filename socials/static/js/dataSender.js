// dataSender.js
let csrfToken = '{{ csrf_token }}';
export async function sendTaintedDataToServer(taintedVariables, url, csrfToken) {
    const data = taintedVariables.map(tv => ({
        name: tv.name,
        changes: tv.changes
    }));

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken // Ensure CSRF token is included if necessary
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Data sent successfully');
            return await response.json(); // Or handle the response as needed
        } else {
            console.error('Failed to send data', response);
        }
    } catch (error) {
        console.error('Error sending data', error);
    }
}
window.sendTaintedDataToServer = sendTaintedDataToServer;