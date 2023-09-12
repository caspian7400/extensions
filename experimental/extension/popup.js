var button = document.getElementById('btn1');

button.addEventListener('click', () => {
    try {
        fetch('http://localhost:3000/add', {
            method: 'POST',
            body: JSON.stringify({
                item1: document.getElementById('num1').value,
                item2: document.getElementById('num2').value,
            }),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        })
            .then((res) => res.json())
            .then((data) => {
                document.getElementById('output').innerHTML = data.output;
            })
    } catch (err) {
        console.error(err);
    }
})