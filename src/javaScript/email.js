export function account_request_email(email , message){

    let data = {
        service_id: 'service_5kdgnv2',
        template_id: "template_jzyedq9",
        user_id: 'sBMZemR0SLw8QdAPw',
        template_params: {
            email_to : email,
            message: message,
        }
    }

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.emailjs.com/api/v1.0/email/send', true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } 
        }
    };

    xhr.onerror = (e) => {
        console.log("Error :" + e);
    };

    xhr.send(JSON.stringify(data)); 
}