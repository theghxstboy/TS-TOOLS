fetch('http://localhost:3000/api/bugs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'test title',
        description: 'test description test',
        severity: 'low'
    })
}).then(async r => {
    console.log(r.status, await r.text());
});
